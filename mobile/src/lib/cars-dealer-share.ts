import type { Metadata } from 'next';
import { headers } from 'next/headers';

const identity = {"name":"Trade Car Sales","publicOrigin":"https://cars-uk-birmingham-trade-car-sales-grasmere.darkapoparka1.workers.dev","description":"Independent design preview for discussion, not an official dealership website. Forms do not send messages or create reservations.","directory":"https://cars-uk-birmingham-trade-car-sales-grasmere.darkapoparka1.workers.dev/dealer-share/39618e6d8195943daa8e","entry":"/variant-5/"};

export async function dealerShareMetadata(input: Metadata | Promise<Metadata>): Promise<Metadata> {
  const original = await input;
  const requestHeaders = await headers();
  const candidate = requestHeaders.get('x-cars-public-path') ?? identity.entry;
  const pathname = candidate.startsWith('/') && !candidate.startsWith('//') && !/[\\\u0000-\u0020]/.test(candidate) ? candidate.split(/[?#]/, 1)[0] : identity.entry;
  const canonical = identity.publicOrigin + pathname;
  const title = typeof original.title === 'string' ? original.title : original.title && typeof original.title === 'object' && 'absolute' in original.title ? original.title.absolute : identity.name;
  const description = original.description ?? identity.description;
  const image = {url: identity.directory + '/social.png', width: 1200, height: 630, type: 'image/png', alt: identity.name + ' dealer website preview'};
  const languages = original.alternates?.languages ? Object.fromEntries(Object.entries(original.alternates.languages).map(([locale, value]) => [locale, typeof value === 'string' || value instanceof URL ? identity.publicOrigin + new URL(value, identity.publicOrigin).pathname : value])) : undefined;
  return {
    ...original, applicationName: identity.name, metadataBase: new URL(identity.publicOrigin),
    alternates: {...original.alternates, ...(languages ? {languages} : {}), canonical},
    icons: {icon: [{url: identity.directory + '/icon-32.png', sizes: '32x32', type: 'image/png'}], shortcut: identity.directory + '/favicon.ico', apple: [{url: identity.directory + '/icon-180.png', sizes: '180x180', type: 'image/png'}]},
    openGraph: {...original.openGraph, type: 'website', title, description, siteName: identity.name, url: canonical, images: [image]},
    twitter: {...original.twitter, card: 'summary_large_image', title, description, images: [{url: image.url, alt: image.alt}]},
  };
}
