#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { AwspstechRedirectStack, AwspstechZoneStack } from '../lib/awspstech-stacks';
import { PipelineStack } from '../lib/pipeline-stack';
import { RumStack } from '../lib/rum-stack';
import { SiteStack } from '../lib/site-stack';

const app = new App();
const ctx = (k: string) => app.node.tryGetContext(k);
const asBool = (v: unknown) => v === true || v === 'true';

// CloudFront, ACM (for CloudFront) and WAF (CLOUDFRONT scope) live in us-east-1.
// The pipeline runs in the Region of the GitHub connection (source actions cannot be
// cross-Region); it reads the site values through CDK cross-Region references.
// The account comes from the deploying profile (no account IDs in this public repo).
const account = ctx('account') ?? process.env.CDK_DEFAULT_ACCOUNT;
const env = { account, region: 'us-east-1' };
const tags = { project: 'aws-ps-tech-docs' };

const site = new SiteStack(app, 'AwsPsTechDocsSite', {
  env, tags, freePlan: asBool(ctx('siteFreePlan')), crossRegionReferences: true,
  description: 'aws-ps-tech docs: S3 (OAC) + CloudFront + WAF, CloudFront flat-rate Free plan',
});

// CloudWatch RUM in Seoul; only the CloudFront-hosted site is monitored.
const rumRegion = 'ap-northeast-2';
const rum = new RumStack(app, 'AwsPsTechDocsRum', {
  env: { account, region: rumRegion }, tags, crossRegionReferences: true,
  description: 'aws-ps-tech docs: CloudWatch RUM app monitor + Cognito guest access',
  domains: [site.distribution.distributionDomainName],
});

const connectionArn: string = ctx('codeConnectionArn');
if (connectionArn) {
  new PipelineStack(app, 'AwsPsTechDocsPipeline', {
    env: { account, region: connectionArn.split(':')[3] },
    rum: { appMonitorId: rum.appMonitorId, identityPoolId: rum.identityPoolId, region: rumRegion },
    crossRegionReferences: true,
    tags,
    description: 'aws-ps-tech docs: CodePipeline + CodeBuild deploy on merge to main',
    bucket: site.bucket,
    distribution: site.distribution,
    viewerRequestFunction: site.viewerRequestFunction,
    connectionArn,
    owner: ctx('githubOwner'),
    repo: ctx('githubRepo'),
    branch: ctx('githubBranch'),
  });
}

const cutover = asBool(ctx('awspstechCutover'));
const zone = new AwspstechZoneStack(app, 'AwspstechZone', {
  env, tags, cutover, description: 'awspstech.kr Route 53 hosted zone',
});
if (cutover) {
  const redirect = new AwspstechRedirectStack(app, 'AwspstechRedirect', {
    env, tags, zone: zone.zone, description: 'awspstech.kr -> aws-ps-tech.kr 301 (pay-as-you-go CloudFront)',
  });
  redirect.addDependency(zone);
}
