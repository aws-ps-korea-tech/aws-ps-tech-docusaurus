---
title: AWS HealthOmics Run Analyzer 분석 리포트 (Run: 1910249)
sidebar_position: 10
---

# AWS HealthOmics Run Analyzer 분석 리포트 {#bkmrk-aws-healthomics-run-}

**Run ID:** 1910249 \| **Region:** us-east-1 \| **분석일:** 2026-01-07

------------------------------------------------------------------------

## 1. 워크플로우 개요 {#bkmrk-1.-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%EA%B0%9C%EC%9A%94}

  항목                  값
  --------------------- -------------------------------
  **워크플로우 이름**   NA12878_WES (nf-core/sarek)
  **시작 시간**         2026-01-06 20:44:04 (UTC)
  **종료 시간**         2026-01-06 23:15:32 (UTC)
  **총 실행 시간**      **2시간 31분 28초** (9,088초)
  **총 태스크 수**      48개

------------------------------------------------------------------------

## 2. 비용 분석 {#bkmrk-2.-%EB%B9%84%EC%9A%A9-%EB%B6%84%EC%84%9D}

### 2.1 전체 비용 요약 {#bkmrk-2.1-%EC%A0%84%EC%B2%B4-%EB%B9%84%EC%9A%A9-%EC%9A%94%EC%95%BD}

  항목                      금액 (USD)
  ------------------------- ----------------
  **현재 예상 비용**        **\$0.581**
  **최적화 후 예상 비용**   **\~\$0.37**
  **절감 가능 금액**        \~\$0.21 (36%)

### 2.2 비용 최적화 기회 (주요 태스크) {#bkmrk-2.2-%EB%B9%84%EC%9A%A9-%EC%B5%9C%EC%A0%81%ED%99%94-%EA%B8%B0%ED%9A%8C-%28%EC%A3%BC%EC%9A%94-%ED%83%9C%EC%8A%A4}

가장 큰 비용 절감이 가능한 태스크:

  태스크                      현재 비용   최적화 비용   절감액         절감률
  --------------------------- ----------- ------------- -------------- -----------
  **GATK4_HAPLOTYPECALLER**   \$0.2836    \$0.0956      **\$0.1880**   **66.3%**
  GATK4_MARKDUPLICATES        \$0.0817    \$0.0536      \$0.0281       34.4%
  BWAMEM1_MEM (일부)          \$0.0435    \$0.0217      \$0.0218       50.0%
  CNNSCOREVARIANTS            \$0.0088    \$0.0059      \$0.0029       32.5%
  FILTERVARIANTTRANCHES       \$0.0126    \$0.0096      \$0.0030       23.8%

------------------------------------------------------------------------

## 3. 리소스 활용률 분석 {#bkmrk-3.-%EB%A6%AC%EC%86%8C%EC%8A%A4-%ED%99%9C%EC%9A%A9%EB%A5%A0-%EB%B6%84%EC%84%9D}

### 3.1 전체 Run 리소스 사용률 {#bkmrk-3.1-%EC%A0%84%EC%B2%B4-run-%EB%A6%AC%EC%86%8C%EC%8A%A4-%EC%82%AC%EC%9A%A9%EB%A5%A0}

  리소스         예약량      최대 사용량   평균 사용량   활용률
  -------------- ----------- ------------- ------------- -----------
  **CPU**        84 vCPU     2.02 vCPU     0.04 vCPU     **2.4%**
  **메모리**     336 GiB     21.53 GiB     1.11 GiB      **6.4%**
  **스토리지**   1,200 GiB   145.23 GiB    137.09 GiB    **12.1%**

*참고: Run 레벨에서 낮은 활용률은 태스크들이 순차적으로 실행되어 동시 리소스 사용이 적기 때문입니다.*

### 3.2 태스크별 리소스 활용률 (상위 비용 태스크) {#bkmrk-3.2-%ED%83%9C%EC%8A%A4%ED%81%AC%EB%B3%84-%EB%A6%AC%EC%86%8C%EC%8A%A4-%ED%99%9C%EC%9A%A9%EB%A5%A0-%28%EC%83%81%EC%9C%84}

