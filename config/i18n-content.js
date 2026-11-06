const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const projectRoot = path.resolve(__dirname, '..');
const supportedLocales = ['ko', 'en'];
const buildLocale = process.env.DOCS_BUILD_LOCALE || 'ko';

if (!supportedLocales.includes(buildLocale)) {
  throw new Error(
    `Unsupported DOCS_BUILD_LOCALE '${buildLocale}'. Expected one of: ${supportedLocales.join(', ')}.`,
  );
}

function walkMarkdown(directory, baseDirectory = directory, files = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(absolutePath, baseDirectory, files);
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push({
        absolutePath,
        relativePath: path.relative(baseDirectory, absolutePath).split(path.sep).join('/'),
      });
    }
  }
  return files;
}

function isPublished(frontMatter) {
  const status = frontMatter.customProps?.publicationStatus;
  return ['published', 'archived'].includes(status) && frontMatter.draft !== true;
}

function koreanIncludes() {
  return walkMarkdown(path.join(projectRoot, 'docs'))
    .filter(({absolutePath}) => {
      const frontMatter = matter.read(absolutePath).data;
      const props = frontMatter.customProps;
      if (!props?.contentId) {
        return true;
      }
      return props.locale === 'ko' && isPublished(frontMatter);
    })
    .map(({relativePath}) => relativePath);
}

function englishIncludes() {
  const translationRoot = path.join(
    projectRoot,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  return walkMarkdown(translationRoot)
    .filter(({absolutePath}) => {
      const frontMatter = matter.read(absolutePath).data;
      return frontMatter.customProps?.locale === 'en' && isPublished(frontMatter);
    })
    .map(({relativePath}) => relativePath)
    .filter((relativePath) => fs.existsSync(path.join(projectRoot, 'docs', relativePath)));
}

const docIncludePatterns = buildLocale === 'en' ? englishIncludes() : koreanIncludes();

if (docIncludePatterns.length === 0) {
  throw new Error(`No published documents are available for locale '${buildLocale}'.`);
}

module.exports = {
  buildLocale,
  docIncludePatterns,
  supportedLocales,
};
