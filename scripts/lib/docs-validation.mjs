import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import matter from 'gray-matter';

const DOC_EXTENSIONS = new Set(['.md', '.mdx']);

export function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function walk(directory, predicate, files = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }

  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath, predicate, files);
    } else if (predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }
  return files;
}

export function listFiles(directory, predicate = () => true) {
  return walk(directory, predicate).sort();
}

export function loadDocuments(projectRoot) {
  const roots = [
    {directory: path.join(projectRoot, 'docs'), locale: null, source: 'default'},
  ];
  const i18nRoot = path.join(projectRoot, 'i18n');

  if (fs.existsSync(i18nRoot)) {
    for (const localeEntry of fs.readdirSync(i18nRoot, {withFileTypes: true})) {
      if (!localeEntry.isDirectory()) {
        continue;
      }
      roots.push({
        directory: path.join(
          i18nRoot,
          localeEntry.name,
          'docusaurus-plugin-content-docs',
          'current',
        ),
        locale: localeEntry.name,
        source: 'translation',
      });
    }
  }

  const documents = [];
  for (const root of roots) {
    for (const absolutePath of listFiles(root.directory, (filePath) =>
      DOC_EXTENSIONS.has(path.extname(filePath)),
    )) {
      const raw = fs.readFileSync(absolutePath, 'utf8');
      let parsed;
      let parseError = null;
      try {
        parsed = matter(raw);
      } catch (error) {
        parsed = {data: {}, content: raw};
        parseError = error;
      }

      documents.push({
        absolutePath,
        projectPath: toPosix(path.relative(projectRoot, absolutePath)),
        relativeDocPath: toPosix(path.relative(root.directory, absolutePath)),
        rootLocale: root.locale,
        rootSource: root.source,
        raw,
        data: parsed.data ?? {},
        content: parsed.content ?? '',
        contentLineOffset:
          parseError || !(parsed.content ?? '')
            ? 0
            : raw.slice(0, raw.indexOf(parsed.content)).split(/\r?\n/).length - 1,
        parseError,
      });
    }
  }
  return documents;
}

export function parseChangedFrom(argv = process.argv.slice(2)) {
  const equalsArg = argv.find((arg) => arg.startsWith('--changed-from='));
  if (equalsArg) {
    const value = equalsArg.slice('--changed-from='.length);
    if (!value || value.startsWith('-')) {
      throw new Error('--changed-from requires a non-empty Git revision.');
    }
    return value;
  }
  const index = argv.indexOf('--changed-from');
  if (index < 0) {
    return null;
  }
  const value = argv[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error('--changed-from requires a Git revision.');
  }
  return value;
}

