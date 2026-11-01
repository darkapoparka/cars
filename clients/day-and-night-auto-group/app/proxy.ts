import {NextResponse, type NextRequest} from 'next/server';
import {proxy as originalProxy} from './cars-original-proxy';
import {basePath} from './lib/paths';

export const config = {matcher: ['/((?!_next|.*\\..*).*)']};

export function proxy(request: NextRequest) {
  const response = originalProxy(request);
  const forwarded = new Headers(request.headers);
  for (const name of (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)) {
    const value = response.headers.get('x-middleware-request-' + name);
    if (value === null) forwarded.delete(name); else forwarded.set(name, value);
  }
  const base = basePath || request.nextUrl.basePath;
  const pathname = request.nextUrl.pathname;
  forwarded.set('x-cars-public-path', !base || pathname === base || pathname.startsWith(base + '/') ? pathname : base + pathname);
  const protocol = request.headers.get('x-forwarded-proto') === 'https' ? 'https:' : request.nextUrl.protocol;
  forwarded.set('x-cars-public-origin', protocol + '//' + (request.headers.get('host') || request.nextUrl.host));
  const overrides = NextResponse.next({request: {headers: forwarded}});
  for (const [name, value] of overrides.headers) {
    if (name === 'x-middleware-override-headers' || name.startsWith('x-middleware-request-')) response.headers.set(name, value);
  }
  return response;
}
