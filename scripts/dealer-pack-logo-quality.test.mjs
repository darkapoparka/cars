import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {assessLogoQualityDecision,REVIEW_DESIGNS,REVIEW_WIDTHS,REVIEW_PATH} from './lib/dealer-pack-logo-quality.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const tinyPng=()=>{const bytes=Buffer.alloc(3500,17);Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes);bytes.writeUInt32BE(800,16);bytes.writeUInt32BE(560,20);return bytes;};
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

test('a reviewed source/contact sheet and all 18 exact six-design screenshots are required',()=>{
 const {pack,screenshots}=fixture();
 assert.equal(assessLogoQualityDecision({pack}).status,'passed');
 assert.equal(assessLogoQualityDecision({pack,screenshots}).status,'passed');
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
  ({screenshots})=>{screenshots[0].sha256='e'.repeat(64);},
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
 assert.equal(result.status,'failed');assert(result.findings.some(value=>value.includes('logo-review-six-design-stale')));
});
