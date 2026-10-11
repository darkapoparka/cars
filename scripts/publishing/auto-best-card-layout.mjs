import {createHash} from 'node:crypto';

export const AUTO_BEST_CARD_LAYOUT_VERSION = 'single-row-mobile-filters-v2';
export const AUTO_BEST_CARD_LAYOUT_CSS = `@media (max-width: 767px) {
  html .dn-vehicle-card.dn-vehicle-card .dn-vehicle-card__mobile-meta { flex-wrap: nowrap; }
  html .dn-vehicle-card.dn-vehicle-card .dn-vehicle-card__fact { flex: 1 1 auto; min-width: 0; }
  html .dn-vehicle-card.dn-vehicle-card .dn-vehicle-card__fact:first-child { flex-shrink: 0; }
  html .dn-vehicle-card.dn-vehicle-card .dn-vehicle-card__fact > span:not(.dn-sr-only) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-detail-finance-trigger__logo img { object-position: left center; }
  html .dn-app-shell dialog .dn-mobile-overlay-heading.dn-mobile-filter-header { display: grid; grid-template-columns: var(--dn-control-hit-height) minmax(0, 1fr) var(--dn-control-hit-height); }
  html .dn-app-shell dialog .dn-mobile-filter-header > h2 { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; text-align: center; }
  html .dn-app-shell dialog .dn-mobile-overlay-heading.dn-mobile-filter-header > button { margin-inline: 0; }
  html .dn-app-shell dialog :is(.dn-mobile-filter-choice, .dn-mobile-overlay-option) { align-items: flex-start; }
  html .dn-app-shell dialog :is(.dn-mobile-filter-choice .choice-label, .dn-mobile-overlay-option .option-label) { display: -webkit-box; min-width: 0; overflow: hidden; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
  html .dn-app-shell dialog :is(.dn-mobile-filter-checkbox, .dn-mobile-overlay-option .identity-check, .dn-mobile-filter-choice > input) { margin-block-start: max(0px, calc((1lh - var(--dn-space-5)) / 2)); }
}`;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

/** Code-only repair for an existing combined Worker, preserving its asset store. */
export function autoBestCardLayoutWorkerSource() {
  return `export function withAutoBestCardLayout(request, response) {
  const path = new URL(request.url).pathname;
  if (request.method !== 'GET' || /^\\/variant-[2-6](?:\\/|$)/.test(path) || !response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;
  return new HTMLRewriter().on('head', { element(head) {
    head.append(${JSON.stringify('<style data-cars-auto-best-layout="'+AUTO_BEST_CARD_LAYOUT_VERSION+'">'+AUTO_BEST_CARD_LAYOUT_CSS+'</style>')}, {html:true});
  }}).transform(response);
}
`;
}

/** Apply after native source seals are checked, before provider compilation. */
export function applyAutoBestCardLayout(files, manifest) {
  if (!(files instanceof Map) || !manifest?.slug) throw Error('Named dealer package required');
  if (!manifest.variants.some(v=>v.key==='auto-best')) return null;
  // Current leads use the six-design contract. Historical package versions
  // retain their original native input seal and repackaging behavior.
  if (manifest.packaging?.version && manifest.packaging.version !== '5') return null;
  const card='auto-best/src/lib/components/vehicles/VehicleCard.svelte';
  const detail='auto-best/src/routes/listing-detail-v1/[id]/detail.css';
  const beforeCard=files.get(card),beforeDetail=files.get(detail);
  if (!beforeCard || !beforeDetail) throw Error('Missing Auto Best card layout inputs');
  const text=beforeCard.toString('utf8');
  if (text.split('</style>').length!==2 || !text.includes('dn-vehicle-card__mobile-meta') || !beforeDetail.toString('utf8').includes('.dn-detail-finance-trigger__logo img')) throw Error('Auto Best layout boundary changed');
  const pending=new Map(files);
  applyAutoBestFilterLayout(pending);
  const marker='/* '+AUTO_BEST_CARD_LAYOUT_VERSION+' */';
  const cardCss=(AUTO_BEST_CARD_LAYOUT_CSS.split('  .dn-detail-finance-trigger')[0]+'}')
    .replace(/(html [^{]+) \{/g, ':global($1) {');
  const afterCard=Buffer.from(text.includes(marker)?text:text.replace('</style>',marker+'\n'+cardCss+'\n</style>'));
  const detailText=beforeDetail.toString('utf8');
  const afterDetail=Buffer.from(detailText.includes(marker)?detailText:detailText+'\n'+marker+'\n@media (max-width: 767px) {\n  .dn-detail-finance-trigger__logo img { object-position: left center; }\n}\n');
  pending.set(card,afterCard);pending.set(detail,afterDetail);
  const changes=[...pending].filter(([path,after])=>files.has(path)&&!files.get(path).equals(after)).map(([path,after])=>({path,beforeSha256:hash(files.get(path)),afterSha256:hash(after)}));
  for(const [path,bytes]of pending)files.set(path,bytes);
  const receipt={schemaVersion:1,dealer:manifest.slug,version:AUTO_BEST_CARD_LAYOUT_VERSION,changes};
  files.set('.cars-auto-best-card-layout.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
  return receipt;
}

export function applyAutoBestFilterLayout(files) {
  const base='auto-best/src/lib/styles/base.css',facet='auto-best/src/lib/components/listing/ListingFacetEditor.svelte',quick='auto-best/src/lib/components/home/VehicleQuickSearch.svelte';
  if (![base,facet,quick].every(name=>files.has(name))) throw Error('Missing shared Auto Best mobile filter inputs');
  let f=files.get(facet).toString('utf8'),q=files.get(quick).toString('utf8'),css=files.get(base).toString('utf8');
  const guard="if (mobile.current && !value && field !== 'sort') return false;";
  if(!f.includes(guard)) {
    if(f.split('  function isSelected(value: string) {').length!==2)throw Error('Mobile facet selection boundary changed');
    f=f.replace('  function isSelected(value: string) {','  function isSelected(value: string) {\n    '+guard);
  }
  if(!q.includes('Boolean(value) && (Array.isArray(mobileMenuValue)')) {
    const before="  const optionSelected = (value: string) => Array.isArray(mobileMenuValue)\n    ? value ? listingSelectionHas(mobileMenuValue, value) : mobileMenuValue.length === 0\n    : mobileMenuValue === value;";
    if(!q.includes(before))throw Error('Mobile Home selection boundary changed');
    q=q.replace(before,before.replace('=> Array.isArray','=> Boolean(value) && (Array.isArray').replace('mobileMenuValue === value;','mobileMenuValue === value);'));
  }
  const marker='/* '+AUTO_BEST_CARD_LAYOUT_VERSION+' filters */';
  if(!css.includes(marker)) css+='\n'+marker+'\n@media (max-width: 767px) {\n'+AUTO_BEST_CARD_LAYOUT_CSS.split('\n').filter(line=>line.includes('.dn-app-shell')).join('\n')+'\n}\n';
  files.set(facet,Buffer.from(f));files.set(quick,Buffer.from(q));files.set(base,Buffer.from(css));
}
