---
title: "AWS HealthOmics에서 Annotation 작업 수행하기"
sidebar_position: 7
---

AWS HealthOmics variant stores and annotation stores are no longer open to new customers. Existing customers can continue to use the service as normal. For more information, see [AWS HealthOmics variant store and annotation store availability change](https://docs.aws.amazon.com/omics/latest/dev/variant-store-availability-change.html).

AWS HealthOmics의 Analytics 기능을 활용하여 annotation작업을 수행할 수 있습니다.

## 준비물 

- 입력 샘플 VCF
- Annotation할 정보 소스 VCF (예: ClinVar)

[s3://omics-eventbridge-solutio-healthomicsckaoutput6642-xbtuwqnxt8uw/outputs/9881593/out/output_vcf/NA12878.hg38.g.vcf.gz]

##  

## [Variant stores]  

### 변이 스토어 생성 

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Variant stores[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/omics/home#/variantStore)
2.  Select **Create variant store**
3.  For **Variant store name** provide \"my_variant_store\".
4.  For **Reference genome** select \"GRCh38\" (this is a pre-provisioned reference, but you can alternatively select the reference you imported in the [Reference Store](https://catalog.workshops.aws/amazon-omics-end-to-end/en-US/020-xp-console/100-omics-storage/reference-stores) part of the workshop)
5.  Finish with **Create variant store**

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-45-15-pm.png)

### [변이스토어에 샘플 VCF 파일 가져오기] 

Next, you are going to start a VCF Import job. To do this:

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Variant stores[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/omics/home#/variantStore)
2.  Select the **Name** Variant store named **omicsvariantstore1** (or the one you created above as appropriate)
3.  Select **Import variant data**. If this option isn\'t available select **Actions** \> **Import**.
4.  Select **Create and use a new service role**
5.  For **Select variant data from S3** provide the following S3 URI:

아래 s3 경로는 입력 VCF 파일의 S3 URI을 의미합니다.

``` 
s3://omics-eventbridge-solutio-healthomicsckaoutput6642-xbtuwqnxt8uw/outputs/9881593/out/output_vcf/NA12878.hg38.g.vcf.gz
```

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-46-45-pm.png)

**NOTE:** The region will differ based on deployment region.

6.  Start the Import with **Create Import job**

You should now see something like this:

\- 적당한 Service role 이 없을 경우 새로 생성하여 사용하는 옵션을 선택할 수 있습니다.

\- 앞에서 설명한대로 입력하고자하는 VCF 파일의 S3 경로를 작성합니다.

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-48-13-pm.png)

콘솔에서 VCF Import작업시 제출되었음을 확인할 수 있습니다.\

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-49-27-pm.png)

## Annotation stores  

### 주석 스토어 생성 

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Annotation stores[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/omics/home#/annotationStore)
2.  Select **Create annotation store**
3.  For **Variant store name** provide \"my_annotation_store\".
4.  For **Data file format** select **VCF file**
5.  For **Reference genome** select \"GRCh38\" (this is a pre-provisioned reference, but you can alternatively select the reference you imported in the [Reference Store](https://catalog.workshops.aws/amazon-omics-end-to-end/en-US/020-xp-console/100-omics-storage/reference-stores) part of the workshop)
6.  Finish with **Create annotation store**

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-51-05-pm.png)

### 주석 스토어에 VCF 파일 가져오기 

