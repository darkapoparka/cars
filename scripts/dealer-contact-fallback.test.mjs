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
