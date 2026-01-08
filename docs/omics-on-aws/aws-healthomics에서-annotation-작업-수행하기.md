---
title: AWS HealthOmics에서 Annotation 작업 수행하기
sidebar_position: 7
---

AWS HealthOmics variant stores and annotation stores are no longer open to new customers. Existing customers can continue to use the service as normal. For more information, see [AWS HealthOmics variant store and annotation store availability change](https://docs.aws.amazon.com/omics/latest/dev/variant-store-availability-change.html).

 

AWS HealthOmics의 Analytics 기능을 활용하여 annotation작업을 수행할 수 있습니다.

## 준비물 {#bkmrk-%EC%A4%80%EB%B9%84%EB%AC%BC}

- 입력 샘플 VCF
- Annotation할 정보 소스 VCF (예: ClinVar)

[s3://omics-eventbridge-solutio-healthomicsckaoutput6642-xbtuwqnxt8uw/outputs/9881593/out/output_vcf/NA12878.hg38.g.vcf.gz]{style="margin-bottom: 0px;"}

##  {#bkmrk-%C2%A0-2 style="padding-top: 4px;"}

## [Variant stores]{style="margin-bottom: 0px;"}  {#bkmrk-%EB%B3%80%EC%9D%B4%EC%8A%A4%ED%86%A0%EC%96%B4%EC%97%90-vcf-%ED%8C%8C%EC%9D%BC-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0 style="padding-top: 4px;"}

### 변이 스토어 생성 {#bkmrk-%EB%B3%80%EC%9D%B4-%EC%8A%A4%ED%86%A0%EC%96%B4-%EC%83%9D%EC%84%B1}

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Variant stores[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/omics/home#/variantStore){#bkmrk-variant-stores%C2%A0 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r23:"}
2.  Select **Create variant store**
3.  For **Variant store name** provide \"my_variant_store\".
4.  For **Reference genome** select \"GRCh38\" (this is a pre-provisioned reference, but you can alternatively select the reference you imported in the [Reference Store](https://catalog.workshops.aws/amazon-omics-end-to-end/en-US/020-xp-console/100-omics-storage/reference-stores){#bkmrk-reference-store .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" aria-labelledby="" analytics-funnel-value="link:r26:"} part of the workshop)
5.  Finish with **Create variant store**

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-45-15-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-45-15-pm.png){target="_blank" rel="noopener"}

### [변이스토어에 샘플 VCF 파일 가져오기]{style="font-weight: bolder; margin-bottom: 0px;"} {#bkmrk-%EB%B3%80%EC%9D%B4%EC%8A%A4%ED%86%A0%EC%96%B4%EC%97%90-%EC%83%98%ED%94%8C-vcf-%ED%8C%8C%EC%9D%BC-%EA%B0%80%EC%A0%B8%EC%98%A4 style="padding-top: 4px;"}

Next, you are going to start a VCF import job. To do this:

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Variant stores[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/omics/home#/variantStore){#bkmrk-variant-stores%C2%A0-1 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r29:"}
2.  Select the **Name** Variant store named **omicsvariantstore1** (or the one you created above as appropriate)
3.  Select **Import variant data**. If this option isn\'t available select **Actions** \> **Import**.
4.  Select **Create and use a new service role**
5.  For **Select variant data from S3** provide the following S3 URI:

아래 s3 경로는 입력 VCF 파일의 S3 URI을 의미합니다.

``` {#bkmrk-s3%3A%2F%2Fomics-eventbrid-1 dir="ltr"}
s3://omics-eventbridge-solutio-healthomicsckaoutput6642-xbtuwqnxt8uw/outputs/9881593/out/output_vcf/NA12878.hg38.g.vcf.gz
```

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-46-45-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-46-45-pm.png){target="_blank" rel="noopener"}

**NOTE:** The region will differ based on deployment region.

6.  Start the import with **Create import job**

You should now see something like this:

\- 적당한 Service role 이 없을 경우 새로 생성하여 사용하는 옵션을 선택할 수 있습니다.

\- 앞에서 설명한대로 입력하고자하는 VCF 파일의 S3 경로를 작성합니다.

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-48-13-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-48-13-pm.png){target="_blank" rel="noopener"}

콘솔에서 VCF Import작업시 제출되었음을 확인할 수 있습니다.\

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-49-27-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-49-27-pm.png){target="_blank" rel="noopener"}

