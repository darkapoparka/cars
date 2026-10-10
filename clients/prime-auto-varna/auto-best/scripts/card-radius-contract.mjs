// Outer card surfaces. Controls, artwork frames and page scaffolding have separate roles.
export const cardSelectors = [
  '.dn-entry-card', '.dn-vehicle-card', '.dn-body-type', '.dn-brand-card',
  '.dn-browse-all', '.dn-discovery-toggle', '.dn-editorial-item',
  '.dn-mobile-core-card', '.dn-mobile-services__card', '.dn-trust-card', '.dn-service-card',
  '.dn-video-card', '.dn-videos__all-card', '.dn-videos > .container',
  '.dn-footer-actions__grid > a', '.dn-listing-empty', '.dn-blog-empty', '.dn-blog-card',
  '.dn-blog-search', '.dn-blog-detail__sheet', '.dn-blog-widget',
  '.dn-showroom-map', '.dn-about-service-card', '.dn-about-showroom__shell',
  '.dn-information-card', '.dn-contact-intent__main', '.dn-contact-card',
  '.dn-contact-location__card', '.dn-contact-vehicle--hero',
  '.dn-detail-card:not(.dn-detail-info-card):not(.dn-detail-summary)', '.dn-detail-dealer-banner', '.dn-detail-title-card',
  '.dn-detail-finance-card', '.dn-detail-finance-trigger', '.dn-detail-dealer',
  '.dn-detail-location-card', '.dn-detail-related-card',
  '.dn-detail-finance-dialog .dn-finance-calculator__result div',
  '.cars-locale-suggestion', '.locale-settings', '.dn-service-landing details',
  '.dn-import-info-prepare', '.dn-import-info-process', '.dn-import-info-drawer--inline .dn-import-info-drawer__peek',
  '.dn-tradein-info-prepare', '.dn-tradein-info-process', '.dn-tradein-info-drawer--inline .dn-tradein-info-drawer__peek',
  '.dn-tradein-review-card', '.dn-tradein-next-step', '.dn-tradein-feedback',
  '.dn-enquiry-selected-link', '.dn-enquiry-summary', '.dn-enquiry-success', '.dn-enquiry-feedback',
  '.dn-banner-picker__options a'
];
export const photoSelectors = [
  '.dn-vehicle-card--listing .dn-vehicle-card__visual', '.dn-contact-vehicle img',
  '.dn-tradein-photo-grid img', '.dn-tradein-review-photos img',
  '.dn-enquiry-photo-grid img', '.dn-enquiry-review-photos img'
];
export const badgeSelector = '.dn-vehicle-card__fact';

export async function radiusMeasurements(page) {
  return page.evaluate(({cardSelectors,photoSelectors,badgeSelector}) => {
    const corners = style => [style.borderTopLeftRadius,style.borderTopRightRadius,style.borderBottomRightRadius,style.borderBottomLeftRadius];
    const visible = element => element instanceof HTMLElement && element.checkVisibility();
    const measure = element => ({class:element.className.replace(/\bsvelte-[\w-]+\b/g,'').trim(),corners:corners(getComputedStyle(element))});
    const cards = new Map();
    for(const selector of cardSelectors) for(const element of document.querySelectorAll(selector)) {
      if(!visible(element)) continue;
      // The contact map and PDP body sections join their enclosing card edge.
      if(element.matches('.dn-showroom-map')&&element.closest('.dn-contact-location__card')) continue;
      const style = getComputedStyle(element);
      const painted = !['transparent','rgba(0, 0, 0, 0)'].includes(style.backgroundColor)
        || style.backgroundImage!=='none' || style.boxShadow!=='none'
        || [style.borderTopWidth,style.borderRightWidth,style.borderBottomWidth,style.borderLeftWidth].some(value=>parseFloat(value)>0);
      if(painted&&!cards.has(element)) cards.set(element,{selector,...measure(element)});
    }
    const photos = new Map();
    for(const selector of photoSelectors) for(const element of document.querySelectorAll(selector)) if(visible(element)&&!photos.has(element))photos.set(element,{selector,...measure(element)});
    return {cards:[...cards.values()],photos:[...photos.values()],badges:[...document.querySelectorAll(badgeSelector)].filter(visible).map(measure)};
  },{cardSelectors,photoSelectors,badgeSelector});
}

export function radiusViolations(measurements, radius='12px') {
  const failures = [];
  for(const card of measurements.cards) {
    const full = [radius,radius,radius,radius];
    const joined = [radius,radius,'0px','0px'];
    const allowed = /dn-detail-title-card|dn-(?:tradein|import)-info-drawer__peek/.test(card.class) ? [full,joined] : [full];
    if(!allowed.some(expected=>expected.every((value,index)=>card.corners[index]===value))) failures.push({kind:'card',...card,expected:allowed});
  }
  for(const [kind,items,value] of [['badge',measurements.badges,'6px'],['photo',measurements.photos,'10px']])
    for(const item of items) if(item.corners.some(corner=>corner!==value))failures.push({kind,...item,expected:value});
  return failures;
}
