/** Preserve dealer stock amounts; recognize comma/dot grouping before decimal separators. */
export function parseDealerNumber(value: string): number {
  const token = value.match(/\d[\d\s.,]*/)?.[0].replace(/\s/g, '').replace(/[.,]+$/, '') ?? '';
  if (!token) return 0;
  const normalized = /^\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$/.test(token)
    ? token.replaceAll(',', '')
    : /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(token)
      ? token.replaceAll('.', '').replace(',', '.')
      : token.replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

/** Price-band copy uses this dealer's currency without changing its numeric threshold. */
export function dealerCurrencyText<T>(value: T, currency: string): T {
  if (typeof value !== 'string' || currency === 'EUR') return value;
  return value.replace(/(\d[\d\s.,kK]*)(?:EUR\b|€)/g, (_match, amount: string) => amount + currency) as T;
}
