import { readCatalogLiteral } from './catalog-literal.mjs';

const serviceIds = {
  imports: new Set(['import', 'imports', 'vehicle-import', 'vehicle-imports', 'import-on-request', 'sourcing']),
  lease: new Set(['lease', 'leasing', 'finance', 'financing', 'finance-enquiries', 'in-house-leasing'])
};
const publicSource = value => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
};

/** A finance advert supports an enquiry route, never an in-house lender claim. */
export function modernDealerServiceFlags(profile) {
  const flags = { imports: false, lease: false };
  for (const service of Array.isArray(profile.business.services) ? profile.business.services : []) {
    if (!service || typeof service !== 'object' || service.enabled === false || service.available === false || service.verified === false) continue;
    if (!publicSource(service.sourceUrl || service.evidenceUrl)) continue;
    const id = String(service.id || service.key || '').trim().toLowerCase().replaceAll('_', '-');
    for (const [capability, ids] of Object.entries(serviceIds)) if (ids.has(id)) flags[capability] = true;
  }
  return flags;
}

/** Only the generated dealer identity block changes; unrelated capability overrides survive. */
export function personalizeModernDealerServices(source, profile) {
  const begin = source.indexOf('// LEAD_SITE_CONFIG_START'), end = source.indexOf('// LEAD_SITE_CONFIG_END', begin);
  if (begin < 0 || end < begin || source.indexOf('// LEAD_SITE_CONFIG_START', begin + 1) >= 0) throw Error('Modern dealer service identity boundary changed');
  let section = source.slice(begin, end);
  const declarations = [...section.matchAll(/^  services:\s*/gm)];
  if (declarations.length > 1) throw Error('Ambiguous Modern dealer services');
  const flags = modernDealerServiceFlags(profile);
  if (declarations.length) {
    const declaration = declarations[0], parsed = readCatalogLiteral(section, declaration.index + declaration[0].length);
    if (!parsed.value || Array.isArray(parsed.value) || typeof parsed.value !== 'object' || Object.entries(parsed.value).some(([key, value]) => !['buy', 'sell', 'imports', 'lease', 'editorial'].includes(key) || typeof value !== 'boolean')) throw Error('Unreviewed Modern dealer service configuration');
    const tail = section.slice(parsed.end).match(/^[ \t]*,[ \t]*(?:\r?\n|$)/);
    if (!tail) throw Error('Modern dealer services must remain a literal property');
    section = section.slice(0, declaration.index) + '  services: ' + JSON.stringify({ ...parsed.value, ...flags }) + ',\n' + section.slice(parsed.end + tail[0].length);
  } else {
    const social = [...section.matchAll(/^  socialLinks:/gm)];
    const anchors = social.length ? social : [...section.matchAll(/^  staticDemoMode:/gm)];
    if (anchors.length !== 1) throw Error('Modern dealer service insertion boundary changed');
    section = section.slice(0, anchors[0].index) + '  services: ' + JSON.stringify(flags) + ',\n' + section.slice(anchors[0].index);
  }
  return source.slice(0, begin) + section + source.slice(end);
}
