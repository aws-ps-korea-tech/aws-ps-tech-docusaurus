#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const forwardedArgs = process.argv.slice(2);
const validators = [
  'validate-docs.mjs',
  'validate-i18n.mjs',
  'check-public-content.mjs',
];
let failed = false;

for (const validator of validators) {
  const result = spawnSync(
    process.execPath,
    [path.join(scriptDirectory, validator), ...forwardedArgs],
    {cwd: process.cwd(), stdio: 'inherit'},
  );
  if (result.status !== 0) {
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('All documentation validators passed.');
}
