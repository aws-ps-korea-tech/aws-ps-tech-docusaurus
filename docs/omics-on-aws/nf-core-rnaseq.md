---
title: "Nf-core 워크플로우 마이그레이션 하기 (rnaseq)"
sidebar_position: 2
---

참고 문서: https://catalog.us-east-1.prod.workshops.aws/workshops/76d4a4ff-fe6f-436a-a1c2-f7ce44bc5d17/en-US

[이 문서를 참고](https://catalog.us-east-1.prod.workshops.aws/workshops/76d4a4ff-fe6f-436a-a1c2-f7ce44bc5d17/en-US/introduction/setting-up-environment)하여 환경을 준비합니다. 여기서는 이 과정은 생략합니다.

## 프로젝트 셋업 

#### nf-core repository로부터 워크플로우 복제 

``` 
cd ~
git clone https://github.com/nf-core/rnaseq --branch 3.14.0 --single-branch
```

#### Docker Image Manifest의 생성 

``` 
cp  ~/amazon-ecr-helper-for-aws-healthomics/lib/lambda/parse-image-uri/public_registry_properties.json namespace.config
```

`inspect_nf.py` 를 실행합니다.

``` 
python3 amazon-omics-tutorials/utils/scripts/inspect_nf.py \
--output-manifest-file rnaseq_3140_docker_images_manifest.json \
 -n namespace.config \
 --output-config-file omics.config \
 --region  \
 ~/rnaseq/
```

생성되는 두 개의 출력은 `rnaseq_3140_docker_images_manifest.json` 과 `omics.config`입니다.

`rnaseq_3140_docker_images_manifest.json` 파일은 다음과 같은 모습이어야 합니다:

``` 

```

\

#### 컨테이너 사설화 

``` 
aws stepfunctions start-execution \
--state-machine-arn arn:aws:states:::stateMachine:omx-container-puller \
--input file://rnaseq_3140_docker_images_manifest.json
```

#### nf-core project 코드 업데이트 

``` 
mv omics.config rnaseq/conf
```

``` 
echo "includeConfig 'conf/omics.config'" >> rnaseq/nextflow.config 
```

##  

## AWS HealthOmics 워크플로우 만들기 

#### 단계1. AWS HealthOmics 파라미터 파일 

`paramter-descrption.json`을 만들어 아래와 같이 저장합니다.

새 워크플로마다 다른 매개변수를 사용할 수 있습니다. 위의 매개변수 템플릿 파일은 SCRNA-Seq nf-core 워크플로에만 해당됩니다. 새 파라미터 파일을 만들 때는 이 워크플로우에 대한 파라미터를 확인해야 합니다.\
\
NF-Core 워크플로우에 대한 파라미터를 찾으려면 설명서를 참조하세요(예: RNA-Seq 파이프라인 파라미터는 [여기](https://nf-co.re/rnaseq/3.14.0/parameters)).\

``` 
,
    "genome": ,
    "igenomes_base": ,
    "fasta": ,
    "gtf": ,
    "gff": ,
    "pseudo_aligner": ,
    "transcript_fasta": ,
    "additional_fasta": ,
    "bbsplit_fasta_list": ,
    "hisat2_index": ,
    "salmon_index": ,
    "rsem_index": ,
    "skip_bbsplit": ,
    "pseudo_aligner": ,
    "umitools_bc_pattern": 
}
```

#### 단계2. 워크플로우 스테이징 

``` 
zip -r rnaseq-workflow.zip rnaseq
```

``` 
aws s3 cp rnaseq-workflow.zip s3:///workshop/rnaseq-workflow.zip

aws omics create-workflow \
  --name rnaseq-v3140 \
  --definition-uri s3:////workshop/rnaseq-workflow.zip \
  --parameter-template file://parameter-description.json \
  --engine NEXTFLOW
```

#### 단계3. 워크플로우 생성 확인 

``` 
aws omics list-workflows --name rnaseq-v3140
```

## 워크플로우 테스트하기 

#### 입력파일 준비 

##### samplesheet_full 

아래의 입력 파일들은 [여기](https://github.com/nf-core/rnaseq/blob/master/conf/test_full.config)를 참고하여 준비할 수 있습니다.

**레퍼런스 데이터 다운로드**

nf-core/rnaseq repository에 있는 [`igenomes.config`](https://github.com/nf-core/rnaseq/blob/master/conf/igenomes.config) 를 참고하여 필요한 GRCh37 레퍼런스 관련 파일들을 모두 healthomics의 사용 리전에 만든 버킷으로 준비합니다.\

``` 
aws s3 sync s3://ngi-igenomes/igenomes/Homo_sapiens/ s3:///workshop/igenomes/Homo_sapiens/
```

\

**샘플시트 예제 템플릿 다운로드**

``` 
wget https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/samplesheet/v3.10/samplesheet_full.csv
```

`parameter-description.json`에 사용된 것과 동일한 키를 사용하여 `input_rnaseq.json` 파일을 새로 만듭니다. 값은 워크플로에서 허용되는 실제 S3 경로 또는 문자열이 됩니다.

`samplesheet_full.csv` 파일을 새로 작성합니다. 이때 HealthOmics와 같은 리전에 있는 s3 bucket에 FASTQ 입력파일을 준비합니다. (aws s3 sync 나 aws s3 cp 와 같은 명령어 활용 가능)

예)

``` 
aws s3 sync s3://ngi-igenomes/test-data/rnaseq/ s3:///workshop/
```

`samplesheet_full.csv` 예시

``` 
sample,fastq_1,fastq_2,strandedness
GM12878_REP1,s3:///test-data/rnaseq/SRX1603629_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX1603629_T1_2.fastq.gz,reverse
GM12878_REP2,s3:///test-data/rnaseq/SRX1603630_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX1603630_T1_2.fastq.gz,reverse
K562_REP1,s3:///test-data/rnaseq/SRX1603392_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX1603392_T1_2.fastq.gz,reverse
K562_REP2,s3:///test-data/rnaseq/SRX1603393_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX1603393_T1_2.fastq.gz,reverse
MCF7_REP1,s3:///test-data/rnaseq/SRX2370490_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX2370490_T1_2.fastq.gz,reverse
MCF7_REP2,s3:///test-data/rnaseq/SRX2370491_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX2370491_T1_2.fastq.gz,reverse
H1_REP1,s3:///test-data/rnaseq/SRX2370468_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX2370468_T1_2.fastq.gz,reverse
H1_REP2,s3:///test-data/rnaseq/SRX2370469_T1_1.fastq.gz,s3:///test-data/rnaseq/SRX2370469_T1_2.fastq.gz,revers
```

**편집한 samplesheet 를 버킷으로 복사**

``` 
aws s3 mv samplesheet_full.csv s3:///workshop/
```

**`input_rnaseq_full.json`**

``` 
/workshop/samplesheet_full.csv",
    "genome": "GRCh37",
    "igenomes_base": "s3:///workshop/igenomes/",
    "pseudo_aligner": "salmon"
}
```

##### samplesheet_test 

아래의 입력 파일들은 [여기](https://github.com/nf-core/rnaseq/blob/master/conf/test.config)를 참고하여 준비할 수 있습니다.

앞의 samplesheet_full.csv 와 달리 본 샘플시트 런은 미니 샘플이기때문에 관련 레퍼런스 및 파라미터 입력을 모두 준비해야 합니다.

``` 
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/genome.fasta
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/genes_with_empty_tid.gtf.gz
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/genes.gff.gz
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/transcriptome.fasta
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/gfp.fa.gz
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/bbsplit_fasta_list.txt
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/hisat2.tar.gz
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/salmon.tar.gz
wget https://raw.githubusercontent.com/nf-core/test-datasets/7f1614baeb0ddf66e60be78c3d9fa55440465ac8/reference/rsem.tar.gz
```

다운로드 받은 파일들을 s3 bucket 으로 업로드

``` 
aws s3 sync . s3:///workshop/reference/
```

**샘플시트 예제 템플릿 다운로드**

``` 
wget https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/samplesheet/v3.10/samplesheet_test.csv
```

`samplesheet_test.csv` 예시

``` 
sample,fastq_1,fastq_2,strandedness
WT_REP1,s3:///workshop/test_fastq/SRR6357070_1.fastq.gz,s3:///workshop/test_fastq/SRR6357070_2.fastq.gz,auto
WT_REP1,s3:///workshop/test_fastq/SRR6357071_1.fastq.gz,s3:///workshop/test_fastq/SRR6357071_2.fastq.gz,auto
WT_REP2,s3:///workshop/test_fastq/SRR6357072_1.fastq.gz,s3:///workshop/test_fastq/SRR6357072_2.fastq.gz,reverse
RAP1_UNINDUCED_REP1,s3:///workshop/test_fastq/SRR6357073_1.fastq.gz,,reverse
RAP1_UNINDUCED_REP2,s3:///workshop/test_fastq/SRR6357074_1.fastq.gz,,reverse
RAP1_UNINDUCED_REP2,s3:///workshop/test_fastq/SRR6357075_1.fastq.gz,,reverse
RAP1_IAA_30M_REP1,s3:///workshop/test_fastq/SRR6357076_1.fastq.gz,s3:///workshop/test_fastq/SRR6357076_2.fastq.gz,reverse
```

**편집한 samplesheet 를 버킷으로 복사**

``` 
aws s3 mv samplesheet_test.csv s3:///workshop/
```

`input_rnaseq_test.json`

``` 
/workshop/samplesheet_test.csv",
    "fasta": "s3:///workshop/reference/genome.fasta",
    "gtf": "s3:///workshop/reference/genes_with_empty_tid.gtf.gz",
    "gff": "s3:///workshop/reference/genes.gff.gz",
    "transcript_fasta": "s3:///workshop/reference/transcriptome.fasta",
    "additional_fasta": "s3:///workshop/reference/gfp.fa.gz",
    "bbsplit_fasta_list": "s3:///workshop/reference/bbsplit_fasta_list.txt",
    "hisat2_index": "s3:///workshop/reference/hisat2.tar.gz",
    "salmon_index": "s3:///workshop/reference/salmon.tar.gz",
    "rsem_index": "s3:///workshop/reference/rsem.tar.gz",
    "skip_bbsplit"        : false,
    "pseudo_aligner"      : "salmon",
    "umitools_bc_pattern" : "NNNN"
}
```

상기 bbsplit_fasta_list.txt 파일 내용도 s3 bucket을 지정합니다.

s3:///workshop/reference/bbsplit_fasta_list.txt 의 내용\

``` 
sarscov2,s3:///workshop/reference/GCA_009858895.3_ASM985889v3_genomic.200409.fna
human,s3:///workshop/reference/chr22_23800000-23980000.fa
```

##### S3 policy 관련 참고사항 

위의 입력데이터로 필요한 S3 버킷에 대해 아래 Policy 준비에 반영되어야 합니다.\
마찬가지로 결과 데이터를 작성할 버킷에 대한 권한도 Policy 준비에 반영해주세요.\

s3:GetObject, s3:ListBucket 권한

![이미지](/img/omics-on-aws/image.png)

s3:PutObject 권한

![이미지](/img/omics-on-aws/eA3image.png)

#### Policy 준비 

##### Prepare IAM service role to run AWS HealthOmics workflow 

`omics_workflow_policy.json` 만들기

``` 
# 환경 변수 설정
Export yourbucket="your-bucket-name"
Export your_account_id="your-account-id"
Export region="your-region"

# JSON 내용 생성 및 파일로 저장
cat  omics_workflow_policy.json
/*"
            ]
        },
        "
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

trust_policy.json 만들기

``` 
# 환경 변수 설정
Export your_account_id="your-account-id"
Export region="your-region"  # 예: us-east-1

# JSON 내용 생성 및 파일로 저장
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
aws iam create-role --role-name omics_start_run_role_v1 --assume-role-policy-document file://trust_policy.json
```

Policy document 생성

``` 
aws iam put-role-policy --role-name omics_start_run_role_v1 --policy-name OmicsWorkflowV1 --policy-document file://omics_workflow_policy.json
```

#### 워크플로우 실행 

`--storage-type` 파라미터를 사용하지 않으면 기본값은 STATIC 입니다. ([참고](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/omics/start-run.html)) \

동적 실행 스토리지 (DYNAMIC)는 정적 실행 스토리지 (STATIC) 보다 프로비저닝/디프로비저닝 시간이 더 빠릅니다. 빠른 설정은 자주 실행되는 소규모 워크플로우에 유리하며 개발/테스트 주기 동안에도 이점이 있습니다. 따라서 처음에 마이그레이션 하면서 테스트할 경우 이 옵션을 DYNAMIC으로 설정한 뒤 스토리지 사용량에 따라 STATIC으로 설정 하는 것을 추천드립니다.\

``` 
aws omics start-run \
  --name rnaseq_workshop_run_1 \
  --role-arn arn:aws:iam:::role/omics_start_run_role_v1 \
  --workflow-id  \
  --parameters file://input_rnaseq.json \
  --output-uri s3:///output/ \
  --storage-type  DYNAMIC
```

``` 
aws omics start-run \
  --name rnaseq_workshop_run_1 \
  --role-arn arn:aws:iam:::role/omics_start_run_role_v1 \
  --workflow-id  \
  --parameters file://input_rnaseq.json \
  --output-uri s3:///output/
  --storage-type STATIC \
  --storage-capacity 2048
```

test 샘플로 할 경우 예시

``` 
aws omics start-run \
  --name rnaseq_workshop_test_run_1 \
  --role-arn arn:aws:iam:::role/omics_start_run_role_v1 \
  --workflow-id  \
  --parameters file://input_rnaseq_test.json \
  --output-uri s3:///output/
```

참고문서

\- https://github.com/aws-samples/amazon-omics-tutorials/tree/main/example-workflows/nf-core/workflows/rnaseq
