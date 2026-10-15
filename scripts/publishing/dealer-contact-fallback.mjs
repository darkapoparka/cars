import {applyAutoBestOptionalContactFallback} from './auto-best-optional-contact.mjs';
import {createHash} from 'node:crypto';
const hash=v=>createHash('sha256').update(v).digest('hex');
/** Missing email is not a dealer fact. The public contact link may instead open
 * this same demonstration's existing contact page without changing emailHref.
 */
function applyImportOptionalContactFallback(files,manifest){
 const config='import/src/lib/config/dealer.ts',site='import/src/lib/config/site.ts';
 if(!files.has(config)||!files.has(site))throw Error('Missing Import contact config');
 const original=files.get(config),text=String(original),matches=[...text.matchAll(/^[ \t]*"emailHref":\s*"([^"\r\n]*)",?$/gm)];
 if(matches.length!==1)throw Error('Unrecognized dealer email boundary');
 if(matches[0][1])return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Existing sourced contact preserved'};
 const origin=new URL(manifest.shareIdentity.publicOrigin),variant=manifest.variants.find(v=>v.key==='import'),locale=manifest.localization.defaultLocale;
 if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash||!variant||!['/variant-2','/variant-3'].includes(variant.base)||!['bg','en'].includes(locale))throw Error('Invalid existing contact route');
 const href=origin.origin+variant.base+'/'+locale+'/contact',before=files.get(site),source=String(before),token='contactHref: daynightContact.emailHref,';
 if(source.split(token).length!==2)throw Error('Import contact consumer changed');
 const after=Buffer.from(source.replace(token,'contactHref: daynightContact.emailHref || '+JSON.stringify(href)+','));
 files.set(site,after);if(files.get(config)!==original)throw Error('Dealer contact facts changed');
 return {schemaVersion:1,dealer:manifest.slug,applied:true,path:site,href,beforeSha256:hash(before),afterSha256:hash(after),originalDealerConfigSha256:hash(original),emailInvented:false,mode:'Existing same-origin contact page; no external enquiry submitted'};
}

/** Both native CF and ordinary Vercel packages use the same optional Auto controls.
 * Stage changes together so a changed Import or Auto boundary leaves all input intact. */
export function applyOptionalContactFallback(files,manifest){
 const autoConfig='auto-best/src/lib/config/brand.ts';
 if(manifest.packaging?.version!=='5'||!files.has(autoConfig))return applyImportOptionalContactFallback(files,manifest);
 const profilePath='auto-best/src/lib/data/dealer-profile.json',profileBytes=files.get(profilePath);
 if(!profileBytes)throw Error('Missing normalized Auto contact profile');
 const profile=JSON.parse(String(profileBytes)),draft=new Map(files);
 const autoBestOptionalContact=applyAutoBestOptionalContactFallback(draft,manifest,{profile});
 const receipt=applyImportOptionalContactFallback(draft,manifest);
 for(const [name,bytes]of draft)if(bytes!==files.get(name))files.set(name,bytes);
 return {...receipt,autoBestOptionalContact};
}

export const MODERN_PHONE_BOUNDARIES = Object.freeze({
  "modern/apps/web/app/[locale]/components/dealer-desktop-footer.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/desktop-contact-preview-form.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/footer.tsx": {
    "elements": 2,
    "arrays": 1
  },
  "modern/apps/web/app/[locale]/components/inventory-states.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/mobile-about-contact.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/mobile-dealer-service-hero.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/mobile-financing-form.tsx": {
    "elements": 2,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/mobile-sell-vehicle-details-drawer.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/public-contact-unavailable.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/components/public-marketplace-frame.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/contact/page.tsx": {
    "elements": 2,
    "arrays": 1
  },
  "modern/apps/web/app/[locale]/contact/sell-contact-handoff.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/imports/components/import-request-form.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/sell/page.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/packages/marketplace-ui/components/dealer-bottom-nav.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/packages/marketplace-ui/components/marketplace-masthead.tsx": {
    "elements": 2,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/lease/lease-desktop-controls.tsx": {
    "elements": 1,
    "arrays": 0
  },
  "modern/apps/web/app/[locale]/lease/lease-vehicle-selector.tsx": {
    "elements": 1,
    "arrays": 0
  }
});
const modernSchemaPath='modern/packages/marketplace-domain/site-config.ts';
const modernSitePath='modern/packages/marketplace/site-config.ts';
const modernLeadPath='modern/packages/marketplace/lead-site.ts';
function replaceContactBoundary(source,before,after,name){if(source.split(before).length!==2)throw Error('Modern optional contact boundary changed: '+name);return source.replace(before,()=>after);}
/** The reviewed UK preservation schema already rejects URL credentials and validates absent phones.
 * Keep that exact source policy; adapt only the still-required optional street boundary. */
