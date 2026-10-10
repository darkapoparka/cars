import {dealer, type AppLocale} from './dealer-config';

/** Use dealer location only; captured inventory may belong to a different country. */
export function showroomLocation(locale: AppLocale, detailed = false): string {
  const city = dealer.city.trim();
  const address = dealer.address.trim();
  const country = dealer.country.trim();
  const countryName = /^[A-Z]{2}$/.test(country)
    ? new Intl.DisplayNames([locale], {type: 'region'}).of(country) || country
    : country;
  return (detailed ? address || city : city || address) || countryName;
}
