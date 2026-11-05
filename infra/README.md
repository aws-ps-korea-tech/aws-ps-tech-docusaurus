# Infrastructure (AWS CDK)

CDK app for hosting this Docusaurus site on Amazon CloudFront and for redirecting
`awspstech.kr` to `aws-ps-tech.kr`. Netlify hosting is unaffected.

| Stack | Region | Contents |
|---|---|---|
| `AwsPsTechDocsSite` | us-east-1 | Private S3 bucket (OAC), CloudFront distribution, WAF web ACL, CloudFront Function, CloudFront flat-rate **Free** plan subscription |
| `AwsPsTechDocsPipeline` | Region of the GitHub connection | CodePipeline (V2) + CodeBuild: deploys on every push to `main` |
| `AwspstechZone` | us-east-1 | Route 53 hosted zone for `awspstech.kr` |
| `AwspstechRedirect` | us-east-1 | Pay-as-you-go CloudFront + ACM certificate: `awspstech.kr`, `www.awspstech.kr` -> `https://aws-ps-tech.kr/` (301). Only synthesized with `-c awspstechCutover=true` |

No account IDs or ARNs are committed: the account comes from the deploying profile and
the GitHub connection ARN is passed on the command line.

## Edge logic: one CloudFront Function

`lib/redirect-function.js` turns `../static/_redirects` into a viewer-request function:

- `/books/...` (old BookStack URLs) -> **301** to the new path (percent-encoded `Location`)
- everything else -> appends `index.html` to directory-style URLs (S3 with OAC has no index documents)

The CloudFront Functions size quota is 10 KB and cannot be raised; generation fails if the
table outgrows it (today: 107 redirects, about 8.4 KB). The next step would be CloudFront
KeyValueStore, which is not included in the Free plan.

```bash
npm test   # every /books/... line of static/_redirects plus index.html rewrites
```

## Deploy pipeline

On every push to `main` CodeBuild runs `npm ci`, `npm run build`, strips NUL bytes that
Docusaurus 3.9 can emit in sidebar labels, republishes the CloudFront Function when
`static/_redirects` changed, syncs `build/` to S3 (hashed `assets/` as immutable, the rest
with revalidation) and invalidates `/*`.

## Commands

Requires Node 22 and credentials for the target account (for example an SSO profile).

```bash
cd infra
npm ci
CONN=<CodeConnections ARN with access to the GitHub repository>

npx cdk deploy AwsPsTechDocsSite AwspstechZone AwsPsTechDocsPipeline -c codeConnectionArn=$CONN
```

### awspstech.kr redirect (two steps)

1. `AwspstechZone` creates the hosted zone with records that mirror the current hosting.kr DNS
   (apex A to the hosting.kr forwarder, `www` and `*` CNAME to GitBook), so changing the name
   servers alone changes nothing. Set the four `NameServers` output values at the registrar.
2. After the name servers resolve to Route 53 (the ACM DNS validation needs it):

   ```bash
   npx cdk deploy AwspstechZone AwspstechRedirect -c awspstechCutover=true -c codeConnectionArn=$CONN
   ```

   This removes the interim apex/`www` records and points both names at the redirect
   distribution. `www.awspstech.kr` (GitBook) stops serving at that point.

### aws-ps-tech.kr cutover (not done yet)

The site is served on its `*.cloudfront.net` name. `aws-ps-tech.kr` and `www.aws-ps-tech.kr`
are still attached to the BookStack Lightsail distribution; a CloudFront hostname can be
attached to only one distribution, so the aliases must be removed there before they are
added to `AwsPsTechDocsSite` (with an ACM certificate) and DNS is switched.
