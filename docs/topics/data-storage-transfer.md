---
title: "데이터·스토리지·전송"
description: "공공부문과 연구 데이터를 저장, 처리 및 전달하기 위한 AWS 가이드"
---

# 데이터·스토리지·전송

데이터 크기, 접근 방식, 성능과 보존 요구사항에 맞는 저장·전송 방법을 선택하기 위한 자료입니다.

## 객체 스토리지

- [Amazon S3](/s3/amazon-s3/)
- [S3 Select 기능 소개](/s3/amazon-s3/s3-select/)

객체 스토리지는 데이터를 파일 시스템의 폴더보다 객체 단위로 저장하는 방식입니다. 대규모 데이터 보관과 공유에 적합하지만, 일반 디스크와 동일한 방식으로 사용할 수 있는 것은 아닙니다.

## 고성능 파일 시스템

- [FSx for Lustre](/fsx-for-lustre/)
- [EFS와 FSx for Lustre 비교 분석](/aws-blast-performance-testing/efs-vs-fsx-for-lustre/)
- [EBS 최적화 아키텍처 테스트 결과](/aws-blast-performance-testing/ebs/)

고성능 파일 시스템은 여러 컴퓨터가 많은 데이터를 빠르게 읽고 써야 하는 분석 작업에 사용합니다.

## 데이터 전송과 전달

- [Data Transfer](/data-transfer/)
- [Genome Data Delivery Portal on AWS](/genome-data-delivery-portal-on-aws/)
- [Storage Browser for S3와 CloudFront로 데이터 배포 포털 만들기](/genome-data-delivery-portal-on-aws/storage-browser-for-s3-cloudfront-gb/)

## 생명과학 데이터

- [AWS HealthOmics Storage](/omics-on-aws/aws-healthomics/aws-healthomics-storage/)
- [HealthOmics 워크플로 스토리지 비용](/omics-on-aws/aws-healthomics-ksh/)

## 선택할 때 확인할 것

1. 데이터의 크기와 파일 수
2. 읽기와 쓰기 방식
3. 여러 컴퓨터가 동시에 접근하는지
4. 보존 기간과 복구 요구사항
5. 전송 경로와 네트워크 비용
6. 데이터에 적용되는 보안·규제 요구사항
