import test from 'node:test';
import assert from 'node:assert/strict';
import { stripModernAlternateWordmark } from './lib/client-logo-contract.mjs';

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
