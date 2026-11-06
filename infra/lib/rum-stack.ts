import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rum from 'aws-cdk-lib/aws-rum';
import { Construct } from 'constructs';

export interface RumStackProps extends StackProps {
  /** Hostnames the web client may send data from (the CloudFront domain for now). */
  readonly domains: string[];
}

export const RUM_APP_MONITOR_NAME = 'aws-ps-tech-docs';

/**
 * CloudWatch RUM for the CloudFront-hosted site.
 *
 * - No cookies: no user or session IDs, only page performance, JavaScript errors and HTTP errors.
 * - 100% session sampling, data kept by RUM for 30 days, no copy to CloudWatch Logs.
 * - Browsers authorize through an unauthenticated Cognito identity pool whose guest
 *   role can only call rum:PutRumEvents on this app monitor.
 */
export class RumStack extends Stack {
  readonly appMonitorId: string;
  readonly identityPoolId: string;

  constructor(scope: Construct, id: string, props: RumStackProps) {
    super(scope, id, props);

    const pool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      identityPoolName: 'aws_ps_tech_docs_rum',
      allowUnauthenticatedIdentities: true,
      allowClassicFlow: false,
    });

    const guestRole = new iam.Role(this, 'GuestRole', {
      description: 'CloudWatch RUM web client (unauthenticated) for aws-ps-tech docs',
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: { 'cognito-identity.amazonaws.com:aud': pool.ref },
          'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });
    guestRole.addToPolicy(new iam.PolicyStatement({
      actions: ['rum:PutRumEvents'],
      resources: [`arn:aws:rum:${this.region}:${this.account}:appmonitor/${RUM_APP_MONITOR_NAME}`],
    }));

    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoles', {
      identityPoolId: pool.ref,
      roles: { unauthenticated: guestRole.roleArn },
    });

    const monitor = new rum.CfnAppMonitor(this, 'AppMonitor', {
      name: RUM_APP_MONITOR_NAME,
      domainList: props.domains,
      cwLogEnabled: false,
      appMonitorConfiguration: {
        allowCookies: false,
        enableXRay: false,
        sessionSampleRate: 1,
        telemetries: ['performance', 'errors', 'http'],
        identityPoolId: pool.ref,
        guestRoleArn: guestRole.roleArn,
      },
    });

    this.appMonitorId = monitor.attrId;
    this.identityPoolId = pool.ref;

    new CfnOutput(this, 'AppMonitorId', { value: monitor.attrId });
    new CfnOutput(this, 'IdentityPoolId', { value: pool.ref });
  }
}
