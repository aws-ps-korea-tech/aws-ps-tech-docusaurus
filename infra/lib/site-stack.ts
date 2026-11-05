import * as fs from 'fs';
import * as path from 'path';
import { CfnOutput, CfnResource, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generate } = require('./redirect-function');

export interface SiteStackProps extends StackProps {
  /** Subscribe the distribution to the CloudFront flat-rate Free plan. */
  readonly freePlan: boolean;
}

/** Name the deploy pipeline uses to republish the function when static/_redirects changes. */
export const SITE_FUNCTION_NAME = 'aws-ps-tech-docs-viewer-request';

/**
 * Static hosting for the Docusaurus build: private S3 bucket (OAC) behind CloudFront.
 *
 * No custom domain yet: the site is served on the *.cloudfront.net name until the
 * aws-ps-tech.kr cutover (remove the aliases from the Lightsail distribution first).
 *
 * Kept within the flat-rate Free plan limits: AWS managed cache policy, no custom
 * response-header policy, no real-time logs, WAF web ACL (required by the plan) with
 * 2 managed rules (Free allows 5), CloudFront Functions for edge logic.
 */
export class SiteStack extends Stack {
  readonly bucket: s3.Bucket;
  readonly distribution: cloudfront.Distribution;
  readonly viewerRequestFunction: cloudfront.Function;

  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const redirects = fs.readFileSync(path.join(__dirname, '../../static/_redirects'), 'utf8');
    this.viewerRequestFunction = new cloudfront.Function(this, 'ViewerRequest', {
      functionName: SITE_FUNCTION_NAME,
      comment: 'BookStack /books/* 301 redirects + index.html rewrite',
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(generate(redirects).code),
      autoPublish: true,
    });

    const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
      name: 'aws-ps-tech-docs-web-acl',
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      visibilityConfig: { cloudWatchMetricsEnabled: true, metricName: 'aws-ps-tech-docs', sampledRequestsEnabled: true },
      rules: [
        managedRule('AWSManagedRulesAmazonIpReputationList', 0),
        managedRule('AWSManagedRulesCommonRuleSet', 1),
      ],
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: 'aws-ps-tech docs (Docusaurus)',
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      webAclId: webAcl.attrArn,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        functionAssociations: [
          { function: this.viewerRequestFunction, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // S3 with OAC answers 403 for missing keys; serve the Docusaurus 404 page.
      errorResponses: [403, 404].map((httpStatus) => ({
        httpStatus,
        responseHttpStatus: 404,
        responsePagePath: '/404.html',
        ttl: Duration.minutes(1),
      })),
    });

    if (props.freePlan) {
      // CloudFront flat-rate pricing plan, Free tier (max 3 per account; tier changes are
      // rejected by CloudFormation, so upgrading is done in the console).
      new CfnResource(this, 'FreePlan', {
        type: 'AWS::PricingPlanManager::Subscription',
        properties: {
          PlanFamily: 'CloudFront',
          PlanTier: 'FREE',
          ResourceArns: [
            `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
            webAcl.attrArn,
          ],
        },
      });
    }

    new CfnOutput(this, 'BucketName', { value: this.bucket.bucketName });
    new CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId });
    new CfnOutput(this, 'DistributionDomain', { value: this.distribution.distributionDomainName });
    new CfnOutput(this, 'FunctionName', { value: SITE_FUNCTION_NAME });
  }
}

function managedRule(name: string, priority: number): wafv2.CfnWebACL.RuleProperty {
  return {
    name,
    priority,
    overrideAction: { none: {} },
    statement: { managedRuleGroupStatement: { vendorName: 'AWS', name } },
    visibilityConfig: { cloudWatchMetricsEnabled: true, metricName: name, sampledRequestsEnabled: true },
  };
}
