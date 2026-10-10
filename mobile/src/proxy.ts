import {NextResponse, type NextProxy} from 'next/server';

export const config = {matcher: ['/((?!_next/|api/|.*\\.[^/]+$).*)']};

export const proxy: NextProxy = async (request, event) => {
  const response = NextResponse.next();
  const forwarded = new Headers(request.headers);
  for (const name of (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)) {
    const value = response.headers.get('x-middleware-request-' + name);
    if (value === null) forwarded.delete(name); else forwarded.set(name, value);
  }
  const base = "/variant-5";
  const pathname = request.nextUrl.pathname;
  forwarded.set('x-cars-public-path', !base || pathname === base || pathname.startsWith(base + '/') ? pathname : base + pathname);
  const overrides = NextResponse.next({request: {headers: forwarded}});
  for (const [name, value] of overrides.headers) {
    if (name === 'x-middleware-override-headers' || name.startsWith('x-middleware-request-')) response.headers.set(name, value);
  }
  return response;
};
