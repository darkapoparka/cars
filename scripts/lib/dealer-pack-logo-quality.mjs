/** Manual-quality release decision for source logos and six rendered dealer designs.
 * Technical image checks alone cannot establish legible lettering or correct identity.
 * A missing or incomplete receipt fails CLOSED; a previously issued screenshot receipt
 * must match the actual 18 screenshots captured by native QA on this run.
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
export function assessLogoQualityDecision({pack,contract=pack?.branding,screenshots,sharpMetadata}={}){
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
    else if(bytes.length<2048) findings.push('logo-review-contact-sheet-empty');
    if(sharpMetadata&&bytes){const meta=sharpMetadata(bytes);if(meta?.width<640||meta?.height<480)findings.push('logo-review-contact-sheet-too-small');}
  }
  if(screenshots!==undefined){
    const actual=Array.isArray(screenshots)?screenshots:[],reviewed=review.sixDesignScreens;
    if(!Array.isArray(reviewed)||reviewed.length!==REVIEW_DESIGNS.length*REVIEW_WIDTHS.length||actual.length!==REVIEW_DESIGNS.length*REVIEW_WIDTHS.length)
      findings.push('logo-review-six-design-evidence-incomplete');
    else {
      const expected=new Map();
      for(const row of reviewed){
        const key=row?.key+':'+row?.width;
        if(!REVIEW_DESIGNS.includes(row?.key)||!REVIEW_WIDTHS.includes(row?.width)||expected.has(key)||!hex64(row.sha256)||row.decision!=='pass'||!utcDate(row.reviewedAt)){
          findings.push('logo-review-six-design-invalid');continue;
        }
        expected.set(key,row);
      }
      for(const row of actual){
        const key=row?.key+':'+row?.width,matched=expected.get(key);
        if(!matched||row.route!=='home'||matched.sha256!==row.sha256)
          findings.push('logo-review-six-design-stale:'+key);
      }
    }
  }
  return {status:findings.length?'failed':'passed',findings:[...new Set(findings)],
    dealerApproval:false,visualReviewPerformed:findings.length===0,
    reviewerKind:review.reviewer?.kind??null,reviewedAt:review.reviewer?.reviewedAt??null,
    identityKind:review.identity?.kind??null,sourceSha256:review.sourceSha256??null,contractSha256:review.contractSha256??null,
    contactSheetSha256:sheet?.sha256??null,
    screenshotCount:screenshots===undefined?null:(Array.isArray(review.sixDesignScreens)?review.sixDesignScreens.length:0),
    note:'Independent visual decision with exact source, reviewed contact sheet, 32/48/64 marks and 18 matching rendered homes; never dealer approval.'};
}
