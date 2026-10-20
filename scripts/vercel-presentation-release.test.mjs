import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {applyDealerPresentation,resolveDealerPresentationVersion,DEALER_PRESENTATION_VERSION} from './publishing/dealer-presentation.mjs';
import {applyOptionalContactFallback} from './publishing/dealer-contact-fallback.mjs';
import {bindModernMobileWordmarkLogo} from './lib/client-logo-contract.mjs';
const source=process.env.CARS_PRESENTATION_SOURCE||'HEAD';
const slugs=['navara-car','day-and-night-auto-group','promosale-varna','priselci','isauto-varna','automarket-varna','outletcars-varna','perfect-auto-varna','avangard-auto','legend-auto'];
const read=p=>execFileSync('git',['show',source+':'+p],{maxBuffer:16*1024**2});
const hash=b=>createHash('sha256').update(b).digest('hex');
const inputs=['modern/packages/marketplace/lead-site.ts','modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx','karento-best/src/lib/components/Header.svelte','karento-best/src/lib/components/MobileNavigation.svelte','karento-best/src/lib/pages/services.svelte','import/src/lib/config/dealer.ts','import/src/lib/config/site.ts','app/lib/dealer.json','auto-best/src/lib/data/inventory.ts','branding/logo-contract.json','dealer-brand/logo-on-light.webp','dealer-brand/logo-on-dark.webp'];
function assertSignatureLogoConsumers(header, original) {
 if (original.includes('  const heroHeader = $derived(\n    [')) {
  // Current native CSS selects the two raster surfaces before hydration.
  // Preserve the complete header, including its controls and styles.
  assert.equal(header,original,'Current native Signature header changed');
  const logos=[...header.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
  for (const [surface,binding] of [['light-mode','dealer.logo.light'],['dark-mode','dealer.logo.archivedDark']]) {
   const consumers=logos.filter(tag=>tag.includes('class="'+surface+'"'));
   assert.equal(consumers.length,3,'Expected all three native '+surface+' logo consumers');
   for (const tag of consumers) {
    assert.ok(tag.includes('src={'+binding+'}'),'Wrong native '+surface+' raster binding');
    assert.ok(tag.includes('alt={dealer.logo.alt}')&&tag.includes('width="168"')&&tag.includes('height="76"')&&tag.includes('style:object-fit="contain"'),'Native logo identity/geometry changed');
   }
  }
  assert.equal((header.match(/href=\{locale\.href\("\/services"\)\}/g)||[]).length,3,'Native services navigation missing');
  assert.doesNotMatch(header,/\{#if !dealer\.businessPreview\}<li/);
  assert.doesNotMatch(header,/src=\{heroLogo\s*\?/);
 } else {
  // Preserved older dealer headers still require the publishing picture repair.
  assert.match(header,/data-dealer-responsive-logo/);
  assert.match(header,/<source media=/);
  assert.match(header,/srcset=\{heroRoute && scrollY <= 20 \? dealer\.logo\.archivedDark : dealer\.logo\.light\}/);
  assert.match(header,/<img\b[^>]*src=\{dealer\.logo\.light\}/);
 }
}
for(const slug of slugs)test(slug+': the actual preserved six-design source accepts both-host presentation without changing facts or logo pixels',()=>{
 const prefix='clients/'+slug+'/',manifest=JSON.parse(read(prefix+'dealer.json'));
 assert.equal(manifest.packaging.version,'5');assert.equal(manifest.variants.length,6);
 const files=new Map(inputs.map(p=>[p,read(prefix+p)])),before=new Map([...files].map(([p,b])=>[p,hash(b)]));
 const originalHeader=String(files.get(inputs[2])).replace(/\r\n/g,'\n');
 const contact=applyOptionalContactFallback(files,manifest);const receipt=applyDealerPresentation(files,manifest);
 const logo=inputs[1];files.set(logo,Buffer.from(bindModernMobileWordmarkLogo(files.get(logo).toString())));
 for(const p of inputs.slice(7).concat(['import/src/lib/config/dealer.ts']))assert.equal(hash(files.get(p)),before.get(p),'Preserved identity/stock changed: '+p);
 assert.equal(receipt.logoPixelsChanged,false);assert.equal(receipt.palette,'template-native');
 const site=String(files.get(inputs[0]));
 const original=read(prefix+inputs[0]).toString();for(const field of ['accent','desktopAccent','name','phoneHref','email','mapsUrl']){const pattern=new RegExp('^  '+field+':.*$','m');assert.deepEqual(site.match(pattern)?.[0],original.match(pattern)?.[0],field);}
 const header=String(files.get(inputs[2]));assertSignatureLogoConsumers(header,originalHeader);assert.match(String(files.get(inputs[3])),/"\/services"/);assert.match(String(files.get(inputs[4])),/data-dealer-services-disclosure/);
 if(contact.applied)assert.equal(new URL(contact.href).origin,new URL(manifest.shareIdentity.publicOrigin).origin);
});
test('Vercel and Cloudflare share the same explicit presentation gate before mounting and sealing',()=>{
 const s=fs.readFileSync(new URL('./package-dealer.mjs',import.meta.url),'utf8');const a=s.indexOf('if (manifest.presentation !== undefined)'),b=s.indexOf('files = applySixVariantMounts',a),c=s.indexOf('sealSixVariantBuild',s.indexOf('async function prepare('));
 assert.ok(a>0&&b>a&&c>b);assert.match(s.slice(a,b),/applyDealerPresentation/);assert.match(s.slice(a,b),/bindModernMobileWordmarkLogo/);assert.doesNotMatch(s.slice(a,b),/provider ===/);assert.match(s.slice(a,b),/resolveDealerPresentationVersion\(manifest\.presentation\.version\)/);
 for(const version of [DEALER_PRESENTATION_VERSION,'neutral-services-v1'])assert.equal(resolveDealerPresentationVersion(version),DEALER_PRESENTATION_VERSION);
 for(const version of [undefined,null,'','unreviewed-services-v9',{}])assert.throws(()=>resolveDealerPresentationVersion(version),/Unknown dealer presentation version/);
});

test('current native Signature logo contract rejects changed surfaces, navigation and header controls',()=>{
 const header=read('clients/priselci/karento-best/src/lib/components/Header.svelte').toString().replace(/\r\n/g,'\n');
 assert.ok(header.includes('  const heroHeader = $derived(\n    ['));
 assertSignatureLogoConsumers(header,header);
 for (const malformed of [
  header.replace('src={dealer.logo.archivedDark}','src={dealer.logo.light}'),
  header.replace('class="light-mode"','class="unknown-logo"'),
  header.replace('href={locale.href("/services")}','href={locale.href("/vehicles")}')
 ]) assert.throws(()=>assertSignatureLogoConsumers(malformed,malformed));
 assert.throws(()=>assertSignatureLogoConsumers(header+'\n// changed controls',header));
});