#### GATK4_HAPLOTYPECALLER (가장 비용이 높은 태스크) {#bkmrk-gatk4_haplotypecalle}

  항목            값
  --------------- --------------------------------------
  실행 시간       25분 0초
  현재 인스턴스   **omics.r.2xlarge** (8 vCPU, 64 GiB)
  권장 인스턴스   **omics.c.xlarge** (4 vCPU, 8 GiB)
  CPU 활용률      33.8% (최대 2.7 vCPU 사용)
  메모리 활용률   **9.8%** (최대 6.25 GiB 사용)

#### GATK4_MARKDUPLICATES {#bkmrk-gatk4_markduplicates}

  항목            값
  --------------- --------------------------------------
  실행 시간       9분 27초
  현재 인스턴스   **omics.m.2xlarge** (8 vCPU, 32 GiB)
  권장 인스턴스   **omics.r.xlarge** (4 vCPU, 32 GiB)
  CPU 활용률      25.2%
  메모리 활용률   **71.4%**

#### BWAMEM1_MEM (24개 병렬 태스크) {#bkmrk-bwamem1_mem-%2824%EA%B0%9C-%EB%B3%91%EB%A0%AC-}

  항목                   값
  ---------------------- ---------------------------------------
  평균 실행 시간         \~2분 30초
  현재 인스턴스          **omics.c.4xlarge** (16 vCPU, 32 GiB)
  대부분 권장 인스턴스   **omics.c.4xlarge** (적정)
  일부 권장 인스턴스     **omics.c.2xlarge** (2개 태스크)
  평균 CPU 활용률        **70-99%** (우수)
  평균 메모리 활용률     **25-28%**

------------------------------------------------------------------------

## 4. 태스크별 상세 분석 {#bkmrk-4.-%ED%83%9C%EC%8A%A4%ED%81%AC%EB%B3%84-%EC%83%81%EC%84%B8-%EB%B6%84%EC%84%9D}

### 4.1 가장 오래 실행된 태스크 (Top 5) {#bkmrk-4.1-%EA%B0%80%EC%9E%A5-%EC%98%A4%EB%9E%98-%EC%8B%A4%ED%96%89%EB%90%9C-%ED%83%9C%EC%8A%A4%ED%81%AC-%28t}

  순위   태스크                   실행 시간   인스턴스
  ------ ------------------------ ----------- -----------------
  1      GATK4_HAPLOTYPECALLER    25분 0초    omics.r.2xlarge
  2      GATK4_APPLYBQSR          24분 15초   omics.c.large
  3      GATK4_BASERECALIBRATOR   20분 52초   omics.c.large
  4      GATK4_MARKDUPLICATES     9분 27초    omics.m.2xlarge
  5      FILTERVARIANTTRANCHES    4분 28초    omics.r.large

### 4.2 인스턴스 타입별 태스크 분포 {#bkmrk-4.2-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4-%ED%83%80%EC%9E%85%EB%B3%84-%ED%83%9C%EC%8A%A4%ED%81%AC-%EB%B6%84%ED%8F%AC}

  인스턴스 타입     태스크 수   총 비용
  ----------------- ----------- ---------
  omics.c.4xlarge   24          \$0.742
  omics.c.large     12          \$0.127
  omics.r.2xlarge   1           \$0.284
  omics.m.2xlarge   1           \$0.082
  omics.c.xlarge    4           \$0.032
  omics.m.large     2           \$0.010
  omics.r.large     2           \$0.021
  omics.m.xlarge    1           \$0.004

------------------------------------------------------------------------

## 5. 최적화 권장사항 {#bkmrk-5.-%EC%B5%9C%EC%A0%81%ED%99%94-%EA%B6%8C%EC%9E%A5%EC%82%AC%ED%95%AD}

### 5.1 즉시 적용 가능한 최적화 {#bkmrk-5.1-%EC%A6%89%EC%8B%9C-%EC%A0%81%EC%9A%A9-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%B5%9C%EC%A0%81%ED%99%94}

#### 1. GATK4_HAPLOTYPECALLER 인스턴스 다운사이징 (최우선) {#bkmrk-1.-gatk4_haplotypeca}

