/** Manual-quality release decision for source logos and six rendered dealer designs.
 * Technical image checks alone cannot establish legible lettering or correct identity.
 * A missing or incomplete receipt fails CLOSED; a previously issued screenshot receipt
 * pins a complete reference grid; each native run hashes and checks its own 18 captures.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {SIX_DESIGN_KEYS} from './six-design-release.mjs';

export const REVIEW_PATH='branding/logo-quality-review.json';
export const REVIEW_DESIGNS=Object.freeze([...SIX_DESIGN_KEYS]);
export const REVIEW_WIDTHS=Object.freeze([320,390,1280]);

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const hex64=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const exactName=value=>String(value??'').normalize('NFC').trim().replace(/\s+/g,' ');
const utcDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)&&Number.isFinite(Date.parse(value));
const boolChecks=Object.freeze(['correctDealerName','legibleLettering','wordmarkProportions','transparentSurfaces','compactMarkIndependentlyLegible','contrast','safePadding','noBackgroundBox','noStretch','noClipping','noAwkwardTypography']);
const bounds=(value,min,max)=>Number.isSafeInteger(value)&&value>=min&&value<=max;

/** Accept only committed pack input bytes. Runtime output is never logo evidence. */
function packBytes(pack,name){
  if(!/^(?:branding\/)[a-zA-Z0-9/_\-.]+$/.test(name)||name.includes('..')||name.includes('//'))return null;
  if(pack?.files instanceof Map)return pack.files.get(name)??null;
  try {return fs.readFileSync(path.join(pack.directory,name));}catch{return null;}
}
function parseReceipt(pack){
  const bytes=packBytes(pack,REVIEW_PATH);
  if(!bytes||bytes.length>64000)return null;
  try{return JSON.parse(bytes.toString('utf8'));}catch{return null;}
}
const fail=(findings)=>({status:'failed',findings:[...new Set(findings)],dealerApproval:false,visualReviewPerformed:false});

/**
 * Require an exact source/contract hash, real committed contact sheet, and an
 * explicit dated image-by-image decision. This is NOT dealer adoption/approval.
 * Do not auto-create this file during an automated build or infer it from image
 * dimensions; a visual reviewer must supply it after inspecting the artwork.
 */
