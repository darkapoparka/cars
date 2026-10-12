import {createHash} from 'node:crypto';
import {readTypeScriptCatalog} from '../lib/catalog-literal.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
const marker = '.cars-dealer-presentation.json';
export const DEALER_PRESENTATION_VERSION = 'template-palette-services-v2';
/** Historical source annotation; derived packages use the current native palette policy. */
export function resolveDealerPresentationVersion(version) {
  if (![DEALER_PRESENTATION_VERSION, 'neutral-services-v1'].includes(version)) throw Error('Unknown dealer presentation version');
  return DEALER_PRESENTATION_VERSION;
}
const notice = `<p class="container dealer-services-disclosure" data-dealer-services-disclosure>{locale.locale === 'bg' ? 'Примерен каталог на услуги за този дизайн. Наличността, условията и цените се потвърждават с автокъщата.' : 'Illustrative service catalogue for this design. Confirm actual availability, terms and prices with the dealership.'}</p>`;
function once(text, before, after, label) {
  if (text.split(before).length !== 2) throw Error('Dealer presentation boundary changed: '+label);
  return text.replace(before, after);
}
export function neutralModern(source) {
  let text = source;
  const accents = [...text.matchAll(/^  accent: ["']#[a-f0-9]{6}["'],/gmi)];
  if (accents.length !== 1) throw Error('Expected one Modern dealer accent');
  // The dealer adapter preserves the approved template accent. Publishing must
  // not introduce a second palette or recolour it from the dealer's logo.
  const read = name => {const m = [...text.matchAll(new RegExp('^  '+name+': (["\'])(.*?)\\1,','gm'))];if(m.length!==1)throw Error('Missing verified Modern logo '+name);return m[0][2];};
  // Current six-design creators already bind both sealed public surface aliases.
  // Legacy sources additionally carry logoOnLight/logoOnDark; preserve that path.
  if (!/^  logoOn(?:Light|Dark):/m.test(text)) {
    const light=read('logoPath'),dark=read('logoInversePath');
    const matched=/^\/dealer-brand\/(v2-[a-f0-9]{16})\/logo-on-light\.webp$/.exec(light);
    if (!matched || dark!=='/dealer-brand/'+matched[1]+'/logo-on-dark.webp') throw Error('Missing verified Modern surface aliases');
    return text;
  }
  const light=read('logoOnLight'),dark=read('logoOnDark');
  text=text.replace(/^  logoPath: ["'][^"']*["'],/m,'  logoPath: '+JSON.stringify(light)+',');
  if (/^  logoInversePath:/m.test(text)) text=text.replace(/^  logoInversePath: ["'][^"']*["'],/m,'  logoInversePath: '+JSON.stringify(dark)+',');
  else text=text.replace(/^  logoPath: .*$/m,line=>line+'\n  logoInversePath: '+JSON.stringify(dark)+',');
  return text;
}
export function signatureHeader(source) {
  let text=source;
  const logos=[...text.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
  const lightLogos=logos.filter(tag=>tag.includes('class="light-mode"'));
  const darkLogos=logos.filter(tag=>tag.includes('class="dark-mode"'));
  // Current masters render both surface treatments and let their existing CSS
  // choose before hydration. Do not apply the old client-only src repair again.
  if (text.includes('  const heroHeader = $derived(\n    [') &&
      lightLogos.length && darkLogos.length &&
      lightLogos.every(tag=>tag.includes('src={dealer.logo.light}')) &&
      darkLogos.every(tag=>tag.includes('src={dealer.logo.archivedDark}'))) {
    if ((text.match(/href=\{locale\.href\("\/services"\)\}/g)||[]).length !== 3 ||
        text.includes('{#if !dealer.businessPreview}<li')) throw Error('Current Signature navigation boundary changed');
    return text;
  }
  // The route is known on the server; viewport-dependent img src changes during
  // hydration can retain the wrong initial src. Let picture select it in CSS media.
  text=once(text,'  const heroHeader = $derived(\n    phone.current &&\n      [','  const heroRoute = $derived(\n      [','Signature hero route');
  text=once(text,'  const heroLogo = $derived(heroHeader && scrollY <= 20);','  const heroHeader = $derived(phone.current && heroRoute);\n  const heroLogo = $derived(heroHeader && scrollY <= 20);','Signature hero state');
  const image=/<img\s+class="light-mode"[\s\S]*?\/>/.exec(text);
  if(!image||!image[0].includes('src={heroLogo ? dealer.logo.archivedDark : dealer.logo.light}'))throw Error('Signature first header logo boundary changed');
  const picture=`<picture class="light-mode" data-dealer-responsive-logo>
              <source media="(max-width: 767.98px)" srcset={heroRoute && scrollY <= 20 ? dealer.logo.archivedDark : dealer.logo.light} />
              <img alt={dealer.logo.alt} src={dealer.logo.light} width="168" height="76" loading="eager" fetchpriority="high" style:object-fit="contain" />
            </picture>`;
  text=text.replace(image[0],picture);
  let services=0;
  text=text.replace(/\{#if !dealer\.businessPreview\}(<li\b[\s\S]*?<\/li\s*>)\{\/if\}/g,(whole,li)=>{if(!li.includes('locale.href("/services")'))return whole;services++;return li;});
  if(services!==3)throw Error('Expected three Signature services navigation boundaries, found '+services);
  return text;
}
export function signatureNavigation(source) {
  if (source.includes('const links = $derived([') &&
      ['/', '/vehicles', '/services', '/shop'].every(href=>source.includes('href: '+JSON.stringify(href))) &&
      !source.includes('.filter(')) return source;
  return once(source,'["/", "/vehicles"].includes(link.href)','["/", "/vehicles", "/services"].includes(link.href)','Signature bottom services tab');
}
export function signatureServices(source) {
  let text=once(source,'  const locale = useLocale();','  const locale = useLocale();\n  import { dealer } from "#lib/content.ts";','Signature services dealer context');
  text=once(text,'<ServicesHeading bind:query bind:category />','<ServicesHeading bind:query bind:category />\n  {#if dealer.businessPreview}'+notice+'{/if}','Signature services disclosure');
  text=once(text,'  {#if desktop.current}','  {#if !dealer.businessPreview}\n  {#if desktop.current}','Signature reference-only upsells');
  text=once(text,'  <Footer />','  {/if}\n  <Footer />','Signature end reference-only upsells');
  return text+'\n<style>\n.dealer-services-disclosure {margin-block:24px 0;color:var(--bs-neutral-600);font-size:14px;line-height:1.55;}\n</style>\n';
}
const importInventoryDisclosure = "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността.";
/** Source-copy preparation shared by native compilation and full private export. */
export function importEditorialDisclosure(source, notice) {
  if (notice !== importInventoryDisclosure) return source;
  const english = "Dated sample of public listings, not a real-time inventory system. Confirm the price, VAT and availability.";
  const catalog = readTypeScriptCatalog(source, 'extraEnglish');
  if (Object.hasOwn(catalog, notice)) {
    if (catalog[notice] !== english) throw Error('Import inventory disclosure conflicts with reviewed English copy');
    return source;
  }
  const anchor = 'export const extraEnglish = {';
  if (source.split(anchor).length !== 2) throw Error('Import editorial catalog source boundary changed');
  const after = source.replace(anchor, anchor + '\n  ' + JSON.stringify(notice) + ': ' + JSON.stringify(english) + ',');
  const check = readTypeScriptCatalog(after, 'extraEnglish');
  if (check[notice] !== english || Object.entries(catalog).some(([key,value]) => check[key] !== value)) throw Error('Import editorial catalog changed retained copy');
  return after;
}
/** Publishing-only presentation policy: never changes dealer facts or logo pixels. */
export function applyDealerPresentation(files, manifest) {
  if (!(files instanceof Map)||!manifest?.slug) throw Error('Named dealer source required');
  if(files.has(marker))throw Error('Presentation already applied; regenerate from reviewed source');
  const edits=[
    ['modern/packages/marketplace/lead-site.ts',neutralModern],
    ['karento-best/src/lib/components/Header.svelte',signatureHeader],
    ['karento-best/src/lib/components/MobileNavigation.svelte',signatureNavigation],
    ['karento-best/src/lib/pages/services.svelte',signatureServices]
  ];
  const factBytes=files.get('business-facts.json');
  const inventoryNotice=factBytes?JSON.parse(String(factBytes))?.business?.inventoryNotice:undefined;
  if(inventoryNotice===importInventoryDisclosure) edits.push(['import/src/lib/content/extra-localized.ts',source=>importEditorialDisclosure(source,inventoryNotice)]);
  const pending=[],changes=[];
  for(const [name,transform]of edits){const before=files.get(name);if(!before)throw Error('Missing presentation input '+name);const after=Buffer.from(transform(String(before).replace(/\r\n/g,'\n')));pending.push([name,after]);changes.push({path:name,beforeSha256:hash(before),afterSha256:hash(after)});}
  const receipt={schemaVersion:1,version:DEALER_PRESENTATION_VERSION,dealer:manifest.slug,palette:'template-native',sourceAccentRetainedInCanonicalDealer:true,compiledAccentPreserved:true,logoPixelsChanged:false,services:'visible-illustrative-catalogue',referenceReviewsAndDiscountsNotAdded:true,changes};
  for(const [name,bytes]of pending)files.set(name,bytes);
  files.set(marker,Buffer.from(JSON.stringify(receipt,null,2)+'\n'));return receipt;
}
