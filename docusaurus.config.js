// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AWS Korea Public Sector SA Team',
  tagline: 'AWS Korea Public Sector SA Team Technical Documentation',
  favicon: 'img/favicon.png',

  // Platform-dependent: GH Pages uses /docusaurus/, CF Pages/Netlify use root.
  // Set DEPLOY_BASE_URL=/aws-ps-tech-docusaurus/ + DEPLOY_URL for GH Pages (CI); unset = root.
  url: process.env.DEPLOY_URL || 'https://aws-ps-tech-docusaurus.netlify.app',
  baseUrl: process.env.DEPLOY_BASE_URL || '/',

  organizationName: 'aws-ps-korea-tech',
  projectName: 'aws-ps-tech-docusaurus',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          numberPrefixParser: false,
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/aws-ps-korea-tech/aws-ps-tech-docusaurus/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  // Offline, in-browser full-text search. No Algolia account or network calls —
  // the index is built at compile time and shipped as static assets, which suits
  // a static deploy (Netlify/CF Pages/S3). Korean + English tokenization so CJK
  // page titles and bodies are searchable.
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
          '⚠️ 이 사이트의 게시물은 최신 정보를 반영하지 않을 수 있으며, <strong>AWS 공식 콘텐츠가 아닙니다.</strong> 최신 정보는 <a target="_blank" rel="noopener" href="https://docs.aws.amazon.com">AWS 공식 문서</a>를 참고하세요.',
        backgroundColor: '#fff3cd',
        textColor: '#664d03',
        isCloseable: false,
      },
      navbar: {
        title: 'AWS Korea Public Sector SA Team',
        logo: {
          alt: 'AWS',
          src: 'img/logo-light-mode.png',
          srcDark: 'img/logo-dark-mode.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'start',
            position: 'left',
            label: "시작하기",
          },
          {
            type: 'docSidebar',
            sidebarId: 'omics',
            position: 'left',
            label: "오믹스·유전체",
          },
          {
            type: 'docSidebar',
            sidebarId: 'batch',
            position: 'left',
            label: "배치·BLAST",
          },
          {
            type: 'docSidebar',
            sidebarId: 'ai',
            position: 'left',
            label: "AI·의사결정",
          },
          {
            href: 'https://github.com/aws-ps-korea-tech/aws-ps-tech-docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'AWS Services',
                to: '/s3/amazon-s3/s3-select',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'AWS',
                href: 'https://aws.amazon.com',
              },
              {
                label: 'Privacy Policy',
                href: 'https://aws.amazon.com/ko/privacy/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/aws-ps-korea-tech/aws-ps-tech-docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Amazon Web Services, Inc. or its affiliates. All rights reserved.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
