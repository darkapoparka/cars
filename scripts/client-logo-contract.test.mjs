import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { stripModernAlternateWordmark, bindReviewedModernMobileSurfaceLogo, normalizeModernFinancingLogo, bindModernMobileWordmarkLogo, applyDealerLogoContract, loadLogoContract, loadReviewedSharingAsset } from './lib/client-logo-contract.mjs';

test('Modern logo normalization removes the complete alternate wordmark JSX expression', () => {
  const source = `<span className="relative">
    <Image
      alt={leadSite.name}
      className="h-full w-full object-contain"
      src={leadSite.logoPath}
    />
    {wordmarkTone === "original" ? null : (
      <Image
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          wordmarkTone === "light" ? "brightness-0 invert" : "brightness-0"
        )}
        src={leadSite.logoPath}
      />
    )}
  </span>`;

  const result = stripModernAlternateWordmark(source);
  assert.equal((result.match(/<Image/g) || []).length, 1);
  assert.match(result, /alt=\{leadSite\.name\}/);
  assert.doesNotMatch(result, /wordmarkTone === "original"/);
  assert.doesNotMatch(result, /aria-hidden|brightness-0/);
  assert.match(result, /<\/span>/);
  assert.equal(stripModernAlternateWordmark(result), result);
});

test('Modern financing adaptation preserves the extracted artwork card without inserting a wordmark', () => {
  const source = 'import { ListingFinanceCard } from "./listing-finance-card";\nconst card = <ListingFinanceCard artwork={leadSite.financingArtworkPath} href="/lease" />;';
  assert.equal(normalizeModernFinancingLogo(source), source);
  assert.equal(normalizeModernFinancingLogo(source.replaceAll('\n', '\r\n')), source.replaceAll('\n', '\r\n'));
  for (const unknown of [
    source.replace('import { ListingFinanceCard } from "./listing-finance-card";', ''),
    source.replace('artwork={leadSite.financingArtworkPath}', 'artwork={leadSite.logoPath}'),
    source.replace('artwork={leadSite.financingArtworkPath}', 'artwork={leadSite.logoOnAccent}'),
    'const card = <UnexpectedFinanceCard />;',
  ]) assert.throws(() => normalizeModernFinancingLogo(unknown), /Missing Modern financing logo anchor/);
});

test('Modern financing adaptation retains the approved accent logo in older inline compositions', () => {
  const source = '<section><span className="relative block aspect-[1780/512] w-28"><Image src={leadSite.logoPath} /></span><p>Financing</p></section>';
  const result = normalizeModernFinancingLogo(source);
  assert.match(result, /src=\{leadSite\.logoOnAccent\}/);
  assert.doesNotMatch(result, /src=\{leadSite\.logoPath\}/);
  assert.ok(result.endsWith('<p>Financing</p></section>'));
  assert.equal(normalizeModernFinancingLogo(result), result);
});

const extractedMobileWordmark = `function DealerMobileWordmark({
  clean,
  wordmarkTone,
}: {
  clean: boolean;
  wordmarkTone: WordmarkTone;
}) {
  if (publicSite.identity.desktopPreview) return <DealerDesktopLogo />;
  return <Image alt={leadSite.name} src={logoSource} />;
}
export const DealerMobileBrandBar = () => {
  const clean = false;
  const wordmarkTone = "original";
  const logoSource = useOnLight ? leadSite.logoOnLight : leadSite.logoOnDark;
  return <DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />;
};`;

test('Modern extracted mobile wordmark receives the parent-selected logo through a typed prop', () => {
  const result = bindModernMobileWordmarkLogo(extractedMobileWordmark);
  const [child, parent] = result.split('export const DealerMobileBrandBar');
  assert.match(child, /wordmarkTone,\s+logoSource,\s*\}: \{/);
  assert.match(child, /readonly logoSource: string;/);
  assert.match(parent, /<DealerMobileWordmark[^>]+logoSource=\{logoSource\}/);
  assert.equal((result.match(/const logoSource =/g) || []).length, 1);
  assert.match(child, /publicSite\.identity\.desktopPreview/);
  assert.match(result, /useOnLight \? leadSite\.logoOnLight : leadSite\.logoOnDark/);
  assert.equal(bindModernMobileWordmarkLogo(result), result);
});

test('Modern mobile wordmark binding supports retained CRLF source', () => {
  const result = bindModernMobileWordmarkLogo(extractedMobileWordmark.replaceAll('\n', '\r\n'));
  assert.match(result, /readonly logoSource: string;/);
  assert.equal(bindModernMobileWordmarkLogo(result), result);
});

