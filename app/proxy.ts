import {NextResponse, type NextProxy} from 'next/server';
import * as original from './cars-original-proxy';

export const config = {matcher: ['/((?!_next|.*\\..*).*)']};

export const proxy: NextProxy = async (request, event) => {
  const originalProxy = 'default' in original && typeof original.default === 'function' ? original.default : 'proxy' in original && typeof original.proxy === 'function' ? original.proxy : undefined;
  if (typeof originalProxy !== 'function') throw new Error('Missing reviewed Next proxy');
  const response = (await originalProxy(request, event)) ?? NextResponse.next();
  const forwarded = new Headers(request.headers);
  for (const name of (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)) {
    const value = response.headers.get('x-middleware-request-' + name);
    if (value === null) forwarded.delete(name); else forwarded.set(name, value);
  }
  const base = "/variant-4";
  const pathname = request.nextUrl.pathname;
  forwarded.set('x-cars-public-path', !base || pathname === base || pathname.startsWith(base + '/') ? pathname : base + pathname);
  const overrides = NextResponse.next({request: {headers: forwarded}});
  for (const [name, value] of overrides.headers) {
    if (name === 'x-middleware-override-headers' || name.startsWith('x-middleware-request-')) response.headers.set(name, value);
  }
  return response;
};
