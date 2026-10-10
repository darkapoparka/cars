import en from './locales/en.json';
import bg from './locales/bg.json';
import type {AppLocale} from './dealer-config';
export {isAppLocale} from './locale-policy';
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
      if (/^View \d{4} /.test(key)) translated = key.replace(/^View /, 'Разгледайте ');
      else if (/^Save /.test(key)) translated = key.replace(/^Save /, 'Запазете ');
      else if (/^Remove .+ from saved cars$/.test(key)) translated = key.replace(/^Remove (.+) from saved cars$/, 'Премахнете $1 от запазените');
      else if (/^Search [A-Z]/.test(key)) translated = key.replace(/^Search /, 'Търсете ');
      else if (/^Show .+ models$/.test(key)) translated = key.replace(/^Show (.+) models$/, 'Модели на $1');
      else if (/^Selling with /.test(key)) translated = key.replace(/^Selling with /, 'Продажба чрез ');
      else if (/^Zoom .+ photo$/.test(key)) {const label = key.slice(5, -6); translated = 'Увеличи: ' + (catalog[label] ?? label);}
      else if (/^About /.test(key)) {const label = key.slice(6); translated = 'За ' + (catalog[label] ?? label);}
      else if (/^Photo \d+$/.test(key)) translated = key.replace(/^Photo /, 'Снимка ');
      else if (/^Show \d+ cars$/.test(key)) translated = key.replace(/^Show (\d+) cars$/, 'Покажи $1 автомобила');
      else if (/^\d+ cars$/.test(key)) translated = key.replace(/ cars$/, ' автомобила');
    }
    if (translated === undefined) return decoded as T;
    return (decoded.match(/^\s*/)?.[0] + translated + decoded.match(/\s*$/)?.[0]) as T;
  };
}