test('Modern mobile wordmark binding leaves legacy inline and independently-bound children unchanged', () => {
  const inline = 'export const DealerMobileBrandBar = () => { const logoSource = leadSite.logoOnLight; return <Image src={logoSource} />; };';
  assert.equal(bindModernMobileWordmarkLogo(inline), inline);
  const independent = extractedMobileWordmark.replace('src={logoSource}', 'src={leadSite.logoOnLight}');
  assert.equal(bindModernMobileWordmarkLogo(independent), independent);
});

test('Modern mobile wordmark binding rejects unknown or incomplete component shapes', () => {
  assert.throws(() => bindModernMobileWordmarkLogo(extractedMobileWordmark.replace('export const DealerMobileBrandBar', 'export const UnknownHeader')), /parent boundary/);
  assert.throws(() => bindModernMobileWordmarkLogo(extractedMobileWordmark.replace('}: {', '}: Props = {')), /signature/);
  assert.throws(() => bindModernMobileWordmarkLogo(extractedMobileWordmark.replace('  wordmarkTone,', '  wordmarkTone,\n  logoSource,')), /Incomplete/);
  assert.throws(() => bindModernMobileWordmarkLogo(extractedMobileWordmark.replace('<DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />', '<Other />')), /wordmark call/);
  assert.throws(() => bindModernMobileWordmarkLogo(extractedMobileWordmark.replace('wordmarkTone={wordmarkTone} />', 'wordmarkTone={wordmarkTone} logoSource={differentLogo} />')), /Unexpected/);
});

