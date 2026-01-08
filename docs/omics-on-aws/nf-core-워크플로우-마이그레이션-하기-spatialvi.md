---
title: Nf-core 워크플로우 마이그레이션 하기 (spatialvi)
sidebar_position: 3
---

2025년 5월 22일 현재 dev 버전 branch에서 테스트 되었습니다.

연구 목적이며 반드시 실제 샘플과 시나리오상에서 개별적으로 결과데이터와 파이프라인 검증을 필요로 할 것입니다.

2025년 5/30일 경 nf-schema 지원을 위한 HealthOmics 업데이트가 예정되어 있습니다. 그전에는 nf-schema를 기존의구 플러그인인 nf-validation으로 변경해야 합니다. 워크플로우 내 코드 수정은 다음을 참고하여 모두 교체해주세요. ([링크](https://github.com/nf-core/spatialvi/compare/dev...hmkim:spatialvi:aho_dev){target="_blank" rel="noopener"})

## 마이그레이션을 위한 환경 구성 {#bkmrk-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%85%8B%EC%97%85}

### Step1 - Ec2 기반 환경 구성 {#bkmrk-}

Ec2기반이 아닌 CloudShell 기반으로도 세팅할 수 있습니다. ([참고](https://catalog.us-east-1.prod.workshops.aws/workshops/76d4a4ff-fe6f-436a-a1c2-f7ce44bc5d17/en-US/introduction/setting-up-environment/cloudshell-environment)) 선호하는 환경에서 작업하세요.

- t2.medium
- Amazon linux 2023 AMI
- 64 bit x86

#### Specify instance type options {#bkmrk-specify-instance-typ}

[\![\](/img/omics-on-aws/image.png)](/img/omics-on-aws/image.png){target="_blank" rel="noopener"}

#### Generate key pairs {#bkmrk-generate-key-pairs}

If you don\'t already have a key pair then select create keypair

[\![\](/img/omics-on-aws/iI6image.png)](/img/omics-on-aws/iI6image.png){target="_blank" rel="noopener"}

Give the key pair a name and select the key pair type and format.

#### Security groups {#bkmrk-security-groups}

Ensure that you have access to the instance via SSH.

[\![\](/img/omics-on-aws/E2Oimage.png)](/img/omics-on-aws/E2Oimage.png){target="_blank" rel="noopener"}

#### Storage {#bkmrk-storage}

Create a root volume of 20GB

[\![\](/img/omics-on-aws/5r8image.png)](/img/omics-on-aws/5r8image.png){target="_blank" rel="noopener"}

#### Instance Profile {#bkmrk-%C2%A0-2}

We will create an IAM instance profile to allow administrator permissions for the EC2 instance, for the purpose of this workshop. However, in general, AWS security best practices recommendation is that you create an instance profile with least privilege. This configuration is not recommended in your own account, you should discuss organizational best-practices with your IT team to configure appropriate permissions.

Advanced Details 토글 

[\![\](/img/omics-on-aws/GB4image.png)](/img/omics-on-aws/GB4image.png){target="_blank" rel="noopener"}

IAM Instance profile에서 Create new IAM profile 선택

[\![\](/img/omics-on-aws/0Egimage.png)](/img/omics-on-aws/0Egimage.png){target="_blank" rel="noopener"}

**AWS service, EC2 선택**

[\![\](/img/omics-on-aws/KIdimage.png)](/img/omics-on-aws/KIdimage.png){target="_blank" rel="noopener"}

**Add Permissions 화면에서 AdministratorAccess 추가(선택)**

[\![\](/img/omics-on-aws/5Hximage.png)](/img/omics-on-aws/5Hximage.png){target="_blank" rel="noopener"}

새로운 role name을 지정 (여기서는 EC2adminAccess라고 작성했음)

[\![\](/img/omics-on-aws/8Otimage.png)](/img/omics-on-aws/8Otimage.png){target="_blank" rel="noopener"}

**이제 EC2 instance 실행 화면으로 돌아가서 앞에서 만든 EC2adminAccess 선택**

[\![\](/img/omics-on-aws/APximage.png)](/img/omics-on-aws/APximage.png){target="_blank" rel="noopener"}

#### **User Data** {#bkmrk-user-data}

**맨 아래의 User data 섹션에 내용 추가**

``` {#bkmrk-%23%21%2Fbin%2Fbash-echo-%22se}
#!/bin/bash

echo "Setting up NodeJS Environment"
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

echo 'export NVM_DIR="/.nvm"' >> /home/ec2-user/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> /home/ec2-user/.bashrc

# Dot source the files to ensure that variables are available within the current shell
. /.nvm/nvm.sh
. ~/.bashrc
nvm install --lts

python3 -m ensurepip --upgrade

pip3 install boto3
npm install -g aws-cdk
sudo yum -y install git
```

[\![\](/img/omics-on-aws/jQZimage.png)](/img/omics-on-aws/jQZimage.png){target="_blank" rel="noopener"}

Launch instance 눌러서 인스턴스 실행

[\![\](/img/omics-on-aws/QyAimage.png)](/img/omics-on-aws/QyAimage.png){target="_blank" rel="noopener"}

### **Step 2 - workflow migration code를 세팅하기** {#bkmrk-step-2---workflow-mi}

**SSH 접속,** **앞에서 만든 console로 접속합니다.**

[\![\](/img/omics-on-aws/2JAimage.png)](/img/omics-on-aws/2JAimage.png){target="_blank" rel="noopener"}

[\![\](/img/omics-on-aws/26timage.png)](/img/omics-on-aws/26timage.png){target="_blank" rel="noopener"}

Use SSH to access the instance, you will need to ensure the key you created earlier is in the .ssh folder in your home directory and has the correct permissions(chmod 400). You will **need replace** ec2-user@10.11.12.123 with the IP address of your instance. This can be found in the EC2 management console.

``` {#bkmrk-ssh--i-.ssh%2Fomics-tu}
ssh -i .ssh/omics-tutorial.pem ec2-user@10.11.12.123
```

Get the region using the `ec2-metadata command`{.awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_code-variant_18wu0_fxrr2_172 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228 inline="true"}. This handy oneliner stores it as a variable

``` {#bkmrk-region%3D%24%28ec2-metadat}
REGION=$(ec2-metadata --availability-zone | sed 's/placement: \(.*\).$/\1/')
```

Get the account number (if you don\'t already know it)

``` {#bkmrk-aws-sts-get-caller-i}
ACCOUNT_NUMBER=$(aws sts get-caller-identity --query 'Account' --output text)
```

**Bootstraping**

Now you can bootstrap cdk replacing `ACCOUNT-NUMBER`{.awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_code-variant_18wu0_fxrr2_172 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228 inline="true"} with your account number nad using the `$REGION`{.awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_code-variant_18wu0_fxrr2_172 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228 inline="true"} variable created earlier.

``` {#bkmrk-cdk-bootstrap-aws%3A%2F%2F}
cdk bootstrap aws://$ACCOUNT_NUMBER/$REGION
```

**Download the workflow migration code**

This step downloads the code which is used to migrate the workflow into AWS HealthOmics Workflows

``` {#bkmrk-cd-%7E-git-clone-https dir="ltr"}
cd ~
git clone https://github.com/aws-samples/amazon-ecr-helper-for-aws-healthomics.git

git clone https://github.com/aws-samples/aws-healthomics-tutorials.git

cd amazon-ecr-helper-for-aws-healthomics
```

Install and deploy the code.

``` {#bkmrk-npm-install-cdk-depl dir="ltr"}
npm install
cdk deploy --all
```

::::: {#bkmrk--15 .awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228}
:::: MarkdownRenderer-module_markdown__35_09
::: {.CodeBlock-module_codeBlock__2a1n0 .CodeBlock-module_hasCopyAction__zdyx-}
[![](data:image/svg+xml;base64,PHN2ZyB2aWV3Ym94PSIwIDAgMTYgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGQ9Ik0xNSA1SDV2MTBoMTBWNVoiIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIC8+PHBhdGggZD0iTTEzIDFIMXYxMSIgY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgLz48L3N2Zz4=)]{.awsui_icon_vjswe_1379u_585 .awsui_icon-left_vjswe_1379u_585 .awsui_icon_h11ix_npnzo_189 .awsui_size-normal-mapped-height_h11ix_npnzo_248 .awsui_size-normal_h11ix_npnzo_244 .awsui_variant-normal_h11ix_npnzo_320}
:::
::::
:::::

## 프로젝트 셋업 {#bkmrk-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%85%8B%EC%97%85-1 .awsui_root_18582_whr0e_145 .awsui_horizontal_18582_whr0e_160 .awsui_horizontal-xs_18582_whr0e_170}

이제 원하는 nf-core의 워크플로우를 HealthOmics private workflow에 마이그레이션을 하기 위해 다음 과정이 필요합니다.

- Cloning a workflow from nf-core
- Generating artifacts for migration
- Privatizing containers by migrating them to your private Amazon ECR \

**버킷 생성 및 Bash 환경변수 선언**

``` {#bkmrk-export-yourbucket%3D%22y}
export yourbucket="your-bucket-name"
export your_account_id="your-account-id" #ACCOUNT_NUMBER
export region="your-region"
export workflow_name="your-workflow-name"
export omics_role_name="your_omics_rolename"

# if not exist the bucket, let's create.
#aws s3 mb $yourbucket
```

##  {#bkmrk--19}

#### Clone nf-core repository that you want to migrate {#bkmrk-clone-nf-core-reposi .awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_h3-variant_18wu0_fxrr2_176 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228}

``` {#bkmrk-cd-%7E-git-clone-https-1 dir="ltr"}
cd ~
git clone https://github.com/nf-core/spatialvi.git
```

#### Docker Image Manifest의 생성 {#bkmrk-docker-image-manifes}

``` {#bkmrk-cp-%2Fhome%2Fworkshop%2Fam dir="ltr"}
cp  /home/workshop/amazon-ecr-helper-for-aws-healthomics/lib/lambda/parse-image-uri/public_registry_properties.json namespace.config
```

준비된 namespace.config파일의 내용은 다음과 같습니다.

[\![\](/img/omics-on-aws/25bimage.png)](/img/omics-on-aws/25bimage.png){target="_blank" rel="noopener"}

This file will be used as one of the inputs for the `inspect_nf.py`{.awsui_root_18wu0_fxrr2_920 .awsui_box_18wu0_fxrr2_172 .awsui_code-variant_18wu0_fxrr2_172 .awsui_color-default_18wu0_fxrr2_172 .awsui_font-size-default_18wu0_fxrr2_188 .awsui_font-weight-default_18wu0_fxrr2_228 inline="true"} script. This script parses the entire nextflow workflow project and identifies all public docker images across all the tools and generates a manifest which will be passed as an input to the migration tool.

`inspect_nf.py` 를 실행합니다.

``` {#bkmrk-python3-amazon-omics}
python3 aws-healthomics-tutorials/utils/scripts/inspect_nf.py \
--output-manifest-file spatialvi_dev_docker_images_manifest.json \
 -n namespace.config \
 --output-config-file omics.config \
 --region $region \
 ~/spatialvi/
```

생성되는 두 개의 출력은 `spatialvi_dev_docker_images_manifest.json` 과 `omics.config`입니다.

`spatialvi_dev_docker_images_manifest.json`  파일은 예를들어 다음과 같은 모습이어야 합니다:

[\![\](/img/omics-on-aws/2keimage.png)](/img/omics-on-aws/2keimage.png){target="_blank" rel="noopener"}

해당 파일의 내용을 다음과 같이 수정합니다. (기존의 container 주소가 더이상 작동하지 않는 것이 많아서 임의로 공개된 것을 찾아 수정하였습니다, 예를들어 [spaceranger에 대한 컨테이너 주소 quay.io/nf-core/spaceranger:3.1.3](https://github.com/nf-core/spatialvi/blob/caeb4ff3768e6cba7a45f4a92220e9e9bf4efa28/modules/nf-core/spaceranger/count/main.nf#L5){target="_blank" rel="noopener"} 가 작동하지 않아서 dockerhub의 공개 Image로부터 검색하여 대응시켰습니다. <https://hub.docker.com/search?q=spaceranger>

\

``` {#bkmrk-%7B-%22manifest%22%3A-%5B-%22qua}
{
    "manifest": [
        "quay.io/biocontainers/fastqc:0.12.1--hdfd78af_0",
        "erikfas/spatialvi:latest",
        "multiqc/multiqc:v1.24.1",
        "cumulusprod/spaceranger:3.1.3",
        "ubuntu:22.04"
    ]
}
```

The omics.config output file is also generated, which needs to be added to the nextflow workflow project. The purpose of this config is to inform nextflow to use the ECR docker image locations instead of the ones specified in the nextflow project code. The omics.config should look like this:

[\![\](/img/omics-on-aws/H6Nimage.png)](/img/omics-on-aws/H6Nimage.png){target="_blank" rel="noopener"}

`omics.config` 내용 중 process에 정의된 내용도 아래와 같이 변경합니다.

``` {#bkmrk-process-%7B-withname%3A-}
process {
withName: '.*' { conda = null }
withName: '(.+:)?MERGE_SDATA' { container = 'erikfas/spatialvi' }
withName: '(.+:)?READ_DATA' { container = 'erikfas/spatialvi' }
withName: '(.+:)?FASTQC' { container = 'quay/biocontainers/fastqc:0.12.1--hdfd78af_0' }
withName: '(.+:)?MULTIQC' { container = 'multiqc/multiqc:v1.24.1' }
withName: '(.+:)?QUARTONOTEBOOK' { container = 'erikfas/spatialvi' }
withName: '(.+:)?SPACERANGER_COUNT' { container = 'quay/nf-core/spaceranger:3.1.3' }
withName: '(.+:)?UNTAR' { container = 'quay/nf-core/ubuntu:22.04' }
}
```

#### 컨테이너 사설화 (into Amazon ECR) {#bkmrk-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%82%AC%EC%84%A4%ED%99%94}

``` {#bkmrk-aws-stepfunctions-st}
aws stepfunctions start-execution \
--state-machine-arn arn:aws:states:$region:$your_account_id:stateMachine:omx-container-puller \
--input file://spatialvi_dev_docker_images_manifest.json
```

[step function 콘솔](https://console.aws.amazon.com/states/home)에서 state machines중에 `omx-container-puller`를 확인하여 Execution이 완료되었는지 확인합니다.\

[\![\](/img/omics-on-aws/screenshot-2025-04-15-at-3-52-46-pm.png)](/img/omics-on-aws/screenshot-2025-04-15-at-3-52-46-pm.png){target="_blank" rel="noopener"}

[\![\](/img/omics-on-aws/24Eimage.png)](/img/omics-on-aws/24Eimage.png){target="_blank" rel="noopener"}

#### nf-core project 코드 업데이트 {#bkmrk-nf-core-project-%EC%BD%94%EB%93%9C-%EC%97%85}

To use the newly migrated containers for our workflow, copy the omics.config generated from inspect_nf.py in the /conf dir of the spatialvi project.

``` {#bkmrk-mv-omics.config-scrn}
mv omics.config spatialvi/conf
```

Update the nextflow.config file in the root dir of the scrnaseq project by adding to the bottom of the file:

``` {#bkmrk-echo-%22includeconfig-}
echo "includeConfig 'conf/omics.config'" >> spatialvi/nextflow.config 
```

##  {#bkmrk-%C2%A0-6}

## 신규 HealthOmics 워크플로우 만들기 {#bkmrk-aws-healthomics-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C}

#### 단계1. 파라미터 파일 {#bkmrk-%EB%8B%A8%EA%B3%841.-aws-healthomics}

`parameter-description.json`을 만들어 아래와 같이 저장합니다.

``` {#bkmrk-%7B-%22input%22%3A-%7B%22descrip}
cat > parameter-description.json <<EOF
{
   "input":{
      "description":"CSV samplesheet containing sample information",
      "optional":false
   },
   "spaceranger_probeset":{
      "description":"Probe set file for Space Ranger analysis",
      "optional":false
   },
   "spaceranger_reference":{
      "description":"Reference genome tarball for Space Ranger",
      "optional":false
   },
   "qc_min_counts":{
      "description":"Minimum count threshold for QC filtering",
      "optional":true
   },
   "qc_min_genes":{
      "description":"Minimum number of genes threshold for QC filtering",
      "optional":true
   }
}
EOF
```

#### 단계2. 워크플로우 스테이징 {#bkmrk-%EB%8B%A8%EA%B3%842.-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%95}

``` {#bkmrk-zip--r-scrnaseq-work}
zip -r spatialvi.zip spatialvi/ -x "*/\.*" "*/\.*/**"
```

``` {#bkmrk-aws-s3-cp-scrnaseq-w}
aws s3 cp spatialvi.zip s3://${yourbucket}/workshop/spatialvi.zip

aws omics create-workflow \
  --name ${workflow_name} \
  --definition-uri s3://${yourbucket}/workshop/spatialvi-workflow.zip \
  --parameter-template file://parameter-description.json \
  --engine NEXTFLOW
```

#### 단계3. 워크플로우 생성 확인 {#bkmrk-%EB%8B%A8%EA%B3%843.-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%EC%83%9D%EC%84%B1-%ED%99%95%EC%9D%B8}

``` {#bkmrk-aws-omics-list-workf}
workflow_id=$(aws omics list-workflows --name ${workflow_name} --query 'items[0].id' --output text)
echo $workflow_id
```

\

## 워크플로우 테스트하기 {#bkmrk-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0}

#### 입력파일 준비 {#bkmrk-%EC%9E%85%EB%A0%A5%ED%8C%8C%EC%9D%BC-%EC%A4%80%EB%B9%84}

`parameter-description.json`에 사용된 것과 동일한 키를 사용하여 `input.json` 파일을 새로 만듭니다. 값은 워크플로에서 허용되는 실제 S3 경로 또는 문자열이 됩니다.

아래는 테스트 샘플의 파라미터 예시입니다. ([참고](https://github.com/nf-core/scrnaseq/blob/e0ddddbff9d8b8c2421c67ff07449a06f9ca02d2/conf/test.config#L26){target="_blank" rel="noopener"})

데이터 준비 참고

예제 데이터는 다음과 같이 다운로드 해볼 수 있습니다.

``` bash
wget "https://raw.githubusercontent.com/nf-core/test-datasets/spatialvi/testdata/human-brain-cancer-11-mm-capture-area-ffpe-2-standard_v2_ffpe_cytassist/samplesheet_spaceranger.csv"
wget "https://raw.githubusercontent.com/nf-core/test-datasets/spatialvi/testdata/human-brain-cancer-11-mm-capture-area-ffpe-2-standard_v2_ffpe_cytassist/outs/probe_set.csv"
wget "https://raw.githubusercontent.com/nf-core/test-datasets/spatialvi/testdata/homo_sapiens_chr22_reference.tar.gz"
```

이제 현재 디렉토리에 다운로드 된 파일들을 버킷에 업로드할 수 있습니다.

``` bash
aws s3 mv samplesheet_spaceranger.csv s3://${yourbucket}/spatialvi/
aws s3 mv probe_set.csv s3://${yourbucket}/spatialvi/
aws s3 mv homo_sapiens_chr22_reference.tar.gz s3://${yourbucket}/spatialvi/
```

**sample sheet 만들기**

``` {#bkmrk-cat-%3C%3C-eof-%3E-samples}
cat << EOF > samplesheet_spaceranger.csv
sample,fastq_dir,cytaimage,slide,area,manual_alignment,slidefile
CytAssist_11mm_FFPE_Human_Glioblastoma_2,s3://${bucket}/spatialvi/fastq_dir.tar.gz,s3://${bucket}/spatialvi/CytAssist_11mm_FFPE_Human_Glioblastoma_image.tif,V52Y10-317,B1,,s3://${bucket}/spatialvi/V52Y10-317.gpr
EOF
```

**위에서 만든 samplesheet를 s3로 복사**

``` {#bkmrk-aws-s3-cp-sampleshee}
aws s3 cp samplesheet_spaceranger.csv s3://${yourbucket}/spatialvi/samplesheet_spaceranger.csv
```

**입력 json 만들기 (위 sample sheet경로가 아래 내용중 input에 값으로 들어가게됨)**

마찬가지로 probe_set.csv, homo_sapiens_chr22_reference.tar.gz도 모두 버킷에 준비해야합니다.

``` {#bkmrk-%7B-%22input%22%3A-%22s3%3A%2F%2Faws}
cat > input.json <<EOF
{
    "input": "s3://${yourbucket}/spatialvi/samplesheet_spaceranger.csv",
    "spaceranger_probeset": "s3://${yourbucket}/spatialvi/probe_set.csv",
    "spaceranger_reference": "s3://${yourbucket}/spatialvi/homo_sapiens_chr22_reference.tar.gz",
    "qc_min_counts": 5,
    "qc_min_genes": 3
}
EOF
```

[Policy 준비]{style="color: rgb(34, 34, 34); font-family: 'Amazon Ember', 'Noto Sans KR', sans-serif; font-size: 1.666em; font-weight: 400;"}

##### Prepare IAM service role to run AWS HealthOmics workflow {#bkmrk-prepare-iam-service-}

your-bucket-name, your-account-id, your-region을 모두 본인 환경에 맞게 수정하여 사용하세요.

`omics_workflow_policy.json` 만들기

``` {#bkmrk-%23-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98-%EC%84%A4%EC%A0%95-export-yo}

cat << EOF > omics_workflow_policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${yourbucket}/*",
                "arn:aws:s3:::aws-genomics-static-${region}/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${yourbucket}",
                "arn:aws:s3:::aws-genomics-static-${region}/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0",
                "arn:aws:s3:::aws-genomics-static-${region}/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::${yourbucket}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogStreams",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:${region}:${your_account_id}:log-group:/aws/omics/WorkflowLog:log-stream:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup"
            ],
            "Resource": [
                "arn:aws:logs:${region}:${your_account_id}:log-group:/aws/omics/WorkflowLog:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:BatchGetImage",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchCheckLayerAvailability"
            ],
            "Resource": [
                "arn:aws:ecr:${region}:${your_account_id}:repository/*"
            ]
        }
    ]
}
EOF

echo "omics_workflow_policy.json 파일이 생성되었습니다."
```

`trust_policy.json` 만들기

``` {#bkmrk-%23-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98-%EC%84%A4%EC%A0%95-export-yo-1}
cat << EOF > trust_policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "omics.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "${your_account_id}"
                },
                "ArnLike": {
                    "aws:SourceArn": "arn:aws:omics:${region}:${your_account_id}:run/*"
                }
            }
        }
    ]
}
EOF

echo "trust_policy.json 파일이 생성되었습니다."
```

#### IAM Role 생성 {#bkmrk-iam-role-%EC%83%9D%EC%84%B1}

``` {#bkmrk-aws-iam-create-role-}
aws iam create-role --role-name ${omics_role_name} --assume-role-policy-document file://trust_policy.json
```

Policy document 생성

``` {#bkmrk-aws-iam-put-role-pol}
aws iam put-role-policy --role-name ${omics_role_name} --policy-name OmicsWorkflowV1 --policy-document file://omics_workflow_policy.json
```

#### 워크플로우 실행 {#bkmrk-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%EC%8B%A4%ED%96%89}

작은 샘플의 예제는 `input.json`, 큰 샘플의 예제는 `input_full.json`

``` {#bkmrk-aws-omics-start-run-}
aws omics start-run \
  --name spatialvi_test_run_1 \
  --role-arn arn:aws:iam::${your_account_id}:role/${omics_role_name}\
  --workflow-id ${workflow_id} \
  --parameters file://input.json \
  --output-uri s3://${yourbucket}/output/
```

**참고문서**

- <https://catalog.us-east-1.prod.workshops.aws/workshops/76d4a4ff-fe6f-436a-a1c2-f7ce44bc5d17/en-US/workshop/project-setup>
