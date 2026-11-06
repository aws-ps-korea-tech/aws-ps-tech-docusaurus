'use strict';
// Guard before publishing: key pages exist, are real HTML, and contain no NUL bytes.
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'build';
const errors = [];
for (const page of [
  'index.html',
  '404.html',
  'en/index.html',
  'en/404.html',
  'en/docs/index.html',
  'en/amazon-bio-discovery-ai/index.html',
  'en/omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390/index.html',
]) {
  const p = path.join(root, page);
  if (!fs.existsSync(p)) { errors.push(`${page} missing`); continue; }
  const data = fs.readFileSync(p);
  if (data.length < 1000) errors.push(`${page} is only ${data.length} bytes`);
  if (!data.toString('utf8').includes('</html>')) errors.push(`${page} is not a complete HTML document`);
}
let html = 0;
let empty = 0;
let nul = 0;
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) {
      html++;
      const data = fs.readFileSync(p);
      if (data.length === 0) empty++;
      if (data.includes(0)) nul++;
    }
  }
})(root);
if (html < 50) errors.push(`only ${html} HTML files`);
if (empty) errors.push(`${empty} empty HTML files`);
if (nul) errors.push(`${nul} HTML files still contain NUL bytes`);
console.log(`check-build: ${html} HTML files, ${empty} empty, ${nul} with NUL`);
if (errors.length) {
  console.error(`check-build FAILED: ${errors.join('; ')}`);
  process.exit(1);
}
