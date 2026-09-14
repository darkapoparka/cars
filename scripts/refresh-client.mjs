import fs from 'node:fs';
import path from 'node:path';
import { copySource } from './copy-source.mjs';
import { verifyTemplate } from './template-release.mjs';
import { ROOT, args, git, inside, json, validateManifest, writeJson } from './lib/workflow.mjs';
import { dealerGuidance } from './lib/dealer-guidance.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';

const TEMPLATE_KEYS = ['auto-best', 'modern', 'import', 'carwow'];
const exists = (file) => fs.existsSync(file);
const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const copy = (source, target) => { if (!exists(source)) return false; fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(source, target); return true; };
const safeString = (value) => JSON.stringify(String(value ?? ''));
const compact = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function dealerFacts(client) {
  const file = path.join(client, 'business-facts.json');
  const raw = exists(file) ? json(file) : {};
  const business = raw.business || raw;
  const vehicles = Array.isArray(raw.vehicles) ? raw.vehicles : [];
  return { raw, business, vehicles };
}

function manifestIdentity(root, slug, client, existing = null) {
  if (existing) return validateManifest(existing);
  const { business } = dealerFacts(client);
  const registryFile = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
  const registry = exists(registryFile) ? json(registryFile) : { dealers: [] };
  const record = registry.dealers?.find((dealer) => dealer.slug === slug) || {};
  const local = TEMPLATE_KEYS.filter((key) => exists(path.join(client, key)));
  const recorded = record.variants?.map((variant) => typeof variant === 'string' ? variant : variant.key).filter((key) => local.includes(key)) || local;
  const ordered = ['auto-best', recorded.includes('import') ? 'import' : 'modern', 'carwow'];
  if (!ordered.every((key) => local.includes(key))) throw new Error(`Cannot infer supported three-design set for ${slug}.`);
  const repository = record.repository || record.delivery?.repository?.replace(/^https:\/\/github\.com\//, '') || (slug === 'excellent-cars' ? 'darkapoparka/excellent-cars' : `darkapoparka/cars-${compact(slug)}`);
  const country = String(business.countryCode || business.country || '').toUpperCase();
  const language = country === 'BG' || /БЪЛГАР/.test(country) ? 'bg' : 'en';
  const variants = ordered.map((key, index) => ({ key, base: index ? `/variant-${index + 1}` : '', entry: index ? (key === 'modern' ? `/variant-${index + 1}/cars` : `/variant-${index + 1}/`) : '/' }));
  const extraAssets = ['assets', 'verify-content.mjs'].filter((name) => exists(path.join(client, name)));
  return validateManifest({ schemaVersion: 1, slug, dealerId: record.id || null, repository, defaultBranch: 'main', language, variants, extraAssets, packaging: { version: '1' }, switcher: { language, accent: '#2563eb' } });
}

function publicRoot(key, variant) {
  return key === 'modern' ? path.join(variant, 'apps/web/public') : path.join(variant, 'static');
}
function dealerDirectoryName(name, slug) {
  const normalized = compact(name), token = compact(slug);
  return ['dealer', 'navara'].includes(normalized) || (token.length >= 4 && (normalized === token || normalized.includes(token)));
}
function copyDealerDirectories(oldVariant, candidate, key, slug) {
  const sourceRoot = publicRoot(key, oldVariant), targetRoot = publicRoot(key, candidate), copied = [];
  if (!exists(sourceRoot)) return copied;
  const walkTop = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name, source = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (dealerDirectoryName(entry.name, slug) || (rel === 'assets' && dealerDirectoryName(entry.name, slug))) {
          const copyTree = (from, nested = '') => { for (const item of fs.readdirSync(from, { withFileTypes: true })) { const nr = nested ? `${nested}/${item.name}` : item.name, src = path.join(from,item.name), dst = path.join(targetRoot,childRel,nr); if (item.isDirectory()) copyTree(src,nr); else if (item.isFile()) { copy(src,dst); copied.push(`${childRel}/${nr}`); } } };
          copyTree(source);
        } else if (!rel && entry.name === 'assets') walkTop(source, 'assets');
      }
    }
  };
  walkTop(sourceRoot);
  return copied;
}
function assetReferences(file) {
  if (!exists(file)) return [];
  const text = read(file), refs = [];
  for (const match of text.matchAll(/["'`](\/[^"'`?#]+\.(?:png|jpe?g|webp|svg|ico|avif))(?:\?[^"'`]*)?["'`]/gi)) refs.push(match[1]);
  return [...new Set(refs)];
}
function copyReferencedAssets(oldVariant, candidate, key, overlayFiles) {
  const sourceRoot = publicRoot(key, oldVariant), targetRoot = publicRoot(key, candidate), copied = [];
  for (const relative of overlayFiles) {
    if (relative.includes(' (')) continue;
    const file = path.join(candidate, relative);
    for (const publicPath of assetReferences(file)) {
      const rel = publicPath.replace(/^\//, ''), source = path.join(sourceRoot, rel), target = path.join(targetRoot, rel);
      if (exists(source) && !exists(target)) { copy(source, target); copied.push(rel); }
    }
  }
  return copied;
}
function copyIdentityAssets(oldVariant, candidate, key, paths) {
  const sourceRoot = publicRoot(key, oldVariant), targetRoot = publicRoot(key, candidate), copied = [];
  for (const publicPath of paths.filter(Boolean)) {
    if (!publicPath.startsWith('/')) continue;
    const rel = publicPath.replace(/^\//, ''), source = path.join(sourceRoot, rel), target = path.join(targetRoot, rel);
    if (exists(source)) { copy(source, target); copied.push(rel); }
  }
  return copied;
}

function copyAddedDealerData(oldDir, newDir) {
  const copied = [];
  if (!exists(oldDir)) return copied;
  for (const entry of fs.readdirSync(oldDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const target = path.join(newDir, entry.name);
    if (!exists(target) && /(dealer|stock|source|data|inventory|listings)/i.test(entry.name)) { copy(path.join(oldDir, entry.name), target); copied.push(entry.name); }
  }
  return copied;
}

function findOldPath(text, key) {
  return text.match(new RegExp(`${key}\\s*:\\s*['\"]([^'\"]+)['\"]`))?.[1] || null;
}
function pickLogo(oldVariant, key, dark = false) {
  const source = key === 'modern' ? path.join(oldVariant, 'packages/marketplace/lead-site.ts') : key === 'auto-best' ? path.join(oldVariant, 'src/lib/config/brand.ts') : null;
  if (source && exists(source)) {
    const text = read(source);
    const keys = key === 'modern' ? ['logoPath'] : dark ? ['logoOnDark', 'logoDark', 'logo'] : ['logo', 'logoLight'];
    for (const item of keys) { const found = findOldPath(text, item); if (found) return found; }
  }
  const publicRoot = key === 'modern' ? path.join(oldVariant, 'apps/web/public') : path.join(oldVariant, 'static');
  const preferred = dark ? ['logo-on-dark.png','logo-dark.png','wordmark-light.svg','logo-light.png','logo.png'] : ['logo-on-light.png','logo-light.png','wordmark.svg','logo.png'];
  for (const folder of ['', 'dealer', 'brand', 'navara']) for (const name of preferred) if (exists(path.join(publicRoot, folder, name))) return `/${[folder,name].filter(Boolean).join('/')}`;
  return null;
}

function patchAutoBest({ oldVariant, candidate, facts }) {
  const copied = [];
  const dataOld = path.join(oldVariant, 'src/lib/data'), dataNew = path.join(candidate, 'src/lib/data');
  for (const name of ['company.ts','demo-content.ts','editorial.ts','inventory.ts','listing.ts','navigation.ts','videos.ts']) if (copy(path.join(dataOld,name), path.join(dataNew,name))) copied.push(`src/lib/data/${name}`);
  copied.push(...copyAddedDealerData(dataOld, dataNew).map((name) => `src/lib/data/${name}`));
  if (exists(path.join(oldVariant, 'src/lib/config/template.ts'))) { copy(path.join(oldVariant, 'src/lib/config/template.ts'), path.join(candidate, 'src/lib/config/template.ts')); copied.push('src/lib/config/template.ts'); }
  const b = facts.business, freshBrand = path.join(candidate, 'src/lib/config/brand.ts');
  let text = read(freshBrand);
  const logo = pickLogo(oldVariant, 'auto-best', false) || findOldPath(text, 'logo');
  const logoDark = pickLogo(oldVariant, 'auto-best', true) || logo;
  const replacements = {
    "const name = 'Auto Best';": `const name = ${safeString(b.name || b.shortName || 'Dealer')};`,
    "const shortName = 'Auto Best';": `const shortName = ${safeString(b.shortName || b.name || 'Dealer')};`,
    "const city = 'София';": `const city = ${safeString(b.city || '')};`,
    "const addressLine = 'ул. „Атанас Манчев“ 18, Студентски град';": `const addressLine = ${safeString(b.addressLine || b.address || '')};`
  };
  for (const [from,to] of Object.entries(replacements)) text = text.replace(from,to);
  const social = b.socialLinks || {};
  text = text.replace(/youtubeUrl: '[^']*'/, `youtubeUrl: ${safeString(social.youtube || 'https://www.youtube.com/')}`)
    .replace(/instagramUrl: '[^']*'/, `instagramUrl: ${safeString(social.instagram || 'https://www.instagram.com/')}`)
    .replace(/facebookUrl: '[^']*'/, `facebookUrl: ${safeString(social.facebook || 'https://www.facebook.com/')}`)
    .replace(/phone: '[^']*'/, `phone: ${safeString(b.phoneDisplay || b.phone || '')}`)
    .replace(/phoneHref: 'tel:[^']*'/, `phoneHref: ${safeString(`tel:${b.phoneE164 || b.phone || ''}`)}`)
    .replace(/appointment: '[^']*'/, `appointment: ${safeString(b.hours || 'Посещения с предварителна уговорка')}`)
    .replace(/logo: '[^']*'/, `logo: ${safeString(logo)}`)
    .replace(/logoOnDark: '[^']*'/, `logoOnDark: ${safeString(logoDark)}`);
  fs.writeFileSync(freshBrand, text); copied.push('src/lib/config/brand.ts');
  copied.push(...copyIdentityAssets(oldVariant, candidate, 'auto-best', [logo, logoDark]).map((item) => `asset:${item}`));
  const map = path.join(candidate, 'src/lib/components/company/ShowroomMap.svelte');
  if (!b.coordinates && exists(map)) {
    let mapText = read(map);
    mapText = mapText.replace("  import { showroomCoordinates } from '$data/company';\n\n  const mapEmbedUrl = `https://maps.google.com/maps?q=${showroomCoordinates.latitude},${showroomCoordinates.longitude}&z=17&hl=bg&output=embed`;", "  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(brand.address)}&z=16&hl=bg&output=embed`;");
    fs.writeFileSync(map, mapText); copied.push('src/lib/components/company/ShowroomMap.svelte (address adapter)');
  }
  return copied;
}

function replaceLeadScalar(text, key, value) {
  const rx = new RegExp(`(^\\s*${key}:\\s*)(?:\"[^\"]*\"|'[^']*'|true|false)(,?)`, 'm');
  return text.replace(rx, `$1${typeof value === 'boolean' ? String(value) : safeString(value)}$2`);
}
function patchModern({ oldVariant, candidate, facts }) {
  const copied = [];
  const testingOld = path.join(oldVariant, 'packages/marketplace-domain/testing'), testingNew = path.join(candidate, 'packages/marketplace-domain/testing');
  if (copy(path.join(testingOld, 'mock-data.ts'), path.join(testingNew, 'mock-data.ts'))) copied.push('packages/marketplace-domain/testing/mock-data.ts');
  copied.push(...copyAddedDealerData(testingOld, testingNew).map((name) => `packages/marketplace-domain/testing/${name}`));
  const oldLead = path.join(oldVariant, 'packages/marketplace/lead-site.ts'), newLead = path.join(candidate, 'packages/marketplace/lead-site.ts');
  let text = read(newLead), old = exists(oldLead) ? read(oldLead) : '';
  const b = facts.business, firstVehicle = facts.vehicles[0] || {};
  const logo = pickLogo(oldVariant, 'modern') || findOldPath(text, 'logoPath');
  const accent = old.match(/accent:\s*['\"]([^'\"]+)/)?.[1] || '#c40101';
  const tagline = old.match(/tagline:\s*['\"]([^'\"]+)/)?.[1] || `${b.name || 'Dealer'} · ${b.city || ''}`;
  const currency = firstVehicle.currency || old.match(/currency:\s*['\"]([^'\"]+)/)?.[1] || 'EUR';
  for (const [key,value] of Object.entries({accent,address:b.addressLine||b.address||'',city:b.city||'',contactUrl:`tel:${b.phoneE164||b.phone||''}`,country:b.country||'',countryCode:b.countryCode||'',currency,email:b.email||'',locale:(b.countryCode==='BG'?'bg-BG':'en-US'),logoPath:logo,mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(`${b.name||''}, ${b.address||b.addressLine||''}`)}&z=16&output=embed`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name||''}, ${b.address||b.addressLine||''}`)}`,name:b.name||'',phoneDisplay:b.phoneDisplay||b.phone||'',phoneHref:`tel:${b.phoneE164||b.phone||''}`,shortName:b.shortName||b.name||'',slug:b.slug||'',tagline,staticDemoMode:true})) text = replaceLeadScalar(text,key,value);
  text = text.replace(/^\s*district:\s*\{[^\n]+\},/m, `  district: { bg: ${safeString(b.city||'')}, en: ${safeString(b.city||'')} },`);
  const socials = b.socialLinks || {};
  text = text.replace(/\s*socialLinks:\s*\{[\s\S]*?\n\s*\},\n\s*staticDemoMode:/m, `\n  socialLinks: ${JSON.stringify(socials)},\n  staticDemoMode:`);
  fs.writeFileSync(newLead, text); copied.push('packages/marketplace/lead-site.ts');
  copied.push(...copyIdentityAssets(oldVariant, candidate, 'modern', [logo]).map((item) => `asset:${item}`));
  return copied;
}

function patchCarwow({ oldVariant, candidate, facts }) {
  const copied = [];
  const oldData = path.join(oldVariant, 'src/lib/data'), newData = path.join(candidate, 'src/lib/data');
  for (const name of ['daynight-blog.ts','daynight-current-inventory.ts','daynight-faq.ts','daynight-reviews.ts','daynight-team.ts','daynight-vehicles.ts','daynight-videos.ts','editorial-guides.ts']) if (copy(path.join(oldData,name), path.join(newData,name))) copied.push(`src/lib/data/${name}`);
  copied.push(...copyAddedDealerData(oldData, newData).map((name) => `src/lib/data/${name}`));
  const site = path.join(newData, 'daynight-site.ts'), oldSite = path.join(oldData, 'daynight-site.ts');
  let text = read(site), old = exists(oldSite) ? read(oldSite) : '';
  const b=facts.business, logoLight=findOldPath(old,'logoLight')||'/brand/daynight-logo.webp', logoDark=findOldPath(old,'logoDark')||logoLight;
  const constant = (name,value) => { text=text.replace(new RegExp(`const ${name} = '[^']*';`), `const ${name} = ${safeString(value)};`); };
  constant('phoneE164',b.phoneE164||b.phone||''); constant('city',b.city||''); constant('shortName',b.shortName||b.name||''); constant('district',b.city||''); constant('street',b.addressLine||b.address||'');
  text=text.replace(/name: 'DAY NIGHT AUTO GROUP'/,`name: ${safeString(b.name||'')}`)
    .replace(/phone: '[^']*'/,`phone: ${safeString(String(b.phoneE164||b.phone||'').replace(/\D/g,''))}`)
    .replace(/phoneLabel: '[^']*'/,`phoneLabel: ${safeString(b.phoneDisplay||b.phone||'')}`)
    .replace(/email: '[^']*'/,`email: ${safeString(b.email||'')}`)
    .replace(/hoursLabel: '[^']*'/,`hoursLabel: ${safeString(b.hours||'Огледи с предварителна уговорка')}`)
    .replace(/sourceInventory: '[^']*'/,`sourceInventory: ${safeString(b.marketplaceUrl||'')}`)
    .replace(/logoLight: '[^']*'/,`logoLight: ${safeString(logoLight)}`)
    .replace(/logoDark: '[^']*'/,`logoDark: ${safeString(logoDark)}`)
    .replace(/heroTitle: '[^']*'/,`heroTitle: ${safeString(b.name||'')}`)
    .replace(/heroSubtitle: '[^']*'/,`heroSubtitle: ${safeString(`${b.city||''} · ${facts.raw.inventoryNotice||'Автомобили и огледи'}`)}`)
    .replace("{ label: 'За Day Night Auto', href: '/about' }", `{ label: ${safeString(`За ${b.shortName||b.name||''}`)}, href: '/about' }`);
  fs.writeFileSync(site,text); copied.push('src/lib/data/daynight-site.ts');
  copied.push(...copyIdentityAssets(oldVariant, candidate, 'carwow', [logoLight, logoDark]).map((item) => `asset:${item}`));
  return copied;
}

function patchImport({ oldVariant, candidate, facts }) {
  const copied=[];
  const oldData=path.join(oldVariant,'src/lib/data'), newData=path.join(candidate,'src/lib/data');
  for(const name of ['daynight-listings.json','vehicles.ts','about-videos.ts','agents.ts','blog.ts','dealers.ts','import-criteria.ts']) if(copy(path.join(oldData,name),path.join(newData,name))) copied.push(`src/lib/data/${name}`);
  copied.push(...copyAddedDealerData(oldData,newData).map((name)=>`src/lib/data/${name}`));
  const oldDay=path.join(oldData,'daynight.ts'), day=path.join(newData,'daynight.ts'); let text=read(day), old=exists(oldDay)?read(oldDay):''; const b=facts.business;
  const block=(name,value)=>{const rx=new RegExp(`export const ${name} = \\{[\\s\\S]*?\\n\\} as const;`); text=text.replace(rx,`export const ${name} = ${JSON.stringify(value,null,2)} as const;`);};
  const oldAssets=old.match(/export const daynightAssets = (\{[\s\S]*?\n\}) as const;/)?.[1]; let logoDark='/assets/daynight/brand/daynight-logo-generated.png',logoLight=logoDark; if(oldAssets){logoDark=oldAssets.match(/logoDark['\"]?\s*:\s*['\"]([^'\"]+)/)?.[1]||logoDark;logoLight=oldAssets.match(/logoLight['\"]?\s*:\s*['\"]([^'\"]+)/)?.[1]||logoDark;}
  block('daynightContact',{primaryPhoneLabel:b.phoneDisplay||b.phone||'',primaryPhoneHref:`tel:${b.phoneE164||b.phone||''}`,marketplacePhoneLabel:b.phoneDisplay||b.phone||'',marketplacePhoneHref:`tel:${b.phoneE164||b.phone||''}`,emailLabel:b.email||'Онлайн запитване',emailHref:b.email?`mailto:${b.email}`:(b.contactsUrl||''),viberHref:'',facebookHref:b.socialLinks?.facebook||'',instagramHref:b.socialLinks?.instagram||'',tiktokHref:b.socialLinks?.tiktok||'',reviewsHref:'',youtubeHref:b.socialLinks?.youtube||'',addressLabel:b.address||b.addressLine||'',appointmentNote:b.hours||'Огледи с предварителна уговорка',mapEmbedUrl:`https://maps.google.com/maps?q=${encodeURIComponent(`${b.name||''}, ${b.address||b.addressLine||''}`)}&z=16&output=embed`});
  block('daynightBrand',{name:b.name||'',displayName:b.name||'',bulgarianName:b.name||'',domain:`${b.slug||'dealer'}.demo`,tagline:`${b.city||''} · автомобили и огледи`,legalNote:facts.raw.previewNotice||'Демонстрационен проект.'});
  const freshAssets=read(path.join(ROOT,'templates/import/src/lib/data/daynight.ts')).match(/export const daynightAssets = (\{[\s\S]*?\n\}) as const;/)?.[1];
  if(freshAssets){let assets=JSON.parse(JSON.stringify({})); const hero=freshAssets.match(/hero:\s*'([^']+)'/)?.[1]||''; const footerImage=freshAssets.match(/footerImage:\s*'([^']+)'/)?.[1]||''; block('daynightAssets',{logoDark,logoLight,hero,homeHeroSlides:[],footerImage});}
  text=text.replace(/export const daynightConsultants = \[[\s\S]*?\n\] as const;/,`export const daynightConsultants: {slug:string; name:string; title:string; image:string}[] = [];`);
  fs.writeFileSync(day,text); copied.push('src/lib/data/daynight.ts'); copied.push(...copyIdentityAssets(oldVariant, candidate, 'import', [logoLight, logoDark]).map((item) => `asset:${item}`)); return copied;
}

function resetProjectMetadata(oldVariant, candidate, release, slug, key, workflowCommit, entry) {
  const projectFile=path.join(oldVariant,'.client/project.json'); const project=exists(projectFile)?json(projectFile):{};
  const prior=project.templateSource?.commit||project.templateVersion||null;
  const next={...project,schemaVersion:1,client:slug,templateKey:key,templateVersion:release.commit,state:'refreshed-needs-local-qa',publicUrl:null,qa:{desktop:false,mobile:false,identity:false,contactPath:false},templateSource:{repository:release.repository,commit:release.commit,digest:release.digest,exportPolicy:release.exportPolicy},packaging:{...(project.packaging||{}),version:'1',entry},workflowCommit,refresh:{previousTemplateVersion:prior,refreshedAt:new Date().toISOString(),approvedTemplateCommit:release.commit,mode:'fresh-template-plus-dealer-overlay'}};
  delete next.verification;delete next.previewUrl;delete next.runtime;delete next.updatedAt;
  fs.mkdirSync(path.join(candidate,'.client'),{recursive:true});writeJson(path.join(candidate,'.client/project.json'),next);
}
function rewriteSourceManifest(root,slug,key,candidate,release,workflowCommit,overlay){
  const file=path.join(candidate,'.template/source-manifest.json');const value=json(file);value.source=`templates/${key}`;value.destination=`clients/${slug}/${key}`;value.sourceCommit=workflowCommit;value.sourceTree=git(root,['rev-parse',`${workflowCommit}:templates/${key}`]);value.method='Approved Cars snapshot plus explicit dealer data/assets overlay';value.approvedTemplate={repository:release.repository,commit:release.commit,digest:release.digest,exportPolicy:release.exportPolicy};value.refresh={mode:'regenerate',overlay};delete value.git;delete value.copiedAt;writeJson(file,value);
}
const REFRESH_CACHE_NAMES = new Set([
  'node_modules', '.svelte-kit', '.next', '.turbo', '.vercel', 'dist', 'build'
]);
function copyRefreshTree(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (REFRESH_CACHE_NAMES.has(entry.name) || entry.name === '.git') continue;
    const from = path.join(source, entry.name), to = path.join(target, entry.name);
    if (entry.isDirectory()) copyRefreshTree(from, to);
    else if (entry.isFile()) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); }
  }
}
export function mirrorRefreshTree(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (REFRESH_CACHE_NAMES.has(entry.name) || entry.name === '.git') continue;
    const current = path.join(target, entry.name);
    const expected = path.join(source, entry.name);
    if (!exists(expected)) {
      fs.rmSync(current, { recursive: true, force: true });
      continue;
    }
    const expectedEntry = fs.lstatSync(expected);
    if (entry.isDirectory() && expectedEntry.isDirectory()) {
      mirrorRefreshTree(expected, current);
    } else if (entry.isDirectory() !== expectedEntry.isDirectory()) {
      fs.rmSync(current, { recursive: true, force: true });
    }
  }
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (REFRESH_CACHE_NAMES.has(entry.name) || entry.name === '.git') continue;
    const from = path.join(source, entry.name), to = path.join(target, entry.name);
    if (entry.isDirectory()) mirrorRefreshTree(from, to);
    else if (entry.isFile()) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); }
  }
}
function dirtyClientPaths(root,slug){return git(root,['status','--porcelain=v1','--untracked-files=all','--',`clients/${slug}`]).split(/\r?\n/).filter(Boolean);}

export async function planClientRefresh({root=ROOT,slug}){
  const client=inside(root,`clients/${slug}`,{mustExist:true}),dealerFile=path.join(client,'dealer.json');const manifest=manifestIdentity(root,slug,client,exists(dealerFile)?json(dealerFile):null),workflowCommit=git(root,['rev-parse','HEAD']);
  const runDir=inside(root,`runtime/client-refresh/${slug}/regen-${Date.now()}-${process.pid}`);fs.mkdirSync(runDir,{recursive:true});const facts=dealerFacts(client),profile=loadDealerProfile(client,slug),variants=[];
  for(const vm of manifest.variants){const key=vm.key,oldVariant=path.join(client,key),release=verifyTemplate(root,key),candidate=path.join(runDir,'candidate',key);fs.mkdirSync(path.dirname(candidate),{recursive:true});await copySource(path.join(root,release.snapshotPath),candidate,{key});let overlay=applyRefreshAdapter({key,oldVariant,candidate,profile});overlay.push(...copyDealerDirectories(oldVariant,candidate,key,slug)); overlay.push(...copyReferencedAssets(oldVariant,candidate,key,overlay));resetProjectMetadata(oldVariant,candidate,release,slug,key,workflowCommit,vm.entry);rewriteSourceManifest(root,slug,key,candidate,release,workflowCommit,overlay);fs.writeFileSync(path.join(candidate,'AGENTS.md'),dealerGuidance({slug,variants:manifest.variants,workflowCommit,variant:key}));variants.push({key,release:{repository:release.repository,commit:release.commit,digest:release.digest},candidate,overlay});}
  const report={schemaVersion:2,slug,workflowCommit,manifest,dirtyBefore:dirtyClientPaths(root,slug),variants,runDir,ready:true};writeJson(path.join(runDir,'proposal.json'),report);return report;
}
export async function refreshClient({root=ROOT,slug,write=false}) {
  const before=dirtyClientPaths(root,slug);
  if(write&&before.length) throw new Error(`Dealer source is dirty before refresh (${before.length} paths). Preserve or reconcile it first.`);
  const plan=await planClientRefresh({root,slug});
  if(!write) return plan;
  const client=path.join(root,'clients',slug),mirrored=[];
  try {
    for(const variant of plan.variants){
      const live=path.join(client,variant.key),backup=path.join(plan.runDir,'backup',variant.key);
      if(exists(backup)) fs.rmSync(backup,{recursive:true,force:true});
      copyRefreshTree(live,backup); mirrored.push({live,backup});
      mirrorRefreshTree(variant.candidate,live);
    }
    writeJson(path.join(client,'dealer.json'),plan.manifest);
    fs.writeFileSync(path.join(client,'AGENTS.md'),dealerGuidance({slug,variants:plan.manifest.variants,workflowCommit:plan.workflowCommit}));
    const receipt={...plan,written:true,writtenAt:new Date().toISOString(),dirtyAfter:dirtyClientPaths(root,slug)};
    writeJson(path.join(plan.runDir,'refresh.json'),receipt); return receipt;
  } catch(error) {
    for(const item of mirrored.reverse()) if(exists(item.backup)) mirrorRefreshTree(item.backup,item.live);
    throw error;
  }
}
async function main(){if(process.argv.includes('--help')){console.log('Usage: node scripts/refresh-client.mjs --client SLUG [--write]\nRegenerates existing variants from approved Cars snapshots, reapplies only dealer identity/content/inventory/assets, keeps template UI/hero/artwork, and preserves publishing identity.');return;}const o=args(process.argv.slice(2),['client'],['write']);if(!o.client)throw new Error('Use --client SLUG.');console.log(JSON.stringify(await refreshClient({slug:o.client,write:!!o.write}),null,2));}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch((error)=>{console.error(error.stack||error.message);process.exitCode=1;});