## Annotation stores  {#bkmrk-%EC%A3%BC%EC%84%9D-%EC%8A%A4%ED%86%A0%EC%96%B4%EC%97%90-vcf-%ED%8C%8C%EC%9D%BC-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0}

### 주석 스토어 생성 {#bkmrk-%EC%A3%BC%EC%84%9D-%EC%8A%A4%ED%86%A0%EC%96%B4-%EC%83%9D%EC%84%B1}

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Annotation stores[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/omics/home#/annotationStore){#bkmrk-annotation-stores%C2%A0 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r2f:"}
2.  Select **Create annotation store**
3.  For **Variant store name** provide \"my_annotation_store\".
4.  For **Data file format** select **VCF file**
5.  For **Reference genome** select \"GRCh38\" (this is a pre-provisioned reference, but you can alternatively select the reference you imported in the [Reference Store](https://catalog.workshops.aws/amazon-omics-end-to-end/en-US/020-xp-console/100-omics-storage/reference-stores){#bkmrk-reference-store-1 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" aria-labelledby="" analytics-funnel-value="link:r2i:"} part of the workshop)
6.  Finish with **Create annotation store**

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-51-05-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-51-05-pm.png){target="_blank" rel="noopener"}

### 주석 스토어에 VCF 파일 가져오기 {#bkmrk-%EC%A3%BC%EC%84%9D-%EC%8A%A4%ED%86%A0%EC%96%B4%EC%97%90-vcf-%ED%8C%8C%EC%9D%BC-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0-1}

