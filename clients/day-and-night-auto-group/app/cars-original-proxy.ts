import {NextResponse, type NextRequest} from 'next/server';
import {dealer} from './lib/dealer-config';
import {resolveLocale} from './lib/locale-policy';
import {withoutMount} from './lib/paths';

/** The URL wins over preferences; disabled cookies can never create redirect loops. */
export function proxy(request: NextRequest) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new NextResponse('This preview does not accept submissions.', {status: 405, headers: {Allow: 'GET, HEAD'}});
  }
  const {locale, redirectPath} = resolveLocale(
    withoutMount(request.nextUrl.pathname), request.cookies.get('cars-app-locale')?.value, dealer,
  );
  if (redirectPath !== null) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
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
