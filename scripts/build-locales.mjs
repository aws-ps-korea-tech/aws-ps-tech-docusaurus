#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pruneUnavailableEnglishAlternates} from './i18n/prune-unavailable-alternates.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const buildRoot = path.join(projectRoot, 'build');
const stagingRoot = path.join(projectRoot, '.locale-build');
const docusaurus = path.join(projectRoot, 'node_modules', '.bin', 'docusaurus');
const requestedLocale = process.argv[2] ?? null;

if (requestedLocale && !['ko', 'en'].includes(requestedLocale)) {
  throw new Error(`Unsupported locale '${requestedLocale}'. Expected ko or en.`);
}

function runBuild(locale, outputDirectory) {
  console.log(`Building ${locale} site into ${path.relative(projectRoot, outputDirectory)}...`);
  const result = spawnSync(
    docusaurus,
    ['build', '--locale', locale, '--out-dir', outputDirectory],
    {
      cwd: projectRoot,
      env: {...process.env, DOCS_BUILD_LOCALE: locale},
      stdio: 'inherit',
    },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (requestedLocale) {
  fs.rmSync(buildRoot, {recursive: true, force: true});
  runBuild(requestedLocale, buildRoot);
  process.exit(0);
}

fs.rmSync(buildRoot, {recursive: true, force: true});
fs.rmSync(stagingRoot, {recursive: true, force: true});

const koreanStage = path.join(stagingRoot, 'ko');
const englishStage = path.join(stagingRoot, 'en');
runBuild('ko', koreanStage);
runBuild('en', englishStage);

const englishOutput = path.join(englishStage, 'en');
if (!fs.existsSync(path.join(koreanStage, 'index.html'))) {
  throw new Error('Korean build did not produce its root index.html.');
}
if (!fs.existsSync(path.join(englishOutput, 'index.html'))) {
  throw new Error('English build did not produce en/index.html.');
}

fs.cpSync(koreanStage, buildRoot, {recursive: true});
fs.cpSync(englishOutput, path.join(buildRoot, 'en'), {recursive: true});
const removedAlternates = pruneUnavailableEnglishAlternates(
  buildRoot,
  process.env.DEPLOY_BASE_URL || '/',
);
fs.rmSync(stagingRoot, {recursive: true, force: true});
console.log(`Combined Korean and English sites in build/; removed ${removedAlternates} unavailable English alternate link(s).`);