Next, you are going to start an annotation Import job to Import [ClinVar[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://www.ncbi.nlm.nih.gov/clinvar/) annotations in VCF format into the pre-provisioned store.

1.  From the AWS HealthOmics Console, navigate to **Analytics** \> [Annotation stores[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/omics/home#/annotationStore)
2.  Click on the name of the Annotation store named **omicsannotationstore1** (or the one you created above as appropriate)
3.  Under **Store versions** click on the name of the only version listed (there should only be one at this time).
4.  Select **Import VCF data**. If this option isn\'t available select **Actions** \> **Import**.
5.  Select **Create and use a new service role**
6.  For **Choose annotation data from S3** provide the following S3 URI, including the appropriate AWS region:

아래는 미리준비된 예제 clinvar 입니다.

``` 
s3://aws-genomics-static-/omics-workshop/data/annotations/clinvar.vcf.gz
```

실제 clinvar 데이터는 [여기서](https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/#download) 다운로드 할 수 있습니다.

예: 

[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik0yIDVoOXY5SDJ6IiAvPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik01IDVWMmg5djloLTMiIC8+PC9zdmc+)]

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-53-49-pm.png)

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-10-54-04-pm.png)

\

## Querying variants and annotations  

이전 섹션에서 가져온 variant 및 annotation 데이터는 확장 가능한 쿼리가 가능한 열 형식의 저장소(**Apache Parquet**)로 변환됩니다. 데이터는 AWS 레이크 형성에서 공유 데이터베이스 및 테이블로 사용할 수 있습니다. 데이터를 쿼리하기 전에 Lake Formation 리소스 링크를 통해 액세스 권한을 제공하고 Athena 작업 그룹을 만드는 등 몇 가지 설정 단계를 수행해야 합니다.

- AWS Lake Formation을 사용하여 데이터 레이크 관리자 및 리소스 링크 생성하기
- Amazon Athena에서 작업 그룹을 생성하고 쿼리 편집기를 사용하여 변형 및 어노테이션 저장소에 대한 간단한 쿼리 실행하기
- AWS SDK for Pandas (aka AWS Wrangler)를 사용해 SageMaker 노트북에서 변형 및 어노테이션 저장소에 대해 쿼리 실행하기\

![이미지](/img/omics-on-aws/omics-analytics.png)

### AWS Lake Formation 서비스 셋업  

Lake Formation Data Lake administrators are users and roles with permissions to create resource links (covered in the section below). In a real-world scenario, you would only need to setup data lake administrators once per account per region, or you would have IT support staff that serve this role.

For this workshop, you will need to verify that your current user role is a data lake administrator.

1\. Navigate to the [AWS Lake Formation console[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/lakeformation/home).

2\. If you see the following screen, select **Get started**:

![이미지](/img/omics-on-aws/lakeformation-get-started.png)

3\. From the navigation, go to **Administative roles and tasks**. Verify that `WSParticipantRole` is listed in the **Data lake administrators table**.

[[[[![AWS Lakeformation admin](https://static.us-east-1.prod.workshops.aws/public/fa137586-7af3-4277-86de-3c7bf44e9e71/static/screenshots/lakeformation__administrators.png)]]]]

4\. If `WSParticipantRole` is not listed as a data lake administrator, select **Choose administrators** and then choose `WSParticipantRole` under **IAM uesrs and roles**. Then select **Save** to add the role as a Data lake administrator.

#### **데이터베이스 생성** 

Let\'s create a database that we\'ll use as a virtual container for our variants and annotations.

1\. AWS Lake Formation 콘솔에서 Databases 로 들어갑니다.

2\. Select **Create Database**.

3\. For **Name** provide **omicsdb**. [[[[![HealthOmics Database](https://static.us-east-1.prod.workshops.aws/public/fa137586-7af3-4277-86de-3c7bf44e9e71/static/screenshots/lakeformation__create_database.png)]]]]

4\. Accept all other defaults and finish with **Create database**.

#### **리소스 링크 생성** 

Resource links connect resources shared by HealthOmics Analytics to new or existing databases in your AWS Glue Data Catalog. For this workshop, we\'ll create resource links within the **omicsdb** you created above that point to the Variant and Annotaiton stores you created in previous sections.

1\. AWS Lake Formation 콘솔에서 Tables 메뉴로 진입합니다.

2\. 앞에서 만들었던 변이 스토어 이름을 검색한 뒤 선택하고 새로운 리소스 링크를 만듭니다.

여기 예는 my_variant_store 입니다.

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-02-20-pm.png)

For **Resource link name**, provide **omicsvariants**.

For **Database**, provide **omicsdb**. 

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-04-32-pm.png)

주석 테이블에 대해 위의 단계를 반복하여 omicsdb 데이터베이스에 omicsannotations라는 리소스 링크를 만듭니다.

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-25-pm.png)

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-05-45-pm.png)

### Amazon Athena 셋업 

#### 쿼리 결과 디렉토리 지정 

1.  Open the [Amazon Athena console[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/athena/home).
2.  From the navigation, choose **Query editor**.
3.  In the Query editor, choose the **Settings** tab and then choose **Manage**.
4.  Click on **Browse S3**, select the bucket named **omics-output--**, and click **Choose**. This will fill the **Location of query result** with the S3 URI of the workshop output bucket. Append to this URI \"/athena/\" and select **Save**.

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-15-pm.png)

#### 워킹 그룹 생성 

1.  Open the [Amazon Athena console[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/athena/home).

2.  From the navigation, choose **Workgroups**, and then **Create Workgroup**.

3.  For **Workgroup name** provide **athena3**.

4.  Select **Athena SQL** for the type of engine.

5.  Under **Upgrade query engine** select **Manual**.

6.  Under **Query Engine Version** select **Athena version 3**.

7.  Finish with **Create workgroup**

    ![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-07-56-pm.png)

### **Running queries - Amazon Athena**  

Now that we have Athena configured, let\'s run some queries.

1.  Open the [Amazon Athena Query editor[ [[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWNhcC1zcXVhcmUiIGQ9Ik0xMCAyaDR2NCIgLz48cGF0aCBkPSJtNiAxMCA4LTgiIC8+PHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTE0IDkuMDQ4VjE0SDJWMmg1IiAvPjwvc3ZnPg==)]]]](https://console.aws.amazon.com/athena/home#/query-editor).
2.  Under **Workgroup** select \"athena3\" (which you created above).
3.  Make sure the **Data Source** is **AwsDataCatalog** and the **Database** is **omicsdb** (which you created previously). Both the **omicsvariants** and **omicsannotations** tables should be listed.

#### 간단한 쿼리 

Preview the **omicsvariants** table, by running the following query:

``` 
SELECT * from omicsvariants limit 10
```

[![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxNiAxNiIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik0yIDVoOXY5SDJ6IiAvPjxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik01IDVWMmg5djloLTMiIC8+PC9zdmc+)]

1.  Copy the above query and paste it into the **Query Editor** under the **Query 1** tab.
2.  Select **Run** to execute the query.

Results should return in a few seconds and look like:

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-09-08-pm.png)

#### 복잡한 쿼리 

For a more complex query, you can run the following which displays variants with a \'Likely_pathogenic\' clinical significance by joining ClinVar annotations to variants.

1.  Select the **+** on the top right to create a new query tab called **Query 2**.
2.  Copy and paste the SQL below and select **Run**.

``` 
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

![이미지](/img/omics-on-aws/screenshot-2024-06-14-at-11-27-02-pm.png)

또다른 예 (본인의 상황에 맞게 수정해야할 것입니다.)\

``` 
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

####  

##  

## **참고**  

- 
- 

- https://github.com/vcflib/vcflib/tree/master
- 
- echtvar
  - 
  - 
- https://github.com/brentp/vcfanno