Next, you are going to start an annotation import job to import [ClinVar[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://www.ncbi.nlm.nih.gov/clinvar/){#bkmrk-clinvar%C2%A0 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r2l:"} annotations in VCF format into the pre-provisioned store.

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Annotation stores[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/omics/home#/annotationStore){#bkmrk-annotation-stores%C2%A0-1 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r2o:"}
2.  Click on the name of the Annotation store named **omicsannotationstore1** (or the one you created above as appropriate)
3.  Under **Store versions** click on the name of the only version listed (there should only be one at this time).
4.  Select **Import VCF data**. If this option isn\'t available select **Actions** \> **Import**.
5.  Select **Create and use a new service role**
6.  For **Choose annotation data from S3** provide the following S3 URI, including the appropriate AWS region:

아래는 미리준비된 예제 clinvar 입니다.

``` {#bkmrk-s3%3A%2F%2Faws-genomics-st dir="ltr"}
s3://aws-genomics-static-<aws-region>/omics-workshop/data/annotations/clinvar.vcf.gz
```

실제 clinvar 데이터는 [여기서](https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/#download) 다운로드 할 수 있습니다.

예: <https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh38/>

::::: {#bkmrk--6 .CodeBlock-module_codeBlock__2a1n0 .CodeBlock-module_hasCopyAction__zdyx- style="margin-bottom: 2rem; margin-top: 2rem; position: relative; color: rgb(22, 25, 31); font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"}
:::: {.CodeBlock-module_codeBlock__2a1n0 .CodeBlock-module_hasCopyAction__zdyx- style="margin-bottom: 2rem; margin-top: 2rem; position: relative; color: rgb(22, 25, 31); font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"}
[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik0yIDVoOXY5SDJ6IiAvPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik01IDVWMmg5djloLTMiIC8+PC9zdmc+)]{.awsui_icon_vjswe_1ivyw_1121 .awsui_icon-left_vjswe_1ivyw_1121 .awsui_icon_h11ix_1q8e6_101 .awsui_size-normal-mapped-height_h11ix_1q8e6_157 .awsui_size-normal_h11ix_1q8e6_153 .awsui_variant-normal_h11ix_1q8e6_229 style="display: inline-block; position: relative; vertical-align: top; box-sizing: border-box; inline-size: var(--size-icon-normal-wflv4k,16px); block-size: var(--line-height-body-m-2zx78l,22px); padding-block: calc((var(--line-height-body-m-2zx78l, 22px) - var(--size-icon-normal-wflv4k, 16px))/2); padding-inline: 0px; color: currentcolor; inset-inline: 0px; margin-inline: auto;"}

::: {.awsui_popover-inline-content_xjuzf_191w6_919 aria-live="polite" aria-atomic="true" awsui-referrer-id=":r2r:" style="display: inline;"}
[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-53-49-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-53-49-pm.png){target="_blank" rel="noopener"}
:::
::::
:::::

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-10-54-04-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-10-54-04-pm.png){target="_blank" rel="noopener"}

\

## Querying variants and annotations  {#bkmrk-%C2%A0-5}

이전 섹션에서 가져온 variant 및 annotation 데이터는 확장 가능한 쿼리가 가능한 열 형식의 저장소(**Apache Parquet**)로 변환됩니다. 데이터는 AWS 레이크 형성에서 공유 데이터베이스 및 테이블로 사용할 수 있습니다. 데이터를 쿼리하기 전에 Lake Formation 리소스 링크를 통해 액세스 권한을 제공하고 Athena 작업 그룹을 만드는 등 몇 가지 설정 단계를 수행해야 합니다.

- AWS Lake Formation을 사용하여 데이터 레이크 관리자 및 리소스 링크 생성하기
- Amazon Athena에서 작업 그룹을 생성하고 쿼리 편집기를 사용하여 변형 및 어노테이션 저장소에 대한 간단한 쿼리 실행하기
- AWS SDK for Pandas (aka AWS Wrangler)를 사용해 SageMaker 노트북에서 변형 및 어노테이션 저장소에 대해 쿼리 실행하기\

[\![\](/img/omics-on-aws/omics-analytics.png)](/img/omics-on-aws/omics-analytics.png){target="_blank" rel="noopener"}

### AWS Lake Formation 서비스 셋업  {#bkmrk-aws-lake-formation-%EC%84%9C}

Lake Formation Data Lake administrators are users and roles with permissions to create resource links (covered in the section below). In a real-world scenario, you would only need to setup data lake administrators once per account per region, or you would have IT support staff that serve this role.

For this workshop, you will need to verify that your current user role is a data lake administrator.

1\. Navigate to the [AWS Lake Formation console[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/lakeformation/home){#bkmrk-aws-lake-formation-c .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r3d:"}.

2\. If you see the following screen, select **Get started**:

[\![\](/img/omics-on-aws/lakeformation-get-started.png)](/img/omics-on-aws/lakeformation-get-started.png){target="_blank" rel="noopener"}

3\. From the navigation, go to **Administative roles and tasks**. Verify that `WSParticipantRole`{.awsui_root_18wu0_1ra3n_851 .awsui_box_18wu0_1ra3n_108 .awsui_code-variant_18wu0_1ra3n_108 .awsui_color-default_18wu0_1ra3n_108 .awsui_font-size-default_18wu0_1ra3n_124 .awsui_font-weight-default_18wu0_1ra3n_164 style="font-family: var(--font-family-monospace-yt4nwf,Monaco,Menlo,Consolas,'Courier Prime',Courier,'Courier New',monospace); font-size: var(--font-size-body-s-533prh,12px); border-radius: 2px; padding: 0.1em 0.15em; background: rgba(0, 0, 0, 0); color: var(--color-text-body-default-ffdwgg,#16191f); font-weight: 400; line-height: var(--line-height-body-s-n0pazd,16px); -webkit-font-smoothing: auto; letter-spacing: var(--letter-spacing-body-s-nkvets,normal);" inline="true"} is listed in the **Data lake administrators table**.

[[[[![AWS Lakeformation admin](https://static.us-east-1.prod.workshops.aws/public/fa137586-7af3-4277-86de-3c7bf44e9e71/static/screenshots/lakeformation__administrators.png){.Image-module_image__3AdDJ style="border-style: none; font-size: medium; max-width: 100%; cursor: zoom-in;"}]{style="color: rgb(22, 25, 31); font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 0px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; visibility: visible;" rmiz-content="found"}]{style="position: relative;" aria-owns="rmiz-modal-1cb644293f45" rmiz=""}]{.Image-module_imageWrapper__3HXhZ}]{.Image-module_imageContainer__3PIQv style="display: inline-block; font-size: 0px; line-height: normal; transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0s; box-shadow: rgba(0, 0, 0, 0.06) 0px 10px 20px; z-index: 1;"}

4\. If `WSParticipantRole`{.awsui_root_18wu0_1ra3n_851 .awsui_box_18wu0_1ra3n_108 .awsui_code-variant_18wu0_1ra3n_108 .awsui_color-default_18wu0_1ra3n_108 .awsui_font-size-default_18wu0_1ra3n_124 .awsui_font-weight-default_18wu0_1ra3n_164 style="font-family: var(--font-family-monospace-yt4nwf,Monaco,Menlo,Consolas,'Courier Prime',Courier,'Courier New',monospace); font-size: var(--font-size-body-s-533prh,12px); border-radius: 2px; padding: 0.1em 0.15em; background: rgba(0, 0, 0, 0); color: var(--color-text-body-default-ffdwgg,#16191f); font-weight: 400; line-height: var(--line-height-body-s-n0pazd,16px); -webkit-font-smoothing: auto; letter-spacing: var(--letter-spacing-body-s-nkvets,normal);" inline="true"} is not listed as a data lake administrator, select **Choose administrators** and then choose `WSParticipantRole`{.awsui_root_18wu0_1ra3n_851 .awsui_box_18wu0_1ra3n_108 .awsui_code-variant_18wu0_1ra3n_108 .awsui_color-default_18wu0_1ra3n_108 .awsui_font-size-default_18wu0_1ra3n_124 .awsui_font-weight-default_18wu0_1ra3n_164 style="font-family: var(--font-family-monospace-yt4nwf,Monaco,Menlo,Consolas,'Courier Prime',Courier,'Courier New',monospace); font-size: var(--font-size-body-s-533prh,12px); border-radius: 2px; padding: 0.1em 0.15em; background: rgba(0, 0, 0, 0); color: var(--color-text-body-default-ffdwgg,#16191f); font-weight: 400; line-height: var(--line-height-body-s-n0pazd,16px); -webkit-font-smoothing: auto; letter-spacing: var(--letter-spacing-body-s-nkvets,normal);" inline="true"} under **IAM uesrs and roles**. Then select **Save** to add the role as a Data lake administrator.

#### **데이터베이스 생성** {#bkmrk-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%83%9D%EC%84%B1}

Let\'s create a database that we\'ll use as a virtual container for our variants and annotations.

1\. AWS Lake Formation 콘솔에서 Databases 로 들어갑니다.

2\. Select **Create Database**.

3\. For **Name** provide **omicsdb**. [[[[![HealthOmics Database](https://static.us-east-1.prod.workshops.aws/public/fa137586-7af3-4277-86de-3c7bf44e9e71/static/screenshots/lakeformation__create_database.png){.Image-module_image__3AdDJ style="border-style: none; font-size: medium; max-width: 100%; cursor: zoom-in;"}]{style="color: rgb(22, 25, 31); font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 0px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; visibility: visible;" rmiz-content="found"}]{style="position: relative;" aria-owns="rmiz-modal-fe6fda8baf1c" rmiz=""}]{.Image-module_imageWrapper__3HXhZ}]{.Image-module_imageContainer__3PIQv style="display: inline-block; font-size: 0px; line-height: normal; transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0s;"}

4\. Accept all other defaults and finish with **Create database**.

#### **리소스 링크 생성** {#bkmrk-%EB%A6%AC%EC%86%8C%EC%8A%A4-%EB%A7%81%ED%81%AC-%EC%83%9D%EC%84%B1}

Resource links connect resources shared by HealthOmics Analytics to new or existing databases in your AWS Glue Data Catalog. For this workshop, we\'ll create resource links within the **omicsdb** you created above that point to the Variant and Annotaiton stores you created in previous sections.

1\. AWS Lake Formation 콘솔에서 Tables 메뉴로 진입합니다.

2\. 앞에서 만들었던 변이 스토어 이름을 검색한 뒤 선택하고 새로운 리소스 링크를 만듭니다.

여기 예는 my_variant_store 입니다.

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-02-20-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-02-20-pm.png){target="_blank" rel="noopener"}

For **Resource link name**, provide **omicsvariants**.

For **Database**, provide **omicsdb**. 

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-04-32-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-04-32-pm.png){target="_blank" rel="noopener"}

주석 테이블에 대해 위의 단계를 반복하여 omicsdb 데이터베이스에 omicsannotations라는 리소스 링크를 만듭니다.

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-25-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-25-pm.png){target="_blank" rel="noopener"}

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-45-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-45-pm.png){target="_blank" rel="noopener"}

### Amazon Athena 셋업 {#bkmrk-amazon-athena-%EC%85%8B%EC%97%85}

#### 쿼리 결과 디렉토리 지정 {#bkmrk-%EC%BF%BC%EB%A6%AC-%EA%B2%B0%EA%B3%BC-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EC%A7%80%EC%A0%95}

1.  Open the [Amazon Athena console[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/athena/home){#bkmrk-amazon-athena-consol .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r3s:"}.
2.  From the navigation, choose **Query editor**.
3.  In the Query editor, choose the **Settings** tab and then choose **Manage**.
4.  Click on **Browse S3**, select the bucket named **omics-output-{REGION}-{ACCOUNT-ID}**, and click **Choose**. This will fill the **Location of query result** with the S3 URI of the workshop output bucket. Append to this URI \"/athena/\" and select **Save**.

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-15-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-15-pm.png){target="_blank" rel="noopener"}

#### 워킹 그룹 생성 {#bkmrk-%EC%9B%8C%ED%82%B9-%EA%B7%B8%EB%A3%B9-%EC%83%9D%EC%84%B1 style="padding-top: 4px;"}

1.  Open the [Amazon Athena console[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/athena/home){#bkmrk-amazon-athena-consol-1 .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r3v:"}.

2.  From the navigation, choose **Workgroups**, and then **Create Workgroup**.

3.  For **Workgroup name** provide **athena3**.

4.  Select **Athena SQL** for the type of engine.

5.  Under **Upgrade query engine** select **Manual**.

6.  Under **Query Engine Version** select **Athena version 3**.

7.  Finish with **Create workgroup**

    [\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-56-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-56-pm.png){target="_blank" rel="noopener"}

### **Running queries - Amazon Athena**  {#bkmrk-running-queries---am style="padding-top: 4px;"}

Now that we have Athena configured, let\'s run some queries.

1.  Open the [Amazon Athena Query editor[ [[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]{.awsui_icon_h11ix_1q8e6_101 .awsui_icon-flex-height_h11ix_1q8e6_109 .awsui_size-medium_h11ix_1q8e6_172 .awsui_variant-normal_h11ix_1q8e6_229 .awsui_name-external_h11ix_1q8e6_263 style="display: inline-flex; position: relative; vertical-align: top; align-items: center; box-sizing: border-box; inline-size: var(--size-icon-medium-6sroof,16px); color: currentcolor; height: 24px;"}]{.awsui_icon_4c84z_eu8v7_485 style="display: inline-block;"}]{.awsui_icon-wrapper_4c84z_eu8v7_485 style="white-space: nowrap;"}](https://console.aws.amazon.com/athena/home#/query-editor){#bkmrk-amazon-athena-query- .awsui_link_4c84z_eu8v7_97 .awsui_variant-secondary_4c84z_eu8v7_166 .awsui_font-size-inherit_4c84z_eu8v7_477 style="background-color: initial; border-collapse: initial; border-spacing: 0px; box-sizing: border-box; caption-side: top; cursor: auto; direction: inherit; empty-cells: show; font-family: var(--font-family-base-4om3hr,'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif); font-size: inherit; font-stretch: normal; font-style: normal; font-variant: normal; hyphens: none; line-height: inherit; list-style: outside none disc; tab-size: 8; text-align: start; text-indent: 0px; text-shadow: none; text-transform: none; visibility: visible; word-spacing: normal; -webkit-font-smoothing: inherit; color: var(--color-text-link-default-hop3gv,#0073bb); display: inline; font-weight: inherit; letter-spacing: inherit; text-decoration-color: rgba(0, 0, 0, 0); text-decoration-line: none; text-decoration-thickness: 1px; text-underline-offset: 0.25em; transition-duration: var(--motion-duration-refresh-only-medium-0rwzu1,165ms); transition-property: color, text-decoration, -webkit-text-decoration; white-space: inherit;" target="_blank" rel="noopener noreferrer" aria-labelledby="" analytics-funnel-value="link:r42:"}.
2.  Under **Workgroup** select \"athena3\" (which you created above).
3.  Make sure the **Data Source** is **AwsDataCatalog** and the **Database** is **omicsdb** (which you created previously). Both the **omicsvariants** and **omicsannotations** tables should be listed.

#### 간단한 쿼리 {#bkmrk-%EA%B0%84%EB%8B%A8%ED%95%9C-%EC%BF%BC%EB%A6%AC style="padding-top: 4px;"}

Preview the **omicsvariants** table, by running the following query:

``` {#bkmrk-select-%2A-from-omicsv dir="ltr"}
SELECT * from omicsvariants limit 10
```

::: {#bkmrk--20 .CodeBlock-module_codeBlock__2a1n0 .CodeBlock-module_hasCopyAction__zdyx- style="margin-bottom: 2rem; margin-top: 2rem; position: relative; color: rgb(22, 25, 31); font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"}
[![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik0yIDVoOXY5SDJ6IiAvPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik01IDVWMmg5djloLTMiIC8+PC9zdmc+)]{.awsui_icon_vjswe_1ivyw_1121 .awsui_icon-left_vjswe_1ivyw_1121 .awsui_icon_h11ix_1q8e6_101 .awsui_size-normal-mapped-height_h11ix_1q8e6_157 .awsui_size-normal_h11ix_1q8e6_153 .awsui_variant-normal_h11ix_1q8e6_229 style="display: inline-block; position: relative; vertical-align: top; box-sizing: border-box; inline-size: var(--size-icon-normal-wflv4k,16px); block-size: var(--line-height-body-m-2zx78l,22px); padding-block: calc((var(--line-height-body-m-2zx78l, 22px) - var(--size-icon-normal-wflv4k, 16px))/2); padding-inline: 0px; color: currentcolor; inset-inline: 0px; margin-inline: auto;"}
:::

1.  Copy the above query and paste it into the **Query Editor** under the **Query 1** tab.
2.  Select **Run** to execute the query.

Results should return in a few seconds and look like:

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-09-08-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-09-08-pm.png){target="_blank" rel="noopener"}

#### 복잡한 쿼리 {#bkmrk-%EB%B3%B5%EC%9E%A1%ED%95%9C-%EC%BF%BC%EB%A6%AC}

For a more complex query, you can run the following which displays variants with a \'Likely_pathogenic\' clinical significance by joining ClinVar annotations to variants.

1.  Select the **+** on the top right to create a new query tab called **Query 2**.
2.  Copy and paste the SQL below and select **Run**.

``` {#bkmrk-select-variants.samp dir="ltr"}
SELECT variants.sampleid,
  variants.contigname,
  variants.start,
  variants.referenceallele,
  variants.alternatealleles,
  variants.attributes AS variant_attributes,
  clinvar.referenceallele,
  clinvar.alternatealleles,
  clinvar.attributes AS clinvar_attributes 
FROM omicsvariants as variants 
INNER JOIN omicsannotations as clinvar ON 
  variants.contigname=CONCAT('chr',clinvar.contigname) 
  AND variants.start=clinvar.start 
  AND variants."end"=clinvar."end" 
  WHERE clinvar.attributes['CLNSIG']='Benign'
```

[\![\](/img/omics-on-aws/screenshot-2024-06-14-at-11-27-02-pm.png)](/img/omics-on-aws/screenshot-2024-06-14-at-11-27-02-pm.png){target="_blank" rel="noopener"}

또다른 예 (본인의 상황에 맞게 수정해야할 것입니다.)\

``` {#bkmrk-select-variants.samp-1 dir="ltr"}
SELECT variants.sampleid,
  variants.contigname,
  variants.start,
  variants.referenceallele,
  variants.alternatealleles,
  variants.attributes AS variant_attributes,
  clinvar.attributes AS clinvar_attributes 
FROM omicsvariants as variants 
INNER JOIN omicsannotations as clinvar ON 
  variants.contigname=CONCAT('chr',clinvar.contigname) 
  AND variants.start=clinvar.start 
  AND variants."end"=clinvar."end" 
  AND variants.referenceallele=clinvar.referenceallele 
  AND variants.alternatealleles=clinvar.alternatealleles 
WHERE clinvar.attributes['CLNSIG']='Likely_pathogenic'
```

####  {#bkmrk--24}

##  {#bkmrk--25}

## **참고**  {#bkmrk-%EA%B8%B0%ED%83%80-%EC%B0%B8%EA%B3%A0-%EB%A6%AC%EC%86%8C%EC%8A%A4}

- <https://catalog.workshops.aws/amazon-omics-end-to-end/en-US/010-xp-console/300-omics-analytics>
- <https://github.com/aws-samples/amazon-omics-tutorials/blob/main/notebooks/200-omics_analytics.ipynb>

<!-- -->

- https://github.com/vcflib/vcflib/tree/master
- <https://github.com/Ensembl/ensembl-vep>
- echtvar
  - <https://academic.oup.com/nar/article/51/1/e3/6775383>
  - <https://github.com/brentp/echtvar/wiki/why>
- https://github.com/brentp/vcfanno

::: {#bkmrk--27}
:::

::: {#bkmrk--28}
:::
