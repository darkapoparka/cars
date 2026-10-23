import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {assessLogoQualityDecision,REVIEW_DESIGNS,REVIEW_WIDTHS,REVIEW_PATH} from './lib/dealer-pack-logo-quality.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const tinyPng=()=>{const bytes=Buffer.alloc(3500,17);Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes);bytes.writeUInt32BE(13,8);Buffer.from('IHDR').copy(bytes,12);bytes.writeUInt32BE(800,16);bytes.writeUInt32BE(560,20);return bytes;};
const checks=Object.fromEntries(['correctDealerName','legibleLettering','wordmarkProportions','transparentSurfaces','compactMarkIndependentlyLegible','contrast','safePadding','noBackgroundBox','noStretch','noClipping','noAwkwardTypography'].map(key=>[key,true]));
const views=()=>REVIEW_DESIGNS.flatMap(key=>REVIEW_WIDTHS.map(width=>({key,width,route:'home',sha256:sha(key+width)})));
function fixture(){
 const source=Buffer.from('{"reviewedInputs":{"reviewedAt":"2026-10-22T10:00:00Z"}}\n');
 const contract=Buffer.from('{"schemaVersion":1,"dealer":"honest-motors"}\n');
 const sheet=tinyPng(),screenshots=views();
 const review={schemaVersion:1,dealer:'honest-motors',displayName:'Honest Motors',decision:'pass',
  reviewer:{kind:'agent-visual-review',reviewedAt:'2026-10-22T10:00:00Z'},dealerApproved:false,
  identity:{kind:'independent-website-proposal',exactDealerNameVerified:true,dealerAdoptionClaimed:false},
  sourceSha256:sha(source),contractSha256:sha(contract),
  contactSheet:{path:'branding/qa/logo-contact-sheet.png',sha256:sha(sheet)},
  surfacesReviewed:['onLight','onDark','onAccent'],smallSizesReviewed:[32,48,64],
  checks,notes:['Verified exact name, independent compact symbol, light/dark/accent surfaces and native small-size renders.'],
  sixDesignScreens:screenshots.map(({key,width,sha256})=>({key,width,sha256,decision:'pass',reviewedAt:'2026-10-22T10:00:00Z'}))};
 const files=new Map([['branding/source.json',source],['branding/logo-contract.json',contract],['branding/qa/logo-contact-sheet.png',sheet],
   [REVIEW_PATH,Buffer.from(JSON.stringify(review))]]);
 return {pack:{manifest:{slug:'honest-motors'},facts:{business:{name:'Honest Motors'}},files},review,screenshots};
}

test('a committed 18-view visual review is mandatory; two fresh native runs may hash different PNGs',()=>{
 const {pack,screenshots,review}=fixture();
 assert.equal(assessLogoQualityDecision({pack}).status,'passed','Committed reference review passes preflight');
 const one=assessLogoQualityDecision({pack,screenshots});assert.equal(one.status,'passed');
 const secondRun=screenshots.map(row=>({...row,sha256:sha('second-run:'+row.key+':'+row.width)}));
 const two=assessLogoQualityDecision({pack,screenshots:secondRun});
 assert.equal(two.status,'passed','Same reviewed source, contract and contact sheet must survive a second native capture');
 assert.equal(two.runScreenshotBinding,'current-run-authenticated');
 assert.equal(two.currentRunHumanReview,false,'Native QA does not invent another reviewer');
 assert.notEqual(secondRun[0].sha256,review.sixDesignScreens[0].sha256);
 // Even before a browser starts, removing any of the 18 reviewed reference
 // decisions fails closed. A capture-only proof cannot replace signed-off art.
 review.sixDesignScreens.pop();pack.files.set(REVIEW_PATH,Buffer.from(JSON.stringify(review)));
 assert(assessLogoQualityDecision({pack}).findings.includes('logo-review-six-design-evidence-incomplete'));
 pack.files.delete(REVIEW_PATH);
 assert.deepEqual(assessLogoQualityDecision({pack}).findings,['logo-quality-review-missing']);
});

test('forged signoff, changed source, missing review, or screenshot drift is not a pass',()=>{
 for(const mutate of [
  ({review})=>{review.dealerApproved=true;},
  ({review})=>{review.displayName='Other Motors';},
  ({review})=>{review.checks.compactMarkIndependentlyLegible=false;},
  ({review})=>{review.smallSizesReviewed=[32,64];},
  ({review})=>{review.reviewer.kind='auto-hash-check';},
  ({review})=>{review.sourceSha256='f'.repeat(64);},
  ({review})=>{review.sixDesignScreens.pop();},
  ({review})=>{review.sixDesignScreens[0].decision='hold';},
  ({screenshots})=>{screenshots[0].sha256='not-a-sha256';},
  ({screenshots})=>{screenshots[0].route='contact';},
  ({screenshots})=>{screenshots.pop();},
  ({screenshots})=>{screenshots[0].key=screenshots[1].key;screenshots[0].width=screenshots[1].width;},
  ({pack})=>{pack.files.set('branding/qa/logo-contact-sheet.png',Buffer.from('fake'));},
 ]){
  const caseData=fixture();mutate(caseData);
  caseData.pack.files.set(REVIEW_PATH,Buffer.from(JSON.stringify(caseData.review)));
  const result=assessLogoQualityDecision({pack:caseData.pack,screenshots:caseData.screenshots});
  assert.equal(result.status,'failed',JSON.stringify(result));
 }
});

test('rendered review refuses screenshots from another dealer or an incomplete width/design grid',()=>{
 const {pack,screenshots}=fixture();screenshots[7].key='another-dealer';
 const result=assessLogoQualityDecision({pack,screenshots});
 assert.equal(result.status,'failed');assert(result.findings.some(value=>value.includes('logo-review-run-screenshot-invalid')));
});

test('reference grid rejects duplicated keys and invalid hashes without native screenshots',()=>{
 for(const mutate of [
   rows=>{rows[0].sha256='bad';},
   rows=>{rows[1].key=rows[0].key;rows[1].width=rows[0].width;},
   rows=>{rows[0].reviewedAt='not-a-date';},
   rows=>{rows[0].decision='hold';},
 ]){const {pack,review}=fixture();mutate(review.sixDesignScreens);pack.files.set(REVIEW_PATH,Buffer.from(JSON.stringify(review)));
  assert.equal(assessLogoQualityDecision({pack}).status,'failed','Preflight must require true independent reference evidence');}
});
