import {headers} from 'next/headers';
import {dealer} from './dealer-config';
import {createCopy, isAppLocale} from './locale-core';
export async function getLocale() {
  const requested = (await headers()).get('x-cars-app-locale');
  return isAppLocale(requested) ? requested : dealer.defaultLocale;
}
export async function getCopy() { return createCopy(await getLocale()); }
