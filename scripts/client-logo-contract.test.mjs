import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { stripModernAlternateWordmark, normalizeModernFinancingLogo, bindModernMobileWordmarkLogo, applyDealerLogoContract, loadLogoContract } from './lib/client-logo-contract.mjs';

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
