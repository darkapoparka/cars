import test from 'node:test';import assert from 'node:assert/strict';import {applyOptionalContactFallback} from './publishing/dealer-contact-fallback.mjs';
const manifest={slug:'fixture',shareIdentity:{publicOrigin:'https://fixture.example'},variants:[{key:'import',base:'/variant-3'}],localization:{defaultLocale:'bg'}};
const input=email=>new Map([['import/src/lib/config/dealer.ts',Buffer.from('  "emailHref": "'+email+'",\n')],['import/src/lib/config/site.ts',Buffer.from('contactHref: daynightContact.emailHref,')]]);
test('missing email opens named existing contact route without inventing a fact',()=>{const f=input(''),original=f.get('import/src/lib/config/dealer.ts'),r=applyOptionalContactFallback(f,manifest);assert.equal(r.href,'https://fixture.example/variant-3/bg/contact');assert.equal(r.emailInvented,false);assert.equal(f.get('import/src/lib/config/dealer.ts'),original);assert.match(String(f.get('import/src/lib/config/site.ts')),/emailHref \|\|/);});
test('sourced email is unchanged',()=>{const f=input('mailto:dealer@example.com'),s=f.get('import/src/lib/config/site.ts');assert.equal(applyOptionalContactFallback(f,manifest).applied,false);assert.equal(f.get('import/src/lib/config/site.ts'),s);});
test('unknown consumer fails without modifying source',()=>{const f=input('');f.set('import/src/lib/config/site.ts',Buffer.from('unknown'));assert.throws(()=>applyOptionalContactFallback(f,manifest),/consumer/);assert.equal(String(f.get('import/src/lib/config/site.ts')),'unknown');});

import {createRequire} from 'node:module';
import {guardModernUnavailablePhoneActions,applyModernOptionalContactFallback} from './publishing/dealer-contact-fallback.mjs';
const ts=createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || new URL('../templates/import/package.json',import.meta.url))('typescript');
test('absent Modern phone actions are removed from JSX children and expression returns',()=>{
 for(const source of ['const C=()=> <section><a href={leadSite.phoneHref}>Call</a><p>Form stays</p></section>;','const C=()=> <a href={withBasePath(leadSite.phoneHref)}>Call</a>;']){
  const fixed=guardModernUnavailablePhoneActions(source,{name:'fixture.tsx',expected:{elements:1,arrays:0},typescript:ts});
  assert.match(fixed.source,/leadSite\.phoneHref\) \?/);assert.equal(fixed.elements,1);
  assert.match(fixed.source,/ : null/);if(source.includes('Form stays'))assert.match(fixed.source,/<p>Form stays<\/p>/);
 }
});
test('Modern phone action arrays preserve non-phone actions',()=>{
 const source='const actions=[{href:leadSite.phoneHref,label:"Call"},{href:"/contact",label:"Contact"}];';
 const fixed=guardModernUnavailablePhoneActions(source,{name:'fixture.tsx',expected:{elements:0,arrays:1},typescript:ts});
 assert.match(fixed.source,/\.\.\.\(leadSite\.phoneHref \?/);assert.match(fixed.source,/{href:"\/contact",label:"Contact"}/);
});
test('Modern optional phone refuses unknown consumer boundaries and partial sourced telephone',()=>{
 assert.throws(()=>guardModernUnavailablePhoneActions('const C=()=> <a href={unknown}>Call</a>;',{name:'fixture.tsx',expected:{elements:1,arrays:0},typescript:ts}),/boundary changed/);
 assert.throws(()=>applyModernOptionalContactFallback(new Map(),{slug:'fixture'},{profile:{business:{countryCode:'GB',phoneDisplay:'Known',phoneHref:'',phoneE164:''}},typescript:ts}),/Incomplete published/);
});
test('Modern sourced phones and other markets remain byte-for-byte untouched',()=>{
 const files=new Map([['sentinel',Buffer.from('retained')]]),before=files.get('sentinel');
 for(const business of [{countryCode:'BG'},{countryCode:'GB',phoneDisplay:'+44 12345678',phoneHref:'tel:+4412345678',phoneE164:'+4412345678'}])assert.equal(applyModernOptionalContactFallback(files,{slug:'fixture'},{profile:{business},typescript:ts}).applied,false);
 assert.equal(files.size,1);assert.equal(files.get('sentinel'),before);
});

import fs from 'node:fs';
import {MODERN_PHONE_BOUNDARIES,prepareModernOptionalPhoneSchema} from './publishing/dealer-contact-fallback.mjs';
const reviewedModernPolicy=fs.readFileSync(new URL('./fixtures/modern-reviewed-optional-contact-schema.ts',import.meta.url),'utf8');
test('reviewed UK schema retains its exact safe URL/absent-phone/pair policy',()=>{
 const result=prepareModernOptionalPhoneSchema(reviewedModernPolicy,{address:'Birmingham'});
 assert.equal(result.source,reviewedModernPolicy);assert.equal(result.policy,'retained-reviewed-safe-optional-phone');
 const absent=prepareModernOptionalPhoneSchema(reviewedModernPolicy,{address:''});
 assert.equal(absent.source.replace('address: z.union([z.string().trim().min(1).max(300), z.literal("")]),','address: z.string().trim().min(1).max(300),'),reviewedModernPolicy);
 assert.throws(()=>prepareModernOptionalPhoneSchema(reviewedModernPolicy.replace('!url.username','true'),{address:'Birmingham'}),/HTTPS validation/);
});
test('all Modern absent-phone controls prepare against the real preserved schema without changing facts or validation policy',()=>{
 const manifest={slug:'birmingham-square-one-motors',shareIdentity:{publicOrigin:'https://birmingham-square-one-motors.webpreviews.site'},variants:[{key:'modern',base:'/variant-2'}],localization:{defaultLocale:'en'}},profile={business:{countryCode:'GB',address:'Birmingham',phoneDisplay:'',phoneHref:'',phoneE164:''}};
 const lead=Buffer.from('export const leadSite = {\n  address: "Birmingham",\n  phoneDisplay: "",\n  phoneHref: "",\n  contactUrl: "",\n};');
 const files=new Map([['modern/packages/marketplace-domain/site-config.ts',Buffer.from(reviewedModernPolicy)],['modern/packages/marketplace/site-config.ts',Buffer.from('const contact={contactUrl: config.contactUrl,};')],['modern/packages/marketplace/lead-site.ts',lead],['business-facts.json',Buffer.from('untouched facts')]]);
 for(const[name,expected]of Object.entries(MODERN_PHONE_BOUNDARIES)){const expr=name.includes('/lease/')?'phoneHref':'leadSite.phoneHref';files.set(name,Buffer.from('const C=()=> <section>'+('<a href={'+expr+'}>Call</a>').repeat(expected.elements)+'<p>Form remains</p></section>; const actions=['+Array.from({length:expected.arrays},()=>'{href:'+expr+',label:"Call"}').join(',')+'];'));}
 const result=applyModernOptionalContactFallback(files,manifest,{profile,typescript:ts});assert.equal(result.schemaPolicy,'retained-reviewed-safe-optional-phone');assert.equal(String(files.get('modern/packages/marketplace-domain/site-config.ts')),reviewedModernPolicy);assert.equal(files.get('modern/packages/marketplace/lead-site.ts'),lead);assert.equal(String(files.get('business-facts.json')),'untouched facts');assert.equal(result.phoneInvented,false);assert(result.telephoneActionsHidden>0);
});
