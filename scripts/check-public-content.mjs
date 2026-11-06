#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {
  addIssue,
  findLine,
  getChangedFiles,
  loadBaseline,
  loadDocuments,
  parseChangedFrom,
  reportIssues,
  toPosix,
} from './lib/docs-validation.mjs';

const projectRoot = process.cwd();
const changedFrom = parseChangedFrom();
const changedFiles = getChangedFiles(projectRoot, changedFrom);
const baseline = loadBaseline(projectRoot);
const issues = [];
const documentByPath = new Map(
  loadDocuments(projectRoot).map((document) => [document.projectPath, document]),
);
const excludedRootDirectories = new Set([
  '.cache-loader',
  '.docusaurus',
  '.git',
  'build',
  'node_modules',
]);
const selfPath = path.join(projectRoot, 'scripts', 'check-public-content.mjs');

const patterns = [
  {
    rule: 'AWS_ACCESS_KEY',
    regex: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
    message: 'AWS 액세스 키로 보이는 값이 있습니다. 즉시 제거하고 유출 여부를 확인하세요.',
  },
  {
    rule: 'AWS_ACCOUNT_ID',
    regex: /(?<![A-Z0-9_<])\d{12}(?![A-Z0-9_>])/g,
    message: '12자리 AWS 계정 ID로 보이는 값이 있습니다. <ACCOUNT_ID> 자리표시자로 바꾸세요.',
  },
  {
    rule: 'AWS_ARN',
    regex: /\barn:(?![^\s)"']*[<{])(?:aws|aws-cn|aws-us-gov):[A-Za-z0-9_./:=+@-]+/g,
    message: '실제 ARN으로 보이는 값이 있습니다. 공개 가능한 일반 예제가 아니면 자리표시자로 바꾸세요.',
  },
  {
    rule: 'AWS_RESOURCE_ID',
    regex: /\b(?:vpc|subnet|sg|eni|igw|nat|rtb|vpce|i)-[0-9a-f]{8,17}\b/gi,
    message: '실제 AWS 리소스 ID로 보이는 값이 있습니다. 의미가 분명한 자리표시자로 바꾸세요.',
  },
  {
    rule: 'INTERNAL_URL',
    regex: /https?:\/\/(?:[A-Za-z0-9.-]+\.(?:corp\.amazon\.com|amazon\.dev|a2z\.com|aws\.dev|amazon\.work)|(?:w|code|pipelines|apollo|phonetool|broadcast|isengard|issues|sim|cti|bindles|paste|oncall|profiler|kingpin|quilt|meetings|build|npmpm)\.amazon\.com|quip-amazon\.com)(?:[/:?#][^\s)"']*)?/gi,
    message: 'Amazon 내부 URL로 보이는 주소가 있습니다. 공개 출처로 교체하거나 제거하세요.',
  },
  {
    rule: 'LOCAL_ABSOLUTE_PATH',
    regex: /(?:\/local)?\/home\/[A-Za-z0-9._-]+\/[^\s)"']+|\/Users\/[A-Za-z0-9._-]+\/[^\s)"']+|\/workplace\/[A-Za-z0-9._-]+\/[^\s)"']+/g,
    message: '작성 환경의 절대 경로로 보이는 값이 있습니다. 저장소 기준 경로나 일반적인 자리표시자로 바꾸세요.',
  },
  {
    rule: 'STATIC_AWS_CREDENTIAL_EXPORT',
    regex: /^\s*export\s+AWS_(?:ACCESS_KEY_ID|SECRET_ACCESS_KEY|SESSION_TOKEN)\s*=/gm,
    message: '정적 AWS 자격 증명을 환경 변수로 내보내도록 안내하지 마세요. AWS CLI 프로필 또는 역할 기반 인증을 사용하세요.',
  },
  {
    rule: 'PRIVATE_MARKER',
    regex: /\b(?:internal only|do not share|confidential)\b|비공개\s*초안|외부\s*공유\s*금지/gi,
    message: '비공개 또는 외부 공유 금지 표시가 있습니다. 공개 저장소에 적합한 내용인지 확인하세요.',
  },
];

function fallbackRepositoryPaths(directory = projectRoot, files = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (
      directory === projectRoot &&
      entry.isDirectory() &&
      excludedRootDirectories.has(entry.name)
    ) {
      continue;
    }
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      fallbackRepositoryPaths(absolutePath, files);
    } else {
      files.push(absolutePath);
    }
  }
  return files;
}

function repositoryPaths() {
  if (!fs.existsSync(path.join(projectRoot, '.git'))) {
    return fallbackRepositoryPaths();
  }
  const output = execFileSync(
    'git',
    [
      '-c',
      'core.quotePath=false',
      'ls-files',
      '-z',
      '--cached',
      '--others',
      '--exclude-standard',
    ],
    {cwd: projectRoot},
  );
  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((projectPath) => path.join(projectRoot, projectPath));
}

function isProbablyText(buffer) {
  if (buffer.includes(0)) {
    return false;
  }
  const decoded = buffer.toString('utf8');
  const replacementCharacters = [...decoded].filter(
    (character) => character === '\uFFFD',
  ).length;
  return replacementCharacters <= Math.max(2, decoded.length * 0.001);
}

function collectTextFiles() {
  return repositoryPaths()
    .filter((absolutePath) => {
      if (absolutePath === selfPath || !fs.existsSync(absolutePath)) {
        return false;
      }
      const stat = fs.lstatSync(absolutePath);
      return stat.isFile() && isProbablyText(fs.readFileSync(absolutePath));
    })
    .sort();
}

for (const absolutePath of collectTextFiles()) {
  const projectPath = toPosix(path.relative(projectRoot, absolutePath));
  const text = fs.readFileSync(absolutePath, 'utf8');
  const document = documentByPath.get(projectPath);
  const strict = document
    ? changedFiles.has(projectPath) || Boolean(document.data?.customProps?.contentId)
    : changedFiles.has(projectPath);

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      addIssue(issues, {
        document,
        projectPath,
        rule: pattern.rule,
        message: pattern.message,
        line: findLine(text, match.index),
        changedFiles,
        baseline,
        strict,
      });
    }
  }
}

const result = reportIssues(issues, 'Public-content validation');
if (result.errors > 0) {
  process.exitCode = 1;
}
