---
title: "Nf-core 워크플로우 마이그레이션 하기 (spatialvi)"
sidebar_position: 3
---

2025년 5월 22일 현재 dev 버전 branch에서 테스트 되었습니다.

연구 목적이며 반드시 실제 샘플과 시나리오상에서 개별적으로 결과데이터와 파이프라인 검증을 필요로 할 것입니다.

2025년 5/30일 경 nf-schema 지원을 위한 HealthOmics 업데이트가 예정되어 있습니다. 그전에는 nf-schema를 기존의구 플러그인인 nf-validation으로 변경해야 합니다. 워크플로우 내 코드 수정은 다음을 참고하여 모두 교체해주세요. ([링크](https://github.com/nf-core/spatialvi/compare/dev...hmkim:spatialvi:aho_dev))

## 마이그레이션을 위한 환경 구성 

### Step1 - Ec2 기반 환경 구성 

Ec2기반이 아닌 CloudShell 기반으로도 세팅할 수 있습니다. ([참고](https://catalog.us-east-1.prod.workshops.aws/workshops/76d4a4ff-fe6f-436a-a1c2-f7ce44bc5d17/en-US/introduction/setting-up-environment/cloudshell-environment)) 선호하는 환경에서 작업하세요.

- t2.medium
- Amazon linux 2023 AMI
- 64 bit x86

#### Specify instance type options 

![이미지](/img/omics-on-aws/image.png)

#### Generate key pairs 

If you don\'t already have a key pair then select create keypair

![이미지](/img/omics-on-aws/iI6image.png)

Give the key pair a name and select the key pair type and format.

#### Security groups 

Ensure that you have access to the instance via SSH.

![이미지](/img/omics-on-aws/E2Oimage.png)

#### Storage 

Create a root volume of 20GB

![이미지](/img/omics-on-aws/5r8image.png)

#### Instance Profile 

We will create an IAM instance profile to allow administrator permissions for the EC2 instance, for the purpose of this workshop. However, in general, AWS security best practices recommendation is that you create an instance profile with least privilege. This configuration is not recommended in your own account, you should discuss organizational best-practices with your IT team to configure appropriate permissions.

Advanced Details 토글 

![이미지](/img/omics-on-aws/GB4image.png)

IAM Instance profile에서 Create new IAM profile 선택

![이미지](/img/omics-on-aws/0Egimage.png)

**AWS service, EC2 선택**

![이미지](/img/omics-on-aws/KIdimage.png)

**Add Permissions 화면에서 AdministratorAccess 추가(선택)**

![이미지](/img/omics-on-aws/5Hximage.png)

새로운 role name을 지정 (여기서는 EC2adminAccess라고 작성했음)

![이미지](/img/omics-on-aws/8Otimage.png)

**이제 EC2 instance 실행 화면으로 돌아가서 앞에서 만든 EC2adminAccess 선택**

![이미지](/img/omics-on-aws/APximage.png)

#### **User Data** 

**맨 아래의 User data 섹션에 내용 추가**

``` 
#!/bin/bash

echo "Setting up NodeJS Environment"
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

echo 'Export NVM_DIR="/.nvm"' >> /home/ec2-user/.bashrc
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

![이미지](/img/omics-on-aws/jQZimage.png)

Launch instance 눌러서 인스턴스 실행

![이미지](/img/omics-on-aws/QyAimage.png)

### **Step 2 - workflow migration code를 세팅하기** 

**SSH 접속,** **앞에서 만든 console로 접속합니다.**

![이미지](/img/omics-on-aws/2JAimage.png)

![이미지](/img/omics-on-aws/26timage.png)

Use SSH to access the instance, you will need to ensure the key you created earlier is in the .ssh folder in your home directory and has the correct permissions(chmod 400). You will **need replace** ec2-user@10.11.12.123 with the IP address of your instance. This can be found in the EC2 management console.

``` 
ssh -i .ssh/omics-tutorial.pem ec2-user@10.11.12.123
```

Get the region using the `ec2-metadata command`. This handy oneliner stores it as a variable

``` 
REGION=$(ec2-metadata --availability-zone | sed 's/placement: \(.*\).$/\1/')
```

Get the account number (if you don\'t already know it)

``` 
ACCOUNT_NUMBER=$(aws sts get-caller-identity --query 'Account' --output text)
```

**Bootstraping**

Now you can bootstrap cdk replacing `ACCOUNT-NUMBER` with your account number nad using the `$REGION` variable created earlier.

``` 
cdk bootstrap aws://$ACCOUNT_NUMBER/$REGION
```

**Download the workflow migration code**

This step downloads the code which is used to migrate the workflow into AWS HealthOmics Workflows

``` 
cd ~
git clone https://github.com/aws-samples/amazon-ecr-helper-for-aws-healthomics.git

git clone https://github.com/aws-samples/aws-healthomics-tutorials.git

cd amazon-ecr-helper-for-aws-healthomics
```

Install and deploy the code.

``` 
npm install
cdk deploy --all
```

 MarkdownRenderer-module_markdown__35_09
 
[![이미지](data:image/svg+xml;base64,PHN2ZyB2aWV3Ym94PSIwIDAgMTYgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZm9jdXNhYmxlPSJmYWxzZSIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGQ9Ik0xNSA1SDV2MTBoMTBWNVoiIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIC8+PHBhdGggZD0iTTEzIDFIMXYxMSIgY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgLz48L3N2Zz4=)]

## 프로젝트 셋업 

이제 원하는 nf-core의 워크플로우를 HealthOmics private workflow에 마이그레이션을 하기 위해 다음 과정이 필요합니다.

- Cloning a workflow from nf-core
- Generating artifacts for migration
- Privatizing containers by migrating them to your private Amazon ECR \

**버킷 생성 및 Bash 환경변수 선언**

``` 
Export yourbucket="your-bucket-name"
Export your_account_id="your-account-id" #ACCOUNT_NUMBER
Export region="your-region"
Export workflow_name="your-workflow-name"
Export omics_role_name="your_omics_rolename"

# if not exist the bucket, let's create.
#aws s3 mb $yourbucket
```

##  

#### Clone nf-core repository that you want to migrate 

``` 
cd ~
git clone https://github.com/nf-core/spatialvi.git
```

#### Docker Image Manifest의 생성 

``` 
cp  /home/workshop/amazon-ecr-helper-for-aws-healthomics/lib/lambda/parse-image-uri/public_registry_properties.json namespace.config
```

준비된 namespace.config파일의 내용은 다음과 같습니다.

![이미지](/img/omics-on-aws/25bimage.png)

This file will be used as one of the inputs for the `inspect_nf.py` script. This script parses the entire nextflow workflow project and identifies all public docker images across all the tools and generates a manifest which will be passed as an input to the migration tool.

`inspect_nf.py` 를 실행합니다.

``` 
python3 aws-healthomics-tutorials/utils/scripts/inspect_nf.py \
--output-manifest-file spatialvi_dev_docker_images_manifest.json \
 -n namespace.config \
 --output-config-file omics.config \
 --region $region \
 ~/spatialvi/
```

생성되는 두 개의 출력은 `spatialvi_dev_docker_images_manifest.json` 과 `omics.config`입니다.

`spatialvi_dev_docker_images_manifest.json`  파일은 예를들어 다음과 같은 모습이어야 합니다:

![이미지](/img/omics-on-aws/2keimage.png)

해당 파일의 내용을 다음과 같이 수정합니다. (기존의 container 주소가 더이상 작동하지 않는 것이 많아서 임의로 공개된 것을 찾아 수정하였습니다, 예를들어 [spaceranger에 대한 컨테이너 주소 quay.io/nf-core/spaceranger:3.1.3](https://github.com/nf-core/spatialvi/blob/caeb4ff3768e6cba7a45f4a92220e9e9bf4efa28/modules/nf-core/spaceranger/count/main.nf#L5) 가 작동하지 않아서 dockerhub의 공개 Image로부터 검색하여 대응시켰습니다. 

\

``` 

```

The omics.config output file is also generated, which needs to be added to the nextflow workflow project. The purpose of this config is to inform nextflow to use the ECR docker image locations instead of the ones specified in the nextflow project code. The omics.config should look like this:

![이미지](/img/omics-on-aws/H6Nimage.png)

`omics.config` 내용 중 process에 정의된 내용도 아래와 같이 변경합니다.

``` 
process 
withName: '(.+:)?MERGE_SDATA' 
withName: '(.+:)?READ_DATA' 
withName: '(.+:)?FASTQC' 
withName: '(.+:)?MULTIQC' 
withName: '(.+:)?QUARTONOTEBOOK' 
withName: '(.+:)?SPACERANGER_COUNT' 
withName: '(.+:)?UNTAR' 
}
```

#### 컨테이너 사설화 (into Amazon ECR) 

``` 
aws stepfunctions start-execution \
--state-machine-arn arn:aws:states:$region:$your_account_id:stateMachine:omx-container-puller \
--input file://spatialvi_dev_docker_images_manifest.json
```

[step function 콘솔](https://console.aws.amazon.com/states/home)에서 state machines중에 `omx-container-puller`를 확인하여 Execution이 완료되었는지 확인합니다.\

![이미지](/img/omics-on-aws/screenshot-2025-04-15-at-3-52-46-pm.png)

![이미지](/img/omics-on-aws/24Eimage.png)

#### nf-core project 코드 업데이트 

To use the newly migrated containers for our workflow, copy the omics.config generated from inspect_nf.py in the /conf dir of the spatialvi project.

``` 
mv omics.config spatialvi/conf
```

Update the nextflow.config file in the root dir of the scrnaseq project by adding to the bottom of the file:

``` 
echo "includeConfig 'conf/omics.config'" >> spatialvi/nextflow.config 
```

##  

## 신규 HealthOmics 워크플로우 만들기 

#### 단계1. 파라미터 파일 

`parameter-description.json`을 만들어 아래와 같이 저장합니다.

``` 
cat > parameter-description.json  samplesheet_spaceranger.csv
sample,fastq_dir,cytaimage,slide,area,manual_alignment,slidefile
CytAssist_11mm_FFPE_Human_Glioblastoma_2,s3://$/spatialvi/fastq_dir.tar.gz,s3://$/spatialvi/CytAssist_11mm_FFPE_Human_Glioblastoma_image.tif,V52Y10-317,B1,,s3://$/spatialvi/V52Y10-317.gpr
EOF
```

**위에서 만든 samplesheet를 s3로 복사**

``` 
aws s3 cp samplesheet_spaceranger.csv s3://$/spatialvi/samplesheet_spaceranger.csv
```

**입력 json 만들기 (위 sample sheet경로가 아래 내용중 input에 값으로 들어가게됨)**

마찬가지로 probe_set.csv, homo_sapiens_chr22_reference.tar.gz도 모두 버킷에 준비해야합니다.

``` 
cat > input.json  omics_workflow_policy.json
/*",
                "arn:aws:s3aws-genomics-static-$/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0/*"
            ]
        },
        ",
                "arn:aws:s3aws-genomics-static-$/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0",
                "arn:aws:s3aws-genomics-static-$/workflow_migration_workshop/nfcore-scrnaseq-v2.3.0/*"
            ]
        },
        /*"
            ]
        },
        :$:log-group:/aws/omics/WorkflowLog:log-stream:*"
            ]
        },
        :$:log-group:/aws/omics/WorkflowLog:*"
            ]
        },
        :$:repository/*"
            ]
        }
    ]
}
EOF

echo "omics_workflow_policy.json 파일이 생성되었습니다."
```

`trust_policy.json` 만들기

``` 
cat  trust_policy.json
,
            "Action": "sts:AssumeRole",
            "Condition": "
                },
                "ArnLike": :$:run/*"
                }
            }
        }
    ]
}
EOF

echo "trust_policy.json 파일이 생성되었습니다."
```

#### IAM Role 생성 

``` 
aws iam create-role --role-name $ --assume-role-policy-document file://trust_policy.json
```

Policy document 생성

``` 
aws iam put-role-policy --role-name $ --policy-name OmicsWorkflowV1 --policy-document file://omics_workflow_policy.json
```

#### 워크플로우 실행 

작은 샘플의 예제는 `input.json`, 큰 샘플의 예제는 `input_full.json`

``` 
aws omics start-run \
  --name spatialvi_test_run_1 \
  --role-arn arn:aws:iam::$:role/$\
  --workflow-id $ \
  --parameters file://input.json \
  --output-uri s3://$/output/
```

**참고문서**

- 
