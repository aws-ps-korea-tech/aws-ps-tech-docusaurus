---
title: AWS 계정 안전하게 지키기
sidebar_position: 0
---

### [[ ]{offset-key="e45913f7e0ff41748d1d7083830905f5:0"}]{key="e45913f7e0ff41748d1d7083830905f5"} {#bkmrk- .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

[AWS Well-Architected](https://www.aws-ps-tech.kr/AWS%20Well-Architected%20%20helps%20cloud%20architects%20build%20a%20secure,%20high-performing,%20resilient,%20and%20efficient%20infrastructure%20for%20their%20applications%20and%20workloads.%20The%20Security%20Baseline%20Workshop%20aligns%20to%20the%20security%20pillar%20%20%20of%20the%20AWS%20Well-Architected%20Framework.%20The%20security%20pillar%20describes%20how%20to%20take%20advantage%20of%20cloud%20technologies%20to%20protect%20data,%20systems,%20and%20assets%20in%20a%20way%20that%20can%20improve%20your%20security%20posture.%20This%20helps%20you%20meet%20your%20business%20and%20regulatory%20requirements%20by%20following%20current%20AWS%20recommendations.%20%20You%20can%20assess%20your%20adherence%20to%20Well-Architected%20best%20practices%20using%20the%20Well-Architected%20Tool%20%20%20in%20your%20AWS%20account.%20%20Security%20and%20compliance%20are%20a%20shared%20responsibility%20between%20AWS%20and%20the%20customer.%20The%20shared%20responsibility%20model%20%20is%20often%20described%20by%20saying%20that%20AWS%20is%20responsible%20for%20the%20security%20of%20the%20cloud%20(that%20is,%20for%20protecting%20the%20infrastructure%20that%20runs%20all%20the%20services%20offered%20in%20the%20AWS%20Cloud),%20and%20you%20are%20responsible%20for%20the%20security%20in%20the%20cloud%20(as%20determined%20by%20the%20AWS%20Cloud%20services%20that%20you%20select).%20In%20the%20shared%20responsibility%20model,%20implementing%20the%20security%20controls%20in%20this%20document%20is%20part%20of%20your%20responsibility%20as%20a%20customer.) helps cloud architects build a secure, high-performing, resilient, and efficient infrastructure for their applications and workloads. The Security Baseline Workshop aligns to the [security pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) of the AWS Well-Architected Framework. The security pillar describes how to take advantage of cloud technologies to protect data, systems, and assets in a way that can improve your security posture. This helps you meet your business and regulatory requirements by following current AWS recommendations.

You can assess your adherence to Well-Architected best practices using the [Well-Architected Tool](https://console.aws.amazon.com/wellarchitected/) in your AWS account.

Security and compliance are a shared responsibility between AWS and the customer. The [shared responsibility model](http://aws.amazon.com/compliance/shared-responsibility-model/) \
is often described by saying that AWS is responsible for the security of the cloud (that is, for protecting the infrastructure that runs all the services offered in the AWS Cloud), and you are responsible for the security in the cloud (as determined by the AWS Cloud services that you select). In the shared responsibility model, implementing the security controls in this document is part of your responsibility as a customer.

[\![\](/img/대학-고객을-위한-aws-길라잡이/module-0-image-2.jpg)](/img/대학-고객을-위한-aws-길라잡이/module-0-image-2.jpg){target="_blank" rel="noopener"}

### [[1. MFA on Root account]{offset-key="e45913f7e0ff41748d1d7083830905f5:0"}]{key="e45913f7e0ff41748d1d7083830905f5"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-1.-mfa-on-root-accou .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%EC%8A%88%ED%8D%BC-%EA%B6%8C%ED%95%9C%EC%9D%B4-%EC%9E%88%EB%8A%94-root-accou .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[슈퍼 권한이 있는 Root Account는 비밀번호는 특히 중요합니다. 사고로 비밀번호가 노출 되더라도 MFA 를 설정해 놓으면 로그인 시 MFA 장치가 없는 경우 최종 로그인이 실패하기 때문에 더 안전하게 AWS 계정을 지킬 수 있습니다.]{offset-key="6cd5459994ae439eaf041a5efb68c669:0"}]{key="6cd5459994ae439eaf041a5efb68c669"}
:::

::: {#bkmrk-%EA%B0%84%ED%98%B9%2C-%EB%8B%A4%EB%A5%B8-%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%97%90%EC%84%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EA%B3%84%EC%A0%95 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[간혹, 다른 사이트에서 사용하는 계정의 비밀번호와, Root Account의 비밀번호가 동일하게 이용하시다가, 다른 사이트 사용자 계정의 비밀번호가 노출되어 Root Account가 침해되는 사례가 있었습니다.]{offset-key="524271784f7a4259939d582c8e7c6a85:0"}]{key="524271784f7a4259939d582c8e7c6a85"}
:::

[[[Action Plan - Protect the Root User 구성 가이드 ]{offset-key="623e2b5849144518b6fdb9afd3754750:0"}]{key="623e2b5849144518b6fdb9afd3754750"}](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/2-protect-root-user)

[[[10분안에 정복하는 안전한 계정 관리를 위한 IAM 모범 사례 ]{offset-key="82e6f21cea8f4147a40eba60b4a68b80:0"}]{key="82e6f21cea8f4147a40eba60b4a68b80"}](https://www.youtube.com/watch?v=pDg7qxQMNFo)

::::::::::::::::: {#bkmrk-%E2%80%8B-2}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="ed331eb0824d48ec9ae4be0c25e5f1b0"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="ed331eb0824d48ec9ae4be0c25e5f1b0"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="145b383b813f4d66a65d0b41897f5dd1"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="a976d6899b974fc082735fc726b8c85a"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="89494ccef68c4a62be02ab041027b4a6:0"}]{key="89494ccef68c4a62be02ab041027b4a6"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

### [[2. Amazon S3 Bucket Permissions]{offset-key="e70fa35c2d4a47eda3ce75d3b9f06c1f:0"}]{key="e70fa35c2d4a47eda3ce75d3b9f06c1f"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-2.-amazon-s3-bucket- .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%EA%B3%B5%EA%B0%9C-%EC%95%A1%EC%84%B8%EC%8A%A4-%EA%B6%8C%ED%95%9C%EC%9D%B4-%EC%9E%88%EA%B1%B0%EB%82%98%2C-any- .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[공개 액세스 권한이 있거나, Any Authenticated AWS User 에 대한 액세스를 허용하는 S3 버킷을 확인합니다.]{offset-key="2715b7de2f074313a81ff0c2f6fef515:0"}]{key="2715b7de2f074313a81ff0c2f6fef515"}
:::

::: {#bkmrk-%EA%B3%B5%EA%B0%9C-%EC%95%A1%EC%84%B8%EC%8A%A4-%EC%A0%91%EA%B7%BC%EC%9C%BC%EB%A1%9C-%EB%85%B8%EC%B6%9C%EB%90%9C-s3%EB%8A%94- .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[공개 액세스 접근으로 노출된 S3는 IAM \> Access Analyzer 메뉴에서 확인하시기 바랍니다. 의도되지 않은 경우 권한을 제한 하는 것을 권장합니다.]{offset-key="e240df63a0fb4a55b4febf9ecc7dbd43:0"}]{key="e240df63a0fb4a55b4febf9ecc7dbd43"}
:::

::: {#bkmrk-%EA%B4%80%EB%A6%AC%EC%9E%90-%EA%B6%8C%ED%95%9C%EC%9D%84-%EA%B0%80%EC%A7%80%EA%B3%A0-%EC%9E%88%EC%A7%80-%EC%95%8A%EC%9D%80-%EA%B2%BD%EC%9A%B0 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[관리자 권한을 가지고 있지 않은 경우, S3 Bucket 생성, 삭제, 설정 변경 권한을 제한하시기 바랍니다.]{offset-key="2a19c0d5e5d943b785bf93b8d92b54f0:0"}]{key="2a19c0d5e5d943b785bf93b8d92b54f0"}
:::

::: {#bkmrk--2 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
:::

[[[Action Plan - Prevent Public Access to Private S3 Buckets 구성 가이드]{offset-key="78c21dbabd874b34954a2ee17a7f9557:0"}]{key="78c21dbabd874b34954a2ee17a7f9557"}](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/6-block-public-access-s3)

[[[Action Plan - 공개 액세스 접근으로 노출된 S3 버킷 확인]{offset-key="4404bd70fb154c269c1921b06ac08360:0"}]{key="4404bd70fb154c269c1921b06ac08360"}](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-analyzer.html)

::::::::::::::::: {#bkmrk-%E2%80%8B-4}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="07813968ef034c21b5d81b89485c51d5"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="07813968ef034c21b5d81b89485c51d5"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="dc777a3cd57146069031e10aa5c4803d"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="01f154765e814506b1a27cdbaa46a585"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="0627257375b24c4f86de0f3ff85c2b91:0"}]{key="0627257375b24c4f86de0f3ff85c2b91"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

### [[3. Security Groups - Specific Ports Unrestricted]{offset-key="b5b2a3286fb94c33893b552f9dee71c8:0"}]{key="b5b2a3286fb94c33893b552f9dee71c8"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-3.-security-groups-- .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%ED%95%84%EC%9A%94%ED%95%9C-ip-%EC%A3%BC%EC%86%8C%EB%A1%9C%EB%A7%8C-%EC%95%A1%EC%84%B8%EC%8A%A4%EB%A5%BC-%EC%A0%9C%ED%95%9C%ED%95%98 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[필요한 IP 주소로만 액세스를 제한하시기 바랍니다.]{offset-key="634f8b39dd1f44f8b9e2fe8b7bc06663:0"}]{key="634f8b39dd1f44f8b9e2fe8b7bc06663"}
:::

::: {#bkmrk-%EB%8D%94-%EC%A0%9C%ED%95%9C%EC%A0%81%EC%9D%B8-%EA%B7%9C%EC%B9%99%EC%9D%84-%EB%A7%8C%EB%93%A0-%ED%9B%84%EC%97%90%EB%8A%94-%EC%A7%80%EB%82%98 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[더 제한적인 규칙을 만든 후에는 지나치게 허용되는 규칙을 삭제해야 합니다. 예를 들어 SSH 액세스 허용을 위한 22 Port라던가, MySQL 3306 Port등은 불특정 다수 (0.0.0.0/0) 에 규칙은 실제 접근이 필요한 IP만 구별하여 설정하시고, 해당 설정은 삭제하시기 바랍니다.]{offset-key="e196fb974ed44adbaadf41376bb1005a:0"}]{key="e196fb974ed44adbaadf41376bb1005a"}
:::

::: {#bkmrk--3 .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}
:::

### [[4. CloudTrail]{offset-key="10158c828f7a44789d3a5007621f3bb8:0"}]{key="10158c828f7a44789d3a5007621f3bb8"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-4.-cloudtrail .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%EA%B0%90%EC%82%AC-%EB%AA%A9%EC%A0%81%EC%9C%BC%EB%A1%9C-trail-%EC%A0%95%EB%B3%B4%EB%A5%BC-s3 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[감사 목적으로 Trail 정보를 S3에 저장합니다. ]{offset-key="a8f2671c9290459bac9da57b6b830532:0"}]{key="a8f2671c9290459bac9da57b6b830532"}
:::

[[[Action Plan - Turn CloudTrail On 구성가이드]{offset-key="0d73441a0dfb4e9a82c4c9c1f5e77e86:0"}]{key="0d73441a0dfb4e9a82c4c9c1f5e77e86"}](https://www.aws-ps-tech.kr/%EA%B0%90%EC%82%AC%20%EB%AA%A9%EC%A0%81%EC%9C%BC%EB%A1%9C%20Trail%20%EC%A0%95%EB%B3%B4%EB%A5%BC%20S3%EC%97%90%20%EC%A0%80%EC%9E%A5%ED%95%A9%EB%8B%88%EB%8B%A4.%20%20Action%20Plan%20-%20Turn%20CloudTrail%20On%20%EA%B5%AC%EC%84%B1%EA%B0%80%EC%9D%B4%EB%93%9C)

::::::::::::::::: {#bkmrk-%E2%80%8B-5}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="b55803dd9e084ab6b4a33948d738fca3"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="b55803dd9e084ab6b4a33948d738fca3"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="cbf6fdb7d9b049de9576d552537636ab"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="11ca507f2a394909a677e9e0a69bb5d8"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="a2b4c96219e945aaba9a864425d496b8:0"}]{key="a2b4c96219e945aaba9a864425d496b8"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

### [[5. IAM Password Policy]{offset-key="192aff7398844ad984314c034e606217:0"}]{key="192aff7398844ad984314c034e606217"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-5.-iam-password-poli .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-iam-user%EC%9D%98-%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EB%B3%B5%EC%9E%A1%EB%8F%84%EB%A5%BC- .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[IAM User의 비밀번호 복잡도를 설정하여, 강력한 비밀번호로 설정할 수 있도록 강제화 할 수 있습니다.]{offset-key="eb02e82b230d4fbfae0e2f300b995be7:0"}]{key="eb02e82b230d4fbfae0e2f300b995be7"}
:::

[[[Action Plan - Set a password policy to ensure strong passwords 구성가이드](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/3-create-multiple-users/2-2-create-iam-users#set-a-password-policy-to-ensure-strong-passwords)\
]{offset-key="e0068ddc6e004882a3c1a51d52ae230e:0"}]{key="e0068ddc6e004882a3c1a51d52ae230e"}

::::::::::::::::: {#bkmrk-%E2%80%8B-6}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="ab6aeba21c5d47079b3a4be194c2f800"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="ab6aeba21c5d47079b3a4be194c2f800"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="e38221fdb99344a08e65a8653a8c380a"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="8ef787d111364561aa920d259edf46dc"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="e6067994e69e47e782802954e3c591fc:0"}]{key="e6067994e69e47e782802954e3c591fc"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

### [[6. IAM Access key rotation]{offset-key="4bc3f375a92845c1b47d1767724f4dc1:0"}]{key="4bc3f375a92845c1b47d1767724f4dc1"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-6.-iam-access-key-ro .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%EC%B5%9C%EA%B7%BC-%EB%B3%B4%EC%95%88-%EC%82%AC%EA%B3%A0%EB%8A%94-%ED%95%B4%EC%BB%A4%EA%B0%80-awa-ac .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[최근 보안 사고는 해커가 AWA Account 탈취한 후, 몇 개월 동안 꾸준하게 고객의 정보를 수집하여 다각도로 피해를 주는 사례들이 늘어나고 있습니다. 이러한 해킹 사고는 일단 AWS Account가 침해 되더라도 고객이 이를 인지하지 못하는 경우가 있습니다. 주기적 비밀번호 변경 이외에도, IAM Access Key를 주기적으로 만료하고 새로 생성하여 사용하는 것을 권장합니다. 관리가 소홀하여 해당 Access Key와 Secret Access Key가 노출 되었다 하더라도 이러한 관리로 이 키 관련 정보를 무효화할 수 있습니다.]{offset-key="4849a175cfaf47338fac5f74b1bd3396:0"}]{key="4849a175cfaf47338fac5f74b1bd3396"}
:::

::: {#bkmrk--4 .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
:::

[[[AWS Config를 활용한 Access Key 자동 교환 구성하기 ]{offset-key="65e3058b25304cd6884c15039e244913:0"}]{key="65e3058b25304cd6884c15039e244913"}](https://aws.amazon.com/blogs/mt/managing-aged-access-keys-through-aws-config-remediations/)[[[​]{slate-zero-width="z"}]{offset-key="f7d47ac57e594f208a75e26e59c7c250:0"}]{key="f7d47ac57e594f208a75e26e59c7c250"}

[[[AWS Credential Report 로 AWS Account에서 발행한 전체 Access Key 상태 확인하는 방법 ]{offset-key="8d5fe1271da146a2b536c46ee8949ba0:0"}]{key="8d5fe1271da146a2b536c46ee8949ba0"}[[[​]{slate-zero-width="z"}]{offset-key="483a2919ed194f23a8d74a19841f16be:0"}]{key="483a2919ed194f23a8d74a19841f16be"}](https://aws.amazon.com/blogs/mt/managing-aged-access-keys-through-aws-config-remediations/)

::::::::::::::::: {#bkmrk-%E2%80%8B-8}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="c5e7362b226746ea85c43436b412c34f"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="c5e7362b226746ea85c43436b412c34f"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="5c423daa365c4b5e88446d3998dc3805"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="3ba2dc3a00394a72bd09988f156e39ba"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="164d232e1b4349948043b66a112e4885:0"}]{key="164d232e1b4349948043b66a112e4885"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

::::::::::::::::: {#bkmrk--5}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="7d63eed6baba4d7a95d04923e82ea5e5"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="7d63eed6baba4d7a95d04923e82ea5e5"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="f04e5bf45633403f9bec705381951604"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="bd0c943a5a3b44eb85312a437b8213f1"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
\
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

> ::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-fdjqy7 .r-1bnj018 .r-1xnzce8 dir="auto"}
> [[Note, AWS 계정을 파트너사에서 관리하는 경우 관련 설정이 파트너사 별로 다를 수 있으니 이런 경우, 파트너사로 문의하시기 바랍니다.]{offset-key="e4ae994aa21748299fc9b2cf07f28a69:0"}]{key="e4ae994aa21748299fc9b2cf07f28a69"}
> :::

::: {#bkmrk--6 .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}
:::

### [[참고 자료]{offset-key="5ac837b1c908473d8efbc4db9a48fc76:0"}]{key="5ac837b1c908473d8efbc4db9a48fc76"}![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) {#bkmrk-%EC%B0%B8%EA%B3%A0-%EC%9E%90%EB%A3%8C .css-1rynq56 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto" rnwrdesktop-gg6oyi-adyw6z-135wba7-b88u0q="true" rnwr700-gg6oyi-ubezar-135wba7-1kfrs79="true"}

::: {#bkmrk-%EC%89%BD%EA%B2%8C-%ED%99%9C%EC%9A%A9-%ED%95%B4-%EB%B3%BC-%EC%88%98-%EC%9E%88%EB%8A%94-aws-i .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
**[[쉽게 활용 해 볼 수 있는 AWS IAM 모범 사례를 참고하시면 좋습니다.]{offset-key="687e819253fa4b149e9154af3ac73014:0"}]{key="687e819253fa4b149e9154af3ac73014"}**
:::

[[[10분안에 정복하는 안전한 계정 관리를 위한 IAM 모범 사례 (Youtube) ]{offset-key="26aca268a1a54cedbe756daa3a8b33ee:0"}]{key="26aca268a1a54cedbe756daa3a8b33ee"}](https://www.youtube.com/watch?v=pDg7qxQMNFo)

::::::::::::::::: {#bkmrk-%E2%80%8B-9}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="8a381ee9a5e14a7c9c1cfa8d358793e8"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="8a381ee9a5e14a7c9c1cfa8d358793e8"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="9489d067c23d4f4487b04eeb75f66271"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="b770abfeec2c4b62bf8a5325403bde4a"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="444226db819342cb80aa9c61bfdb5b32:0"}]{key="444226db819342cb80aa9c61bfdb5b32"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

::: {#bkmrk-aws-%EA%B3%84%EC%A0%95-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EC%A7%80%ED%82%A4%EA%B8%B0-%EC%9C%84%ED%95%B4%EC%84%9C- .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
**[[AWS 계정 안전하게 지키기 위해서 꼭 보셔야 하는 문서들입니다.]{offset-key="22593cc7f61a4aa4a2a408bb0e4f109b:0"}]{key="22593cc7f61a4aa4a2a408bb0e4f109b"}**
:::

[[[AWS Perspective Guidance on Baseline Security ]{offset-key="8c0c5b77d5d64b3993d90d462728eecc:0"}]{key="8c0c5b77d5d64b3993d90d462728eecc"}](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-startup-security-baseline/controls-acct.html)

::::::::::::::::: {#bkmrk-%E2%80%8B-10}
:::::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
::::::::::::::: {.view_manYY .blockWrapper_y0Ubs .noneVertical_jpmaI .autoHorizontal_dqmM-}
:::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-18u37iz .r-1777fci rnwr1490-1777fci="true" rnwr700-1777fci="true"}
::::::::::::: {.css-175oi2r .r-1ro0kt6 .r-16y2uox .r-1wbh5a2}
:::::::::::: css-175oi2r
::::::::::: css-175oi2r
:::::::::: {.view_manYY .relative_F68jE .column_C3yiR .mediumVertical_-Vaii .mediumTop_QDiZG .mediumBottom_jdYUb key="55ff07eaa4734973a1cd0c75267d03fe"}
::::::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-eqz5dr .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 block-content="55ff07eaa4734973a1cd0c75267d03fe"}
:::::::: css-175oi2r
::::::: css-175oi2r
:::::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-417010 .r-1ro0kt6 .r-16y2uox .r-1wbh5a2 .r-6koalj .r-18u37iz .r-bnwqim block-content="3eb246bf962f44b5b6640ce6060d399a"}
::::: {.css-175oi2r .r-13awgt0}
:::: {.r-1oszu61 .r-1xc7w19 .r-1phboty .r-1yadl64 .r-deolkf .r-6koalj .r-1mlwlqe .r-eqz5dr .r-1q142lx .r-crgep1 .r-ifefl9 .r-bcqeeo .r-t60dpp .r-bnwqim .r-417010 key="d651cf840a3d4c2b954114d90e657aee"}
::: {.css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
[[[​]{slate-zero-width="z"}]{offset-key="7dfbedcdcf254572a100d2ab823aa948:0"}]{key="7dfbedcdcf254572a100d2ab823aa948"}
:::
::::
:::::
::::::
:::::::
::::::::
:::::::::
::::::::::
:::::::::::
::::::::::::
:::::::::::::
::::::::::::::
:::::::::::::::
::::::::::::::::
:::::::::::::::::

::: {#bkmrk-aws-%EA%B3%84%EC%A0%95-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EC%A7%80%ED%82%A4%EA%B8%B0-tip- .css-1rynq56 .r-gg6oyi .r-ubezar .r-16dba41 .r-135wba7 .r-1nf4jbm .r-fdjqy7 .r-1xnzce8 dir="auto"}
**[[AWS 계정 안전하게 지키기 Tip 에 대해서 항목별로 적용하는 방법은 아래 링크를 참고하시기 바랍니다.]{offset-key="47c0ab4960e44fed83b7021b1d7e50ad:0"}]{key="47c0ab4960e44fed83b7021b1d7e50ad"}**
:::

[[[Security Baseline - Basic Playbook ]{offset-key="ed3b56fb94a54f93b8a4033377992501:0"}]{key="ed3b56fb94a54f93b8a4033377992501"}[[[​]{slate-zero-width="z"}]{offset-key="d917d68330014bde87dbb3af8fbc2c70:0"}]{key="d917d68330014bde87dbb3af8fbc2c70"}](https://catalog.workshops.aws/startup-security-baseline/en-US)
