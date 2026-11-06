---
draft: true
title: "아키텍처 제목"
description: "아키텍처가 해결하는 문제와 적용 범위를 설명하는 한 문장"
slug: /topic/stable-architecture-slug
keywords:
  - AWS architecture
  - technical topic
tags:
  - architecture
customProps:
  contentId: globally-unique-content-id
  locale: ko
  sourceLocale: ko
  publicationStatus: draft
  translationStatus: source
  sectors:
    - government-public
  audiences:
    - customer
    - partner
  contentType: architecture
  level: intermediate
  awsServices:
    - AWS service name
  maintainers:
    - github-login
  lastReviewed: null
---

## 한눈에 보기 {#summary}

해결하려는 문제, 권장 설계와 중요한 선택 기준을 요약합니다.

## 대상 독자와 적용 범위 {#audience-and-scope}

이 설계가 적합한 독자, 워크로드와 적용하지 말아야 할 경우를 설명합니다.

## 요구사항과 가정 {#requirements-and-assumptions}

사실로 확인한 요구사항과 설계를 위해 둔 가정을 구분합니다.

## 아키텍처 {#architecture}

![아키텍처의 구성 요소와 데이터 흐름을 설명하는 대체 텍스트](./_assets/architecture.png)

구성 요소와 데이터 흐름을 일반 독자가 이해할 수 있도록 설명합니다.

## 설계 결정 {#design-decisions}

| 결정 | 선택 | 이유 | 대안과 선택 기준 |
|---|---|---|---|
| 예시 결정 | 권장 선택 | 선택 이유 | 다른 선택이 적합한 경우 |

## 보안 경계 {#security-boundaries}

인증, 권한, 네트워크, 데이터 보호와 감사 경계를 설명합니다. 공개 엔드포인트와 비공개 구성 요소를 구분합니다.

## 가용성과 확장성 {#availability-and-scale}

장애 처리, 복구, 용량 증가와 서비스 제한을 설명합니다.

## 비용을 만드는 요소 {#cost-drivers}

비용을 결정하는 사용량과 서비스를 설명합니다. 고정 금액보다 공식 가격 링크와 계산식을 우선합니다.

## 제한사항과 적용하지 말아야 할 경우 {#limitations}

설계의 경계와 다른 접근이 더 적합한 상황을 설명합니다.

## 검증 방법 {#verification}

설계를 실습 또는 시험 환경에서 확인하는 방법과 성공 기준을 설명합니다.

## 참고 자료 {#references}

- [AWS 공식 문서 제목](https://docs.aws.amazon.com/)
