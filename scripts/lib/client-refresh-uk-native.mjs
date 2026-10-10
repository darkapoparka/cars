/**
 * Narrow compatibility fixes for the reviewed UK native dealer boundaries.
 * Modern: quote the factual city property after native text personalization.
 * Import: permit an honestly absent telephone pair and hide unavailable calls.
 * Original template sources and factual profile/stock records are never edited.
 */
export const UK_MODERN_CITY_PATHS = Object.freeze([
  'packages/marketplace-ui/lib/listing-truth.ts',
  'packages/marketplace-ui/lib/marketplace-control-copy.ts'
]);
const cityMaps = ['locationLabelsBg', 'cityLabelsBg'];
const callBoundaries = [
  ['src/lib/components/agents/AgentDetailSidebar.svelte', 'sidebar.callHref', 'sidebar.callHref && sidebar.phone', 2],
  ['src/lib/components/agents/AuxeroAgentCard.svelte', 'card.phoneHref', 'card.phoneHref', 1],
  ['src/lib/components/common/ContactBanner.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/contact/ContactLocation.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/contact/ContactMobilePage.svelte', 'info.phoneHref', 'info.phoneHref', 1],
  ['src/lib/components/detail/AuxeroVehicleMobilePdp.svelte', 'detail.contact.primaryPhoneHref', 'detail.contact.primaryPhoneHref', 2],
  ['src/lib/components/detail/VehiclePurchasePanel.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/home/HomeFiveFooter.svelte', 'daynightContact.primaryPhoneHref', 'daynightContact.primaryPhoneHref', 2],
  ['src/lib/components/home/HomeFiveHeader.svelte', 'header.contact.phoneHref', 'header.contact.phoneHref && header.contact.phoneLabel', 2],
  ['src/lib/components/home/HomeFiveHero.svelte', 'mobileShowroomPhoneHref', 'mobileShowroomPhoneHref', 1],
  ['src/lib/components/home1/Home1Hero.svelte', 'mobileShowroomPhoneHref', 'mobileShowroomPhoneHref', 1],
  ['src/lib/components/layout/CleanSiteFooter.svelte', 'footer.contact.phoneHref', 'footer.contact.phoneHref && footer.contact.phoneLabel', 1],
  ['src/lib/components/layout/CleanSiteHeader.svelte', 'header.contact.phoneHref', 'header.contact.phoneHref && header.contact.phoneLabel', 2],
  ['src/lib/components/layout/MobileAppbar.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/layout/MobileNavigationMenu.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 2],
  ['src/lib/components/layout/PublicFooter.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/layout/PublicHeader.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/layout/SiteFooter.svelte', 'daynightContact.primaryPhoneLabel', 'daynightContact.primaryPhoneLabel', 1],
  ['src/lib/components/sell-your-car/SellValuationCard.svelte', 'site.contact.phoneHref', 'site.contact.phoneHref', 1],
  ['src/lib/components/sell-your-car/SellYourCarMobilePage.svelte', 'daynightContact.primaryPhoneHref', 'daynightContact.primaryPhoneHref', 1],
  ['src/routes/(site)/contact/+page.svelte', 'data.site.contact.phoneHref', 'data.site.contact.phoneHref', 1]
];
export const UK_IMPORT_PHONE_PATHS = Object.freeze([
  'src/lib/config/site.ts',
  ...callBoundaries.map(([name]) => name),
  'src/lib/content/contact-desktop.ts',
  'src/routes/(site)/import/+page.svelte',
  'src/routes/(site)/sell-your-car/+page.svelte',
  'src/lib/data/blog.ts'
]);
export const UK_IMPORT_PHONE_INPUT_PATHS = Object.freeze([
  'src/lib/config/dealer.ts', ...UK_IMPORT_PHONE_PATHS
]);
const text = (files, name) => {
  if (!(files instanceof Map) || !files.has(name)) throw Error('Missing UK native input: ' + name);
  const value = files.get(name);
  if (typeof value !== 'string' && !Buffer.isBuffer(value)) throw Error('UK native input must be text: ' + name);
  return String(value).replace(/\r\n/g, '\n');
};
function once(source, before, after, name) {
  if (source.split(before).length !== 2) throw Error('UK native boundary changed: ' + name);
  return source.replace(before, () => after);
}
function commit(files, updates) {
  for (const [name, source] of updates) {
    files.set(name, Buffer.isBuffer(files.get(name)) ? Buffer.from(source) : source);
  }
  return [...updates.keys()];
}

/** Family-relative string/Buffer Map; atomic, exact-path changes only. */
export function repairModernUkCityKeys(files, profile) {
  if (profile?.business?.countryCode !== 'GB') return [];
  const city = profile.business.city;
  if (typeof city !== 'string' || !city.trim() || /[\r\n"]/.test(city)) throw Error('Expected the reviewed UK city text.');
  const updates = new Map();
  UK_MODERN_CITY_PATHS.forEach((name, index) => {
    const source = text(files, name);
    const header = 'const ' + cityMaps[index] + ': Record<string, string> = {\n';
    const start = source.indexOf(header), end = source.indexOf('\n};', start);
    if (start < 0 || end < start || source.split(header).length !== 2) throw Error('UK native city map boundary changed: ' + name);
    const block = source.slice(start, end);
    const before = '  ' + city + ': ' + JSON.stringify(city) + ',';
    const after = '  ' + JSON.stringify(city) + ': ' + JSON.stringify(city) + ',';
    const fixed = once(block, before, after, name);
    updates.set(name, source.slice(0, start) + fixed + source.slice(end));
  });
  return commit(files, updates);
}

/** Find the actual end of a Svelte opening tag, respecting JS/quoted attributes. */
function openingEnd(source, start) {
  let quote = '', escaped = false, braces = 0;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = '';
    } else if (c === "'" || c === '"' || c === '\x60') quote = c;
    else if (c === '{') braces++;
    else if (c === '}') braces--;
    else if (c === '>' && braces === 0) return i + 1;
    if (braces < 0) break;
  }
  throw Error('Unexpected UK native contact tag boundary.');
}
function wrapCalls(source, [name, expression, condition, count]) {
  const elements = [], startAt = source.indexOf('</script>');
  if (startAt < 0) throw Error('UK native Svelte script boundary changed: ' + name);
  const pattern = /<(a|Action|MobileMenuAction)\b/g;
  pattern.lastIndex = startAt + 9;
  let match;
  while ((match = pattern.exec(source))) {
    const start = match.index, opened = openingEnd(source, start);
    const opening = source.slice(start, opened), tag = match[1];
    let end = opened;
    if (!/\/\s*>$/.test(opening)) {
      const close = new RegExp('</' + tag + '\\s*>', 'g');
      close.lastIndex = opened;
      const found = close.exec(source);
      if (!found) throw Error('Unclosed UK native contact element: ' + name);
      end = found.index + found[0].length;
      if (new RegExp('<' + tag + '\\b').test(source.slice(opened, found.index))) {
        throw Error('Nested UK native contact element requires review: ' + name);
      }
    }
    const fragment = source.slice(start, end);
    const matches = name.endsWith('/SiteFooter.svelte') ? fragment.includes(expression) : opening.includes(expression);
    if (matches) elements.push({start, end});
    pattern.lastIndex = end;
  }
  if (elements.length !== count || source.includes('{#if ' + condition + '}')) {
    throw Error('UK native telephone control boundary changed: ' + name);
  }
  // Keep the original telephone row's icon/spacing inside its optional branch.
  if (name.endsWith('/AgentDetailSidebar.svelte')) {
    const first = elements[0], start = source.lastIndexOf('<ul class="contact-info mb-28">', first.start);
    const end = source.indexOf('</ul>', first.end);
    if (start < startAt || end < first.end) throw Error('UK native agent telephone row changed.');
    first.start = start; first.end = end + 5;
  } else if (name.endsWith('/AuxeroAgentCard.svelte')) {
    const item = elements[0], start = source.lastIndexOf('<li>', item.start), end = source.indexOf('</li>', item.end);
    if (start < startAt || end < item.end) throw Error('UK native agent telephone item changed.');
    item.start = start; item.end = end + 5;
  } else if (name.endsWith('/CleanSiteFooter.svelte')) {
    const item = elements[0], start = source.lastIndexOf('<p class="mb-2">', item.start), end = source.indexOf('</p>', item.end);
    if (start < startAt || end < item.end) throw Error('UK native footer telephone row changed.');
    item.start = start; item.end = end + 4;
  }
  for (const {start, end} of elements.reverse()) {
    source = source.slice(0, start) + '{#if ' + condition + '}' +
      source.slice(start, end) + '{/if}' + source.slice(end);
  }
  return source;
}

/** No phone facts are synthesized; known-phone and other-market source is untouched. */
export function repairImportUkOptionalPhone(files, profile) {
  if (profile?.business?.countryCode !== 'GB') return [];
  const business = profile.business;
  const fields = [business.phoneDisplay, business.phoneHref, business.phoneE164];
  if (fields.some(value => typeof value !== 'string')) throw Error('Expected normalized UK telephone facts.');
  if (fields.some(Boolean)) {
    if (!fields.every(Boolean) || !/^tel:\+?[0-9 -]+$/.test(business.phoneHref)) throw Error('Incomplete published UK telephone facts.');
    return [];
  }
  const dealer = text(files, 'src/lib/config/dealer.ts');
  const contacts = [...dealer.matchAll(/export const daynightContact = (\{[\s\S]*?\n\}) as const;/g)];
  if (contacts.length !== 1) throw Error('UK Import dealer contact boundary changed.');
  const contact = JSON.parse(contacts[0][1]);
  for (const key of ['primaryPhoneLabel','primaryPhoneHref','marketplacePhoneLabel','marketplacePhoneHref']) {
    if (contact[key] !== '') throw Error('UK Import absent phone differs from factual profile: ' + key);
  }
  const updates = new Map(), siteName = 'src/lib/config/site.ts';
  const required = "\tif (!/^tel:[+]?[0-9 -]+$/.test(config.contact.phoneHref))\n\t\tthrow new Error('A valid telephone link is required');";
  const optional = [
    '\tif (',
    '\t\t(config.contact.phone || config.contact.phoneHref) &&',
    '\t\t(!config.contact.phone.trim() || !/^tel:[+]?[0-9 -]+$/.test(config.contact.phoneHref))',
    '\t)',
    "\t\tthrow new Error('A published telephone requires a label and valid telephone link');"
  ].join('\n');
  updates.set(siteName, once(text(files, siteName), required, optional, siteName));
  for (const boundary of callBoundaries) {
    const name = boundary[0];
    let source = text(files, name);
    if (name.endsWith('/Home1Hero.svelte')) {
      source = once(source, "\timport { resolve } from '$app/paths';",
        "\timport { resolve } from '$app/paths';\n\timport { site } from '$lib/config/site';", name + ' site binding');
      source = once(source, "\tconst mobileShowroomPhoneHref = 'tel:';",
        '\tconst mobileShowroomPhoneHref = site.contact.phoneHref;', name + ' absent phone binding');
    }
    updates.set(name, wrapCalls(source, boundary));
  }
  const channelsName = 'src/lib/content/contact-desktop.ts';
  let channels = text(files, channelsName);
  channels = once(channels, "\t\t\ttext: 'Viber',",
    "\t\t\ttext: site.contact.messageHref.startsWith('viber:') ? 'Viber' : contactDesktopCopy[locale].message,", channelsName + ' message label');
  channels = once(channels, '\t];\n}',
    "\t].filter((channel) => channel.kind !== 'phone' || Boolean(site.contact.phone && site.contact.phoneHref));\n}", channelsName + ' optional phone row');
  updates.set(channelsName, channels);
  for (const [name, label] of [
    ['src/routes/(site)/import/+page.svelte', 'discuss'],
    ['src/routes/(site)/sell-your-car/+page.svelte', 'contact']
  ]) {
    let source = text(files, name);
    source = once(source, 'actionHref={data.site.contact.phoneHref}',
      'actionHref={data.site.contact.phoneHref || data.site.contact.contactHref}', name + ' contact destination');
    source = once(source, "actionLabel={copy." + label + " + ' · ' + data.site.contact.phone}",
      "actionLabel={copy." + label + " + (data.site.contact.phone ? ' · ' + data.site.contact.phone : '')}", name + ' contact label');
    updates.set(name, source);
  }
  const blogName = 'src/lib/data/blog.ts';
  let blog = text(files, blogName), found = 0;
  for (const [before, after] of [
    ['Contact the dealership on  and identify the exact vehicle before visiting.',
      'Contact the dealership and identify the exact vehicle before visiting.'],
    ['Свържете се с автокъщата на  и посочете точния автомобил преди посещение.',
      'Свържете се с автокъщата и посочете точния автомобил преди посещение.']
  ]) {
    const needle = JSON.stringify(before);
    if (blog.includes(needle)) { blog = once(blog, needle, JSON.stringify(after), blogName); found++; }
  }
  if (found !== 1) throw Error('UK Import missing-phone guidance boundary changed.');
  updates.set(blogName, blog);
  return commit(files, updates);
}
