'use strict';
/**
 * Generates the CloudFront Functions (cloudfront-js-2.0) viewer-request code for the
 * documentation site from Docusaurus `static/_redirects`.
 *
 *  - /books/... (old BookStack URLs) -> compact 301 redirect table
 *  - other entries in static/_redirects -> direct 301 redirect table
 *  - every other request               -> append index.html to directory-style URLs,
 *                                       because the S3 (OAC) origin has no index documents
 *
 * The same module is used by the CDK stack (initial function code) and by the CodeBuild
 * deploy step (republishes the function when `_redirects` changes), so both always
 * produce identical code.
 *
 * CLI: node infra/lib/redirect-function.js static/_redirects > function.js
 */
const fs = require('fs');

const MAX_BYTES = 10 * 1024; // CloudFront Functions size quota (not adjustable)

function encodePath(p) {
  return p.split('/').map((seg) => encodeURIComponent(decodeURIComponent(seg))).join('/');
}

function buildTable(redirectsText) {
  const table = {};
  const direct = {};
  let count = 0;
  for (const line of redirectsText.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 3) continue;
    const [src, dst] = parts;
    const key = src.replace(/\/+$/, '') || '/';
    const target = encodePath(dst);
    if (src !== '/books' && !src.startsWith('/books/')) {
      if (direct[key] === undefined) {
        direct[key] = target;
        count++;
      }
      continue;
    }
    const rest = key.slice('/books/'.length);
    const slash = rest.indexOf('/');
    const book = slash < 0 ? rest : rest.slice(0, slash);
    const sub = slash < 0 ? '' : rest.slice(slash + 1);
    table[book] = table[book] || {};
    if (table[book][sub] !== undefined) continue; // trailing-slash duplicate
    count++;
    // "page/<slug>" -> "/<book>/<slug>/" is the common case; store 1 to save bytes.
    const short = sub.startsWith('page/') && target === `/${book}/${encodePath(sub.slice(5))}/`;
    table[book][sub] = short ? 1 : target;
  }
  return { table, direct, count };
}

function generate(redirectsText) {
  const { table, direct, count } = buildTable(redirectsText);
  const code = `var R=${JSON.stringify(table)},D=${JSON.stringify(direct)};
function handler(event){
var q=event.request,u=q.uri,k=u.replace(/\\/+$/,'')||'/',x=D[k];
if(x)return{statusCode:301,statusDescription:'Moved Permanently',headers:{location:{value:x},'cache-control':{value:'max-age=86400'}}};
if(u==='/books'||u.indexOf('/books/')===0){
var r=u.replace(/\\/+$/,'').slice(7).split('/'),b=R[r[0]];
if(b){var s=r.slice(1).join('/'),d=b[s];
if(d===1)d='/'+r[0]+'/'+r[2]+'/';
if(d)return{statusCode:301,statusDescription:'Moved Permanently',headers:{location:{value:d},'cache-control':{value:'max-age=86400'}}};}
}
if(u.endsWith('/'))q.uri=u+'index.html';
else if(u.lastIndexOf('.')<u.lastIndexOf('/'))q.uri=u+'/index.html';
return q;
}
`;
  const bytes = Buffer.byteLength(code, 'utf8');
  if (bytes > MAX_BYTES) {
    throw new Error(`CloudFront Function is ${bytes} bytes, over the ${MAX_BYTES}-byte quota. ` +
      'Shrink static/_redirects or move the table to CloudFront KeyValueStore (Pro plan or pay-as-you-go).');
  }
  return { code, bytes, count };
}

module.exports = { generate, MAX_BYTES };

if (require.main === module) {
  const file = process.argv[2] || 'static/_redirects';
  const { code, bytes, count } = generate(fs.readFileSync(file, 'utf8'));
  process.stdout.write(code);
  process.stderr.write(`redirects=${count} bytes=${bytes}/${MAX_BYTES}\n`);
}
