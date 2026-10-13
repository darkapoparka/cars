import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stripModernAlternateWordmark, normalizeModernFinancingLogo, bindModernMobileWordmarkLogo, applyDealerLogoContract } from './lib/client-logo-contract.mjs';

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
