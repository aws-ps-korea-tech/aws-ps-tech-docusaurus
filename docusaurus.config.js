// @ts-check

const {themes} = require('prism-react-renderer');
const {
  buildLocale,
  docIncludePatterns,
  supportedLocales,
} = require('./config/i18n-content');

const siteUrl = process.env.DEPLOY_URL || 'https://aws-ps-tech-docusaurus.netlify.app';
const siteBaseUrl = process.env.DEPLOY_BASE_URL || '/';
const englishBaseUrl = `${siteBaseUrl.replace(/\/$/, '')}/en/`;
const koreanUrl = new URL(siteBaseUrl, siteUrl).toString();
const englishUrl = new URL(englishBaseUrl, siteUrl).toString();
const isEnglish = buildLocale === 'en';
const githubUrl = 'https://github.com/aws-ps-korea-tech/technical-documents';

const localeContent = isEnglish
  ? {
      title: 'AWS Public Sector Technical Guides',
      tagline: 'Technical guides, hands-on tutorials, and architecture references for public sector customers and partners',
      announcement:
        'This site does not replace AWS Documentation. Confirm current service information in the <a target="_blank" rel="noopener" href="https://docs.aws.amazon.com">official AWS Documentation</a>.',
      navbarTitle: 'AWS Public Sector Technical Guides',
      navbarItems: [
        {to: '/getting-started/', label: 'Getting started', position: 'left'},
        {
          to: '/sectors/healthcare-life-sciences/',
          label: 'Healthcare & life sciences',
          position: 'left',
        },
        {
          label: 'Featured guides',
          position: 'left',
          items: [
            {
              label: 'AI antibody design',
              to: '/amazon-bio-discovery-ai/',
            },
            {
              label: 'Run nf-core/sarek',
              to: '/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/',
            },
            {
              label: 'VPC-connected workflows',
              to: '/omics-on-aws/aws-healthomics/vpc-connected-workflows-s3/',
            },
            {
              label: 'Concurrency and storage cost',
              to: '/omics-on-aws/aws-healthomics-ksh/',
            },
          ],
        },
        {href: koreanUrl, label: '한국어', position: 'right', target: '_self'},
        {href: githubUrl, label: 'GitHub', position: 'right'},
      ],
      footerLinks: [
        {
          title: 'English guides',
          items: [
            {label: 'Getting started', to: '/getting-started/'},
            {
              label: 'Healthcare & life sciences',
              to: '/sectors/healthcare-life-sciences/',
            },
            {label: 'All English guides', to: '/docs/'},
          ],
        },
        {
          title: 'Related links',
          items: [
            {label: 'AWS', href: 'https://aws.amazon.com/'},
            {label: 'AWS Documentation', href: 'https://docs.aws.amazon.com/'},
            {label: 'Privacy', href: 'https://aws.amazon.com/privacy/'},
            {label: 'GitHub', href: githubUrl},
          ],
        },
      ],
      copyright:
        'Unofficial technical guidance maintained by AWS Korea Public Sector contributors. This site does not replace AWS Documentation.',
    }
  : {
      title: 'AWS 공공부문 기술 가이드',
      tagline: '공공부문 고객과 파트너를 위한 AWS 기술 가이드, 실습 및 아키텍처 참고 자료',
      announcement:
        '이 사이트는 AWS 공식 설명서를 대체하지 않습니다. 최신 서비스 정보는 <a target="_blank" rel="noopener" href="https://docs.aws.amazon.com">AWS 공식 문서</a>를 확인하세요.',
      navbarTitle: 'AWS 공공부문 기술 가이드',
      navbarItems: [
        {to: '/getting-started/', label: '시작하기', position: 'left'},
        {
          label: '분야별 가이드',
          position: 'left',
          items: [
            {label: '정부·공공기관', to: '/sectors/government-public/'},
            {label: '교육·연구', to: '/sectors/education-research/'},
            {label: '헬스케어·생명과학', to: '/sectors/healthcare-life-sciences/'},
          ],
        },
        {
          label: '기술 주제',
          position: 'left',
          items: [
            {label: 'AI·머신러닝', to: '/topics/ai-ml/'},
            {label: '데이터·스토리지·전송', to: '/topics/data-storage-transfer/'},
            {label: '컴퓨팅·고성능 컴퓨팅', to: '/topics/compute-hpc/'},
            {label: '워크플로·자동화', to: '/topics/workflows-automation/'},
            {label: '보안·규제 준수', to: '/topics/security-compliance/'},
          ],
        },
        {to: '/partners/', label: '파트너', position: 'left'},
        {href: englishUrl, label: 'English', position: 'right', target: '_self'},
        {href: githubUrl, label: 'GitHub', position: 'right'},
      ],
      footerLinks: [
        {
          title: '분야별 가이드',
          items: [
            {label: '정부·공공기관', to: '/sectors/government-public/'},
            {label: '교육·연구', to: '/sectors/education-research/'},
            {label: '헬스케어·생명과학', to: '/sectors/healthcare-life-sciences/'},
          ],
        },
        {
          title: '자료',
          items: [
            {label: '시작하기', to: '/getting-started/'},
            {label: '파트너', to: '/partners/'},
            {label: '전체 문서', to: '/docs/'},
            {label: 'English', href: englishUrl, target: '_self'},
          ],
        },
        {
          title: '관련 링크',
          items: [
            {label: 'AWS', href: 'https://aws.amazon.com/'},
            {label: 'AWS 공식 문서', href: 'https://docs.aws.amazon.com/'},
            {label: '개인정보 처리방침', href: 'https://aws.amazon.com/ko/privacy/'},
            {label: 'GitHub', href: githubUrl},
          ],
        },
      ],
      copyright:
        'AWS Korea Public Sector 기술 기여자가 작성·관리하는 비공식 기술 자료입니다. AWS 공식 문서를 대체하지 않습니다.',
    };

