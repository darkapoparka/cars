import {currency} from './currency';

// Reuse the formatter across cards, filters and finance estimates.
const priceFormatter = new Intl.NumberFormat(currency.locale);
export const formatPrice = (value: number) => priceFormatter.format(value);