export function assessLogoQualityDecision({pack,contract=pack?.branding,screenshots}={}){
  const findings=[],review=parseReceipt(pack),dealer=pack?.manifest?.slug,displayName=exactName(pack?.facts?.business?.name);
  if(!review)return fail(['logo-quality-review-missing']);
  if(review.schemaVersion!==1||review.dealer!==dealer||exactName(review.displayName)!==displayName||!displayName)
    findings.push('logo-review-wrong-dealer-or-name');
  if(review.decision!=='pass'||!['agent-visual-review','human-visual-review'].includes(review.reviewer?.kind)||!utcDate(review.reviewer?.reviewedAt))
    findings.push('logo-review-decision-or-reviewer-missing');
  if(review.dealerApproved!==false||!['retained-dealer-identity','independent-website-proposal'].includes(review.identity?.kind)||
     review.identity?.exactDealerNameVerified!==true||review.identity?.dealerAdoptionClaimed!==false)
    findings.push('logo-review-approval-or-identity');
  for(const name of boolChecks)if(review.checks?.[name]!==true)findings.push('logo-review-check:'+name);
  if(!Array.isArray(review.surfacesReviewed)||JSON.stringify([...review.surfacesReviewed].sort())!==JSON.stringify(['onAccent','onDark','onLight']))
    findings.push('logo-review-surfaces');
  if(!Array.isArray(review.smallSizesReviewed)||JSON.stringify([...review.smallSizesReviewed].sort((a,b)=>a-b))!==JSON.stringify([32,48,64]))
    findings.push('logo-review-small-sizes');
  if(!Array.isArray(review.notes)||!review.notes.length||!review.notes.every(value=>typeof value==='string'&&value.trim().length>=8&&value.length<=500))
    findings.push('logo-review-notes');
  for(const [name,expected] of [['branding/source.json',review.sourceSha256],['branding/logo-contract.json',review.contractSha256]]){
    const bytes=packBytes(pack,name);
    if(!hex64(expected)||!bytes||hash(bytes)!==expected)findings.push('logo-review-stale:'+name);
  }
  const sheet=review.contactSheet;
  if(!sheet||!/^branding\/qa\/[a-z0-9-]+\.png$/.test(sheet.path??'')||!hex64(sheet.sha256))
    findings.push('logo-review-contact-sheet');
  else {
    const bytes=packBytes(pack,sheet.path);
    if(!bytes||hash(bytes)!==sheet.sha256||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))
      findings.push('logo-review-contact-sheet-hash');
    else if(bytes.length<2048||bytes.length<33||bytes.readUInt32BE(8)!==13||bytes.subarray(12,16).toString('ascii')!=='IHDR')
      findings.push('logo-review-contact-sheet-empty');
    else if(bytes.readUInt32BE(16)<640||bytes.readUInt32BE(16)>8192||bytes.readUInt32BE(20)<480||bytes.readUInt32BE(20)>8192)
      findings.push('logo-review-contact-sheet-dimensions');
  }
  // The committed visual decision binds a reviewed 18-view reference grid to
  // the exact source, logo contract and contact sheet. It is mandatory even
  // during preflight, before a native browser exists.
  const reviewed=review.sixDesignScreens,expected=new Map();
  if(!Array.isArray(reviewed)||reviewed.length!==REVIEW_DESIGNS.length*REVIEW_WIDTHS.length)
    findings.push('logo-review-six-design-evidence-incomplete');
  else {
    for(const row of reviewed){
      const key=row?.key+':'+row?.width;
      if(!REVIEW_DESIGNS.includes(row?.key)||!REVIEW_WIDTHS.includes(row?.width)||expected.has(key)||
         !hex64(row?.sha256)||row?.decision!=='pass'||!utcDate(row?.reviewedAt)){
        findings.push('logo-review-six-design-invalid');continue;
      }
      expected.set(key,row);
    }
    for(const design of REVIEW_DESIGNS)for(const width of REVIEW_WIDTHS)
      if(!expected.has(design+':'+width))findings.push('logo-review-six-design-evidence-incomplete');
  }
  // A fresh native run MUST render and hash its own complete 18-image grid.
  // Full-page browser captures are not reproducible byte-for-byte across runs:
  // lazy images, hydration, carousels, antialiasing and animation timing vary.
  // Equating a new run's PNG SHA with an older committed review would force an
  // unending receipt -> pack change -> rebuild -> new PNG SHA cycle.
  // The independent visual signoff remains source-bound; actual current-run
  // pages, identity/logo bytes, welcome flow and visual evidence are checked
  // in the native verifier, and its own screenshot bytes are authenticated by
  // the transport/deployment guard. Never infer a NEW human visual review.
  if(screenshots!==undefined){
    const actual=Array.isArray(screenshots)?screenshots:[],seen=new Set();
    if(actual.length!==REVIEW_DESIGNS.length*REVIEW_WIDTHS.length)
      findings.push('logo-review-run-screenshots-incomplete');
    for(const row of actual){
      const key=row?.key+':'+row?.width;
      if(!expected.has(key)||seen.has(key)||row?.route!=='home'||!hex64(row?.sha256))
        findings.push('logo-review-run-screenshot-invalid:'+key);
      seen.add(key);
    }
    for(const design of REVIEW_DESIGNS)for(const width of REVIEW_WIDTHS)
      if(!seen.has(design+':'+width))findings.push('logo-review-run-screenshots-incomplete');
  }
  return {status:findings.length?'failed':'passed',findings:[...new Set(findings)],
    dealerApproval:false,visualReviewPerformed:findings.length===0,
    reviewerKind:review.reviewer?.kind??null,reviewedAt:review.reviewer?.reviewedAt??null,
    identityKind:review.identity?.kind??null,sourceSha256:review.sourceSha256??null,contractSha256:review.contractSha256??null,
    contactSheetPath:sheet?.path??null,contactSheetSha256:sheet?.sha256??null,
    screenshotCount:screenshots===undefined?null:(Array.isArray(review.sixDesignScreens)?review.sixDesignScreens.length:0),
    currentRunHumanReview:false,runScreenshotBinding:screenshots===undefined?'not-captured':'current-run-authenticated',
    note:'Source/contract-bound independent visual decision and 18 reviewed reference homes; every native run authenticates its own 18 fresh rendered homes. PNG bytes are not cross-run signatures; no new human or dealer approval is implied.'};
}
