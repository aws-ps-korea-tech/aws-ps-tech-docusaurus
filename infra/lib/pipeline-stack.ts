import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { SITE_FUNCTION_NAME } from './site-stack';

export interface PipelineStackProps extends StackProps {
  readonly bucket: s3.IBucket;
  readonly distribution: cloudfront.IDistribution;
  readonly viewerRequestFunction: cloudfront.IFunction;
  /** AWS CodeConnections (CodeStar Connections) ARN with access to the GitHub repository. */
  readonly connectionArn: string;
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
}

/**
 * main merge -> CodePipeline (V2) -> CodeBuild:
 *   npm ci + docusaurus build -> strip NUL bytes from HTML (Docusaurus 3.9 sidebar labels)
 *   -> republish the CloudFront Function if static/_redirects changed
 *   -> sync to S3 -> invalidate CloudFront.
 */
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const project = new codebuild.PipelineProject(this, 'DeploySite', {
      projectName: 'aws-ps-tech-docs-deploy',
      description: 'Build Docusaurus and publish it to S3 + CloudFront',
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/standard:8.0'),
        computeType: codebuild.ComputeType.MEDIUM,
      },
      timeout: Duration.minutes(30),
      logging: {
        cloudWatch: {
          logGroup: new logs.LogGroup(this, 'DeployLogs', { retention: logs.RetentionDays.ONE_MONTH }),
        },
      },
      environmentVariables: {
        SITE_BUCKET: { value: props.bucket.bucketName },
        SITE_REGION: { value: Stack.of(props.bucket).region },
        DISTRIBUTION_ID: { value: props.distribution.distributionId },
        FUNCTION_NAME: { value: SITE_FUNCTION_NAME },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': { nodejs: '22' },
            commands: ['npm ci --no-audit --no-fund'],
          },
          build: {
            commands: [
              'npm run build',
              // Docusaurus 3.9 can emit NUL bytes inside sidebar labels; strip them
              // (read the whole file before reopening it for writing).
              'node infra/scripts/strip-nul.js build',
              // Refuse to publish an empty or broken build.
              'node infra/scripts/check-build.js build',
            ],
          },
          post_build: {
            commands: [
              'if [ "$CODEBUILD_BUILD_SUCCEEDING" != "1" ]; then echo "build failed, skip publish"; exit 1; fi',
              // Republish the viewer-request function only when the generated code changed.
              'node infra/lib/redirect-function.js static/_redirects > /tmp/fn.js',
              'aws cloudfront get-function --name "$FUNCTION_NAME" --stage LIVE /tmp/live.js > /dev/null',
              [
                'if ! cmp -s /tmp/fn.js /tmp/live.js; then',
                '  ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query ETag --output text);',
                '  ETAG=$(aws cloudfront update-function --name "$FUNCTION_NAME" --if-match "$ETAG"',
                '    --function-config \'{"Comment":"BookStack /books/* 301 redirects + index.html rewrite","Runtime":"cloudfront-js-2.0"}\'',
                '    --function-code fileb:///tmp/fn.js --query ETag --output text);',
                '  aws cloudfront publish-function --name "$FUNCTION_NAME" --if-match "$ETAG" > /dev/null;',
                '  echo "CloudFront Function republished";',
                'else echo "CloudFront Function unchanged"; fi',
              ].join(' '),
              // Hashed assets first (immutable), then everything else with revalidation.
              'aws s3 sync build/ "s3://$SITE_BUCKET/" --region "$SITE_REGION" --exclude "*" --include "assets/*" --cache-control "public,max-age=31536000,immutable"',
              'aws s3 sync build/ "s3://$SITE_BUCKET/" --region "$SITE_REGION" --delete --exclude "assets/*" --cache-control "public,max-age=0,must-revalidate"',
              'aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query Invalidation.Id --output text',
            ],
          },
        },
        cache: { paths: ['/root/.npm/**/*'] },
      }),
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM),
    });

    props.bucket.grantReadWrite(project);
    props.bucket.grantDelete(project);
    project.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudfront:CreateInvalidation'],
      resources: [`arn:aws:cloudfront::${this.account}:distribution/${props.distribution.distributionId}`],
    }));
    project.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudfront:GetFunction', 'cloudfront:DescribeFunction', 'cloudfront:UpdateFunction', 'cloudfront:PublishFunction'],
      resources: [props.viewerRequestFunction.functionArn],
    }));

    const source = new codepipeline.Artifact('Source');
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'aws-ps-tech-docs',
      pipelineType: codepipeline.PipelineType.V2,
      crossAccountKeys: false,
      restartExecutionOnUpdate: false,
      stages: [
        {
          stageName: 'Source',
          actions: [new actions.CodeStarConnectionsSourceAction({
            actionName: 'GitHub',
            connectionArn: props.connectionArn,
            owner: props.owner,
            repo: props.repo,
            branch: props.branch,
            output: source,
            triggerOnPush: true,
          })],
        },
        {
          stageName: 'BuildAndPublish',
          actions: [new actions.CodeBuildAction({ actionName: 'Docusaurus', project, input: source })],
        },
      ],
    });

    new CfnOutput(this, 'PipelineName', { value: pipeline.pipelineName });
  }
}
