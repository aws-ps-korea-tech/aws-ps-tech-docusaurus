---
draft: true
title: "실습 제목"
description: "독자가 실습을 완료해 얻을 결과를 설명하는 한 문장"
slug: /topic/stable-hands-on-slug
keywords:
  - AWS service
  - hands-on
tags:
  - service-name
customProps:
  contentId: globally-unique-content-id
  locale: ko
  sourceLocale: ko
  publicationStatus: draft
  translationStatus: source
  sectors:
    - education-research
  audiences:
    - customer
    - partner
  contentType: hands-on
  level: intermediate
  awsServices:
    - AWS service name
  maintainers:
    - github-login
  lastReviewed: null
---

## 한눈에 보기 {#summary}

실습이 해결하는 문제와 완료 후 확인할 결과를 설명합니다.

## 대상 독자 {#audience}

필요한 사전 지식과 이 실습이 적합한 독자를 설명합니다.

## 검증 환경 {#tested-environment}

| 항목 | 값 |
|---|---|
| 검증 날짜 | YYYY-MM-DD |
| AWS 리전 | `<AWS_REGION>` |
| 서비스·도구 버전 | 버전 |
| 입력 데이터 | 공개 예제 또는 생성 방법 |
| 반복 횟수 | 1회 이상 실제 횟수 |

## 사전 준비 {#prerequisites}

필요한 계정, AWS CLI 프로필, 도구와 IAM 권한 범위를 설명합니다. 각 자리표시자의 값을 어디서 확인하는지도 설명합니다.

## 핵심 개념 {#concepts}

실습에서 사용하는 전문 용어를 일반적인 표현으로 설명합니다.

## 실습 절차 {#procedure}

### 1. 첫 번째 단계 {#step-1}

실행할 작업과 그 이유를 설명합니다.

```bash
aws sts get-caller-identity --profile <AWS_PROFILE>
```

예상 결과와 성공 판단 기준을 설명합니다.

## 결과 확인 {#verification}

실습이 성공했음을 독자가 직접 확인할 명령, 화면 또는 출력값을 설명합니다.

## 문제 해결 {#troubleshooting}

| 증상 | 가능한 원인 | 확인 방법 | 해결 방법 |
|---|---|---|---|
| 예시 증상 | 예시 원인 | 확인 명령 | 해결 절차 |

## 제한사항과 운영 전 확인사항 {#limitations}

테스트 환경과 운영 환경의 차이, 적용 리전, 서비스 제한과 보안 고려사항을 설명합니다.

## 리소스 정리 {#cleanup}

비용이 계속 발생할 수 있는 리소스와 안전한 정리 순서를 설명합니다. 삭제 명령은 실제 리소스를 특정하는 완전한 형태로 작성하고 독자가 삭제 대상을 확인하도록 안내합니다.

## 참고 자료 {#references}

- [AWS 공식 문서 제목](https://docs.aws.amazon.com/)
