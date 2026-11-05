---
title: "워크플로·자동화"
description: "분석 단계, 배치 실행과 배포 절차를 자동화하기 위한 AWS 가이드"
---

# 워크플로·자동화

여러 분석 단계를 반복 가능하게 실행하고, 작업의 상태와 결과를 추적하기 위한 자료입니다.

워크플로는 입력, 처리 단계와 결과 사이의 순서와 조건을 정의한 자동화 절차입니다.

## AWS Batch와 Nextflow

- [AWS Batch](/aws-batch/)
- [Tagging with Nextflow](/aws-batch/tagging-w-nextflow/)
- [AWS Batch와 Nextflow 문제 해결](/aws-batch/troubleshooting-for-aws-batch-nextflow/)
- [Nextflow](/omics-on-aws/nextflow/)

## AWS HealthOmics 워크플로

- [AWS HealthOmics](/omics-on-aws/aws-healthomics/)
- [nf-core/sarek 실행하기](/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/)
- [WDL 워크플로 마이그레이션](/omics-on-aws/aws-healthomics/wdl-hifi-human-wgs-wdl/)
- [Call Caching](/omics-on-aws/aws-healthomics/call-caching/)

Call caching은 이전 작업의 입력과 설정이 같을 때 기존 결과를 재사용해 중복 계산을 줄이는 기능입니다.

## 배포와 운영 자동화

- [AWS HealthOmics 워크플로를 위한 CI/CD](/omics-on-aws/aws-healthomics-cicd/)
- [AWS HealthOmics 문제 해결](/omics-on-aws/aws-healthomics/aws-healthomics-troubleshooting/)

CI/CD는 코드와 설정의 변경을 자동으로 검사하고 배포하는 절차입니다. 자동화하더라도 변경 승인, 접근 권한과 실행 기록은 조직의 운영 기준에 맞게 관리해야 합니다.