export function prepareModernOptionalPhoneSchema(schema,{address}={}){
 const reviewedPolicy=hash(Buffer.from(schema))==='8d91c2fb6450378b0700346e99dddc80c1bc6e2266dc30749afeee8b9fedf4a6';
 if(!reviewedPolicy)schema=replaceContactBoundary(schema,'.refine((value) => new URL(value).protocol === "https:", "Use HTTPS");','.refine((value) => { try { return new URL(value).protocol === "https:"; } catch { return false; } }, "Use HTTPS");',modernSchemaPath+' HTTPS validation');
 if(!address)schema=replaceContactBoundary(schema,'address: z.string().trim().min(1).max(300),','address: z.union([z.string().trim().min(1).max(300), z.literal("")]),',modernSchemaPath+' absent address');
 if(!reviewedPolicy)schema=replaceContactBoundary(schema,'phoneDisplay: z.string().trim().min(1).max(40),','phoneDisplay: z.union([z.string().trim().min(1).max(40), z.literal("")]),',modernSchemaPath+' absent phone label');
 if(!reviewedPolicy)schema=replaceContactBoundary(schema,'      phoneHref,','      phoneHref: z.union([phoneHref, z.literal("")]),',modernSchemaPath+' absent telephone');
 if(!reviewedPolicy)schema=replaceContactBoundary(schema,'.superRefine((site, context) => {','.superRefine((site, context) => {\n    if (Boolean(site.contact.phoneHref) !== Boolean(site.contact.phoneDisplay)) context.addIssue({ code: \"custom\", path: [\"contact\", \"phoneHref\"], message: \"A published telephone requires both its label and telephone link\" });',modernSchemaPath+' telephone pair');
 return {source:schema,policy:reviewedPolicy?'retained-reviewed-safe-optional-phone':'prepared-native-optional-phone'};
}

/** Guard only reviewed telephone actions; forms and all unrelated artwork stay in place. */
export function guardModernUnavailablePhoneActions(source,{name,expected,typescript,phoneExpression='leadSite.phoneHref'}){
 if(!typescript?.createSourceFile)throw Error('Modern optional contact requires the installed TypeScript parser');
 const t=typescript,sf=t.createSourceFile(name,source,t.ScriptTarget.Latest,true,t.ScriptKind.TSX),edits=[];let elements=0,arrays=0;
 if(sf.parseDiagnostics.length)throw Error('Modern optional contact input syntax changed: '+name);
 const matches=value=>phoneExpression==='phoneHref'?/\bphoneHref\b/.test(value):/leadSite\.phoneHref|contactAction\.href/.test(value);
 function visit(node){
  const open=t.isJsxElement(node)?node.openingElement:t.isJsxSelfClosingElement(node)?node:null;
  if(open&&['a','Link','ButtonLink','DesktopContactPhoneCard'].includes(open.tagName.getText(sf))){
   const href=open.attributes.properties.find(a=>t.isJsxAttribute(a)&&['href','phoneHref'].includes(a.name.getText(sf))&&a.initializer&&matches(a.initializer.getText(sf)));
   if(href){const start=node.getStart(sf),end=node.end,condition=href.initializer.getText(sf).includes('isDealershipSite ?')?'!isDealershipSite || '+phoneExpression:phoneExpression;
    const guarded='('+condition+') ? ('+source.slice(start,end)+') : null',jsxChild=t.isJsxElement(node.parent)||t.isJsxFragment(node.parent);
    edits.push({start,end,after:jsxChild?'{'+guarded+'}':guarded});elements++;}
  }
  if(t.isArrayLiteralExpression(node))for(const item of node.elements){
   const phone=t.isObjectLiteralExpression(item)&&item.properties.some(p=>t.isPropertyAssignment(p)&&p.name.getText(sf)==='href'&&matches(p.initializer.getText(sf)))||phoneExpression==='leadSite.phoneHref'&&t.isIdentifier(item)&&item.text==='contactAction';
   if(phone){const start=item.getStart(sf),end=item.end;edits.push({start,end,after:'...('+phoneExpression+' ? ['+source.slice(start,end)+'] : [])'});arrays++;}
  }
  t.forEachChild(node,visit);
 }
 visit(sf);
 if(elements!==expected.elements||arrays!==expected.arrays)throw Error('Modern optional telephone consumer boundary changed: '+name);
 edits.sort((a,b)=>b.start-a.start);let after=source,previous=source.length;
 for(const e of edits){if(e.end>previous)throw Error('Overlapping Modern telephone consumers: '+name);after=after.slice(0,e.start)+e.after+after.slice(e.end);previous=e.start;}
 const parsed=t.createSourceFile(name,after,t.ScriptTarget.Latest,true,t.ScriptKind.TSX);if(parsed.parseDiagnostics.length)throw Error('Modern optional contact produced invalid TSX: '+name);
 return {source:after,elements,arrays};
}
/** An explicitly absent UK telephone remains absent. Only derived consumers are
 * adapted; no telephone, street, email, inventory, raster or dealer facts are invented. */
