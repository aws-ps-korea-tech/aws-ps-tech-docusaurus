import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const sectors = [
  {
    title: '정부·공공기관',
    description: '보안, 규제 준수, 공공 데이터, 생성형 AI와 애플리케이션 현대화 자료를 살펴봅니다.',
    to: '/sectors/government-public/',
  },
  {
    title: '교육·연구',
    description: 'AWS 기초부터 연구 환경, 연구 데이터와 대규모 분석까지 필요한 자료를 찾습니다.',
    to: '/sectors/education-research/',
  },
  {
    title: '헬스케어·생명과학',
    description: '유전체 분석, AWS HealthOmics, AI 신약 개발과 GxP 가이드를 확인합니다.',
    to: '/sectors/healthcare-life-sciences/',
  },
];

const quickStarts = [
  ['AWS 계정을 안전하게 시작하기', '/aws/'],
  ['연구 컴퓨팅 환경 만들기', '/aws/aws-h9c/'],
  ['데이터를 저장하고 전달하기', '/topics/data-storage-transfer/'],
  ['대규모 분석 작업 실행하기', '/topics/compute-hpc/'],
  ['AI·머신러닝 시작하기', '/topics/ai-ml/'],
  ['보안·규제 요구사항 검토하기', '/topics/security-compliance/'],
];

const featured = [
  {
    type: '입문·실습',
    title: 'Amazon Bio Discovery로 AI 항체 설계 시작하기',
    description: '클라우드가 익숙하지 않은 생명과학 연구자를 위한 콘솔 중심 안내입니다.',
    to: '/amazon-bio-discovery-ai/',
  },
  {
    type: '아키텍처·실습',
    title: 'NCBI BLAST on AWS',
    description: '대규모 BLAST 실행 원리, 비용과 백엔드 선택 기준을 확인합니다.',
    to: '/ncbi-blast-on-aws/',
  },
  {
    type: '규제·거버넌스',
    title: '한국 제약·바이오를 위한 GxP on AWS',
    description: '위험 기반 검증과 AWS 공동 책임 모델을 실제 통제 관점에서 정리합니다.',
    to: '/gxp-on-aws/',
  },
];

function Card({title, description, to, eyebrow}) {
  return (
    <Link className={styles.card} to={to}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
      <span className={styles.cardLink}>자료 보기 →</span>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="홈"
      description="정부·공공기관, 교육·연구 및 헬스케어·생명과학 고객과 파트너를 위한 AWS 기술 가이드">
      <main>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.kicker}>AWS KOREA PUBLIC SECTOR</span>
            <Heading as="h1">AWS 공공부문 기술 가이드</Heading>
            <p className={styles.lead}>
              정부·공공기관, 교육·연구 및 헬스케어·생명과학 고객과 파트너를 위한
              기술 가이드, 실습 및 아키텍처 참고 자료입니다.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/getting-started/">
                AWS 시작하기
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/">
                전체 문서 보기
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>분야별 가이드</span>
              <Heading as="h2">업무 분야에서 시작하세요</Heading>
              <p>AWS 서비스명을 몰라도 분야별로 필요한 자료를 찾을 수 있습니다.</p>
            </div>
            <div className={styles.gridThree}>
              {sectors.map((sector) => (
                <Card key={sector.to} {...sector} />
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alternate}`}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>빠른 시작</span>
              <Heading as="h2">해결하려는 문제로 찾아보세요</Heading>
            </div>
            <div className={styles.quickGrid}>
              {quickStarts.map(([label, to]) => (
                <Link key={to} className={styles.quickLink} to={to}>
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>주요 자료</span>
              <Heading as="h2">먼저 살펴볼 가이드</Heading>
              <p>현재 콘텐츠의 강점을 보여주는 대표 자료입니다.</p>
            </div>
            <div className={styles.gridThree}>
              {featured.map((item) => (
                <Card key={item.to} {...item} eyebrow={item.type} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`container ${styles.split}`}>
            <div className={styles.callout}>
              <span className={styles.kicker}>AWS 파트너</span>
              <Heading as="h2">고객과 함께 활용할 자료</Heading>
              <p>
                고객 분야별 권장 자료와 실습·아키텍처 문서를 한곳에서 확인하세요.
              </p>
              <Link to="/partners/">파트너 안내 보기 →</Link>
            </div>
            <div className={styles.callout}>
              <span className={styles.kicker}>ENGLISH RESOURCES</span>
              <Heading as="h2">Read reviewed guides in English</Heading>
              <p>Browse the English technical guides currently available in this collection.</p>
              <Link to="/english/">View English resources →</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
