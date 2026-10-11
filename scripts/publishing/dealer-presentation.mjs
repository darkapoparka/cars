import {createHash} from 'node:crypto';
const hash = value => createHash('sha256').update(value).digest('hex');
const marker = '.cars-dealer-presentation.json';
export const DEALER_PRESENTATION_VERSION = 'neutral-services-v1';
const notice = `<p class="container dealer-services-disclosure" data-dealer-services-disclosure>{locale.locale === 'bg' ? 'Примерен каталог на услуги за този дизайн. Наличността, условията и цените се потвърждават с автокъщата.' : 'Illustrative service catalogue for this design. Confirm actual availability, terms and prices with the dealership.'}</p>`;
function once(text, before, after, label) {
  if (text.split(before).length !== 2) throw Error('Dealer presentation boundary changed: '+label);
  return text.replace(before, after);
}
export function neutralModern(source) {
  let text = source;
  const accents = [...text.matchAll(/^  accent: ["']#[a-f0-9]{6}["'],/gmi)];
  if (accents.length !== 1) throw Error('Expected one Modern dealer accent');
  text = text.replace(accents[0][0], '  accent: "#18181b",');
  const read = name => {const m = [...text.matchAll(new RegExp('^  '+name+': (["\'])(.*?)\\1,','gm'))];if(m.length!==1)throw Error('Missing verified Modern logo '+name);return m[0][2];};
  const light=read('logoOnLight'),dark=read('logoOnDark');
  text=text.replace(/^  logoPath: ["'][^"']*["'],/m,'  logoPath: '+JSON.stringify(light)+',');
  if (/^  logoInversePath:/m.test(text)) text=text.replace(/^  logoInversePath: ["'][^"']*["'],/m,'  logoInversePath: '+JSON.stringify(dark)+',');
  else text=text.replace(/^  logoPath: .*$/m,line=>line+'\n  logoInversePath: '+JSON.stringify(dark)+',');
  return text;
}
export function signatureHeader(source) {
  let text=source;
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
  return once(source,'["/", "/vehicles"].includes(link.href)','["/", "/vehicles", "/services"].includes(link.href)','Signature bottom services tab');
}
export function signatureServices(source) {
  let text=once(source,'  const locale = useLocale();','  const locale = useLocale();\n  import { dealer } from "#lib/content.ts";','Signature services dealer context');
  text=once(text,'<ServicesHeading bind:query bind:category />','<ServicesHeading bind:query bind:category />\n  {#if dealer.businessPreview}'+notice+'{/if}','Signature services disclosure');
  text=once(text,'  {#if desktop.current}','  {#if !dealer.businessPreview}\n  {#if desktop.current}','Signature reference-only upsells');
  text=once(text,'  <Footer />','  {/if}\n  <Footer />','Signature end reference-only upsells');
  return text+'\n<style>\n.dealer-services-disclosure {margin-block:24px 0;color:var(--bs-neutral-600);font-size:14px;line-height:1.55;}\n</style>\n';
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
  const pending=[],changes=[];
  for(const [name,transform]of edits){const before=files.get(name);if(!before)throw Error('Missing presentation input '+name);const after=Buffer.from(transform(String(before).replace(/\r\n/g,'\n')));pending.push([name,after]);changes.push({path:name,beforeSha256:hash(before),afterSha256:hash(after)});}
  const receipt={schemaVersion:1,version:DEALER_PRESENTATION_VERSION,dealer:manifest.slug,palette:'neutral-black-white',sourceAccentRetainedInCanonicalDealer:true,logoPixelsChanged:false,services:'visible-illustrative-catalogue',referenceReviewsAndDiscountsNotAdded:true,changes};
  for(const [name,bytes]of pending)files.set(name,bytes);
  files.set(marker,Buffer.from(JSON.stringify(receipt,null,2)+'\n'));return receipt;
}
