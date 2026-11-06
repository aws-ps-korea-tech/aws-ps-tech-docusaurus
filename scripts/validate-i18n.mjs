#!/usr/bin/env node

import {execFileSync} from 'node:child_process';
import {
  addIssue,
  findLine,
  getChangedFiles,
  loadBaseline,
  loadDocuments,
  parseChangedFrom,
  reportIssues,
} from './lib/docs-validation.mjs';

const projectRoot = process.cwd();
const changedFrom = parseChangedFrom();
const changedFiles = getChangedFiles(projectRoot, changedFrom);
const baseline = loadBaseline(projectRoot);
const documents = loadDocuments(projectRoot).filter(
  (document) => document.data?.customProps?.contentId,
);
const issues = [];
const groups = new Map();

function addDocumentIssue(document, rule, message, options = {}) {
  addIssue(issues, {
    document,
    rule,
    message,
    changedFiles,
    baseline,
    ...options,
  });
}

function commitExists(commit) {
  try {
    execFileSync('git', ['cat-file', '-e', `${commit}^{commit}`], {
      cwd: projectRoot,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function sourceChangedSince(commit, sourcePath) {
  try {
    execFileSync('git', ['diff', '--quiet', commit, 'HEAD', '--', sourcePath], {
      cwd: projectRoot,
      stdio: 'ignore',
    });
    return false;
  } catch {
    return true;
  }
}

function headingMetadata(content) {
  const ids = new Set();
  const missingIdLines = [];
  const lines = content.split(/\r?\n/);
  let fenceCharacter = null;
  let fenceLength = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const character = marker[0];
      if (!fenceCharacter) {
        fenceCharacter = character;
        fenceLength = marker.length;
      } else if (
        character === fenceCharacter &&
        marker.length >= fenceLength &&
        fenceMatch[2].trim() === ''
      ) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }
    if (fenceCharacter) {
      continue;
    }

    const atxMatch = /^ {0,3}#{2,6}\s+(.+?)\s*#*\s*$/.exec(line);
    const setextH2 =
      index > 0 &&
      /^ {0,3}-{3,}\s*$/.test(line) &&
      lines[index - 1].trim() !== '';
    if (!atxMatch && !setextH2) {
      continue;
    }

    const headingLine = setextH2 ? lines[index - 1] : line;
    const headingLineNumber = setextH2 ? index : index + 1;
    const idMatch = /\s+\{#([a-z0-9][a-z0-9-]*)\}\s*#*\s*$/.exec(
      headingLine,
    );
    if (idMatch) {
      ids.add(idMatch[1]);
    } else {
      missingIdLines.push(headingLineNumber);
    }
  }
  return {ids, missingIdLines};
}

for (const document of documents) {
  const props = document.data.customProps;
  const group = groups.get(props.contentId) ?? [];
  group.push(document);
  groups.set(props.contentId, group);

  if (document.rootSource === 'default' && props.locale !== 'ko') {
    addDocumentIssue(
      document,
      'DEFAULT_DOC_LOCALE_MISMATCH',
      `기본 docs 디렉터리는 locale 'ko'만 허용합니다. '${props.locale}' 문서는 해당 i18n 디렉터리로 옮기세요.`,
    );
  }

  if (document.rootLocale && document.rootLocale !== props.locale) {
    addDocumentIssue(
      document,
      'LOCALE_DIRECTORY_MISMATCH',
      `번역 디렉터리 '${document.rootLocale}'와 locale '${props.locale}'이 다릅니다.`,
    );
  }

  if (props.locale === props.sourceLocale && props.translationStatus !== 'source') {
    addDocumentIssue(
      document,
      'SOURCE_TRANSLATION_STATUS',
      '원문은 translationStatus를 source로 설정해야 합니다.',
    );
  }

  if (props.locale !== props.sourceLocale) {
    if (props.translationStatus === 'source') {
      addDocumentIssue(
        document,
        'TRANSLATION_MARKED_AS_SOURCE',
        '번역본은 translationStatus를 source로 설정할 수 없습니다.',
      );
    }
    if (
      ['published', 'archived'].includes(props.publicationStatus) &&
      !props.translatedFrom
    ) {
      addDocumentIssue(
        document,
        'TRANSLATED_FROM_MISSING',
        '발행된 번역본에는 기준 원문 커밋 translatedFrom이 필요합니다.',
      );
    }
  }

  if (props.locale !== 'ko') {
    for (const match of document.content.matchAll(/\[[^\]]+\]\((\/(?!\/)[^)#?\s]+)[^)]*\)/g)) {
      addDocumentIssue(
        document,
        'ROOT_ABSOLUTE_INTERNAL_LINK',
        `루트 절대 링크 '${match[1]}'는 현재 언어를 벗어날 수 있습니다. 상대 Markdown 링크를 사용하세요.`,
        {
          line:
            findLine(document.content, match.index) + document.contentLineOffset,
          severity: 'warning',
        },
      );
    }
  }
}

for (const [contentId, group] of groups) {
  const sourceLocales = new Set(
    group.map((document) => document.data.customProps.sourceLocale),
  );
  if (sourceLocales.size !== 1) {
    for (const document of group) {
      addDocumentIssue(
        document,
        'SOURCE_LOCALE_MISMATCH',
        `contentId '${contentId}'의 언어판이 서로 다른 sourceLocale을 선언합니다.`,
      );
    }
    continue;
  }

  const sourceLocale = [...sourceLocales][0];
  const sourceDocument = group.find(
    (document) => document.data.customProps.locale === sourceLocale,
  );
  if (!sourceDocument) {
    for (const document of group) {
      addDocumentIssue(
        document,
        'SOURCE_DOCUMENT_MISSING',
        `contentId '${contentId}'의 원문 locale '${sourceLocale}' 파일을 찾을 수 없습니다.`,
      );
    }
    continue;
  }

  const sourceHeadings = headingMetadata(sourceDocument.content);
  for (const document of group) {
    if (document === sourceDocument) {
      continue;
    }
    const props = document.data.customProps;
    if (document.relativeDocPath !== sourceDocument.relativeDocPath) {
      addDocumentIssue(
        document,
        'TRANSLATION_PATH_MISMATCH',
        `번역본 경로는 원문 '${sourceDocument.relativeDocPath}'와 같아야 합니다.`,
      );
    }
    if (document.data.slug !== sourceDocument.data.slug) {
      addDocumentIssue(
        document,
        'TRANSLATION_SLUG_MISMATCH',
        `번역본 slug는 원문 '${sourceDocument.data.slug}'와 같아야 합니다.`,
      );
    }

    const translatedHeadings = headingMetadata(document.content);
    if (
      sourceHeadings.ids.size === 0 ||
      translatedHeadings.ids.size === 0 ||
      sourceHeadings.missingIdLines.length > 0 ||
      translatedHeadings.missingIdLines.length > 0
    ) {
      addDocumentIssue(
        document,
        'EXPLICIT_HEADING_IDS_MISSING',
        `번역 문서 쌍의 모든 H2-H6 제목에는 명시적 문단 ID가 필요합니다. 원문 누락 ${sourceHeadings.missingIdLines.length}개, 번역본 누락 ${translatedHeadings.missingIdLines.length}개.`,
        {
          line:
            (translatedHeadings.missingIdLines[0] ?? 1) +
            document.contentLineOffset,
        },
      );
    } else {
      const missing = [...sourceHeadings.ids].filter(
        (id) => !translatedHeadings.ids.has(id),
      );
      const extra = [...translatedHeadings.ids].filter(
        (id) => !sourceHeadings.ids.has(id),
      );
      if (missing.length || extra.length) {
        addDocumentIssue(
          document,
          'HEADING_ID_MISMATCH',
          `원문과 번역본의 문단 ID가 다릅니다. 누락: ${missing.join(', ') || '없음'}; 추가: ${extra.join(', ') || '없음'}.`,
        );
      }
    }

    if (props.translatedFrom) {
      if (!commitExists(props.translatedFrom)) {
        addDocumentIssue(
          document,
          'TRANSLATED_FROM_UNKNOWN',
          `translatedFrom 커밋 '${props.translatedFrom}'을 Git 이력에서 찾을 수 없습니다.`,
        );
      } else if (sourceChangedSince(props.translatedFrom, sourceDocument.projectPath)) {
        addDocumentIssue(
          document,
          'TRANSLATION_SOURCE_CHANGED',
          '번역 기준 커밋 이후 원문이 변경됐습니다. 번역 영향을 확인하고 상태를 갱신하세요.',
          {severity: 'warning'},
        );
      }
    }
  }
}

const result = reportIssues(issues, 'Localization validation');
if (result.errors > 0) {
  process.exitCode = 1;
}
