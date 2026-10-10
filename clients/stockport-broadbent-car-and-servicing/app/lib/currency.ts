import {dealer} from './dealer-config';
/** Uses each dealer's recorded inventory currency; amounts are never relabelled or converted. */
export const currency = {code: dealer.currency, symbol: dealer.currency === 'GBP' ? '£' : dealer.currency === 'EUR' ? '€' : dealer.currency, locale: dealer.defaultLocale === 'bg' ? 'bg-BG' : 'en-GB'};
export function currencyText(text: string) { return text; }
