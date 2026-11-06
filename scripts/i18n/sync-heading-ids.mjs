#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function headings(lines) {
  const found = [];
  let fenceCharacter = null;
  let fenceLength = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (
        marker[0] === fenceCharacter &&
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
    const match = /^( {0,3})(#{2,6})\s+(.+?)(?:\s+\{#[a-z0-9][a-z0-9-]*\})?\s*$/.exec(line);
    if (match) {
      found.push({index, level: match[2].length, prefix: `${match[1]}${match[2]}`, text: match[3]});
    }
  }
  return found;
}

function slugifyHeading(text, fallback, used) {
  let slug = text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\d+(?:\.\d+)*\.?\s+/, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
  const base = slug;
  let suffix = 2;
  while (used.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(slug);
  return slug;
}

function applyIds(filePath, headingList, ids) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  headingList.forEach((heading, index) => {
    lines[heading.index] = `${heading.prefix} ${heading.text} {#${ids[index]}}`;
  });
  fs.writeFileSync(filePath, lines.join('\n'));
}

const [sourceArgument, translationArgument] = process.argv.slice(2);
if (!sourceArgument || !translationArgument) {
  throw new Error('Usage: node scripts/i18n/sync-heading-ids.mjs <source.md> <translation.md>');
}

const sourcePath = path.resolve(sourceArgument);
const translationPath = path.resolve(translationArgument);
const sourceLines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
const translationLines = fs.readFileSync(translationPath, 'utf8').split(/\r?\n/);
const sourceHeadings = headings(sourceLines);
const translationHeadings = headings(translationLines);

if (sourceHeadings.length !== translationHeadings.length) {
  throw new Error(
    `Heading count differs: source=${sourceHeadings.length}, translation=${translationHeadings.length}`,
  );
}

for (let index = 0; index < sourceHeadings.length; index += 1) {
  if (sourceHeadings[index].level !== translationHeadings[index].level) {
    throw new Error(
      `Heading level differs at position ${index + 1}: source=H${sourceHeadings[index].level}, translation=H${translationHeadings[index].level}`,
    );
  }
}

const used = new Set();
const ids = translationHeadings.map((heading, index) =>
  slugifyHeading(heading.text, `section-${String(index + 1).padStart(2, '0')}`, used),
);
applyIds(sourcePath, sourceHeadings, ids);
applyIds(translationPath, translationHeadings, ids);
console.log(`Applied ${ids.length} shared heading IDs to ${sourceArgument} and ${translationArgument}.`);
