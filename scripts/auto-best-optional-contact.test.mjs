import test from 'node:test';
import assert from 'node:assert/strict';
import {AUTO_BEST_PHONE_BOUNDARIES,applyAutoBestOptionalContactFallback,guardAutoBestUnavailablePhoneActions} from './publishing/auto-best-optional-contact.mjs';
import {applyOptionalContactFallback} from './publishing/dealer-contact-fallback.mjs';
const prefix='auto-best/',manifest={slug:'fixture',packaging:{version:'5'},shareIdentity:{publicOrigin:'https://fixture.example'},variants:[{key:'import',base:'/variant-3'}],localization:{defaultLocale:'en'}};
const profile={business:{countryCode:'GB',phoneDisplay:'',phoneHref:'',phoneE164:''}};
function fixture(){
 const files=new Map([['business-facts.json',Buffer.from(JSON.stringify(profile))],[prefix+'src/lib/data/dealer-profile.json',Buffer.from(JSON.stringify(profile))],[prefix+'src/lib/config/brand.ts',Buffer.from('export const brand = {\n  phone: "",\n  phoneHref: "tel:",\n} as const;')],[prefix+'src/lib/data/navigation.ts',Buffer.from("const links=[{ id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }];")],['import/src/lib/config/dealer.ts',Buffer.from('  "emailHref": "",\n')],['import/src/lib/config/site.ts',Buffer.from('contactHref: daynightContact.emailHref,')]]);
 for(const [relative,count]of Object.entries(AUTO_BEST_PHONE_BOUNDARIES)){
  const anchor='<a href={brand.phoneHref} aria-label={`${brand.phone} > Call`}>Call</a>';
  const body=relative.endsWith('/Header.svelte')?'<li><Icon name="phone" />'+anchor+'</li>'+anchor.repeat(count-1):anchor.repeat(count);
  files.set(prefix+relative,Buffer.from('<script>const brand={phone:"",phoneHref:"tel:"};</script><section>'+body+'<p>Contact form and directions stay</p></section><style>section{color:red}</style>'));
 }
 return files;
}
test('all Auto telephone consumers and the whole topbar row become optional without changing facts, CSS or forms',()=>{
 const files=fixture(),original=new Map(files),result=applyAutoBestOptionalContactFallback(files,manifest,{profile});
 assert.equal(result.telephoneActionsHidden,17);assert.equal(result.navigationRowsHidden,1);
 for(const key of ['business-facts.json',prefix+'src/lib/data/dealer-profile.json',prefix+'src/lib/config/brand.ts'])assert.equal(files.get(key),original.get(key));
 for(const relative of Object.keys(AUTO_BEST_PHONE_BOUNDARIES)){const source=String(files.get(prefix+relative));assert.match(source,/<p>Contact form and directions stay<\/p>/);assert.match(source,/<style>section\{color:red\}<\/style>/);}
 assert.match(String(files.get(prefix+'src/lib/components/layout/Header.svelte')),/\{#if brand\.phone[^}]+\}<li><Icon name="phone"/);
});
test('phone-present and other-market inputs remain byte-identical',()=>{
 const files=fixture(),original=new Map(files);
 for(const business of [{countryCode:'BG'},{countryCode:'GB',phoneDisplay:'+44 12345678',phoneHref:'tel:+4412345678',phoneE164:'+4412345678'}])assert.equal(applyAutoBestOptionalContactFallback(files,manifest,{profile:{business}}).applied,false);
 for(const [name,bytes]of original)assert.equal(files.get(name),bytes);
});
test('partial facts, unknown controls and repeated preparation fail without mutating source',()=>{
 assert.throws(()=>applyAutoBestOptionalContactFallback(fixture(),manifest,{profile:{business:{...profile.business,phoneDisplay:'Known'}}}),/Incomplete published/);
 const files=fixture(),name=prefix+'src/lib/components/company/ContactIntent.svelte';files.set(name,Buffer.from('<script></script><a href="/unknown">Unknown</a>'));const original=new Map(files);
 assert.throws(()=>applyAutoBestOptionalContactFallback(files,manifest,{profile}),/count changed/);for(const [path,bytes]of original)assert.equal(files.get(path),bytes);
 const source='<script></script><a href={i18n.href(brand.phoneHref)}>Call</a>',guarded=guardAutoBestUnavailablePhoneActions(source,{name:'fixture.svelte',expected:1}).source;
 assert.throws(()=>guardAutoBestUnavailablePhoneActions(guarded,{name:'fixture.svelte',expected:1}),/boundary changed/);
});
test('shared packaging wrapper covers CF and Vercel and rolls back Auto edits if Import rejects',()=>{
 const files=fixture(),result=applyOptionalContactFallback(files,manifest);assert.equal(result.autoBestOptionalContact.telephoneActionsHidden,17);assert.equal(result.emailInvented,false);
 const broken=fixture();broken.set('import/src/lib/config/site.ts',Buffer.from('unknown boundary'));const original=new Map(broken);
 assert.throws(()=>applyOptionalContactFallback(broken,manifest),/Import contact consumer/);for(const [name,bytes]of original)assert.equal(broken.get(name),bytes);
});
