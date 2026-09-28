import {NextResponse, type NextRequest} from 'next/server';
import {dealer} from './lib/dealer-config';
import {isAppLocale} from './lib/locale-core';
import {withoutMount} from './lib/paths';
/** App-owned locale routing. The public path always wins over cookie/header input. */
export function proxy(request: NextRequest) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new NextResponse('This preview does not accept submissions.', {status: 405, headers: {Allow: 'GET, HEAD'}});
  }
  const pathname = withoutMount(request.nextUrl.pathname);
  const segment = pathname.split('/')[1];
  const requested = isAppLocale(segment) && dealer.enabledLocales.includes(segment) ? segment : null;
  const preference = request.cookies.get('cars-app-locale')?.value;
  const locale = requested || (isAppLocale(preference) ? preference : dealer.defaultLocale);
  const url = request.nextUrl.clone();
  if (!requested) {
    url.pathname = '/' + locale + (pathname === '/' ? '' : pathname);
    return NextResponse.redirect(url);
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-cars-app-locale', locale);
  const response = NextResponse.next({request: {headers: requestHeaders}});
  response.cookies.set('cars-app-locale', locale, {path: '/', sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', maxAge: 31536000});
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = {matcher: ['/((?!_next|.*\\..*).*)']};
