import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex');
const prefix='auto-best/';
const condition="brand.phone && brand.phoneHref !== 'tel:'";
export const AUTO_BEST_PHONE_BOUNDARIES=Object.freeze({
 'src/lib/components/layout/Header.svelte':3,
 'src/lib/components/layout/Footer.svelte':1,
 'src/lib/components/layout/MobileMenu.svelte':1,
 'src/lib/components/company/ContactHero.svelte':1,
 'src/lib/components/company/ContactIntent.svelte':5,
 'src/lib/components/company/DesktopShowroom.svelte':1,
 'src/lib/components/company/TradeInEnquiry.svelte':1,
 'src/lib/components/company/WorkflowSupport.svelte':1,
 'src/lib/components/editorial/ArticleSupport.svelte':1,
 'src/routes/listing-detail-v1/[id]/+page.svelte':2
});
const read=(files,name)=>{const bytes=files.get(name);if(!Buffer.isBuffer(bytes)&&typeof bytes!=='string')throw Error('Missing Auto optional telephone consumer: '+name);return String(bytes);};
function openingEnd(source,start){
 let braces=0,quote='';
 for(let at=start;at<source.length;at++){
  const ch=source[at];
  if(quote){if(ch==='\\')at++;else if(ch===quote)quote='';}
  else if(ch==='"'||ch==="'"||ch==='`')quote=ch;
  else if(ch==='{')braces++;
  else if(ch==='}')braces--;
  else if(ch==='>'&&braces===0)return at+1;
  if(braces<0)break;
 }
 throw Error('Auto telephone opening tag changed');
}
/** Adapt the named native phone controls only; no CSS, form or contact fact changes. */
export function guardAutoBestUnavailablePhoneActions(source,{name,expected}){
 const script=source.indexOf('</script>');
 if(script<0||script!==source.lastIndexOf('</script>')||source.includes('{#if '+condition+'}'))throw Error('Auto telephone source boundary changed: '+name);
 const pattern=/<a\b/g,edits=[];pattern.lastIndex=script+9;let match;
 while((match=pattern.exec(source))){
  const start=match.index,opened=openingEnd(source,start),opening=source.slice(start,opened);
  const close=source.indexOf('</a>',opened);if(close<0)throw Error('Auto telephone anchor changed: '+name);
  const end=close+4;pattern.lastIndex=end;
  if(!/href=\{(?:brand\.phoneHref|i18n\.href\(brand\.phoneHref\))\}|\{\.\.\.phoneLinkAttributes\}/.test(opening))continue;
  edits.push({start,end});
 }
 if(edits.length!==expected)throw Error('Auto telephone consumer count changed: '+name+' ('+edits.length+' !== '+expected+')');
 if(name===prefix+'src/lib/components/layout/Header.svelte'){
  const first=edits[0],liStart=source.lastIndexOf('<li>',first.start),liEnd=source.indexOf('</li>',first.end);
  if(liStart<script||liEnd!==first.end||!source.slice(liStart,first.start).includes('<Icon name="phone"'))throw Error('Auto topbar telephone row changed');
  first.start=liStart;first.end=liEnd+5;
 }
 let after=source;
 for(const edit of edits.reverse())after=after.slice(0,edit.start)+'{#if '+condition+'}'+after.slice(edit.start,edit.end)+'{/if}'+after.slice(edit.end);
 return {source:after,telephoneActions:edits.length};
}
/** A normalized absent telephone stays absent in every reviewed Auto consumer.
 * Existing GB callers retain their behavior; other markets require pack opt-in. */
export function applyAutoBestOptionalContactFallback(files,manifest,{profile,factPolicy}={}){
 if(profile?.business?.countryCode!=='GB'&&factPolicy!=='dealer-pack-optional-v1')return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Other market source preserved'};
 const b=profile.business,phone=[b.phoneDisplay,b.phoneHref,b.phoneE164];
 if(phone.some(value=>typeof value!=='string'))throw Error('Expected normalized Auto telephone facts');
 if(phone.some(Boolean)){
  if(!phone.every(Boolean)||!/^tel:\+[1-9]\d{6,14}$/.test(b.phoneHref))throw Error('Incomplete published Auto telephone facts');
  return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Existing sourced telephone preserved'};
 }
 const brandPath=prefix+'src/lib/config/brand.ts',brand=files.get(brandPath),brandText=read(files,brandPath);
 for(const [field,value]of [['phone',''],['phoneHref','tel:']]){
  const matches=[...brandText.matchAll(new RegExp('^  '+field+': ("[^"\\r\\n]*"),','gm'))];
  if(matches.length!==1||JSON.parse(matches[0][1])!==value)throw Error('Auto telephone differs from normalized facts: '+field);
 }
 const updates=new Map();let telephoneActionsHidden=0;
 for(const [relative,expected]of Object.entries(AUTO_BEST_PHONE_BOUNDARIES)){
  const name=prefix+relative,result=guardAutoBestUnavailablePhoneActions(read(files,name),{name,expected});
  updates.set(name,Buffer.from(result.source));telephoneActionsHidden+=result.telephoneActions;
 }
 const navigationPath=prefix+'src/lib/data/navigation.ts',navigation=read(files,navigationPath);
 const row="{ id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }";
 if(navigation.split(row).length!==2)throw Error('Auto navigation telephone row changed');
 updates.set(navigationPath,Buffer.from(navigation.replace(row,'...('+condition+' ? ['+row+'] : [])')));
 const changes=[...updates].map(([name,after])=>({path:name,beforeSha256:hash(files.get(name)),afterSha256:hash(after)}));
 for(const [name,after]of updates)files.set(name,after);
 if(files.get(brandPath)!==brand)throw Error('Auto factual telephone source changed');
 return {schemaVersion:1,dealer:manifest.slug,applied:true,kind:'cars-absent-auto-best-telephone-consumers',telephoneActionsHidden,navigationRowsHidden:1,changes,originalDealerConfigSha256:hash(brand),phoneInvented:false,dealerFactsChanged:false};
}
