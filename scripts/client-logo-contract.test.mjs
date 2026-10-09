import test from 'node:test';
import assert from 'node:assert/strict';
import { stripModernAlternateWordmark, normalizeModernFinancingLogo } from './lib/client-logo-contract.mjs';

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
