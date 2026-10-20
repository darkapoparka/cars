import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {neutralModern,signatureHeader,signatureNavigation,signatureServices,applyDealerPresentation} from './publishing/dealer-presentation.mjs';
const site='export const leadSite = {\n  accent: "#30343b",\n  name: "Original dealer",\n  phoneHref: "tel:+359000000",\n  logoPath: "/dark.webp",\n  logoOnLight: "/light.webp",\n  logoOnDark: "/dark.webp",\n};'.replaceAll('\\n','\n');
test('publishing preserves the template palette, identity and exact logo assets',()=>{const s=neutralModern(site);assert.match(s,/accent: "#30343b"/);assert.doesNotMatch(s,/#18181b/);assert.match(s,/logoPath: "\/light.webp"/);assert.match(s,/logoInversePath: "\/dark.webp"/);assert.ok(s.includes('phoneHref: "tel:+359000000"'));assert.ok(s.includes('name: "Original dealer"'));assert.equal(neutralModern(s),s);});
test('publishing also preserves a later approved template accent',()=>{const s=neutralModern(site.replace('#30343b','#244466'));assert.match(s,/accent: "#244466"/);});
test('unknown or ambiguous palette fails instead of guessing',()=>{assert.throws(()=>neutralModern(''),/accent/);assert.throws(()=>neutralModern(site.replace('logoOnLight','otherLogo')),/logo/);});
test('Services becomes the fourth bottom navigation item including Menu; Shop remains excluded',()=>{const s=signatureNavigation('["/", "/vehicles"].includes(link.href)');assert.equal(s,'["/", "/vehicles", "/services"].includes(link.href)');assert.throws(()=>signatureNavigation('unknown'));});
test('service examples disclose uncertainty and do not enable rental upsells',()=>{const s=signatureServices('  const locale = useLocale();\n<ServicesHeading bind:query bind:category />\n  {#if desktop.current}example{/if}\n  <Footer />');assert.match(s,/data-dealer-services-disclosure/);assert.match(s,/Confirm actual availability/);assert.match(s,/if !dealer.businessPreview/);});
test('missing presentation input is atomic',()=>{const original=Buffer.from(site),files=new Map([['modern/packages/marketplace/lead-site.ts',original]]);assert.throws(()=>applyDealerPresentation(files,{slug:'test'}));assert.equal(files.size,1);assert.equal(files.get('modern/packages/marketplace/lead-site.ts'),original);});
test('current Signature source keeps its server-safe logo consumers and complete navigation',()=>{
 const header=fs.readFileSync(new URL('../templates/karento-best/src/lib/components/Header.svelte',import.meta.url),'utf8').replace(/\r\n/g,'\n');
 const navigation=fs.readFileSync(new URL('../templates/karento-best/src/lib/components/MobileNavigation.svelte',import.meta.url),'utf8').replace(/\r\n/g,'\n');
 assert.equal(signatureHeader(header),header);
 assert.equal(signatureNavigation(navigation),navigation);
 assert.throws(()=>signatureHeader(header.replace('src={dealer.logo.archivedDark}','src={dealer.logo.light}')));
});

test('current generated Modern surface aliases are retained without palette or identity rewriting',()=>{
 const source='export const leadSite = {\n  accent: "#30343b",\n  logoPath: "/dealer-brand/v2-0e9c59ba68488896/logo-on-light.webp",\n  logoInversePath: "/dealer-brand/v2-0e9c59ba68488896/logo-on-dark.webp",\n};\n';
 assert.equal(neutralModern(source),source);
 assert.throws(()=>neutralModern(source.replace('logo-on-dark.webp','logo-on-light.webp')),/Missing verified/);
 assert.throws(()=>neutralModern(source.replace('v2-0e9c59ba68488896/logo-on-dark','v2-ffffffffffffffff/logo-on-dark')),/Missing verified/);
 assert.throws(()=>neutralModern(source.replace('  logoInversePath:','  missingInverse:')),/Missing verified/);
 assert.throws(()=>neutralModern(source.replace('  accent:','  logoOnLight: "broken",\n  accent:')),/Missing verified/);
});

import {importEditorialDisclosure} from './publishing/dealer-presentation.mjs';
import {readTypeScriptCatalog} from './lib/catalog-literal.mjs';
const disclosureBg="Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността.",disclosureEn="Dated sample of public listings, not a real-time inventory system. Confirm the price, VAT and availability.";
const editorial='export const extraEnglish = {"Retained source":"Retained translation"} as const;\n';
test('Import source preparation adds only the exact disclosure and preserves catalog bytes',()=>{
 const fixed=importEditorialDisclosure(editorial,disclosureBg);
 const values=readTypeScriptCatalog(fixed,'extraEnglish');assert.equal(values[disclosureBg],disclosureEn);assert.equal(values['Retained source'],'Retained translation');
 assert.equal(importEditorialDisclosure(fixed,disclosureBg),fixed);assert.equal(importEditorialDisclosure(editorial,'Other notice'),editorial);
});
test('Import disclosure rejects a conflicting translation or invalid literal',()=>{
 const conflicting='export const extraEnglish = '+JSON.stringify({[disclosureBg]:'Wrong translation'})+' as const;';
 assert.throws(()=>importEditorialDisclosure(conflicting,disclosureBg),/conflicts/);assert.throws(()=>importEditorialDisclosure('export const extraEnglish = buildCatalog();',disclosureBg));
});
function disclosurePackage(){
 const header=fs.readFileSync(new URL('../templates/karento-best/src/lib/components/Header.svelte',import.meta.url),'utf8').replace(/\r\n/g,'\n'),navigation=fs.readFileSync(new URL('../templates/karento-best/src/lib/components/MobileNavigation.svelte',import.meta.url),'utf8').replace(/\r\n/g,'\n');
 return new Map(Object.entries({'business-facts.json':JSON.stringify({business:{inventoryNotice:disclosureBg,name:'Original dealer'}}),'stock.json':'{"unchanged":true}','localization/adoption.json':'{"retained":true}','modern/packages/marketplace/lead-site.ts':site,'karento-best/src/lib/components/Header.svelte':header,'karento-best/src/lib/components/MobileNavigation.svelte':navigation,'karento-best/src/lib/pages/services.svelte':'  const locale = useLocale();\n<ServicesHeading bind:query bind:category />\n  {#if desktop.current}example{/if}\n  <Footer />','import/src/lib/content/extra-localized.ts':editorial}).map(([n,s])=>[n,Buffer.from(s)]));
}
test('shared native/private source packaging records the Import change without altering facts or original source seal',()=>{
 const files=disclosurePackage(),before=new Map(files),receipt=applyDealerPresentation(files,{slug:'centralauto-varna'});
 for(const name of ['business-facts.json','stock.json','localization/adoption.json'])assert.equal(files.get(name),before.get(name));
 assert.equal(readTypeScriptCatalog(String(files.get('import/src/lib/content/extra-localized.ts')),'extraEnglish')[disclosureBg],disclosureEn);
 assert(receipt.changes.some(r=>r.path==='import/src/lib/content/extra-localized.ts'&&r.beforeSha256!==r.afterSha256));
});
test('a missing Import catalog fails the full package atomically',()=>{
 const files=disclosurePackage();files.delete('import/src/lib/content/extra-localized.ts');const before=new Map(files);assert.throws(()=>applyDealerPresentation(files,{slug:'centralauto-varna'}),/Missing presentation input/);
 assert.equal(files.size,before.size);for(const [name,bytes]of before)assert.equal(files.get(name),bytes);
});
