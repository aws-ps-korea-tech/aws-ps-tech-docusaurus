/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Amazon S3',
      items: [
        'amazon-s3/s3-select-기능-소개',
        'amazon-s3/추천-링크',
        'amazon-s3/예제-데이터',
      ],
    },
    {
      type: 'category',
      label: '대학 고객을 위한 AWS 길라잡이',
      items: [
        '대학-고객을-위한-aws-길라잡이/aws-계정-안전하게-지키기',
        '대학-고객을-위한-aws-길라잡이/루트-계정-보호하기---otp-설정-필수-영상',
        '대학-고객을-위한-aws-길라잡이/워크샵-시작-전-준비사항',
        '대학-고객을-위한-aws-길라잡이/cloud9',
        '대학-고객을-위한-aws-길라잡이/리눅스-머신-실행',
        '대학-고객을-위한-aws-길라잡이/공유-ami로부터-가상-머신-시작하기',
        '대학-고객을-위한-aws-길라잡이/저장-장치-추가하기',
        '대학-고객을-위한-aws-길라잡이/aws-cli',
        '대학-고객을-위한-aws-길라잡이/데이터-다운로드-실습',
        '대학-고객을-위한-aws-길라잡이/기본-분석-수행하기-옵션',
        '대학-고객을-위한-aws-길라잡이/ec2로부터-이미지-ami-생성',
        '대학-고객을-위한-aws-길라잡이/ec2-종료와-볼륨-스냅샷-저장-옵션',
        '대학-고객을-위한-aws-길라잡이/ami로-쉽게-리눅스-머신-셋업하기',
        '대학-고객을-위한-aws-길라잡이/hail-on-ec2-옵션',
        '대학-고객을-위한-aws-길라잡이/amazon-lightsail-for-research',
        '대학-고객을-위한-aws-길라잡이/research-and-engineering-studio-on-aws',
        '대학-고객을-위한-aws-길라잡이/유용한-링크들-모음',
        '대학-고객을-위한-aws-길라잡이/쉽게-따라하는-연구실-계정-관리',
        '대학-고객을-위한-aws-길라잡이/실습용-윈도우-ec2-인스턴스-자동화',
        '대학-고객을-위한-aws-길라잡이/rstudio-실습환경-자동화-구성',
      ],
    },
    {
      type: 'category',
      label: 'Omics on AWS',
      items: [
        'omics-on-aws/aws-healthomics-소개-및-주요-링크',
        'omics-on-aws/nf-core-워크플로우-마이그레이션-하기-scrnaseq',
        'omics-on-aws/nf-core-워크플로우-마이그레이션-하기-rnaseq',
        'omics-on-aws/nf-core-워크플로우-마이그레이션-하기-spatialvi',
        'omics-on-aws/wdl-워크플로우-마이그레이션-하기-hifi-human-wgs-wdl',
        'omics-on-aws/aws-healthomics로-유전체-분석-fastq-to-vcf-annotation-자동화하기',
        'omics-on-aws/aws-healthomics---storage',
        'omics-on-aws/aws-healthomics에서-annotation-작업-수행하기',
        'omics-on-aws/aws-healthomics---troubleshooting',
        'omics-on-aws/몇-가지-기능과-알아둘-것들',
        'omics-on-aws/aws-healthomics-run-analyzer-분석-리포트-run-1910249',
        'omics-on-aws/amazon-emr-on-ec2',
        'omics-on-aws/aws-glue',
        'omics-on-aws/hail-with-amazon-emr-notebook',
        'omics-on-aws/quickstart-hail-korean',
        'omics-on-aws/quickstart-hail-english',
        'omics-on-aws/소개-및-실습-준비',
        'omics-on-aws/store-multimodal-data-with-purpose-built-health-ai-services',
        'omics-on-aws/amazon-genomics-cli---핸즈온-가이드',
        'omics-on-aws/example-code',
      ],
    },
    {
      type: 'category',
      label: 'AWS Batch',
      items: [
        'aws-batch/tagging-w-nextflow',
        'aws-batch/troubleshooting-for-aws-batch--nextflow',
      ],
    },
    {
      type: 'category',
      label: 'AWS BLAST Performance Testing',
      items: [
        'aws-blast-performance-testing/아키텍처-개요',
        'aws-blast-performance-testing/비용-분석-cost-analysis',
        'aws-blast-performance-testing/ebs-최적화-아키텍처-테스트-결과',
        'aws-blast-performance-testing/efs-vs-fsx-for-lustre-비교-분석-실제-테스트-결과-포함',
        'aws-blast-performance-testing/ebs-snapshot-프로비저닝-성능-분석',
      ],
    },
  ],
};

module.exports = sidebars;
