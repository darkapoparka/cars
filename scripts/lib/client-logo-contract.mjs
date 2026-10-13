import fs from 'node:fs';
import {bindCurrentImportLogoAssets} from './client-presentation-policy.mjs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {replaceCandidateFile} from '../dealer-updates/three-way-upgrade.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(file, 'utf8');
const publicRoot = (key, root) => path.join(root, key === 'modern' ? 'apps/web/public' : 'static');
const copyLogoAsset=(source,target)=>{fs.mkdirSync(path.dirname(target),{recursive:true});const previous=fs.existsSync(target)?sha256(fs.readFileSync(target)):null;replaceCandidateFile(target,fs.readFileSync(source),{expectedPreviousSha256:previous});};
const walk = (dir, files = []) => {
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(item.name)) continue;
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file, files);
    else if (/\.(?:svelte|tsx?|css)$/.test(file)) files.push(file);
  }
  return files;
};

export function loadLogoContract(client) {
  const file = path.join(client, 'branding/logo-contract.json');
  if (!fs.existsSync(file)) return null;
  const contract = JSON.parse(read(file));
  for (const surface of ['onLight', 'onDark', 'onAccent']) {
    const asset = contract.assets[surface];
    if (!asset || !/^\/dealer-brand\/[^/]+\.webp$/.test(asset.publicPath)) throw Error(`Invalid ${surface} logo contract: ${file}`);
    const bytes = fs.readFileSync(path.join(client, asset.publicPath.slice(1)));
    if (sha256(bytes) !== asset.sha256) throw Error(`Approved ${surface} logo bytes changed without updating the contract: ${file}`);
  }
  return contract;
}

export function stripModernAlternateWordmark(text) {
  const marker = '{wordmarkTone === "original" ? null : (';
  if (!text.includes(marker)) return text;
  const next = text.replace(
    /\r?\n\s*\{wordmarkTone === "original" \? null : \([\s\S]*?\r?\n\s*\)\}(?=\r?\n\s*<\/span>)/,
    ''
  );
  if (next === text || next.includes(marker)) {
    throw new Error('Could not remove the complete Modern alternate wordmark expression');
  }
  return next;
}

