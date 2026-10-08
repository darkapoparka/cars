import {headers} from 'next/headers';
import {dealer} from './dealer-config';
import {createCopy} from './locale-core';
import {isEnabledLocale} from './locale-policy';
export async function getLocale() {
  const requested = (await headers()).get('x-cars-app-locale');
  return isEnabledLocale(requested, dealer.enabledLocales) ? requested : dealer.defaultLocale;
}
export async function getCopy() { return createCopy(await getLocale()); }
