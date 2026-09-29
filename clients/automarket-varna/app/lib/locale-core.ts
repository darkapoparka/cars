import en from './locales/en.json';
import bg from './locales/bg.json';
import type {AppLocale} from './dealer-config';
export const isAppLocale = (value: unknown): value is AppLocale => value === 'en' || value === 'bg';
export type Copy = <T>(value: T) => T;
const catalogs: Record<AppLocale, Record<string, string>> = {en, bg};
const decode = (text: string) => text.replaceAll('&amp;', '&').replaceAll('&apos;', "'").replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&nbsp;', ' ');
/** Called only by presentation consumers, not by filters or business-data storage. */
export function createCopy(locale: AppLocale): Copy {
  const catalog = catalogs[locale];
  return <T,>(value: T): T => {
    if (typeof value !== 'string' || !value.trim()) return value;
    const decoded = decode(value), key = decoded.replace(/\s+/g, ' ').trim();
    let translated = catalog[key];
    if (translated === undefined && locale === 'bg') {
      if (/^Selling with /.test(key)) translated = key.replace(/^Selling with /, 'Продажба чрез ');
      else if (/^Photo \d+$/.test(key)) translated = key.replace(/^Photo /, 'Снимка ');
      else if (/^Show \d+ cars$/.test(key)) translated = key.replace(/^Show (\d+) cars$/, 'Покажи $1 автомобила');
      else if (/^\d+ cars$/.test(key)) translated = key.replace(/ cars$/, ' автомобила');
    }
    if (translated === undefined) return decoded as T;
    return (decoded.match(/^\s*/)?.[0] + translated + decoded.match(/\s*$/)?.[0]) as T;
  };
}
