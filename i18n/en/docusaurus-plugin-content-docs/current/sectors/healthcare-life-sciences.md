---
title: "Healthcare and Life Sciences"
description: "Reviewed English guides for genomics, AWS HealthOmics, AI-assisted research, data delivery, and cost analysis"
slug: /sectors/healthcare-life-sciences
keywords:
  - AWS HealthOmics
  - life sciences
tags:
  - healthcare
  - life-sciences
customProps:
  contentId: sector-healthcare-life-sciences
  locale: en
  sourceLocale: ko
  publicationStatus: published
  translationStatus: current
  translatedFrom: 69b4e7e7f7f874052f51c67cd195e14d48a469c7
  sectors:
    - healthcare-life-sciences
  audiences:
    - customer
    - partner
    - researcher
  contentType: overview
  level: beginner
  awsServices:
    - AWS HealthOmics
  maintainers:
    - hmkim
  lastReviewed: "2026-11-06"
---

# Healthcare and Life Sciences

These reviewed English guides cover genomics workflows, AI-assisted research, network design, and workflow cost behavior. A workflow is a defined sequence of analysis steps that runs automatically with specified inputs and outputs.

## Start here {#start-here}

- [Browse the English guide index](../index.md)
- [Start with your goal](../getting-started/index.md)
- [Design antibody candidates with Amazon Bio Discovery](../amazon-bio-discovery-ai/amazon-bio-discovery-ai.md)

## Genomics and omics workflows {#genomics-and-omics-workflows}

- [Run nf-core/sarek on AWS HealthOmics](../omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390.md)
- [Connect AWS HealthOmics workflows to a VPC](../omics-on-aws/aws-healthomics/vpc-connected-workflows-s3.md)

The nf-core project provides community-maintained analysis workflows. AWS HealthOmics can run supported workflow definitions using managed compute and run storage.

## AI-assisted research and drug discovery {#ai-assisted-research-and-drug-discovery}

- [Getting Started with AI Antibody Design on Amazon Bio Discovery](../amazon-bio-discovery-ai/amazon-bio-discovery-ai.md)

Amazon Bio Discovery brings scientific foundation models and guided workflows into a web application for life science research.

## Data storage and delivery {#data-storage-and-delivery}

- [How task concurrency affects AWS HealthOmics run storage cost](../omics-on-aws/aws-healthomics-ksh.md)
- [Amazon S3 User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)

Object storage keeps data as individually addressed objects rather than files tied to a particular disk or server directory.

## Performance, cost, and operations {#performance-cost-and-operations}

- [Task concurrency and AWS HealthOmics storage cost](../omics-on-aws/aws-healthomics-ksh.md)
- [AWS HealthOmics Documentation](https://docs.aws.amazon.com/omics/)

:::caution Regulatory scope
These pages provide technical guidance, not legal or regulatory advice. Applicable requirements depend on the product, intended use, market, and customer environment.
:::
