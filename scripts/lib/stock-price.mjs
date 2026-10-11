// Source headings may end in 4x4 or V6. Never merge their digits into a price.
const currency = '(?:EUR|USD|GBP|BGN|AED|€|\\$|£|лв\\.?)';
const currencyLine = new RegExp(`^(?:${currency}\\s*([0-9][0-9 .,\\u00a0\\u202f]*)|([0-9][0-9 .,\\u00a0\\u202f]*)\\s*${currency})$`, 'i');
const unknown = /\b(?:p\.?\s*o\.?\s*a\.?|on\s+request|price\s+on\s+application|not\s+(?:published|provided|available|disclosed)|unpublished|unknown|tbc|tba)\b|^\s*n\/a(?:\b|\s*\()|по\s+(?:запитване|договаряне)/i;

function amountFrom(text) {
  const amount = text.trim().replace(/[\u00a0\u202f]/g, ' ');
  if (!/^[0-9]+(?:[ .,][0-9]+)*$/.test(amount)) return null;
  let integer = amount;
  let fraction = '';
  const final = amount.match(/([.,])(\d{1,2})$/);
  if (final) {
    integer = amount.slice(0, -final[0].length);
    fraction = final[2];
    // A decimal separator cannot also serve as a thousands separator.
    if (integer.includes(final[1])) return null;
  }
  if (!/^\d+$/.test(integer)) {
    const grouped = integer.match(/^\d{1,3}([ .,])\d{3}(?:\1\d{3})*$/);
    if (!grouped) return null;
    integer = integer.split(grouped[1]).join('');
  }
  const result = Number(`${integer}${fraction ? `.${fraction}` : ''}`);
  return Number.isFinite(result) && result >= 0 && result <= Number.MAX_SAFE_INTEGER ? result : null;
}

export function stockPriceFrom(...values) {
  for (const value of values) {
    if (typeof value === 'number') {
      if (Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER) return value;
      continue;
    }
    if (typeof value !== 'string' || value.length > 16384 || unknown.test(value)) continue;
    const lines = value.split(/\r\n|[\r\n]/).map((line) => line.trim()).filter(Boolean);
    const prices = lines.flatMap((line) => {
      const match = line.match(currencyLine);
      if (!match) return [];
      return [amountFrom(match[1] || match[2])];
    });
    if (prices.length === 1 && prices[0] !== null) return prices[0];
    // Multiple currency quotations are ambiguous; unlabelled amounts are only
    // accepted when the whole input is one standalone line.
    if (prices.length === 0 && lines.length === 1) {
      const parsed = amountFrom(lines[0]);
      if (parsed !== null) return parsed;
    }
  }
  return null;
}