const importFallbackPaths = [
  'src/lib/content/sell-your-car.ts',
  'src/lib/server/auxero-listing-data.ts',
  'src/lib/server/inventory-options.ts',
  'src/routes/offer/+page.svelte'
];
function importLogoFixture(t, extension = 'webp') {
  const parent = fs.realpathSync(os.tmpdir());
  const root = fs.mkdtempSync(path.join(parent, 'cars-import-fallback-'));
  t.after(() => {
    const absolute = fs.realpathSync(root);
    assert.equal(path.dirname(absolute), parent);
    assert(path.basename(absolute).startsWith('cars-import-fallback-'));
    fs.rmSync(absolute, { recursive: true });
  });
  const candidate = path.join(root, 'candidate');
  const write = (name, bytes) => {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
  };
  const bytes = Buffer.from(extension === 'png'
    ? 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF9sAAAAASUVORK5CYII='
    : 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v89WAAAAA==', 'base64');
  const digest = createHash('sha256').update(bytes).digest('hex');
  const assets = Object.fromEntries(['onLight', 'onDark', 'onAccent'].map(surface => {
    const publicPath = extension === 'png' ? `/registered-branding/${surface}.png` : `/dealer-brand/${surface}.webp`;
    write(publicPath.slice(1), bytes);
    return [surface, { publicPath, sha256: digest }];
  }));
  write('candidate/src/lib/config/dealer.ts', "export const daynightAssets = {\n logoLight: '/brand/daynight-wordmark.svg',\n logoDark: '/brand/daynight-wordmark.svg'\n} as const;\nexport const palette = { accent: '#ff0000' };\n");
  return { root, candidate, write, bytes, contract: { assets }, apply: () => applyDealerLogoContract({ key: 'import', oldVariant: path.join(root, 'import'), candidate, profile: { logoContract: { assets } } }) };
}

for (const extension of ['webp', 'png']) test(`Import binds four native fallback consumers to the selected ${extension} raster only`, t => {
  const fixture = importLogoFixture(t, extension);
  const original = importFallbackPaths.map((name, index) => {
    const quote = index % 2 ? '"' : "'";
    const text = `const retained = '/customer/custom-logo.svg';\r\nconst fallback = ${quote}/brand/daynight-wordmark.svg${quote};\r\nconst palette = '#ff0000';\r\n<style>.card{color:#fff;gap:8px}</style>\r\n`;
    fixture.write('candidate/' + name, text);
    return text;
  });
  fixture.write('candidate/src/lib/content/unowned.ts', "const fallback = '/brand/daynight-wordmark.svg';\n");
  const changed = fixture.apply();
  for (const [index, name] of importFallbackPaths.entries()) {
    const actual = fs.readFileSync(path.join(fixture.candidate, name), 'utf8');
    assert.equal(actual, original[index].replace(/(['"])\/brand\/daynight-wordmark\.svg\1/, JSON.stringify(fixture.contract.assets.onLight.publicPath)));
    assert(changed.includes(name));
  }
  assert.equal(fs.readFileSync(path.join(fixture.candidate, 'src/lib/content/unowned.ts'), 'utf8'), "const fallback = '/brand/daynight-wordmark.svg';\n");
  assert(fs.readFileSync(path.join(fixture.candidate, 'src/lib/config/dealer.ts'), 'utf8').includes("accent: '#ff0000'"));
  for (const asset of Object.values(fixture.contract.assets)) assert.deepEqual(fs.readFileSync(path.join(fixture.candidate, 'static', asset.publicPath.slice(1))), fixture.bytes);
  assert.deepEqual(fixture.apply(), []);
});

test('Import fallback binding preserves older absent consumers and arbitrary existing custom logo bindings', t => {
  const fixture = importLogoFixture(t);
  const custom = "const fallback = '/customer/custom-logo.svg';\nconst palette = '#ff0000';\n";
  fixture.write('candidate/' + importFallbackPaths[0], custom);
  fixture.apply();
  assert.equal(fs.readFileSync(path.join(fixture.candidate, importFallbackPaths[0]), 'utf8'), custom);
  for (const name of importFallbackPaths.slice(1)) assert.equal(fs.existsSync(path.join(fixture.candidate, name)), false);
});

test('Import rejects duplicated fallback slots and retains ordinary contract byte authentication', t => {
  const fixture = importLogoFixture(t);
  fixture.write('candidate/' + importFallbackPaths[0], "const one = '/brand/daynight-wordmark.svg';\nconst two = '/brand/daynight-wordmark.svg';\n");
  assert.throws(fixture.apply, /Ambiguous Import fallback logo/);
  fixture.write('branding/logo-contract.json', JSON.stringify(fixture.contract));
  assert.deepEqual(loadLogoContract(fixture.root), fixture.contract);
  fixture.write(fixture.contract.assets.onLight.publicPath.slice(1), Buffer.from('changed'));
  assert.throws(() => loadLogoContract(fixture.root), /Approved onLight logo bytes changed/);
});

test('Registered PNG logo replacement detaches immutable candidate aliases and preserves the shared pool', () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-logo-pool-'));
  const view=path.join(root,'registered-input-assets'),candidate=path.join(root,'candidate');
  fs.mkdirSync(path.join(view,'auto-best'),{recursive:true});
  fs.mkdirSync(path.join(candidate,'src/lib/config'),{recursive:true});
  fs.writeFileSync(path.join(candidate,'src/lib/config/brand.ts'),"export const brand={logo:'/old.png',logoOnDark:'/old.png'};");
  const oldBytes=Buffer.from('immutable old artwork'),pool=path.join(root,'pool.png');fs.writeFileSync(pool,oldBytes);fs.chmodSync(pool,0o444);
  const assets={};const prefix=Buffer.from([137,80,78,71,13,10,26,10]);
  for(const surface of ['onLight','onDark','onAccent']){
    const publicPath='/dealer-brand/'+surface+'.png',source=path.join(view,publicPath.slice(1)),target=path.join(candidate,'static',publicPath.slice(1));
    fs.mkdirSync(path.dirname(source),{recursive:true});fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(source,Buffer.concat([prefix,Buffer.from(surface)]));fs.linkSync(pool,target);assets[surface]={publicPath};
  }
  const alias=path.join(candidate,'static/assets/images/lead/day-night-logo.png');fs.mkdirSync(path.dirname(alias),{recursive:true});fs.linkSync(pool,alias);
  applyDealerLogoContract({key:'auto-best',oldVariant:path.join(view,'auto-best'),candidate,profile:{logoContract:{assets}}});
  assert.deepEqual(fs.readFileSync(pool),oldBytes);
  for(const asset of Object.values(assets))assert.deepEqual(fs.readFileSync(path.join(candidate,'static',asset.publicPath.slice(1))),fs.readFileSync(path.join(view,asset.publicPath.slice(1))));
  assert.deepEqual(fs.readFileSync(alias),fs.readFileSync(path.join(view,assets.onLight.publicPath.slice(1))));
  assert.match(fs.readFileSync(path.join(candidate,'src/lib/config/brand.ts'),'utf8'),/dealer-brand\/onLight\.png/);
});


const reviewedModernBarPath=new URL('../templates/modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',import.meta.url);
const reviewedModernBar=()=>{const raw=fs.readFileSync(reviewedModernBarPath),lf=Buffer.from(raw.toString('utf8').replaceAll('\r\n','\n'));assert.equal(createHash('sha1').update('blob '+lf.length+'\0').update(lf).digest('hex'),'4b59b7e49a0e114c31fef81ab758082a9a15e220','Fixture must use the actual immutable097 reviewed bar');return lf.toString('utf8');};
const reviewedNativeLogoBlock="  const logoSrc = onDarkSurface\n    ? (leadSite.logoInversePath ?? leadSite.logoPath)\n    : leadSite.logoPath;",reviewedBoundLogoBlock="  const logoSrc = onDarkSurface\n    ? leadSite.logoOnDark\n    : leadSite.logoOnLight;";

test('reviewed Modern child binds real painted surfaces without repainting its native badge, SVG preview or parent layout',()=>{
 const source=reviewedModernBar(),result=bindReviewedModernMobileSurfaceLogo(source);
 assert.equal(result,source.replace(reviewedNativeLogoBlock,reviewedBoundLogoBlock));
 assert.ok(result.includes('light && "h-10 bg-black px-2.5"'));assert.ok(result.includes('<DealerDesktopLogo'));assert.ok(result.includes('publicSite.identity.desktopPreview'));
 assert.ok(result.includes('leadingAction ??'));assert.ok(result.includes('trailingAction ??'));assert.ok(result.includes('onClick={onNavigate}'));
 const segment=result.slice(result.indexOf('  const onDarkSurface ='),result.indexOf('\n  return (',result.indexOf('  const onDarkSurface ='))),select=new Function('wordmarkTone','clean','leadSite',segment+'\nreturn logoSrc;'),logos={logoOnDark:'/selected-dark.webp',logoOnLight:'/selected-light.webp'};
 for(const [tone,clean,expected]of [['original',false,logos.logoOnDark],['original',true,logos.logoOnLight],['light',false,logos.logoOnDark],['light',true,logos.logoOnDark],['dark',false,logos.logoOnLight],['dark',true,logos.logoOnLight]])assert.equal(select(tone,clean,logos),expected);
 assert.equal(bindReviewedModernMobileSurfaceLogo(result),result);
 const crlf=source.replaceAll('\n','\r\n'),adapted=bindReviewedModernMobileSurfaceLogo(crlf);
 assert.equal(adapted,crlf.replace(reviewedNativeLogoBlock.replaceAll('\n','\r\n'),reviewedBoundLogoBlock.replaceAll('\n','\r\n')));assert.equal(bindReviewedModernMobileSurfaceLogo(adapted),adapted);
 // Independent SVG/toolbar composition belongs to the parent and is retained byte for byte.
 const svgParent=source+'\nexport const ExtraToolbar=()=> <svg><defs><clipPath id="icon"><path d="M0 0h2v2H0z"/></clipPath></defs><path clipPath="url(#icon)" /></svg>;\n';
 assert.equal(bindReviewedModernMobileSurfaceLogo(svgParent),svgParent.replace(reviewedNativeLogoBlock,reviewedBoundLogoBlock));
});

test('reviewed Modern child refuses changed surface rules, bindings, signatures and calls',()=>{
 const source=reviewedModernBar();
 for(const changed of [source.replace('wordmarkTone === "light" || (wordmarkTone === "original" && !clean)','wordmarkTone === "dark" || clean'),source.replace('src={logoSrc}','src={unreviewedLogo}'),source.replace('  clean: boolean;','  clean: string;'),source.replace('<DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />','<DealerMobileWordmark clean={!clean} wordmarkTone={wordmarkTone} />'),source+source])assert.throws(()=>bindReviewedModernMobileSurfaceLogo(changed),/Unknown reviewed|Ambiguous reviewed/);
 assert.equal(bindReviewedModernMobileSurfaceLogo(extractedMobileWordmark),null);
});

function modernSurfaceFixture(t,mobileSource){
 const parent=fs.realpathSync(os.tmpdir()),root=fs.mkdtempSync(path.join(parent,'cars-modern-reviewed-logo-'));t.after(()=>{const resolved=fs.realpathSync(root);assert.equal(path.dirname(resolved),parent);assert(path.basename(resolved).startsWith('cars-modern-reviewed-logo-'));fs.rmSync(resolved,{recursive:true});});
 const candidate=path.join(root,'candidate'),write=(name,text)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);};
 const png=Buffer.from([137,80,78,71,13,10,26,10]),assets={};
 for(const surface of ['onLight','onDark','onAccent']){const publicPath='/dealer-brand/'+surface+'.png';write(publicPath.slice(1),Buffer.concat([png,Buffer.from(surface)]));assets[surface]={publicPath};}
 write('candidate/packages/marketplace/lead-site.ts','interface LeadSite { readonly logoPath: string; }\nexport const leadSite={\n  logoPath: "/old.png",\n};\n');
 write('candidate/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',mobileSource);
 write('candidate/packages/marketplace-ui/components/listing-detail-content.tsx','import { ListingFinanceCard } from "./listing-finance-card";\nconst card=<ListingFinanceCard artwork={leadSite.financingArtworkPath} />;\n');
 write('candidate/packages/marketplace-ui/components/seller-identity-card.tsx','const photo=leadSite.logoPath; const palette="#f44336";\n');
 write('candidate/apps/web/lib/public-marketplace-data.ts','const photo=leadSite.logoPath;\n');
 write('candidate/apps/web/app/[locale]/layout.tsx','const icon={type: "image/png", url: leadSite.logoPath};\n');
 return {root,candidate,assets,apply:()=>applyDealerLogoContract({key:'modern',oldVariant:path.join(root,'modern'),candidate,profile:{logoContract:{assets}}})};
}
test('real reviewed Modern refresh keeps all five explicit logo roles and byte-identical second application',t=>{
 const source=reviewedModernBar(),f=modernSurfaceFixture(t,source);f.apply();
 const read=name=>fs.readFileSync(path.join(f.candidate,name),'utf8'),bar=read('packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx');
 assert.equal(bar,source.replace(reviewedNativeLogoBlock,reviewedBoundLogoBlock));
 const config=read('packages/marketplace/lead-site.ts');for(const [field,surface]of [['logoPath','onDark'],['logoOnLight','onLight'],['logoOnDark','onDark'],['logoOnAccent','onAccent']])assert.ok(config.includes(field+': "'+f.assets[surface].publicPath+'"'));
 assert.equal(read('packages/marketplace-ui/components/seller-identity-card.tsx'),'const photo=leadSite.logoOnLight; const palette="#f44336";\n');assert.equal(read('apps/web/lib/public-marketplace-data.ts'),'const photo=leadSite.logoOnLight;\n');assert.equal(read('apps/web/app/[locale]/layout.tsx'),'const icon={type: "image/webp", url: leadSite.logoOnLight};\n');
 assert.equal(read('packages/marketplace-ui/components/listing-detail-content.tsx'),'import { ListingFinanceCard } from "./listing-finance-card";\nconst card=<ListingFinanceCard artwork={leadSite.financingArtworkPath} />;\n');
 const names=['packages/marketplace/lead-site.ts','packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx','packages/marketplace-ui/components/listing-detail-content.tsx','packages/marketplace-ui/components/seller-identity-card.tsx','apps/web/lib/public-marketplace-data.ts','apps/web/app/[locale]/layout.tsx','apps/web/public/lead-logo.png',...Object.values(f.assets).map(x=>'apps/web/public'+x.publicPath)],before=names.map(name=>fs.readFileSync(path.join(f.candidate,name)));f.apply();for(const [i,name]of names.entries())assert.deepEqual(fs.readFileSync(path.join(f.candidate,name)),before[i]);
});

test('legacy inline Modern refresh retains its prior explicit light/dark declarations and clipping correction',t=>{
 const inline='export const DealerMobileBrandBar=({tone,wordmarkTone})=>{\n  const light = tone === "light";\n  const clean = tone === "clean";\n return <span><Image src={leadSite.logoPath} /></span>;\n};\n',f=modernSurfaceFixture(t,inline);f.apply();const bar=fs.readFileSync(path.join(f.candidate,'packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx'),'utf8');
 assert.match(bar,/const useOnLight = wordmarkTone === "dark" \|\| \(wordmarkTone === "original" && light\)/);assert.match(bar,/const logoSource = useOnLight \? leadSite\.logoOnLight : leadSite\.logoOnDark/);assert.match(bar,/src=\{logoSource\}/);assert.doesNotMatch(bar,/clipPath|brightness-0|\binvert\b/);f.apply();assert.equal(fs.readFileSync(path.join(f.candidate,'packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx'),'utf8'),bar);
});


function sharingFixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-reviewed-sharing-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64'),hash=createHash('sha256').update(png).digest('hex');
  const inputs=[['master','generated-master'],['mark','generated-mark'],['onLight','reviewed-surfaces/on-light'],['onDark','reviewed-surfaces/on-dark'],['onAccent','reviewed-surfaces/on-accent']].map(([role,name])=>({role,path:'branding/'+name+'.png',sha256:hash}));
  for(const row of inputs){fs.mkdirSync(path.dirname(path.join(root,row.path)),{recursive:true});fs.writeFileSync(path.join(root,row.path),png);}
  fs.writeFileSync(path.join(root,'branding/logo-on-light.png'),png);
  const packId=createHash('sha256').update(JSON.stringify(inputs)).digest('hex').slice(0,16);
  const contract={schemaVersion:1,dealer:'centralauto-varna',policy:'template-default',creationMethod:'image-generation-reviewed-surface-variants',monochromePairFromOneMaster:false,packId,publicBase:'/dealer-brand/v2-'+packId,packInputs:inputs,reviewedSurfaceVariants:{schemaVersion:1,reviewed:true,reviewedAt:'2026-10-14T11:56:24.553Z',surfaces:Object.fromEntries(['onLight','onDark','onAccent'].map(role=>[role,{assetPath:inputs.find(x=>x.role===role).path,sha256:hash,alphaSha256:'a'.repeat(64),sourceReference:'docs/reviewed-logo.json',generation:{tool:'image_gen',id:'recorded-generation'}}]))}};
  const manifest={slug:'centralauto-varna',branding:{contract:'.cars-branding.json'},shareIdentity:{logo:{sourcePath:'branding/logo-on-light.png',sha256:hash}}};
  const save=()=>fs.writeFileSync(path.join(root,'.cars-branding.json'),JSON.stringify(contract));
  save();return {root,png,hash,manifest,contract,save};
}
test('reviewed PNG source sharing works without a legacy WebP logo contract and preserves the source',t=>{
  const f=sharingFixture(t),before=JSON.stringify(f.manifest),bytes=fs.readFileSync(path.join(f.root,'.cars-branding.json'));
  assert.deepEqual(loadReviewedSharingAsset(f.root,f.manifest,null),{publicPath:'/branding/logo-on-light.png',sha256:f.hash});
  assert.equal(JSON.stringify(f.manifest),before);assert.deepEqual(fs.readFileSync(path.join(f.root,'.cars-branding.json')),bytes);
});
test('reviewed source sharing rejects missing review, wrong dealer, provenance and source bytes',t=>{
  const f=sharingFixture(t),original=JSON.stringify(f.contract);
  for(const change of [c=>{c.dealer='other';},c=>{c.reviewedSurfaceVariants.reviewed=false;},c=>{c.reviewedSurfaceVariants.reviewedAt='invalid';},c=>{delete c.reviewedSurfaceVariants.surfaces.onDark;},c=>{delete c.reviewedSurfaceVariants.surfaces.onLight.generation;},c=>{c.packInputs[2].path='../outside.png';}]){f.contract=JSON.parse(original);change(f.contract);fs.writeFileSync(path.join(f.root,'.cars-branding.json'),JSON.stringify(f.contract));assert.throws(()=>loadReviewedSharingAsset(f.root,f.manifest,null));}
  fs.writeFileSync(path.join(f.root,'.cars-branding.json'),original);fs.writeFileSync(path.join(f.root,'branding/reviewed-surfaces/on-dark.png'),'changed');assert.throws(()=>loadReviewedSharingAsset(f.root,f.manifest,null),/bytes differ/);
});
test('reviewed sharing cannot borrow a foreign or changed manifest PNG',t=>{
  const f=sharingFixture(t);for(const sourcePath of ['../outside.png','modern/public/logo.png','branding/missing.png'])assert.throws(()=>loadReviewedSharingAsset(f.root,{...f.manifest,shareIdentity:{logo:{sourcePath,sha256:f.hash}}},null));
  fs.writeFileSync(path.join(f.root,'branding/logo-on-light.png'),'changed');assert.throws(()=>loadReviewedSharingAsset(f.root,f.manifest,null),/differs/);
});
test('legacy reviewed sharing assets remain authoritative when their contract exists',()=>{
  const asset={publicPath:'/dealer-brand/logo-on-light.webp',sha256:'a'.repeat(64)};
  assert.equal(loadReviewedSharingAsset('unused',{branding:{contract:'.cars-branding.json'}},{assets:{onLight:asset}}),asset);
  assert.equal(loadReviewedSharingAsset('unused',{},null),null);
});
