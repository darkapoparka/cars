import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const exec = promisify(execFile);
const root = 'reference/2026-09-26-final-pass';
const proof = `${root}/recovery`;
const buildId = (await readFile('.next/BUILD_ID', 'utf8')).trim();
const buildTime = (await stat('.next/BUILD_ID')).mtimeMs;
const run = JSON.parse(await readFile(`${proof}/run.json`, 'utf8'));
if (run.buildId !== buildId || !run.sourceUnchanged || run.results.some(result => result.exit !== 0)) throw Error('Recovery validation is incomplete or failed');
const suites = {};
for (const [name, directory] of Object.entries({regression:'regression', newFlows:'new-flows', vehicleCoverage:'vehicle-coverage', gestures:'gestures'})) {
  const file = `${proof}/${directory}/results.json`;
  const result = JSON.parse(await readFile(file, 'utf8'));
  if (!result.checks.length || result.checks.some(check => !check.passed) || result.errors.length) throw Error(`Unresolved ${name} validation failures`);
  if (Date.parse(result.createdAt) < buildTime) throw Error(`${name} predates the active build`);
  suites[name] = {passed:result.checks.length, failed:0, screenshots:result.captures.length, browserErrors:0, createdAt:result.createdAt, report:file};
}
if ((await readFile(`${root}/check-exit.txt`, 'utf8')).trim() !== '0') throw Error('Production check did not pass');
const loan = await readFile(`${proof}/loan.log`, 'utf8');
if (!/# pass 5\b/.test(loan) || !/# fail 0\b/.test(loan)) throw Error('Loan tests did not pass');
const {stdout:head} = await exec('git', ['rev-parse', 'HEAD']);
const sourceHashes = await Promise.all(run.sourceHashes.map(async item => ({path:item.path, sha256:createHash('sha256').update(await readFile(item.path)).digest('hex')})));
if (sourceHashes.length < 30 || JSON.stringify(sourceHashes) !== JSON.stringify(run.sourceHashes)) throw Error('Source differs from the verified application');
const data = JSON.parse(await readFile('lib/captured-vehicle-details.json', 'utf8'));
const manifest = JSON.parse(await readFile(`${root}/vehicle-details/manifest.json`, 'utf8'));
const coverage = {
  capturedListingDetails:Object.keys(data).length,
  galleryImages:new Set(Object.values(data).flatMap(detail => detail.gallery.map(photo => photo.src))).size,
  videoTours:Object.values(data).filter(detail => detail.videoTour).length,
  inspectionCheckpoints:Object.values(data).reduce((n,detail) => n + detail.inspection.flatMap(section => section.groups).reduce((m,group) => m + group.items.length,0),0),
  featureEntries:Object.values(data).reduce((n,detail) => n + detail.featureGroups.reduce((m,group) => m + group.items.length,0),0),
  sourceFailures:manifest.results.filter(result => result.status === 'unavailable').length,
  liveInventory:false,
};
const pairs = [
  ['similar-entry','new-flows/similar-entry','final-similar-entry-ready'],
  ['similar-comparison','new-flows/similar-comparison','final-similar-top'],
  ['exchange-coupon','new-flows/exchange-coupon','final-offer-action'],
  ['interest-offer','new-flows/interest-offer','final-interest-sheet'],
  ['customer-stories','new-flows/customer-stories','final-customers'],
  ['ciaz-detail','vehicle-coverage/ciaz-detail','final-ciaz-ready'],
  ['airbag-information','vehicle-coverage/airbag-information','final-airbag-information'],
  ['ciaz-tyre-life','vehicle-coverage/ciaz-tyre-life','final-ciaz-tyre-life'],
  ['gallery-exterior','regression/gallery-exterior','native-gallery-exteriors'],
  ['price-breakdown','regression/price-breakdown','price-breakdown-confirmed'],
  ['emi-plans','regression/emi-plans','emi-confirmed'],
  ['service-history','regression/detail-service-history','resume-service-history'],
];
const pairDir = `${proof}/comparisons`;
await mkdir(pairDir, {recursive:true});
const header = Buffer.from('<svg width="854" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="854" height="28" fill="white"/><g font-family="Arial" font-size="13" fill="#17263d"><text x="12" y="19">Android reference</text><text x="439" y="19">Browser reconstruction</text></g></svg>');
for (const [name,web,native] of pairs) {
  const a = await sharp(`reference/2026-09-26-continuation/${native}-427.png`).png().toBuffer();
  const b = await sharp(`${proof}/${web}.png`).png().toBuffer();
  await sharp({create:{width:854,height:980,channels:3,background:'#fff'}}).composite([{input:header,left:0,top:0},{input:a,left:0,top:28},{input:b,left:427,top:28}]).png().toFile(`${pairDir}/${name}.png`);
}
await writeFile(`${pairDir}/pairs.json`, JSON.stringify(pairs.map(([name,web,native]) => ({comparison:`${pairDir}/${name}.png`,browser:`${proof}/${web}.png`,native:`reference/2026-09-26-continuation/${native}-427.png`})),null,2));
const previewChecks = [];
for (const base of ['http://127.0.0.1:4173','http://192.168.1.2:4173']) {
  const response = await fetch(base, {signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw Error(`Preview unavailable: ${base} ${response.status}`);
  previewChecks.push({url:base,status:response.status});
}
const report = {
  createdAt:new Date().toISOString(), project:path.resolve('.'), head:head.trim(), buildId, checkExit:0,
  preview:'http://192.168.1.2:4173', previewChecks, committed:false, pushed:false,
  suites, loanUnitTests:{passed:5,failed:0}, coverage,
  totalChecks:Object.values(suites).reduce((n,suite) => n + suite.passed,0) + 5,
  screenshots:Object.values(suites).reduce((n,suite) => n + suite.screenshots,0),
  visualReview:{comparisonPairs:pairs.length,directory:pairDir,exhaustivePixelParityAccepted:false},
  closedImplementationGaps:[
    'Native Similar Cars entry sheet and three-car comparison table',
    'Rotating detail offers, exchange coupon, cash login and interest terms',
    'Actual inspection and five customer testimonial video clips',
    'Per-vehicle galleries, equipment, fees, service histories and inspection trees for captured snapshots',
    'Source-backed vehicle video tours',
    'Structural VIN copy and feature/specification information sheets',
    'Prime/Luxe layouts, visible inspection imperfections and recorded tyre measurements',
  ],
  remaining:[
    'Exhaustive pixel and transition identity across every native state is not established',
    'Five preserved legacy fixtures lack a newly captured detailed listing',
    'Authenticated account and transaction interfaces are outside the verified guest flows',
  ],
  disconnected:['OTP','live inventory synchronization','real bookings','payments','lender decisions'],
  sourceHashes,
};
const document = `# CARS24 UAE reconstruction — current verification record

## Checkout and preview

Existing checkout: L:\\cars-app, branch main, base ${head.trim()}.
Production build: ${buildId}. Preview: http://192.168.1.2:4173.
The existing Next.js, React, TypeScript and StyleX implementation is preserved. No reset, clean, migration, commit, push or deployment was performed in this recovery. This is a local reference reconstruction, not an official Cars24 service.

## Recovery of the interrupted pass

The earlier run saved the implementation and a successful production build, plus passing new-flow and vehicle-coverage reports. Its regression and gesture reports predated that last build, and its verification documentation was not finalized. The cause of the ChatGPT execution failure is unknown; it is not diagnosed as an application failure.

All four suites have now been rerun against the same active build. Application source hashes were captured before and after the tests and were unchanged. Old evidence is preserved. New results are under ${proof}.

## Completed implementation gaps

The native VIEW SIMILAR CARS entry opens the reconstructed sheet. Similar Cars and Similar Cars To Compare contain their own carousel, vehicle links and three-column specification table. The Fortuner comparison uses the selected vehicle, Jeep and second Fortuner from the captured reference.

Detail offers rotate and support manual selection/swipe, interest-benefit terms, the TRADEINCAR coupon and cash-offer login entry. Inspection video and five customer testimonial clips use real local media; playback, decoded frames, pause, seeking and offscreen pausing are tested. There are ${coverage.videoTours} vehicle-specific video tours.

There are ${coverage.capturedListingDetails} detailed listing snapshots, ${coverage.galleryImages} gallery photographs, ${coverage.inspectionCheckpoints} inspection checkpoints and ${coverage.featureEntries} equipment entries. Vehicle-specific fees, VINs, service records, inspection findings and tyre measurements are retained rather than copied from the Fortuner. The complete dataset stays behind server-route boundaries; each client receives its selected vehicle's snapshot.

## Validation on the current build

| Suite | Passing checks | Screenshots |
| --- | ---: | ---: |
| Existing regression | ${suites.regression.passed} | ${suites.regression.screenshots} |
| Comparison, offers and media | ${suites.newFlows.passed} | ${suites.newFlows.screenshots} |
| Captured data and vehicle routes | ${suites.vehicleCoverage.passed} | ${suites.vehicleCoverage.screenshots} |
| Physical photo gestures | ${suites.gestures.passed} | ${suites.gestures.screenshots} |
| Loan calculation unit tests | 5 | — |

The production check passed. Lint and TypeScript were rechecked during recovery. These results include 172 detail/gallery/features/inspection route responses. No exceptions, console errors or failed HTTP responses were recorded by the browser suites. Viewports cover 390×844, 427×952, 768×1024 and 1440×1000. These are checks, not a count of unique screens or a pixel-identity score.

## Visual evidence and acceptance boundaries

${pairs.length} side-by-side Android/browser comparisons are saved in ${pairDir}. Native evidence is from emulator-5554, com.cars24.uaeusedcars. Browser captures are interactive React interfaces, not flattened screenshots.

The previously named comparison, offers, video and vehicle-detail implementation gaps are closed in the tested guest flows. Full-app 1:1 acceptance is still NOT established: small typography/icon/photo-framing and transition differences remain subject to per-state review; authenticated account and transaction interfaces are not verified. Five preserved legacy fixtures do not have new detailed snapshots. Unfiltered headings such as 1,644/195 reproduce earlier reference captures, not live inventory totals.

OTP, real bookings, payments, lender decisions and inventory synchronization are disconnected. No real account, credit check, payment or appointment was submitted. Captured inspection/finance claims are reference presentation, not independent certification or a financial offer. Asset manifests do not establish commercial redistribution rights.

## Reproduce verification

Use the installed Node 22.20.0 runtime. Never rebuild over a running production preview's output.

~~~powershell
Set-Location L:\\cars-app
# With the verified production preview already running:
node scripts/verify-recovery.mjs
~~~

Current detailed reports, logs and source fingerprints: ${proof}.
Current machine-readable record: docs/CARS24-PARITY-RESULTS.json.
The old development/HMR path is not claimed fixed; this evidence is for the production preview.
`;
const docPath = 'docs/CARS24-PARITY.md', resultPath = 'docs/CARS24-PARITY-RESULTS.json';
const expected = [[docPath,'df24d9b1210046d97eb90f2b2b9532c8e283f8098bce956c4cc3fe1472d85b86'],[resultPath,'770aad89ca3253eb2323de9e09d45eb00eee076293d12f75f8c25d2ddb00504b']];
for (const [file, sha] of expected) {
  const bytes = await readFile(file);
  if (createHash('sha256').update(bytes).digest('hex') !== sha) throw Error(`Evidence document changed: ${file}`);
  await writeFile(`${proof}/previous-${path.basename(file)}`, bytes, {flag:'wx'});
}
await writeFile(resultPath, JSON.stringify(report,null,2) + '\n');
await writeFile(docPath, document);
await writeFile(`${proof}/verification-summary.json`, JSON.stringify(report,null,2) + '\n');
JSON.parse(await readFile(resultPath,'utf8'));
console.log(JSON.stringify({buildId,suites,coverage,totalChecks:report.totalChecks,screenshots:report.screenshots,comparisons:pairs.length,previewChecks},null,2));
