import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {
  addIssue,
  getChangedFiles,
  loadBaseline,
  parseChangedFrom,
} from '../lib/docs-validation.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, '..', '..');
const scratchRoot = process.env.DOCS_VALIDATION_TMPDIR || os.tmpdir();

function createProject() {
  fs.mkdirSync(scratchRoot, {recursive: true});
  const root = fs.mkdtempSync(path.join(scratchRoot, 'docs-validation-'));
  fs.mkdirSync(path.join(root, 'docs'), {recursive: true});
  fs.mkdirSync(path.join(root, 'schemas'), {recursive: true});
  fs.mkdirSync(path.join(root, 'config'), {recursive: true});
  fs.copyFileSync(
    path.join(projectRoot, 'schemas', 'doc-frontmatter.schema.json'),
    path.join(root, 'schemas', 'doc-frontmatter.schema.json'),
  );
  fs.writeFileSync(
    path.join(root, 'config', 'doc-validation-baseline.json'),
    '{"version":1,"exceptions":{}}\n',
  );
  return root;
}

function initializeGitProject(root) {
  const initialized = spawnSync('git', ['init'], {cwd: root, encoding: 'utf8'});
  assert.equal(initialized.status, 0, initialized.stderr);
  fs.writeFileSync(path.join(root, 'seed.txt'), 'seed\n');
  const added = spawnSync('git', ['add', 'seed.txt'], {cwd: root, encoding: 'utf8'});
  assert.equal(added.status, 0, added.stderr);
  const committed = spawnSync(
    'git',
    [
      '-c',
      'user.name=Validation Test',
      '-c',
      'user.email=test@example.invalid',
      'commit',
      '-m',
      'seed',
    ],
    {cwd: root, encoding: 'utf8'},
  );
  assert.equal(committed.status, 0, committed.stderr);
}

function runValidator(root, script) {
  return spawnSync(process.execPath, [path.join(projectRoot, 'scripts', script)], {
    cwd: root,
    encoding: 'utf8',
  });
}

function validFrontMatter(overrides = '') {
  return `---
title: "Valid public guide"
description: "A sufficiently detailed description for a public technical guide"
slug: /guides/valid-public-guide
keywords:
  - AWS
tags:
  - example
customProps:
  contentId: valid-public-guide
  locale: ko
  sourceLocale: ko
  publicationStatus: published
  translationStatus: source
  sectors:
    - education-research
  audiences:
    - customer
  contentType: overview
  level: beginner
  awsServices:
    - Amazon S3
  maintainers:
    - hmkim
  lastReviewed: "2026-11-06"
${overrides}---

## Summary {#summary}

This guide explains a valid example.
`;
}

test('accepts a valid modern document', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.writeFileSync(path.join(root, 'docs', 'valid.md'), validFrontMatter());

  const result = runValidator(root, 'validate-docs.mjs');
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('rejects missing required front matter in a modern document', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const invalid = validFrontMatter().replace(
    'description: "A sufficiently detailed description for a public technical guide"\n',
    '',
  );
  fs.writeFileSync(path.join(root, 'docs', 'invalid.md'), invalid);

  const result = runValidator(root, 'validate-docs.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FRONT_MATTER_SCHEMA/);
});

test('rejects account identifiers in modern public content', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.writeFileSync(
    path.join(root, 'docs', 'unsafe.md'),
    `${validFrontMatter()}\nAccount: ${['123456', '789012'].join('')}\n`,
  );

  const result = runValidator(root, 'check-public-content.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /AWS_ACCOUNT_ID/);
});

test('rejects a translated document at a different relative path', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const source = validFrontMatter();
  fs.writeFileSync(path.join(root, 'docs', 'source.md'), source);

  const translationDirectory = path.join(
    root,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  fs.mkdirSync(translationDirectory, {recursive: true});
  const translation = validFrontMatter()
    .replace('locale: ko', 'locale: en')
    .replace('translationStatus: source', 'translationStatus: current');
  fs.writeFileSync(path.join(translationDirectory, 'different.md'), translation);

  const result = runValidator(root, 'validate-i18n.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /TRANSLATION_PATH_MISMATCH/);
});

test('rejects wildcard validation baselines', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.writeFileSync(
    path.join(root, 'config', 'doc-validation-baseline.json'),
    '{"version":1,"exceptions":{"docs/**":["*"]}}\n',
  );

  assert.throws(() => loadBaseline(root), /cannot contain wildcard|must name one file/);
});

test('does not let a baseline downgrade errors in changed files', () => {
  const issues = [];
  const document = {
    projectPath: 'docs/known.md',
    data: {customProps: {contentId: 'known-doc'}},
  };
  addIssue(issues, {
    document,
    rule: 'KNOWN_RULE',
    message: 'must remain blocking',
    changedFiles: new Set(['docs/known.md']),
    baseline: {exceptions: {'docs/known.md': ['KNOWN_RULE']}},
  });

  assert.equal(issues[0].severity, 'error');
});

test('fails closed when changed-from cannot be resolved', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  initializeGitProject(root);

  assert.throws(
    () => getChangedFiles(root, 'definitely-not-a-ref'),
    /Git command failed/,
  );
});

