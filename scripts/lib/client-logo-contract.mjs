import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(file, 'utf8');
const publicRoot = (key, root) => path.join(root, key === 'modern' ? 'apps/web/public' : 'static');
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
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(source, target);
  }
  const brandRoot = path.join(path.dirname(oldVariant), 'branding');
  const lightPng = path.join(brandRoot, 'logo-on-light.png');
  const masterPng = fs.existsSync(lightPng) ? lightPng : path.join(brandRoot, 'logo-master.png');
  const aliases = key === 'carwow' ? ['brand/daynight-logo-generated.png', 'brand/daynight-logo-lockup.png'] : key === 'modern' ? ['lead-logo.png'] : key === 'auto-best' ? ['assets/images/lead/day-night-logo.png'] : [];
  for (const alias of aliases) {
    const target = path.join(publicRoot(key, candidate), alias); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(masterPng, target);
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
      if (clippedPrimary.test(text)) text = text.replace(clippedPrimary, 'src={' + source + '}');
      else if (!text.includes('src={' + source + '}')) throw Error('Missing Modern mobile logo source');
      text = stripModernAlternateWordmark(text);
      if (/clipPath|brightness-0|\binvert\b/.test(text)) throw Error('Obsolete clipped Modern mobile logo survived');
      return text;
    });
    edit('packages/marketplace-ui/components/listing-detail-content.tsx', text => {
      const start = text.indexOf('<span className="relative block aspect-[1780/512] w-28">');
      const end = text.indexOf('</span>', start);
      if (start < 0 || end < 0) throw Error('Missing Modern financing logo anchor');
      return text.slice(0, start) + '<span className="relative block aspect-[1780/512] w-28">\n                <Image alt={leadSite.name} className="h-full w-full object-contain" height={512} sizes="112px" src={leadSite.logoOnAccent} width={1780} />\n              </span>' + text.slice(end + 7);
    });
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
    edit('src/lib/data/daynight.ts', text => scalar(scalar(text, 'logoLight', p.onDark), 'logoDark', p.onLight));
  }
  return changed;
}
