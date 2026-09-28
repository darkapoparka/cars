import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='reference/2026-09-26-finish';
const run=JSON.parse(await readFile(root+'/run.json','utf8'));
const buildId=(await readFile('.next/BUILD_ID','utf8')).trim();
if(buildId!==run.buildId||!run.sourceUnchanged||run.results.some(r=>r.exit!==0))throw Error('Unverified build or failed suite');
if((await readFile(root+'/check-exit.txt','utf8')).trim()!=='0')throw Error('Build validation did not pass');
for(const entry of run.sourceHashes)if(createHash('sha256').update(await readFile(entry.path)).digest('hex')!==entry.sha256)throw Error('Source drift: '+entry.path);
const review=await readFile(root+'/visual-review.md','utf8');if(!review.includes(buildId))throw Error('Visual review is missing or belongs to another build');
const pairs=JSON.parse(await readFile(root+'/visuals/pairs.json','utf8'));
const previousText=await readFile('docs/CARS24-PARITY-RESULTS.json','utf8'),previous=JSON.parse(previousText);
for(const [file,sha]of [['docs/CARS24-PARITY.md','c084046ba97dd128dab80bd3004488f756d6c533595556ee27713a33cdd2bd3c'],['docs/CARS24-PARITY-RESULTS.json','e590721966fd7f048b0f5793362346e3dc9bd47d7b8578ddb3d0b82e951513bc']])if(createHash('sha256').update(await readFile(file)).digest('hex')!==sha)throw Error('Documentation changed: '+file);
const loan=await readFile(root+'/loan.log','utf8');if(!/# pass 5\b/.test(loan)||!/# fail 0\b/.test(loan))throw Error('Missing passing loan tests');
const preview=[];for(const url of ['http://127.0.0.1:4173','http://192.168.1.2:4173']){const response=await fetch(url,{signal:AbortSignal.timeout(15000)}),html=await response.text();if(!response.ok||!html.includes(buildId))throw Error('Preview does not serve tested build: '+url);preview.push({url,status:response.status,testedBuildPresent:true});}
const suites=Object.fromEntries(Object.entries(run.suites).map(([name,s])=>[name,{passed:s.passed,failed:s.failed.length,screenshots:s.screenshots,browserErrors:s.browserErrors.length,report:s.report}]));
const total=Object.values(suites).reduce((n,s)=>n+s.passed,5),screenshots=Object.values(suites).reduce((n,s)=>n+s.screenshots,0);
const report={createdAt:new Date().toISOString(),project:'L:\\cars-app',head:previous.head,buildId,checkExit:0,preview:'http://192.168.1.2:4173',previewChecks:preview,committed:false,pushed:false,sourceUnchanged:true,suites,loanUnitTests:{passed:5,failed:0},totalChecks:total,screenshots,coverage:previous.coverage,visualReview:{comparisonPairs:pairs.length,directory:root+'/visuals/pairs',review:root+'/visual-review.md',measuredGuestPolishPassComplete:true,exhaustivePixelParityAccepted:false},completedThisPass:['Measured font identification and native vehicle title, price and dealer typography','Separate reference-matched side-view thumbnails without changing hero media','Native three-tab and four-tab geometry, spacing and heights','Gallery category font and pill widths','EMI sheet top edge, heading position, fixed action and short-screen scrolling'],remaining:previous.remaining,disconnected:previous.disconnected,sourceHashes:run.sourceHashes};
await writeFile(root+'/previous-status.json',previousText);
await writeFile('docs/CARS24-PARITY-RESULTS.json',JSON.stringify(report,null,2)+'\n');
const lines=[
 '# CARS24 UAE — final visual-polish record','',
 '## Current local build','',
 `Checkout: L:\\cars-app, main, base ${report.head}.`,
 `Verified production build: ${buildId}. Preview: http://192.168.1.2:4173.`,
 'Next.js, React, TypeScript and StyleX remain unchanged. All earlier work and inventory fixtures are preserved. No reset, clean, migration, commit, push or public deployment was performed.','',
 '## Final corrections','',
 'The vehicle-heading font was matched against the native raster using 27 font/size/weight candidates. Poppins 600 at 18px matched the native title glyph dimensions; the former Geist 700 face did not. The price, EMI line and dealer strip now use the corresponding legacy-detail typography rather than inheriting the newer discovery-page font.',
 'Exterior category thumbnails now use the captured right-side photograph rather than reusing the hero. Interior selection uses the observed front-door cabin image. Hero photography/video stays unchanged. Three- and four-category rails now match the measured native bounds, without losing responsive behavior.',
 'Gallery category fonts and widths were corrected. The EMI sheet now matches the native 96px top edge, heading location and bottom action position at the reference viewport, with scrolling retained on shorter screens.','',
 '## Acceptance and tests','',
 ...Object.entries(suites).map(([name,s])=>`- ${name}: ${s.passed} passed, ${s.failed} failed, ${s.screenshots} screenshots, ${s.browserErrors} browser errors.`),
 '- Loan calculation unit tests: 5 passed.',
 `- Total: ${total} automated checks and ${screenshots} screenshots. This is not a pixel-parity percentage or count of unique screens.`,
 '- npm run check passed. Application hashes and the build ID were stable during verification and were checked again before recording this result.',
 '- Reference, smaller-phone, tablet and desktop layouts were exercised; the measured visual checks use 427×952 and 3× raster density.',
 `- ${pairs.length} Android/browser pairs: ${root}/visuals/pairs. Manual findings: ${root}/visual-review.md.`,'',
 'This final measured guest-interface polish pass is complete. This does not establish exhaustive pixel identity across every state of the entire Android application. Platform text rasterization/system chrome and changing offer positions are distinguished from layout defects. Authenticated account/transaction screens and the previously documented five legacy fixtures without detailed snapshots remain outside full-app acceptance.',
 'OTP, real bookings, payments, lender decisions and live inventory synchronization remain disconnected. No real account, credit check, payment or appointment was submitted. Reference images and inspection/finance text are captured presentation, not independent certification or a commercial offer.','',
 '## Evidence and reproduction','',
 `Detailed reports, stable source hashes and logs: ${root}.`,
 'Run scripts/finish-build.ps1 to validate and rebuild after stopping only the verified preview owner, then run node scripts/verify-finish.mjs. Do not run a production build over the files of an active production server.',
 'The previous report is preserved in reference/2026-09-26-finish/previous-status.json. Older screenshots and logs remain intact.',''
];
await writeFile('docs/CARS24-PARITY.md',lines.join('\n'));
await writeFile(root+'/summary.json',JSON.stringify({buildId,totalChecks:total,screenshots,suites,preview},null,2));console.log(JSON.stringify({buildId,totalChecks:total,screenshots,suites,preview},null,2));