test('rejects a non-Korean modern document in the default docs directory', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const invalid = validFrontMatter()
    .replace('locale: ko', 'locale: en')
    .replace('sourceLocale: ko', 'sourceLocale: en');
  fs.writeFileSync(path.join(root, 'docs', 'wrong-locale.md'), invalid);

  const result = runValidator(root, 'validate-i18n.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /DEFAULT_DOC_LOCALE_MISMATCH/);
});

test('requires matching explicit heading IDs for translation pairs', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const source = validFrontMatter().replace(' {#summary}', '');
  fs.writeFileSync(path.join(root, 'docs', 'valid.md'), source);

  const translationDirectory = path.join(
    root,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  fs.mkdirSync(translationDirectory, {recursive: true});
  const translation = validFrontMatter()
    .replace('locale: ko', 'locale: en')
    .replace('translationStatus: source', 'translationStatus: current')
    .replace(' {#summary}', '');
  fs.writeFileSync(path.join(translationDirectory, 'valid.md'), translation);

  const result = runValidator(root, 'validate-i18n.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /EXPLICIT_HEADING_IDS_MISSING/);
});

test('requires the Docusaurus draft flag for draft publication status', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const invalid = validFrontMatter().replace(
    'publicationStatus: published',
    'publicationStatus: draft',
  );
  fs.writeFileSync(path.join(root, 'docs', 'draft.md'), invalid);

  const result = runValidator(root, 'validate-docs.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /DRAFT_BUILD_FLAG_MISSING/);
});

test('rejects calendar dates that normalize to another day', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const invalid = validFrontMatter().replace('2026-11-06', '2026-02-30');
  fs.writeFileSync(path.join(root, 'docs', 'invalid-date.md'), invalid);

  const result = runValidator(root, 'validate-docs.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /INVALID_DATE/);
});

test('scans new files in arbitrary repository directories', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  initializeGitProject(root);
  fs.mkdirSync(path.join(root, 'infra', 'build'), {recursive: true});
  const internalUrl = ['https://pipelines', 'amazon', 'com'].join('.');
  fs.writeFileSync(
    path.join(root, 'infra', 'build', '비밀.ts'),
    `Account: ${['123456', '789012'].join('')}\nURL: ${internalUrl}/example\n`,
  );

  const result = runValidator(root, 'check-public-content.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /AWS_ACCOUNT_ID/);
  assert.match(result.stdout, /INTERNAL_URL/);
});

test('rejects an empty changed-from argument', () => {
  assert.throws(
    () => parseChangedFrom(['--changed-from=']),
    /non-empty Git revision|Git revision/,
  );
  assert.throws(
    () => parseChangedFrom(['--changed-from']),
    /Git revision/,
  );
  assert.throws(
    () => parseChangedFrom(['--changed-from=--output=unexpected']),
    /Git revision/,
  );
});

test('rejects partially missing heading IDs in translation pairs', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.writeFileSync(
    path.join(root, 'docs', 'valid.md'),
    `${validFrontMatter()}\n  ### Indented heading without an ID\n\nSetext heading without an ID\n---\n`,
  );

  const translationDirectory = path.join(
    root,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  fs.mkdirSync(translationDirectory, {recursive: true});
  const translation = validFrontMatter()
    .replace('locale: ko', 'locale: en')
    .replace('translationStatus: source', 'translationStatus: current');
  fs.writeFileSync(
    path.join(translationDirectory, 'valid.md'),
    `${translation}\n  ### Indented heading without an ID\n\nSetext heading without an ID\n---\n`,
  );

  const result = runValidator(root, 'validate-i18n.mjs');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /EXPLICIT_HEADING_IDS_MISSING/);
});

test('ignores Markdown headings inside longer code fences', (t) => {
  const root = createProject();
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const fencedExample = '\n````markdown\n```\n## Example heading inside code\n```\n````\n';
  fs.writeFileSync(
    path.join(root, 'docs', 'valid.md'),
    `${validFrontMatter()}${fencedExample}`,
  );

  const translationDirectory = path.join(
    root,
    'i18n',
    'en',
    'docusaurus-plugin-content-docs',
    'current',
  );
  fs.mkdirSync(translationDirectory, {recursive: true});
  const translation = validFrontMatter()
    .replace('locale: ko', 'locale: en')
    .replace('publicationStatus: published', 'publicationStatus: review')
    .replace('translationStatus: source', 'translationStatus: needs-review');
  fs.writeFileSync(
    path.join(translationDirectory, 'valid.md'),
    `${translation}${fencedExample}`,
  );

  const result = runValidator(root, 'validate-i18n.mjs');
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