function runGit(projectRoot, args, {binary = false} = {}) {
  try {
    return execFileSync('git', ['-c', 'core.quotePath=false', ...args], {
      cwd: projectRoot,
      encoding: binary ? null : 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    throw new Error(`Git command failed (git ${args.join(' ')}): ${detail}`);
  }
}

function parseNulPaths(output) {
  return output
    .toString('utf8')
    .split('\0')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(toPosix);
}

function resolveRevision(projectRoot, revision) {
  if (!revision || revision.startsWith('-')) {
    throw new Error('--changed-from requires a valid Git commit revision.');
  }
  const resolved = runGit(projectRoot, [
    'rev-parse',
    '--verify',
    '--end-of-options',
    `${revision}^{commit}`,
  ]).trim();
  if (!/^[0-9a-f]{40}$/i.test(resolved)) {
    throw new Error(`Could not resolve Git commit '${revision}'.`);
  }
  return resolved;
}

export function getChangedFiles(projectRoot, changedFrom = null) {
  if (!fs.existsSync(path.join(projectRoot, '.git'))) {
    if (changedFrom) {
      throw new Error(`Cannot resolve --changed-from '${changedFrom}' outside a Git working tree.`);
    }
    return new Set();
  }

  const paths = [];
  if (changedFrom) {
    const baseCommit = resolveRevision(projectRoot, changedFrom);
    paths.push(
      ...parseNulPaths(
        runGit(
          projectRoot,
          ['diff', '--name-only', '-z', `${baseCommit}...HEAD`, '--'],
          {binary: true},
        ),
      ),
    );
  }
  paths.push(
    ...parseNulPaths(
      runGit(projectRoot, ['diff', '--name-only', '-z', 'HEAD', '--'], {
        binary: true,
      }),
    ),
    ...parseNulPaths(
      runGit(
        projectRoot,
        ['ls-files', '-z', '--others', '--exclude-standard'],
        {binary: true},
      ),
    ),
  );
  return new Set(paths);
}

export function loadBaseline(projectRoot) {
  const baselinePath = path.join(projectRoot, 'config', 'doc-validation-baseline.json');
  if (!fs.existsSync(baselinePath)) {
    return {exceptions: {}};
  }
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  if (baseline.version !== 1 || typeof baseline.exceptions !== 'object') {
    throw new Error('config/doc-validation-baseline.json must use version 1 and an exceptions object.');
  }
  const globCharacters = /[*?\[\]{}]/;
  for (const [projectPath, rules] of Object.entries(baseline.exceptions)) {
    if (globCharacters.test(projectPath) || !Array.isArray(rules)) {
      throw new Error(`Baseline entry '${projectPath}' must name one file and an array of rules.`);
    }
    if (rules.some((rule) => typeof rule !== 'string' || globCharacters.test(rule))) {
      throw new Error(`Baseline entry '${projectPath}' cannot contain wildcard rules.`);
    }
  }
  return baseline;
}

export function hasBaselineException(baseline, projectPath, rule) {
  return Boolean(baseline.exceptions?.[projectPath]?.includes(rule));
}

export function isStrictDocument(document, changedFiles) {
  return (
    changedFiles.has(document.projectPath) ||
    Boolean(document.data?.customProps?.contentId)
  );
}

export function addIssue(
  issues,
  {
    document,
    projectPath,
    rule,
    message,
    severity = 'error',
    line = 1,
    changedFiles = new Set(),
    baseline = {exceptions: {}},
    strict,
  },
) {
  const resolvedPath = projectPath ?? document?.projectPath ?? '<repository>';
  const resolvedStrict =
    strict ?? (document ? isStrictDocument(document, changedFiles) : true);
  let resolvedSeverity = severity;

  if (resolvedSeverity === 'error') {
    const changed = changedFiles.has(resolvedPath);
    const baselineApplies =
      !changed && hasBaselineException(baseline, resolvedPath, rule);
    if (!resolvedStrict || baselineApplies) {
      resolvedSeverity = 'warning';
    }
  }

  issues.push({
    severity: resolvedSeverity,
    path: resolvedPath,
    line,
    rule,
    message,
  });
}

export function reportIssues(issues, label) {
  const sorted = [...issues].sort((a, b) =>
    `${a.path}:${String(a.line).padStart(8, '0')}:${a.rule}`.localeCompare(
      `${b.path}:${String(b.line).padStart(8, '0')}:${b.rule}`,
    ),
  );
  const errors = sorted.filter((issue) => issue.severity === 'error');
  const warnings = sorted.filter((issue) => issue.severity === 'warning');
  const warningCounts = new Map();
  const visibleWarnings = [];
  const warningLimitPerRule = 3;

  for (const warning of warnings) {
    const count = warningCounts.get(warning.rule) ?? 0;
    warningCounts.set(warning.rule, count + 1);
    if (count < warningLimitPerRule) {
      visibleWarnings.push(warning);
    }
  }

  for (const issue of [...errors, ...visibleWarnings]) {
    const command = issue.severity === 'error' ? 'error' : 'warning';
    console.log(
      `::${command} file=${issue.path},line=${issue.line},title=${issue.rule}::${issue.message}`,
    );
    console.log(
      `${issue.severity.toUpperCase()} ${issue.path}:${issue.line} [${issue.rule}] ${issue.message}`,
    );
  }

  if (warnings.length > visibleWarnings.length) {
    const summary = [...warningCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([rule, count]) => `${rule}=${count}`)
      .join(', ');
    console.log(`Warning summary (showing up to ${warningLimitPerRule} per rule): ${summary}`);
  }

  console.log(`${label}: ${errors.length} error(s), ${warnings.length} warning(s)`);
  return {errors: errors.length, warnings: warnings.length};
}

export function findLine(text, index) {
  return text.slice(0, Math.max(index, 0)).split(/\r?\n/).length;
}

export function isPublished(document) {
  return ['published', 'archived'].includes(
    document.data?.customProps?.publicationStatus,
  );
}

export function isExternalTarget(target) {
  return /^(?:https?:|mailto:|tel:|#)/i.test(target);
}

export function stripTargetSuffix(target) {
  return target.split('#')[0].split('?')[0];
}
