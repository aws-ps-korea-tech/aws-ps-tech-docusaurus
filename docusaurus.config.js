// @ts-check

const {themes} = require('prism-react-renderer');

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
  title: 'AWS 공공부문 기술 가이드',
  tagline: '공공부문 고객과 파트너를 위한 AWS 기술 가이드, 실습 및 아키텍처 참고 자료',
  favicon: 'img/favicon.png',

  // Platform-dependent: GitHub Pages uses a repository base path, while
  // Cloudflare Pages and Netlify serve from the site root.
  url: process.env.DEPLOY_URL || 'https://aws-ps-tech-docusaurus.netlify.app',
  baseUrl: process.env.DEPLOY_BASE_URL || '/',

  organizationName: 'aws-ps-korea-tech',
  projectName: 'technical-documents',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  // Korean remains the default and only generated locale until reviewed
  // translations are separated from the mixed-language source tree. Reviewed
  // English documents are curated at /english/ in the meantime.
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
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
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/aws-ps-korea-tech/technical-documents/edit/main/',
          // These sources require publication review. Excluding them keeps them
          // off the generated website; because the repository is public, truly
          // private material must also be removed from the repository itself.
          exclude: [
            '**/draft-*/**',
            'decision-models-on-aws/**',
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

  // Build the Korean and English full-text index into the static site.
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en', 'ko'],
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
        id: 'disclaimer',
        content:
          '이 사이트는 AWS 공식 설명서를 대체하지 않습니다. 최신 서비스 정보는 <a target="_blank" rel="noopener" href="https://docs.aws.amazon.com">AWS 공식 문서</a>를 확인하세요.',
        backgroundColor: '#fff3cd',
        textColor: '#664d03',
        isCloseable: false,
      },
      navbar: {
        title: 'AWS 공공부문 기술 가이드',
        logo: {
          alt: 'AWS 공공부문 기술 가이드',
          src: 'img/logo-light-mode.png',
          srcDark: 'img/logo-dark-mode.png',
        },
        items: [
          {
            to: '/getting-started/',
            label: '시작하기',
            position: 'left',
          },
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
          {
            to: '/partners/',
            label: '파트너',
            position: 'left',
          },
          {
            to: '/english/',
            label: 'English',
            position: 'right',
          },
          {
            href: 'https://github.com/aws-ps-korea-tech/technical-documents',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
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
              {label: 'English', to: '/english/'},
            ],
          },
          {
            title: '관련 링크',
            items: [
              {label: 'AWS', href: 'https://aws.amazon.com/'},
              {label: 'AWS 공식 문서', href: 'https://docs.aws.amazon.com/'},
              {label: '개인정보 처리방침', href: 'https://aws.amazon.com/ko/privacy/'},
              {
                label: 'GitHub',
                href: 'https://github.com/aws-ps-korea-tech/technical-documents',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AWS Korea Public Sector SA Team. 비공식 기술 자료이며 AWS 공식 문서를 대체하지 않습니다.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
