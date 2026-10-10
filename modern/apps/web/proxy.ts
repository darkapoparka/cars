import {NextResponse, type NextProxy} from 'next/server';
import * as original from './cars-original-proxy';

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on public routes, excluding Next.js framework internals,
  // static assets, and PostHog ingest. Intercepting the dev HMR endpoint
  // breaks its WebSocket upgrade before the App Router can handle it.
  matcher: [
    "/((?!_next/|ingest|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

export const proxy: NextProxy = async (request, event) => {
  const originalProxy = 'default' in original && typeof original.default === 'function' ? original.default : 'proxy' in original && typeof original.proxy === 'function' ? original.proxy : undefined;
  if (typeof originalProxy !== 'function') throw new Error('Missing reviewed Next proxy');
  const response = (await originalProxy(request, event)) ?? NextResponse.next();
  const forwarded = new Headers(request.headers);
  for (const name of (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)) {
    const value = response.headers.get('x-middleware-request-' + name);
    if (value === null) forwarded.delete(name); else forwarded.set(name, value);
  }
  const base = "/variant-2";
  const pathname = request.nextUrl.pathname;
  forwarded.set('x-cars-public-path', !base || pathname === base || pathname.startsWith(base + '/') ? pathname : base + pathname);
  const overrides = NextResponse.next({request: {headers: forwarded}});
  for (const [name, value] of overrides.headers) {
    if (name === 'x-middleware-override-headers' || name.startsWith('x-middleware-request-')) response.headers.set(name, value);
  }
  return response;
};