// Pinned CloudWatch RUM web client (aws-rum-web) served from the AWS CDN.
const RUM_CLIENT_VERSION = '3.2.1';

function rumHeadTags() {
  const {RUM_APP_MONITOR_ID: id, RUM_IDENTITY_POOL_ID: pool, RUM_REGION: region} = process.env;
  if (!id || !pool || !region) return [];
  const config = {
    sessionSampleRate: 1,
    identityPoolId: pool,
    endpoint: `https://dataplane.rum.${region}.amazonaws.com`,
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: false,
    enableXRay: false,
  };
  const args = [
    'cwr', id, '1.0.0', region,
    `https://client.rum.us-east-1.amazonaws.com/${RUM_CLIENT_VERSION}/cwr.js`, config,
  ].map((a) => JSON.stringify(a)).join(',');
  return [{
    tagName: 'script',
    attributes: {},
    innerHTML:
      '(function(n,i,v,r,s,c,x,z){x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};' +
      'window[n]=function(c,p){x.q.push({c:c,p:p});};z=document.createElement("script");' +
      'z.async=true;z.src=s;document.head.insertBefore(z,document.head.getElementsByTagName("script")[0]);})' +
      `(${args});`,
  }];
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: localeContent.title,
  tagline: localeContent.tagline,
  favicon: 'img/favicon.png',

  // Platform-dependent: GitHub Pages uses a repository base path, while
  // Cloudflare Pages and Netlify serve from the site root.
  url: siteUrl,
  baseUrl: siteBaseUrl,

  organizationName: 'aws-ps-korea-tech',
  projectName: 'technical-documents',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'ko',
    locales: supportedLocales,
    localeConfigs: {
      ko: {label: '한국어', htmlLang: 'ko-KR'},
      en: {label: 'English', htmlLang: 'en', baseUrl: englishBaseUrl},
    },
  },

  // CloudWatch RUM (page performance, JavaScript and HTTP errors; no cookies).
  // Only added when the CodeBuild deploy sets the RUM_* variables, so Netlify,
  // pull request and local builds send nothing.
  headTags: rumHeadTags(),

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          numberPrefixParser: false,
          include: docIncludePatterns,
          sidebarPath: require.resolve(isEnglish ? './sidebars.en.js' : './sidebars.js'),
          editUrl: `${githubUrl}/edit/main/`,
          editLocalizedFiles: true,
          // These sources require publication review. Excluding them keeps them
          // off the generated website; because the repository is public, truly
          // private material must also be removed from the repository itself.
          exclude: [
            '**/draft-*/**',
            'decision-models-on-aws/**',
            'english/**',
            'gxp-on-aws/gxp-on-aws.md',
            'aws/ec2/rstudio.md',
            'omics-on-aws/alphagenome-alphamissense-on-aws/**',
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: isEnglish ? ['en'] : ['en', 'ko'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      announcementBar: {
        id: `disclaimer-${buildLocale}`,
        content: localeContent.announcement,
        backgroundColor: '#fff3cd',
        textColor: '#664d03',
        isCloseable: false,
      },
      navbar: {
        title: localeContent.navbarTitle,
        logo: {
          alt: localeContent.navbarTitle,
          src: 'img/logo-light-mode.png',
          srcDark: 'img/logo-dark-mode.png',
        },
        items: localeContent.navbarItems,
      },
      footer: {
        style: 'dark',
        links: localeContent.footerLinks,
        copyright: localeContent.copyright,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
