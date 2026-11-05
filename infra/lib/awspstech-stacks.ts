import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

const DOMAIN = 'awspstech.kr';
const TARGET = 'https://aws-ps-tech.kr/';

// Records that mirror today's hosting.kr DNS, so moving the name servers to Route 53
// changes nothing until the cutover deploy.
const INTERIM_APEX_IP = '89.106.200.1'; // hosting.kr URL-forwarding server (301 -> www)
const INTERIM_GITBOOK = '22b9b4ffda-hosting.gitbook.io';

export interface AwspstechZoneStackProps extends StackProps {
  /** false: interim records mirroring hosting.kr. true: apex/www belong to the redirect stack. */
  readonly cutover: boolean;
}

/**
 * Route 53 public hosted zone for awspstech.kr (step 1).
 * After deploying, set the four name servers from the output at the registrar (Megazone).
 */
export class AwspstechZoneStack extends Stack {
  readonly zone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: AwspstechZoneStackProps) {
    super(scope, id, props);
    this.zone = new route53.PublicHostedZone(this, 'Zone', {
      zoneName: DOMAIN,
      comment: 'awspstech.kr -> https://aws-ps-tech.kr/ (managed by CDK)',
    });

    // Wildcard keeps mail./_dmarc./other names answering exactly as before.
    new route53.CnameRecord(this, 'InterimWildcard', {
      zone: this.zone, recordName: `*.${DOMAIN}`, domainName: INTERIM_GITBOOK, ttl: Duration.minutes(5),
    });
    if (!props.cutover) {
      new route53.ARecord(this, 'InterimApex', {
        zone: this.zone, target: route53.RecordTarget.fromIpAddresses(INTERIM_APEX_IP), ttl: Duration.minutes(5),
      });
      new route53.CnameRecord(this, 'InterimWww', {
        zone: this.zone, recordName: `www.${DOMAIN}`, domainName: INTERIM_GITBOOK, ttl: Duration.minutes(5),
      });
    }

    new CfnOutput(this, 'NameServers', { value: Fn.join(' ', this.zone.hostedZoneNameServers!) });
  }
}

export interface AwspstechRedirectStackProps extends StackProps {
  readonly zone: route53.IHostedZone;
}

/**
 * Pay-as-you-go CloudFront distribution that answers every request for awspstech.kr and
 * www.awspstech.kr with a 301 to https://aws-ps-tech.kr/ (step 2, after the name servers
 * point at Route 53 so the ACM DNS validation can complete).
 */
export class AwspstechRedirectStack extends Stack {
  constructor(scope: Construct, id: string, props: AwspstechRedirectStackProps) {
    super(scope, id, props);
    const names = [DOMAIN, `www.${DOMAIN}`];

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: DOMAIN,
      subjectAlternativeNames: [`www.${DOMAIN}`],
      validation: acm.CertificateValidation.fromDns(props.zone),
    });

    const redirect = new cloudfront.Function(this, 'Redirect', {
      functionName: 'awspstech-redirect',
      comment: `301 every request to ${TARGET}`,
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(
        `function handler(event){return{statusCode:301,statusDescription:'Moved Permanently',` +
        `headers:{location:{value:'${TARGET}'},'cache-control':{value:'max-age=86400'}}};}`,
      ),
      autoPublish: true,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: `${DOMAIN} -> ${TARGET}`,
      domainNames: names,
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      defaultBehavior: {
        // Never contacted: the viewer-request function answers every request.
        origin: new origins.HttpOrigin('aws-ps-tech.kr'),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        functionAssociations: [{ function: redirect, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
      },
    });

    const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
    names.forEach((name, i) => {
      const recordName = i === 0 ? undefined : name;
      new route53.ARecord(this, `A${i}`, { zone: props.zone, recordName, target });
      new route53.AaaaRecord(this, `Aaaa${i}`, { zone: props.zone, recordName, target });
    });

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
  }
}
