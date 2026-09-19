import fs from 'node:fs';
import path from 'node:path';

const EXACT_PROTECTED_PATHS = {
  'auto-best': [
    'src/lib/data/home.ts',
    'src/lib/data/feature-artwork.ts',
    'src/lib/data/service-artwork.ts',
    'src/lib/data/vehicle-artwork.ts'
  ],
  modern: [
    'apps/web/public/lead-hero.jpg'
  ],
  carwow: [
    'src/lib/components/home/desktop/DesktopHomeHero.svelte',
    'src/lib/components/home/desktop/DesktopHomeBrandStrip.svelte',
    'src/lib/components/home/desktop/DesktopHomeInventoryPreview.svelte',
    'src/lib/components/home/desktop/DesktopHomeVehicleCategories.svelte',
    'src/lib/components/home/desktop/DesktopHomeWhyDayNight.svelte'
  ],
  import: [
    'src/lib/components/home/HomeFiveHero.svelte',
    'static/assets/daynight/hero/home-05-showroom-exterior.webp'
  ]
};
const STYLE_EXTENSION = /\.(?:css|pcss|scss|sass)$/i;
const HERO_ASSET = /(?:^|[\/_.-])(?:hero|banner|masthead)(?:[\/_.-]|$)/i;
const MEDIA_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

function walkFiles(root, current = root, result = []) {
  if (!fs.existsSync(current)) return result;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) walkFiles(root, target, result);
    else if (entry.isFile()) result.push(path.relative(root, target).replaceAll('\\', '/'));
  }
  return result;
}

function normalizedPresentation(key, relative, buffer, profile) {
  if (key !== 'import' || relative !== 'src/lib/components/home/HomeFiveHero.svelte') {
    return buffer;
  }
  // The Import adapter may bind the existing map/phone actions to dealer data.
  // Normalize only those values; every class, style, element and surrounding
  // component line must remain byte-equivalent to the approved template.
  return Buffer.from(
    [profile?.business?.shortName, profile?.business?.name].filter(Boolean).sort((a,b)=>b.length-a.length).reduce((text,name)=>text.split(name).join('Day Night Auto'), buffer.toString('utf8'))
      .replace(/\{isEnglish \? 'Plovdiv, South Industrial Zone' : 'Пловдив, Индустриална зона - Юг'\}/g, '{__DEALER_ADDRESS__}')
      .replace(/\{isEnglish\s*\? 'Plovdiv, South Industrial Zone'\s*: 'Пловдив, Южна Индустриална зона'\}/g, '{__DEALER_ADDRESS__}')
      .replaceAll('{daynightContact.addressLabel}', '{__DEALER_ADDRESS__}')
      .replace("\n\timport { daynightContact } from '$lib/data/daynight';", '')
      .replace(
        /\tconst mobileShowroomMapHref\s*=\s*(?:'[^']*'|`[^`]*`);/,
        '\tconst mobileShowroomMapHref =\n\t\t__DEALER_MAP_HREF__;'
      )
      .replace(
        /\tconst mobileShowroomPhoneHref = (?:'[^']*'|daynightContact\.primaryPhoneHref);/,
        '\tconst mobileShowroomPhoneHref = __DEALER_PHONE_HREF__;'
      )
  );
}

export function protectedPresentationPaths({ key, template, candidate }) {
  const templateFiles = walkFiles(template);
  const candidateFiles = walkFiles(candidate);
  const templateSet = new Set(templateFiles);
  const paths = new Set(EXACT_PROTECTED_PATHS[key] || []);
  for (const relative of [...templateFiles, ...candidateFiles]) {
    if (STYLE_EXTENSION.test(relative)) paths.add(relative);
    // Protect the approved template's own hero/banner media. Dealer inventory
    // folders may contain files with "hero" in their names, but those additions
    // are harmless unless template-owned components or data start referencing them.
    if (templateSet.has(relative) && MEDIA_EXTENSION.test(relative) && HERO_ASSET.test(relative)) {
      paths.add(relative);
    }
    if (key === 'auto-best' && relative.startsWith('src/lib/components/home/') && relative.endsWith('.svelte')) {
      paths.add(relative);
    }
  }
  return [...paths].sort();
}

export function assertTemplatePresentation({ key, template, candidate, profile }) {
  const changed = [];
  for (const relative of protectedPresentationPaths({ key, template, candidate })) {
    const expected = path.join(template, relative);
    const actual = path.join(candidate, relative);
    if (!fs.existsSync(expected) || !fs.existsSync(actual)) {
      changed.push(`${relative} (missing or added)`);
      continue;
    }
    const expectedBuffer = normalizedPresentation(key, relative, fs.readFileSync(expected), profile);
    const actualBuffer = normalizedPresentation(key, relative, fs.readFileSync(actual), profile);
    if (!expectedBuffer.equals(actualBuffer)) changed.push(relative);
  }
  if (changed.length) {
    throw new Error(`${key}: dealer overlay changed template-owned presentation: ${changed.join(', ')}`);
  }
  return true;
}
