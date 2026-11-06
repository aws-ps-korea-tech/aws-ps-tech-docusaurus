import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const content = {
  ko: {
    pageTitle: '홈',
    pageDescription:
      '정부·공공기관, 교육·연구 및 헬스케어·생명과학 고객과 파트너를 위한 AWS 기술 가이드',
    kicker: 'AWS KOREA PUBLIC SECTOR',
    heading: 'AWS 공공부문 기술 가이드',
    lead:
      '정부·공공기관, 교육·연구 및 헬스케어·생명과학 고객과 파트너를 위한 기술 가이드, 실습 및 아키텍처 참고 자료입니다.',
    primaryAction: ['AWS 시작하기', '/getting-started/'],
    secondaryAction: ['전체 문서 보기', '/docs/'],
    sectorKicker: '분야별 가이드',
    sectorHeading: '업무 분야에서 시작하세요',
    sectorDescription: 'AWS 서비스명을 몰라도 분야별로 필요한 자료를 찾을 수 있습니다.',
    sectors: [
      {
        title: '정부·공공기관',
        description:
          '보안, 규제 준수, 공공 데이터, 생성형 AI와 애플리케이션 현대화 자료를 살펴봅니다.',
        to: '/sectors/government-public/',
      },
      {
        title: '교육·연구',
        description:
          'AWS 기초부터 연구 환경, 연구 데이터와 대규모 분석까지 필요한 자료를 찾습니다.',
        to: '/sectors/education-research/',
      },
      {
        title: '헬스케어·생명과학',
        description:
          '유전체 분석, AWS HealthOmics, AI 신약 개발과 GxP 가이드를 확인합니다.',
        to: '/sectors/healthcare-life-sciences/',
      },
    ],
    quickKicker: '빠른 시작',
    quickHeading: '해결하려는 문제로 찾아보세요',
    quickStarts: [
      ['AWS 계정을 안전하게 시작하기', '/aws/'],
      ['연구 컴퓨팅 환경 만들기', '/aws/aws-h9c/'],
      ['데이터를 저장하고 전달하기', '/topics/data-storage-transfer/'],
      ['대규모 분석 작업 실행하기', '/topics/compute-hpc/'],
      ['AI·머신러닝 시작하기', '/topics/ai-ml/'],
      ['보안·규제 요구사항 검토하기', '/topics/security-compliance/'],
    ],
    featuredKicker: '주요 자료',
    featuredHeading: '먼저 살펴볼 가이드',
    featuredDescription: '현재 콘텐츠의 강점을 보여주는 대표 자료입니다.',
    featured: [
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
    ],
    cardLink: '자료 보기 →',
    callouts: [
      {
        kicker: 'AWS 파트너',
        title: '고객과 함께 활용할 자료',
        description: '고객 분야별 권장 자료와 실습·아키텍처 문서를 한곳에서 확인하세요.',
        link: ['파트너 안내 보기 →', '/partners/'],
      },
      {
        kicker: 'ENGLISH RESOURCES',
        title: 'Read reviewed guides in English',
        description: 'Browse the English technical guides currently available in this collection.',
        link: ['View English resources →', '/en/'],
        targetLocale: 'en',
      },
    ],
  },
  en: {
    pageTitle: 'Home',
    pageDescription:
      'Reviewed AWS technical guides for public sector customers and partners',
    kicker: 'AWS KOREA PUBLIC SECTOR',
    heading: 'AWS Public Sector Technical Guides',
    lead:
      'Reviewed technical guides, hands-on tutorials, and architecture references for public sector customers and partners.',
    primaryAction: ['Start by goal', '/getting-started/'],
    secondaryAction: ['Browse English guides', '/docs/'],
    sectorKicker: 'ENGLISH GUIDES',
    sectorHeading: 'Start with an available collection',
    sectorDescription:
      'Only reviewed English content appears here. Korean-only documents are not copied into the English site.',
    sectors: [
      {
        title: 'Healthcare and life sciences',
        description:
          'Explore genomics workflows, AWS HealthOmics, AI-assisted research, and cost analysis.',
        to: '/sectors/healthcare-life-sciences/',
      },
      {
        title: 'AI antibody design',
        description:
          'Follow a console-based introduction to antibody candidate design with Amazon Bio Discovery.',
        to: '/amazon-bio-discovery-ai/',
      },
      {
        title: 'Genomics workflows',
        description:
          'Run nf-core/sarek and connect AWS HealthOmics workflows to a customer-managed VPC.',
        to: '/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/',
      },
    ],
    quickKicker: 'QUICK START',
    quickHeading: 'Choose the problem you want to solve',
    quickStarts: [
      ['Understand the available English guides', '/getting-started/'],
      ['Design antibody candidates with AI', '/amazon-bio-discovery-ai/'],
      ['Run nf-core/sarek', '/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/'],
      ['Connect workflows to a VPC', '/omics-on-aws/aws-healthomics/vpc-connected-workflows-s3/'],
      ['Understand concurrency and storage cost', '/omics-on-aws/aws-healthomics-ksh/'],
    ],
    featuredKicker: 'FEATURED GUIDES',
    featuredHeading: 'Reviewed English content',
    featuredDescription:
      'These guides have a maintained Korean source and an independently tracked English version.',
    featured: [
      {
        type: 'Getting started',
        title: 'AI Antibody Design on Amazon Bio Discovery',
        description: 'A console-based guide for life science researchers who are new to the cloud.',
        to: '/amazon-bio-discovery-ai/',
      },
      {
        type: 'Field guide',
        title: 'Running nf-core/sarek on AWS HealthOmics',
        description: 'Container strategy, workflow registration, execution, and verified results.',
        to: '/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/',
      },
      {
        type: 'Performance and cost',
        title: 'Task Concurrency and Run Storage Cost',
        description: 'A controlled experiment showing how longer run duration affects storage cost.',
        to: '/omics-on-aws/aws-healthomics-ksh/',
      },
    ],
    cardLink: 'View guide →',
    callouts: [
      {
        kicker: 'KOREAN RESOURCES',
        title: 'Browse the full Korean collection',
        description:
          'The Korean site contains the complete collection across government, education, research, healthcare, and life sciences.',
        link: ['한국어 자료 보기 →', '/'],
        targetLocale: 'ko',
      },
      {
        kicker: 'CONTRIBUTE',
        title: 'Improve or translate a guide',
        description:
          'Use the public contribution guide and document templates in the GitHub repository.',
        link: [
          'Open the contribution guide →',
          'https://github.com/aws-ps-korea-tech/technical-documents/blob/main/CONTRIBUTING.md',
        ],
        external: true,
      },
    ],
  },
};

