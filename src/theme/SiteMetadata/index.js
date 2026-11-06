/*
 * Derived from @docusaurus/theme-classic SiteMetadata.
 * Docusaurus is licensed under the MIT License.
 */
import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {PageMetadata, useThemeConfig} from '@docusaurus/theme-common';
import {
  DEFAULT_SEARCH_TAG,
  useAlternatePageUtils,
  keyboardFocusedClassName,
} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import SearchMetadata from '@theme/SearchMetadata';
import localeRoutes from '@site/config/i18n-routes.json';

function normalizeLogicalPath(pathname, baseUrl) {
  const withoutBase = pathname.startsWith(baseUrl)
    ? pathname.slice(baseUrl.length)
    : pathname.replace(/^\//, '');
  const normalized = `/${withoutBase}`.replace(/\/+$/, '');
  return normalized || '/';
}

function AlternateLangHeaders() {
  const {
    i18n: {currentLocale, defaultLocale, localeConfigs},
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  const alternatePageUtils = useAlternatePageUtils();
  const currentHtmlLang = localeConfigs[currentLocale].htmlLang;
  const logicalPath = normalizeLogicalPath(pathname, baseUrl);
  const englishRoutes = new Set(localeRoutes.en);
  const availableLocales = new Set([defaultLocale]);

  if (englishRoutes.has(logicalPath)) {
    availableLocales.add('en');
  }
  availableLocales.add(currentLocale);

  const bcp47ToOpenGraphLocale = (code) => code.replace('-', '_');
  return (
    <Head>
      {Object.entries(localeConfigs)
        .filter(([locale]) => availableLocales.has(locale))
        .map(([locale, {htmlLang}]) => (
          <link
            key={locale}
            rel="alternate"
            href={alternatePageUtils.createUrl({locale, fullyQualified: true})}
            hrefLang={htmlLang}
          />
        ))}
      <link
        rel="alternate"
        href={alternatePageUtils.createUrl({
          locale: defaultLocale,
          fullyQualified: true,
        })}
        hrefLang="x-default"
      />
      <meta
        property="og:locale"
        content={bcp47ToOpenGraphLocale(currentHtmlLang)}
      />
      {Object.entries(localeConfigs)
        .filter(
          ([locale, config]) =>
            locale !== currentLocale && availableLocales.has(locale) && config.htmlLang,
        )
        .map(([locale, config]) => (
          <meta
            key={`meta-og-${locale}`}
            property="og:locale:alternate"
            content={bcp47ToOpenGraphLocale(config.htmlLang)}
          />
        ))}
    </Head>
  );
}

function useDefaultCanonicalUrl() {
  const {
    siteConfig: {url: siteUrl, baseUrl, trailingSlash},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  const canonicalPathname = applyTrailingSlash(useBaseUrl(pathname), {
    trailingSlash,
    baseUrl,
  });
  return siteUrl + canonicalPathname;
}

function CanonicalUrlHeaders({permalink}) {
  const {
    siteConfig: {url: siteUrl},
  } = useDocusaurusContext();
  const defaultCanonicalUrl = useDefaultCanonicalUrl();
  const canonicalUrl = permalink ? `${siteUrl}${permalink}` : defaultCanonicalUrl;
  return (
    <Head>
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export default function SiteMetadata() {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const {metadata, image: defaultImage} = useThemeConfig();
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <body className={keyboardFocusedClassName} />
      </Head>
      {defaultImage && <PageMetadata image={defaultImage} />}
      <CanonicalUrlHeaders />
      <AlternateLangHeaders />
      <SearchMetadata tag={DEFAULT_SEARCH_TAG} locale={currentLocale} />
      <Head>
        {metadata.map((metadatum, index) => (
          <meta key={index} {...metadatum} />
        ))}
      </Head>
    </>
  );
}
