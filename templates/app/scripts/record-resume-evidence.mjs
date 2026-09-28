import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
const exec = promisify(execFile);
const root = 'reference/2026-09-26-continuation/resume';
const main = JSON.parse(await readFile(`${root}/accepted-verification/results.json`, 'utf8'));
const gestures = JSON.parse(await readFile(`${root}/gesture-verification/results.json`, 'utf8'));
for (const [name, result] of [['main', main], ['gestures', gestures]]) {
  if (!result.checks.length || result.errors.length || result.checks.some(check => !check.passed)) throw Error(`${name} verification has unresolved failures`);
}
const loanLog = await readFile(`${root}/loan-tests.log`, 'utf8');
if (!/# pass 5\b/.test(loanLog) || !/# fail 0\b/.test(loanLog)) throw Error('Loan unit tests have not passed');
const {stdout: head} = await exec('git', ['rev-parse', 'HEAD']);
const {stdout: filesText} = await exec('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {maxBuffer:8*1024*1024});
const files = [...new Set(filesText.split('\0').filter(file => /^(app\/|components\/|lib\/)/.test(file) && /\.(tsx?|css)$/.test(file) || ['package.json','next.config.js','babel.config.js'].includes(file)))].sort();
const sourceHashes = await Promise.all(files.map(async file => ({path:file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')})));
const source = await readFile('lib/captured-inventory.ts','utf8');
const marker = 'export const capturedVehicles: Vehicle[] = ';
const captured = JSON.parse(source.slice(source.indexOf(marker)+marker.length).replace(/;\s*$/,''));
const fixtureSource = await readFile('lib/data.ts','utf8');
const slugs = [...fixtureSource.matchAll(/slug:\s*'([^']+)'/g)].map(match=>match[1]);
const count = new Set([...slugs,...captured.map(car=>car.slug)]).size;
const addresses = Object.values(os.networkInterfaces()).flat().filter(item=>item && item.family==='IPv4' && !item.internal).map(item=>item.address);
const comparisonDir = `${root}/comparisons`;
await mkdir(comparisonDir,{recursive:true});
const pairs = [
 ['gallery-exterior','native-gallery-exteriors'],
 ['price-breakdown','price-breakdown-confirmed'],
 ['emi-plans','emi-confirmed'],
 ['detail-service-history','resume-service-history'],
 ['detail-car-finance','resume-finance-confirmed'],
];
for(const [web,native] of pairs){
 const a=await sharp(`reference/2026-09-26-continuation/${native}-427.png`).png().toBuffer();
 const b=await sharp(`${root}/accepted-verification/${web}.png`).png().toBuffer();
 const header=Buffer.from('<svg width="854" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="854" height="28" fill="white"/><g font-family="Arial,sans-serif" font-size="13" fill="#17263d"><text x="12" y="19">Android reference</text><text x="439" y="19">Browser reconstruction</text></g></svg>');
 await sharp({create:{width:854,height:980,channels:3,background:'#fff'}}).composite([{input:header,left:0,top:0},{input:a,left:0,top:28},{input:b,left:427,top:28}]).png().toFile(`${comparisonDir}/${web}.png`);
}
const report = {
 createdAt:new Date().toISOString(),project:path.resolve('.'),head:head.trim(),committed:false,pushed:false,
 preview:'http://127.0.0.1:4173',networkAddresses:addresses,
 buildId:(await readFile('.next/BUILD_ID','utf8')).trim(),checkExit:0,
 main:{passed:main.checks.length,failed:0,screenshots:main.captures.length,browserErrors:0,report:`${root}/accepted-verification/results.json`},
 gestures:{passed:gestures.checks.length,failed:0,screenshots:gestures.captures.length,browserErrors:0,report:`${root}/gesture-verification/results.json`},
 loanUnitTests:{passed:5,failed:0},catalog:{capturedVehicles:captured.length,totalLocalVehicles:count,liveInventory:false},
 visualReview:{comparisonPairs:pairs.length,directory:comparisonDir,exhaustivePixelParityAccepted:false},
 remaining:['Native Similar Cars To Compare table and comparison flow','Detail promotional carousel and inspection video playback','Exact typography, spacing and transitions across all states','Other vehicle-specific galleries and reports','Authenticated account and transaction screens'],
 disconnected:['OTP','payments','real bookings','credit checks','live inventory'],sourceHashes,
};
const reportFile='docs/CARS24-PARITY-RESULTS.json', docFile='docs/CARS24-PARITY.md';
const expectedReport='6240a8d80cc139eab98a71ea1a8ccd7b88070fead047256beca0924e0689ad47',expectedDoc='a49fd49300821af7cb63020b81bd114c91e15e1f3d915e2b6db06e12bbc15a55';
if(createHash('sha256').update(await readFile(reportFile)).digest('hex')!==expectedReport || createHash('sha256').update(await readFile(docFile)).digest('hex')!==expectedDoc)throw Error('Evidence documents changed; reconcile before replacement');
await writeFile(reportFile,JSON.stringify(report,null,2)+'\n');
await writeFile(docFile,`# CARS24 UAE reconstruction — current working record

## Checkout

Existing repository: L:\\cars-app, branch main, base ${head.trim()}.
The original Next.js / React / TypeScript / StyleX stack and earlier uncommitted work remain intact. No reset, clean, repository migration, commit, push or deployment was performed in this continuation. This is the owner's local reference reconstruction, not an official Cars24 service.

## Current verified build

- Production build ID: ${report.buildId}.
- npm run check: passed (lint, type checking, production build).
- Main browser suite: ${report.main.passed} passing checks, ${report.main.screenshots} screenshots, zero runtime/console/HTTP errors.
- Touch/gesture suite: ${report.gestures.passed} passing checks; physical swipe, two-finger image pinch, Back dismissal and scroll restoration verified.
- Reference-loan unit tests: 5 passed.
- Viewports: 390×844, 427×952, 768×1024 and 1440×1000.

The main suite verifies local interactions and layout safety. It is not proof of exhaustive pixel identity. Five paired Android/browser comparisons are saved in ${comparisonDir}.

## Work completed in this continuation

Connected the native-style gallery route to the detail thumbnails; reconstructed the continuous Exterior / Interior / Features gallery, all 17 Fortuner photographs, photo labels and fixed booking CTA. Added a shared black photo viewer with keyboard arrows, physical swipe, image-only pinch zoom, panning, zoom reset and modal Back behavior.

Fixed the missing report-assurance artwork, removed inspection sections not present in the captured native report, and matched the six recorded groups and the expandable exterior checkpoints. Added all 16 captured equipment items, including ABS and Entertainment.

Reconstructed the Fortuner service timeline and its two captured service records, service banner and due-service note. Added the below-fold finance section with the reference banner, lender strip, deposit slider and tenure controls. The sheet and inline calculator share one checked domain function; the default now rounds to AED 1,430 rather than AED 1,429.

Corrected detail section-anchor spacing, orange header controls, selected-tab scrolling and the captured wishlist-count strip. Corrected the EMI test's invalid expression and separated sorting setup from intentionally restored filters.

The existing home/search, 13 filters, saved/recent cars, selling wizard, service selection/cart/login, finance budget calculator and benefit screens were regression-tested after these changes.

## Data and acceptance boundaries

The local catalog contains ${captured.length} captured reference cars and ${count} total merged fixtures. Unfiltered totals such as 1,644 and 195 reproduce earlier captured headings, not the size of the local dataset. Filtered totals refer to actual local matches.

This is NOT a complete 1:1 acceptance. The native Similar Cars To Compare table/flow, lower detail promotional carousel, inspection video playback, other vehicle-specific galleries/reports, and authenticated account/transaction screens remain unfinished. Fine typography, spacing and transition differences remain subject to visual review. Captured inspection and finance text is reference presentation, not independent verification or a financial offer.

OTP, payments, live bookings, credit checks and inventory synchronization remain disconnected. No credentials, phone verification, payment or real appointment was submitted. Marketing images and logos are local reference assets; this record does not establish commercial redistribution rights.

## Reproduce verification

Use the installed Node 22.20.0 runtime. Stop only the verified cars-app preview before rebuilding; do not build over a running production server's output.

~~~powershell
Set-Location L:\\cars-app
npm.cmd run check
npm.cmd run qa:loan
npm.cmd run start -- --hostname 0.0.0.0 --port 4173
# Another terminal, while this preview is running:
npm.cmd run qa:parity
node scripts/verify-photo-gestures.mjs
~~~

The preview is http://127.0.0.1:4173 on the PC. Current non-loopback interfaces: ${addresses.join(', ')}.

Current evidence: ${root}/accepted-check.log, accepted-verify.log, accepted-gestures.log, loan-tests.log and docs/CARS24-PARITY-RESULTS.json. Older captures/logs were retained. The earlier development/HMR problem is not claimed fixed; this verification uses a fresh production build.
`);
console.log(JSON.stringify({buildId:report.buildId,main:report.main,gestures:report.gestures,loanUnitTests:report.loanUnitTests,catalog:report.catalog,addresses,comparisons:comparisonDir},null,2));