``` {#bkmrk-%ED%98%84%EC%9E%AC%3A-omics.r.2xlarge-}
현재: omics.r.2xlarge (8 vCPU, 64 GiB) → $0.284
권장: omics.c.xlarge (4 vCPU, 8 GiB)   → $0.096
절감: $0.188 (66% 절감)
```

- 메모리 사용률이 9.8%로 매우 낮음
- 실제 사용 메모리: 6.25 GiB (64 GiB 중)

#### 2. GATK4_MARKDUPLICATES 인스턴스 변경 {#bkmrk-2.-gatk4_markduplica}

``` {#bkmrk-%ED%98%84%EC%9E%AC%3A-omics.m.2xlarge-}
현재: omics.m.2xlarge (8 vCPU, 32 GiB) → $0.082
권장: omics.r.xlarge (4 vCPU, 32 GiB)  → $0.054
절감: $0.028 (34% 절감)
```

- 메모리 사용률이 71.4%로 높아 메모리 최적화 인스턴스 유지 필요

#### 3. 일부 BWAMEM1_MEM 태스크 다운사이징 {#bkmrk-3.-%EC%9D%BC%EB%B6%80-bwamem1_mem-%ED%83%9C%EC%8A%A4}

- 2개 태스크에서 `omics.c.4xlarge` → `omics.c.2xlarge` 가능
- 해당 태스크의 CPU 활용률이 43-48%로 낮음

### 5.2 Nextflow 최적화 설정 생성 {#bkmrk-5.2-nextflow-%EC%B5%9C%EC%A0%81%ED%99%94-%EC%84%A4%EC%A0%95-}

최적화된 설정 파일을 생성하려면:

``` {#bkmrk-aws_default_region%3Du}
AWS_DEFAULT_REGION=us-east-1 python3.11 -m omics.cli.run_analyzer 1910249 --write-config=optimized.config
```

------------------------------------------------------------------------

## 6. 워크플로우 파이프라인 단계별 시간 {#bkmrk-6.-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EB%8B%A8%EA%B3%84%EB%B3%84-%EC%8B%9C}

``` {#bkmrk-prepare_intervals-%E2%96%88%E2%96%88}
PREPARE_INTERVALS     ████ (~1분)
FASTQC/FASTP         ████████ (~3분)
BWAMEM1_MEM          ████████████████ (~4분, 24개 병렬)
MARKDUPLICATES       ██████████████████████ (~10분)
BASERECALIBRATOR     ██████████████████████████████████████████ (~21분)
APPLYBQSR            ████████████████████████████████████████████████ (~24분)
HAPLOTYPECALLER      ██████████████████████████████████████████████████ (~25분)
VCF_FILTERING        ██████████████ (~7분)
QC/MULTIQC           ███ (~1분)
```

------------------------------------------------------------------------

## 7. 결론 {#bkmrk-7.-%EA%B2%B0%EB%A1%A0}

+-----------------+----------------+----------------+-----------------+
| 지표            | 현재           | 최적화 후      | 개선            |
+=================+================+================+=================+
| **총 비용**     | \$0.581        | \~\$0.37       | \~36% 절감 가능 |
+-----------------+----------------+----------------+-----------------+
| **주요 병목**   | GATK4_HAPLOTYPECALLER (메모리 과다 할당)          |
+-----------------+---------------------------------------------------+
| **리소스 효율** | 낮음 (메모리 10% 미만 활용) → 개선 가능           |
+-----------------+---------------------------------------------------+

------------------------------------------------------------------------

## 8. 분석 도구 정보 {#bkmrk-8.-%EB%B6%84%EC%84%9D-%EB%8F%84%EA%B5%AC-%EC%A0%95%EB%B3%B4}

**aws-healthomics-tools** ([GitHub](https://github.com/awslabs/aws-healthomics-tools))를 사용하여 분석되었습니다.

``` {#bkmrk-pip-install-aws-heal}
pip install aws-healthomics-tools
python -m omics.cli.run_analyzer <RUN_ID> -o output.csv
```

*이 리포트는 Claude Code를 통해 자동 생성되었습니다.*
