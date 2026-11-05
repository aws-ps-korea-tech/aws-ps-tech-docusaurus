'use strict';
// Remove NUL bytes from every built HTML file. Docusaurus 3.9 can emit them inside
// sidebar labels; they are pure insertions, so removing them restores the exact text.
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'build';
let files = 0;
let changed = 0;
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) {
      files++;
      const data = fs.readFileSync(p); // read fully before writing
      if (data.includes(0)) {
        fs.writeFileSync(p, Buffer.from(data.filter((b) => b !== 0)));
        changed++;
      }
    }
  }
})(root);
console.log(`strip-nul: ${changed}/${files} HTML files cleaned`);
