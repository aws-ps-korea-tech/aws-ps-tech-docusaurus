import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import matter from 'gray-matter';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {pruneUnavailableEnglishAlternates} from '../i18n/prune-unavailable-alternates.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, '..', '..');

function readIncludes(locale) {
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      "const c=require('./config/i18n-content'); console.log(JSON.stringify(c.docIncludePatterns.sort()))",
    ],
    {
      cwd: projectRoot,
      env: {...process.env, DOCS_BUILD_LOCALE: locale},
      encoding: 'utf8',
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return JSON.parse(result.stdout.trim());
}

test('English build includes only reviewed localized documents', () => {
  const includes = readIncludes('en');
  assert.deepEqual(includes, [
    'amazon-bio-discovery-ai/amazon-bio-discovery-ai.md',
    'getting-started/index.md',
    'index.md',
    'omics-on-aws/aws-healthomics-ksh.md',
    'omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390.md',
    'omics-on-aws/aws-healthomics/vpc-connected-workflows-s3.md',
    'sectors/healthcare-life-sciences.md',
  ]);
  assert.equal(includes.some((documentPath) => documentPath.startsWith('aws/')), false);
  assert.equal(includes.some((documentPath) => documentPath.startsWith('gxp-on-aws/')), false);
});

test('Korean build keeps legacy Korean content and excludes moved English sources', () => {
  const includes = readIncludes('ko');
  assert.equal(includes.includes('aws/aws.md'), true);
  assert.equal(
    includes.includes(
      'amazon-bio-discovery-ai/getting-started-with-ai-antibody-design-on-amazon-bio-discovery-a-guide-for-life-science-researchers.md',
    ),
    false,
  );
  assert.equal(
    includes.includes(
      'omics-on-aws/aws-healthomics/running-nf-coresarek-390-on-aws-healthomics.md',
    ),
    false,
  );
});

test('unsupported build locales fail closed', () => {
  const result = spawnSync(
    process.execPath,
    ['-e', "require('./config/i18n-content')"],
    {
      cwd: projectRoot,
      env: {...process.env, DOCS_BUILD_LOCALE: 'fr'},
      encoding: 'utf8',
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsupported DOCS_BUILD_LOCALE/);
});

test('removes alternate links only when the English route is unavailable', (t) => {
  const scratchRoot = process.env.DOCS_VALIDATION_TMPDIR || os.tmpdir();
  fs.mkdirSync(scratchRoot, {recursive: true});
  const buildRoot = fs.mkdtempSync(path.join(scratchRoot, 'alternate-links-'));
  t.after(() => fs.rmSync(buildRoot, {recursive: true, force: true}));

  fs.mkdirSync(path.join(buildRoot, 'translated'), {recursive: true});
  fs.mkdirSync(path.join(buildRoot, 'korean-only'), {recursive: true});
  fs.mkdirSync(path.join(buildRoot, 'en', 'translated'), {recursive: true});
  const availableTag =
    '<link rel="alternate" href="https://example.com/en/translated" hreflang="en">';
  const unavailableTag =
    '<link rel="alternate" href="https://example.com/en/korean-only" hreflang="en">';
  fs.writeFileSync(path.join(buildRoot, 'translated', 'index.html'), availableTag);
  fs.writeFileSync(path.join(buildRoot, 'korean-only', 'index.html'), unavailableTag);
  fs.writeFileSync(path.join(buildRoot, 'en', 'translated', 'index.html'), availableTag);
  const htmlFileTag =
    '<link rel="alternate" href="https://example.com/en/404.html" hreflang="en">';
  fs.writeFileSync(path.join(buildRoot, '404.html'), htmlFileTag);
  fs.writeFileSync(path.join(buildRoot, 'en', '404.html'), htmlFileTag);

  const removed = pruneUnavailableEnglishAlternates(buildRoot, '/');
  assert.equal(removed, 1);
  assert.match(
    fs.readFileSync(path.join(buildRoot, 'translated', 'index.html'), 'utf8'),
    /hreflang="en"/,
  );
  assert.doesNotMatch(
    fs.readFileSync(path.join(buildRoot, 'korean-only', 'index.html'), 'utf8'),
    /hreflang="en"/,
  );
  assert.match(
    fs.readFileSync(path.join(buildRoot, '404.html'), 'utf8'),
    /hreflang="en"/,
  );
});

test('English route manifest matches every published English document slug', () => {
  const translationRoot = path.join(
    projectRoot,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  const documentRoutes = readIncludes('en').map((documentPath) =>
    matter.read(path.join(translationRoot, documentPath)).data.slug,
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'config', 'i18n-routes.json'), 'utf8'),
  );
  assert.deepEqual(
    [...new Set(manifest.en)].sort(),
    [...new Set(['/', '/search', ...documentRoutes])].sort(),
  );
});