/** Bind the parent-selected dealer logo into the extracted mobile child. */
export function bindModernMobileWordmarkLogo(text) {
  const marker = 'function DealerMobileWordmark(';
  const start = text.indexOf(marker);
  if (start < 0) return text; // Older templates render the image in the parent.
  const end = text.indexOf('export const DealerMobileBrandBar', start);
  if (end < 0) throw Error('Missing Modern mobile wordmark parent boundary');
  const child = text.slice(start, end);
  if (!child.includes('src={logoSource}')) return text;
  const signature = /function DealerMobileWordmark\(\{([\s\S]*?)\}: \{([\s\S]*?)\}\) \{/;
  const matched = signature.exec(child);
  if (!matched) throw Error('Unknown Modern mobile wordmark signature');
  const hasBinding = /\blogoSource\s*(?:,|$)/.test(matched[1].trim());
  const hasType = /(?:^|\s)(?:readonly\s+)?logoSource:\s*string;/.test(matched[2]);
  if (hasBinding !== hasType) throw Error('Incomplete Modern mobile wordmark logo prop');
  let nextChild = child;
  if (!hasBinding) nextChild = child.replace(signature, (_, bindings, types) =>
    'function DealerMobileWordmark({' + bindings + '  logoSource,\n}: {' + types + '  readonly logoSource: string;\n}) {');
  let parent = text.slice(end), calls = 0;
  parent = parent.replace(/<DealerMobileWordmark\b([^>]*?)\/>/g, (call, props) => {
    calls++;
    if (/\blogoSource=/.test(props)) {
      if (!/\blogoSource=\{logoSource\}/.test(props)) throw Error('Unexpected Modern mobile wordmark logo binding');
      return call;
    }
    return '<DealerMobileWordmark' + props.trimEnd() + ' logoSource={logoSource} />';
  });
  if (!calls) throw Error('Missing Modern mobile wordmark call');
  return text.slice(0, start) + nextChild + parent;
}

export function normalizeModernFinancingLogo(text) {
  const start = text.indexOf('<span className="relative block aspect-[1780/512] w-28">');
  const end = text.indexOf('</span>', start);
  const extractedFinance = /import\s*\{\s*ListingFinanceCard\s*\}\s*from\s*["']\.\/listing-finance-card["']/.test(text)
    && /<ListingFinanceCard(?:\s|\/?>)/.test(text)
    && !/leadSite\.logo(?:Path|OnAccent)\b/.test(text);
  // The current artwork card has no inline dealer wordmark to replace. Keep
  // that reviewed composition, while retaining the older inline-logo adapter.
  if (start < 0 && (text.includes('ListingCtaBanner') || extractedFinance)) return text;
  if (start < 0 || end < 0) throw Error('Missing Modern financing logo anchor');
  return text.slice(0, start) + '<span className="relative block aspect-[1780/512] w-28">\n                <Image alt={leadSite.name} className="h-full w-full object-contain" height={512} sizes="112px" src={leadSite.logoOnAccent} width={1780} />\n              </span>' + text.slice(end + 7);
}

export function applyDealerLogoContract({ key, oldVariant, candidate, profile }) {
  const contract = profile.logoContract ?? loadLogoContract(path.dirname(oldVariant));
  if (!contract) return [];
  const p = Object.fromEntries(Object.entries(contract.assets).map(([surface, asset]) => [surface, asset.publicPath]));
  const changed = [];
  const edit = (relative, transform) => {
    const file = path.join(candidate, relative);
    if (!fs.existsSync(file)) throw Error(`Missing logo consumer ${key}/${relative}`);
    const before = read(file), after = transform(before);
    if (before !== after) { fs.writeFileSync(file, after); changed.push(relative); }
  };
  const scalar = (text, name, value) => text.replace(new RegExp(`(\\b${name}\\s*:\\s*)['\"][^'\"]*['\"]`), (_, prefix) => prefix + JSON.stringify(value));
  for (const asset of Object.values(contract.assets)) {
    const source = path.join(path.dirname(oldVariant), asset.publicPath.slice(1));
    const target = path.join(publicRoot(key, candidate), asset.publicPath.slice(1));
    copyLogoAsset(source, target);
  }
  const brandRoot = path.join(path.dirname(oldVariant), 'branding');
  const lightPng = path.join(brandRoot, 'logo-on-light.png');
  const originalMaster=fs.existsSync(lightPng)?lightPng:path.join(brandRoot,'logo-master.png');
  const reviewedLight=path.join(path.dirname(oldVariant),contract.assets.onLight.publicPath.slice(1));
  const masterPng=fs.existsSync(originalMaster)?originalMaster:reviewedLight;
  const aliases = key === 'carwow' ? ['brand/daynight-logo-generated.png', 'brand/daynight-logo-lockup.png'] : key === 'modern' ? ['lead-logo.png'] : key === 'auto-best' ? ['assets/images/lead/day-night-logo.png'] : [];
  if(aliases.length&&!fs.existsSync(originalMaster)&&!fs.readFileSync(masterPng).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('Legacy logo aliases require the reviewed PNG surface');
  for (const alias of aliases) {
    const target=path.join(publicRoot(key,candidate),alias);copyLogoAsset(masterPng,target);
    changed.push((key === 'modern' ? 'apps/web/public/' : 'static/') + alias);
  }
  if (key === 'auto-best') {
    edit('src/lib/config/brand.ts', text => scalar(scalar(text, 'logo', p.onLight), 'logoOnDark', p.onDark));
    for (const file of walk(path.join(candidate, 'src/lib/components')).filter(f => /Footer\.svelte$/.test(f))) {
      const relative = path.relative(candidate, file);
      edit(relative, text => text.replace(/brand\.logo\b/g, 'brand.logoOnDark'));
    }
  } else if (key === 'modern') {
    edit('packages/marketplace/lead-site.ts', text => {
      text = scalar(text, 'logoPath', p.onDark);
      text = text.replace(/^  logoOn(?:Light|Dark|Accent): [^\n]*\n/gm, '');
      if (!text.includes('readonly logoOnLight:')) text = text.replace('readonly logoPath: string;', 'readonly logoPath: string;\n  readonly logoOnLight: string;\n  readonly logoOnDark: string;\n  readonly logoOnAccent: string;');
      text = text.replace(/(\n\s*logoPath: [^\n]+\n)/, `$1  logoOnLight: ${JSON.stringify(p.onLight)},\n  logoOnDark: ${JSON.stringify(p.onDark)},\n  logoOnAccent: ${JSON.stringify(p.onAccent)},\n`);
      return text;
    });
    edit('packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx', text => {
      const source = 'wordmarkTone === "light" ? leadSite.logoOnDark : wordmarkTone === "dark" || light ? leadSite.logoOnLight : leadSite.logoOnDark';
      text = text.replace(/,\r?\n\s*light && "h-10 bg-black px-2\.5"/, '');
      const clippedPrimary = /src=\{leadSite\.logoPath\}(?:\s*style=\{[\s\S]*?\r?\n\s*\})?/;
      if (clippedPrimary.test(text)) text = text.replace(clippedPrimary, 'src={logoSource}');
      else if (text.includes('src={' + source + '}')) text = text.replace('src={' + source + '}', 'src={logoSource}');
      else if (!text.includes('src={logoSource}')) throw Error('Missing Modern mobile logo source');
      const useOnLightDeclaration = '  const useOnLight = wordmarkTone === "dark" || (wordmarkTone === "original" && light);';
      const logoSourceDeclaration = '  const logoSource = useOnLight ? leadSite.logoOnLight : leadSite.logoOnDark;';
      const hasUseOnLightDeclaration = text.includes(useOnLightDeclaration);
      const hasLogoSourceDeclaration = text.includes(logoSourceDeclaration);
      if (hasUseOnLightDeclaration !== hasLogoSourceDeclaration) throw Error('Incomplete Modern mobile logo declarations');
      if (!hasLogoSourceDeclaration) {
        const anchor = '  const clean = tone === "clean";';
        if (!text.includes(anchor)) throw Error('Missing Modern mobile logo declaration anchor');
        text = text.replace(anchor, `${anchor}\n${useOnLightDeclaration}\n${logoSourceDeclaration}`);
      }
      text = stripModernAlternateWordmark(text);
      text = bindModernMobileWordmarkLogo(text);
      if (/clipPath|brightness-0|\binvert\b/.test(text)) throw Error('Obsolete clipped Modern mobile logo survived');
      return text;
    });
    edit('packages/marketplace-ui/components/listing-detail-content.tsx', normalizeModernFinancingLogo);
    for (const file of ['packages/marketplace-ui/components/seller-identity-card.tsx', 'apps/web/lib/public-marketplace-data.ts', 'apps/web/app/[locale]/layout.tsx']) {
      edit(file, text => text.replaceAll('leadSite.logoPath', 'leadSite.logoOnLight').replace('type: "image/png", url: leadSite.logoOnLight', 'type: "image/webp", url: leadSite.logoOnLight'));
    }
  } else if (key === 'carwow') {
    edit('src/lib/data/daynight-site.ts', text => scalar(scalar(text, 'logoLight', p.onDark), 'logoDark', p.onLight));
    for (const file of walk(path.join(candidate, 'src'))) {
      const relative = path.relative(candidate, file).replaceAll('\\', '/');
      if (!/daynightSite\.logoLight/.test(read(file))) continue;
      const name = path.basename(file);
      const onLight = /^(DesktopDealerProfilePage|BlogArticlePage|MobileHomeDiscovery|SiteChromeNavRow)\.svelte$/.test(name) || relative === 'src/routes/+layout.svelte' || relative === 'src/routes/+error.svelte';
      if (onLight) edit(relative, text => text.replaceAll('daynightSite.logoLight', 'daynightSite.logoDark'));
      if (name === 'MobileHeader.svelte') edit(relative, text => text.replace('resolve(daynightSite.logoLight)', "resolve(banner ? daynightSite.logoLight : daynightSite.logoDark)"));
      if (name === 'SiteHeader.svelte') edit(relative, text => text.replace("variant === 'home' ? daynightSite.logoLight : daynightSite.logoDark", 'daynightSite.logoDark'));
    }
  } else if (key === 'import') {
    if (fs.existsSync(path.join(candidate, 'src/lib/config/dealer.ts'))) {
      edit('src/lib/config/dealer.ts', text => bindCurrentImportLogoAssets(text, p));
    } else {
      edit('src/lib/data/daynight.ts', text => scalar(scalar(text, 'logoLight', p.onDark), 'logoDark', p.onLight));
    }
    for (const relative of [
      'src/lib/content/sell-your-car.ts',
      'src/lib/server/auxero-listing-data.ts',
      'src/lib/server/inventory-options.ts',
      'src/routes/offer/+page.svelte'
    ]) {
      if (!fs.existsSync(path.join(candidate, relative))) continue;
      edit(relative, text => {
        const fallback = /(['"])\/brand\/daynight-wordmark\.svg\1/g;
        const matches = [...text.matchAll(fallback)];
        if (matches.length > 1) throw Error(`Ambiguous Import fallback logo: ${relative}`);
        return text.replace(fallback, () => JSON.stringify(p.onLight));
      });
    }
  }
  return changed;
}

/** Exact source-only Modern mobile correction reviewed in Cars issue15/6138426891.
 * The two existing on-dark raster bindings are retained. Layout tone remains
 * clean; the independently specified wordmark tone follows the dark surface.
 * No App binding, desktop palette, dealer configuration or artwork is changed. */
const reviewedModernDarkSource = {
  "dealer-mobile-brand-bar.tsx": {
    "beforeSha256": "1c998e9fb24930fdd14ff2453f62ec32a42b30e0ef8b311ab22c7217e1cd4948",
    "afterSha256": "1ccaac2d0758b9cee14dc250a77e602f08b3227961cc098969d99f94434a661d",
    "from": "return (\n    <span className=\"relative block aspect-[1780/512] w-[144px] max-w-[48vw]\">\n      <Image\n        alt={leadSite.name}\n        className=\"h-full w-full object-contain\"\n        height={512}\n        priority\n        sizes=\"(max-width: 1023px) 144px, 0px\"\n        src={leadSite.logoPath}\n        style={\n          wordmarkTone === \"original\"\n            ? undefined\n            : { clipPath: \"inset(0 68% 0 0)\" }\n        }\n        width={1780}\n      />\n      {wordmarkTone === \"original\" ? null : (\n        <Image\n          alt=\"\"\n          aria-hidden=\"true\"\n          className={cn(\n            \"pointer-events-none absolute inset-0 h-full w-full object-contain [clip-path:inset(0_0_0_32%)]\",\n            wordmarkTone === \"light\" ? \"brightness-0 invert\" : \"brightness-0\"\n          )}\n          height={512}\n          priority\n          sizes=\"(max-width: 1023px) 144px, 0px\"\n          src={leadSite.logoPath}\n          width={1780}\n        />\n      )}",
    "to": "// Tone is the painted logo surface, not the layout-only \"clean\" flag.\n  // Dark chrome and its black logo badge use the committed inverse raster.\n  const onDarkSurface =\n    wordmarkTone === \"light\" || (wordmarkTone === \"original\" && !clean);\n  const logoSrc = onDarkSurface\n    ? (leadSite.logoInversePath ?? leadSite.logoPath)\n    : leadSite.logoPath;\n\n  return (\n    <span className=\"relative block aspect-[1780/512] w-[144px] max-w-[48vw]\">\n      <Image\n        alt={leadSite.name}\n        className=\"h-full w-full object-contain\"\n        height={512}\n        priority\n        sizes=\"(max-width: 1023px) 144px, 0px\"\n        src={logoSrc}\n        width={1780}\n      />"
  },
  "mobile-dealer-discovery-header.tsx": {
    "beforeSha256": "6b737fa77db6f3d24f5f64c38dbdba42c2a6dcf4e1f6200915e1cc800a5fe322",
    "afterSha256": "18a13c6a31966cbb5be290c7ccedb4316e2e57f5a99f2b450a55fc281e537529",
    "from": " isBg={isBg} locale={locale} tone=\"clean\"",
    "to": "\n              isBg={isBg}\n              locale={locale}\n              tone=\"clean\"\n              wordmarkTone=\"light\"\n           "
  }
};
export function repairModernDarkDiscoverySource(name, source) {
  const fix = reviewedModernDarkSource[name];
  if (!fix || typeof source !== 'string') throw new Error('Unreviewed Modern mobile source target');
  const actual = sha256(source);
  if (actual === fix.afterSha256) return {source, changed: false};
  if (actual !== fix.beforeSha256 || source.split(fix.from).length !== 2)
    throw new Error('Modern mobile source differs from the reviewed before lease');
  const next = source.replace(fix.from, () => fix.to);
  if (sha256(next) !== fix.afterSha256) throw new Error('Modern mobile source repair differs from the reviewed result');
  return {source: next, changed: true};
}
