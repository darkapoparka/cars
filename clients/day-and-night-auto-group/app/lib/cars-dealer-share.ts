import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {dealer} from './dealer-config';
import {assetPath} from './paths';

function safeOrigin(candidate: string | null | undefined): string | null {
  if (!candidate || /[\\\u0000-\u0020]/.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash ? url.origin : null;
  } catch {return null;}
}

export async function dealerShareMetadata(input: Metadata | Promise<Metadata>): Promise<Metadata> {
  return buildDealerShareMetadata(await input, await headers());
}

export function buildDealerShareMetadata(original: Metadata, requestHeaders: Pick<Headers, 'get'>): Metadata {
  const protocol = requestHeaders.get('x-forwarded-proto') === 'http' ? 'http' : 'https';
  const host = requestHeaders.get('host');
  const publicOrigin = safeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
    ?? safeOrigin(requestHeaders.get('x-cars-public-origin'))
    ?? safeOrigin(host ? protocol + '://' + host : null)
    ?? 'http://localhost:3000';
  const entry = assetPath('/');
  const candidate = requestHeaders.get('x-cars-public-path') ?? entry;
  const pathname = candidate.startsWith('/') && !candidate.startsWith('//') && !/[\\\u0000-\u0020]/.test(candidate) ? candidate.split(/[?#]/, 1)[0] : entry;
  const canonical = publicOrigin + assetPath(pathname);
  const title = typeof original.title === 'string' ? original.title : original.title && typeof original.title === 'object' && 'absolute' in original.title ? original.title.absolute : dealer.name;
  const description = original.description ?? dealer.previewNotice;
  const image = {url: new URL(assetPath(dealer.logo.light), publicOrigin).href, alt: dealer.name + ' dealer website preview'};
  const icon = new URL(assetPath(dealer.logo.icon), publicOrigin).href;
  const languages = original.alternates?.languages ? Object.fromEntries(Object.entries(original.alternates.languages).map(([locale, value]) => [locale, typeof value === 'string' || value instanceof URL ? publicOrigin + assetPath(new URL(value, publicOrigin).pathname) : value])) : undefined;
  return {
    ...original, applicationName: dealer.name, metadataBase: new URL(publicOrigin),
    alternates: {...original.alternates, ...(languages ? {languages} : {}), canonical},
    icons: {icon, shortcut: icon, apple: icon},
    openGraph: {...original.openGraph, type: 'website', title, description, siteName: dealer.name, url: canonical, images: [image]},
    twitter: {...original.twitter, card: 'summary_large_image', title, description, images: [{url: image.url, alt: image.alt}]},
  };
}
