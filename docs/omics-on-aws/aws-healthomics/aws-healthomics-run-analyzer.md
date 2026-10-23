---
title: "AWS HealthOmics Run Analyzer 분석 리포트"
---

# AWS HealthOmics Run Analyzer 분석 리포트

#   

**Run ID:** 1910249 | **Region:** us-east-1 | **분석일:** 2026-01-07

---

## 1. 워크플로우 개요

항목값**워크플로우 이름**NA12878\_WES (nf-core/sarek)**시작 시간**2026-01-06 20:44:04 (UTC)**종료 시간**2026-01-06 23:15:32 (UTC)**총 실행 시간****2시간 31분 28초** (9,088초)**총 태스크 수**48개

---

## 2. 비용 분석

### 2.1 전체 비용 요약

항목금액 (USD)**현재 예상 비용****$0.581****최적화 후 예상 비용****~$0.37****절감 가능 금액**~$0.21 (36%)

### 2.2 비용 최적화 기회 (주요 태스크)

가장 큰 비용 절감이 가능한 태스크:

태스크현재 비용최적화 비용절감액절감률**GATK4\_HAPLOTYPECALLER**$0.2836$0.0956**$0.1880****66.3%**GATK4\_MARKDUPLICATES$0.0817$0.0536$0.028134.4%BWAMEM1\_MEM (일부)$0.0435$0.0217$0.021850.0%CNNSCOREVARIANTS$0.0088$0.0059$0.002932.5%FILTERVARIANTTRANCHES$0.0126$0.0096$0.003023.8%

---

## 3. 리소스 활용률 분석

### 3.1 전체 Run 리소스 사용률

리소스예약량최대 사용량평균 사용량활용률**CPU**84 vCPU2.02 vCPU0.04 vCPU**2.4%****메모리**336 GiB21.53 GiB1.11 GiB**6.4%****스토리지**1,200 GiB145.23 GiB137.09 GiB**12.1%**

*참고: Run 레벨에서 낮은 활용률은 태스크들이 순차적으로 실행되어 동시 리소스 사용이 적기 때문입니다.*

### 3.2 태스크별 리소스 활용률 (상위 비용 태스크)

#### GATK4\_HAPLOTYPECALLER (가장 비용이 높은 태스크)

항목값실행 시간25분 0초현재 인스턴스**omics.r.2xlarge** (8 vCPU, 64 GiB)권장 인스턴스**omics.c.xlarge** (4 vCPU, 8 GiB)CPU 활용률33.8% (최대 2.7 vCPU 사용)메모리 활용률**9.8%** (최대 6.25 GiB 사용)

#### GATK4\_MARKDUPLICATES

항목값실행 시간9분 27초현재 인스턴스**omics.m.2xlarge** (8 vCPU, 32 GiB)권장 인스턴스**omics.r.xlarge** (4 vCPU, 32 GiB)CPU 활용률25.2%메모리 활용률**71.4%**

#### BWAMEM1\_MEM (24개 병렬 태스크)

항목값평균 실행 시간~2분 30초현재 인스턴스**omics.c.4xlarge** (16 vCPU, 32 GiB)대부분 권장 인스턴스**omics.c.4xlarge** (적정)일부 권장 인스턴스**omics.c.2xlarge** (2개 태스크)평균 CPU 활용률**70-99%** (우수)평균 메모리 활용률**25-28%**

---

## 4. 태스크별 상세 분석

### 4.1 가장 오래 실행된 태스크 (Top 5)

순위태스크실행 시간인스턴스1GATK4\_HAPLOTYPECALLER25분 0초omics.r.2xlarge2GATK4\_APPLYBQSR24분 15초omics.c.large3GATK4\_BASERECALIBRATOR20분 52초omics.c.large4GATK4\_MARKDUPLICATES9분 27초omics.m.2xlarge5FILTERVARIANTTRANCHES4분 28초omics.r.large

### 4.2 인스턴스 타입별 태스크 분포

인스턴스 타입태스크 수총 비용omics.c.4xlarge24$0.742omics.c.large12$0.127omics.r.2xlarge1$0.284omics.m.2xlarge1$0.082omics.c.xlarge4$0.032omics.m.large2$0.010omics.r.large2$0.021omics.m.xlarge1$0.004

---

## 5. 최적화 권장사항

### 5.1 즉시 적용 가능한 최적화

#### 1. GATK4\_HAPLOTYPECALLER 인스턴스 다운사이징 (최우선)

```
현재: omics.r.2xlarge (8 vCPU, 64 GiB) → $0.284
권장: omics.c.xlarge (4 vCPU, 8 GiB)   → $0.096
절감: $0.188 (66% 절감)
```

- 메모리 사용률이 9.8%로 매우 낮음
- 실제 사용 메모리: 6.25 GiB (64 GiB 중)

#### 2. GATK4\_MARKDUPLICATES 인스턴스 변경

```
현재: omics.m.2xlarge (8 vCPU, 32 GiB) → $0.082
권장: omics.r.xlarge (4 vCPU, 32 GiB)  → $0.054
절감: $0.028 (34% 절감)
```

- 메모리 사용률이 71.4%로 높아 메모리 최적화 인스턴스 유지 필요

#### 3. 일부 BWAMEM1\_MEM 태스크 다운사이징

- 2개 태스크에서 `omics.c.4xlarge` → `omics.c.2xlarge` 가능
- 해당 태스크의 CPU 활용률이 43-48%로 낮음

### 5.2 Nextflow 최적화 설정 생성

최적화된 설정 파일을 생성하려면:

```
AWS_DEFAULT_REGION=us-east-1 python3.11 -m omics.cli.run_analyzer 1910249 --write-config=optimized.config
```

---

## 6. 워크플로우 파이프라인 단계별 시간

```
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

---

## 7. 결론

지표현재최적화 후개선**총 비용**$0.581~$0.37~36% 절감 가능**주요 병목**GATK4\_HAPLOTYPECALLER (메모리 과다 할당)**리소스 효율**낮음 (메모리 10% 미만 활용) → 개선 가능

---

## 8. 분석 도구 정보

**aws-healthomics-tools** ([GitHub](https://github.com/awslabs/aws-healthomics-tools))를 사용하여 분석되었습니다.

```
pip install aws-healthomics-tools
python -m omics.cli.run_analyzer <RUN_ID> -o output.csv
```

*이 리포트는 Claude Code를 통해 자동 생성되었습니다.*