export function applyModernOptionalContactFallback(files,manifest,{profile,typescript}={}){
 if(profile?.business?.countryCode!=='GB')return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Other market source preserved'};
 const b=profile.business,phone=[b.phoneDisplay,b.phoneHref,b.phoneE164];
 if(phone.some(x=>typeof x!=='string'))throw Error('Expected normalized Modern telephone facts');
 if(phone.some(Boolean)){if(!phone.every(Boolean)||!/^tel:\+[1-9]\d{6,14}$/.test(b.phoneHref))throw Error('Incomplete published Modern telephone facts');return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Existing sourced telephone preserved'};}
 const lead=files.get(modernLeadPath);if(!Buffer.isBuffer(lead))throw Error('Missing Modern factual contact source');
 for(const [field,value]of [['address',b.address],['phoneDisplay',''],['phoneHref',''],['contactUrl','']]){
  const entries=[...String(lead).matchAll(new RegExp('^  '+field+': ("[^"\\r\\n]*"),','gm'))];
  if(entries.length!==1||JSON.parse(entries[0][1])!==value)throw Error('Modern contact differs from exact normalized facts: '+field);
 }
 const origin=new URL(manifest.shareIdentity.publicOrigin),variant=manifest.variants.find(v=>v.key==='modern'),locale=manifest.localization.defaultLocale;
 if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash||!variant||!['/variant-2','/variant-3'].includes(variant.base)||!['bg','en'].includes(locale))throw Error('Invalid existing Modern contact route');
 const href=origin.origin+variant.base+'/'+locale+'/contact',updates=new Map();let schema=String(files.get(modernSchemaPath)),site=String(files.get(modernSitePath));
 const schemaPreparation=prepareModernOptionalPhoneSchema(schema,{address:b.address});schema=schemaPreparation.source;
 site=replaceContactBoundary(site,'contactUrl: config.contactUrl,','contactUrl: config.contactUrl || '+JSON.stringify(href)+',',modernSitePath+' existing contact route');
 updates.set(modernSchemaPath,Buffer.from(schema));updates.set(modernSitePath,Buffer.from(site));
 let telephoneActionsHidden=0;for(const [name,expected]of Object.entries(MODERN_PHONE_BOUNDARIES)){
  if(!files.has(name))throw Error('Missing reviewed Modern contact consumer: '+name);
  const before=String(files.get(name)),result=guardModernUnavailablePhoneActions(before,{name,expected,typescript,phoneExpression:name.includes('/lease/')?'phoneHref':'leadSite.phoneHref'});
  updates.set(name,Buffer.from(result.source));telephoneActionsHidden+=result.elements+result.arrays;
 }
 const changes=[...updates].map(([name,after])=>({path:name,beforeSha256:hash(files.get(name)),afterSha256:hash(after)}));
 for(const [name,after]of updates)files.set(name,after);
 if(files.get(modernLeadPath)!==lead)throw Error('Modern factual contact source changed');
 return {schemaVersion:1,dealer:manifest.slug,applied:true,kind:'cars-absent-modern-telephone-consumers',href,telephoneActionsHidden,schemaPolicy:schemaPreparation.policy,changes,originalDealerConfigSha256:hash(lead),phoneInvented:false,addressInvented:false,existingContactRouteOnly:true};
}
