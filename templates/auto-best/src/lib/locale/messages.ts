import { dealerTextValues, dealerTextKeys } from './config';
import { en, bg, sourceKeys, dealerSourceKeys, ambiguousAliases } from './catalog';
import { localeContract, intlLocale, type Locale } from './core';
export type MessageKey = keyof typeof en;
export type MessageParameters = Record<string, string | number>;

/** Native rendering only. Business values and user input are never traversed or rewritten. */
export function message(locale: Locale, key: MessageKey, parameters: MessageParameters = {}): string {
  const pattern: string = (locale === 'bg' ? bg : en)[key];
  if (typeof pattern !== 'string') throw new Error(`Missing ${locale} message: ${key}`);
  const values: MessageParameters = {
    dealerName: localeContract.dealerName,
    dealerCity: dealerLabel(locale, 'city'),
    dealerAddress: dealerLabel(locale, 'address'),
    dealerAddressLine: dealerLabel(locale, 'addressLine'),
    inventoryCurrency: localeContract.inventoryCurrency,
    ...parameters
  };
  return pattern.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (_placeholder, name: string) => {
    if (!Object.hasOwn(values, name)) throw new Error(`Missing parameter ${name} for ${key}`);
    return String(values[name]);
  });
}

/** Exact, reviewed copy lookup. Call only for template-owned immutable presentation copy. */
export function templateText<T>(locale: Locale, value: T): T {
  if (typeof value !== 'string') return value;
  const source = value.replace(/\s+/g, ' ').trim();
  const key = (sourceKeys as Record<string, MessageKey>)[source];
  if (!key) throw new Error(`${(ambiguousAliases as readonly string[]).includes(source) ? 'Ambiguous' : 'Missing'} template copy; use a context-specific message key: ${source}`);
  return (value.match(/^\s*/)?.[0] + message(locale, key) + value.match(/\s*$/)?.[0]) as T;
}

export function vehicleCount(locale: Locale, count: number): string {
  const category = new Intl.PluralRules(intlLocale(locale)).select(count);
  return message(locale, category === 'one' ? 'inventory.count.one' : 'inventory.count.other', {
    count: new Intl.NumberFormat(intlLocale(locale)).format(count)
  });
}

export type DealerTextField = keyof typeof dealerTextValues;
export function dealerLabel(locale: Locale, field: DealerTextField): string {
  const source = dealerTextValues[field];
  const key = dealerTextKeys[field];
  if ((dealerSourceKeys as Record<string, MessageKey>)[source] !== key) throw new Error(`Dealer field ${field} requires matching EN/BG dealer-owned copy`);
  return (locale === 'bg' ? bg : en)[key];
}