function Card({title, description, to, eyebrow, cardLink}) {
  return (
    <Link className={styles.card} to={to}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
      <span className={styles.cardLink}>{cardLink}</span>
    </Link>
  );
}

export default function Home() {
  const {i18n, siteConfig} = useDocusaurusContext();
  const page = content[i18n.currentLocale] ?? content.ko;
  const rootBaseUrl =
    i18n.currentLocale === 'en'
      ? siteConfig.baseUrl.replace(/en\/$/, '') || '/'
      : siteConfig.baseUrl;
  const localeHome = {
    ko: new URL(rootBaseUrl, siteConfig.url).toString(),
    en: new URL(`${rootBaseUrl.replace(/\/$/, '')}/en/`, siteConfig.url).toString(),
  };

  return (
    <Layout title={page.pageTitle} description={page.pageDescription}>
      <main>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.kicker}>{page.kicker}</span>
            <Heading as="h1">{page.heading}</Heading>
            <p className={styles.lead}>{page.lead}</p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to={page.primaryAction[1]}>
                {page.primaryAction[0]}
              </Link>
              <Link className="button button--secondary button--lg" to={page.secondaryAction[1]}>
                {page.secondaryAction[0]}
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>{page.sectorKicker}</span>
              <Heading as="h2">{page.sectorHeading}</Heading>
              <p>{page.sectorDescription}</p>
            </div>
            <div className={styles.gridThree}>
              {page.sectors.map((sector) => (
                <Card key={sector.to} {...sector} cardLink={page.cardLink} />
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alternate}`}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>{page.quickKicker}</span>
              <Heading as="h2">{page.quickHeading}</Heading>
            </div>
            <div className={styles.quickGrid}>
              {page.quickStarts.map(([label, to]) => (
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
              <span className={styles.kicker}>{page.featuredKicker}</span>
              <Heading as="h2">{page.featuredHeading}</Heading>
              <p>{page.featuredDescription}</p>
            </div>
            <div className={styles.gridThree}>
              {page.featured.map((item) => (
                <Card
                  key={item.to}
                  {...item}
                  eyebrow={item.type}
                  cardLink={page.cardLink}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`container ${styles.split}`}>
            {page.callouts.map((callout) => (
              <div className={styles.callout} key={callout.title}>
                <span className={styles.kicker}>{callout.kicker}</span>
                <Heading as="h2">{callout.title}</Heading>
                <p>{callout.description}</p>
                {callout.targetLocale || callout.external ? (
                  <a href={callout.targetLocale ? localeHome[callout.targetLocale] : callout.link[1]}>
                    {callout.link[0]}
                  </a>
                ) : (
                  <Link to={callout.link[1]}>{callout.link[0]}</Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
