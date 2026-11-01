import assert from 'node:assert/strict';
import {it} from 'node:test';
import {NextRequest} from 'next/server';
import {proxy} from '../proxy';
import {dealer} from '../lib/dealer-config';

it('redirects an unprefixed alternative URL without dropping its query', () => {
  const response = proxy(new NextRequest('https://example.test/2/cars?brand=Toyota'));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://example.test/' + dealer.defaultLocale + '/2/cars?brand=Toyota');
});
it('preserves the Next.js base path when redirecting a mounted preview', () => {
  const request = new NextRequest('https://example.test/dealer-preview/2/cars?q=BMW', {nextConfig: {basePath: '/dealer-preview'}});
  const response = proxy(request);
  assert.equal(response.headers.get('location'), 'https://example.test/dealer-preview/' + dealer.defaultLocale + '/2/cars?q=BMW');
});
it('overwrites untrusted locale headers with the explicit URL locale', () => {
  const locale = dealer.enabledLocales[0];
  const response = proxy(new NextRequest('https://example.test/' + locale + '/2', {headers: {'x-cars-app-locale': 'invalid', cookie: 'cars-app-locale=invalid'}}));
  assert.equal(response.headers.get('x-middleware-request-x-cars-app-locale'), locale);
  assert.equal(response.cookies.get('cars-app-locale')?.value, locale);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});
it('terminates redirects for disabled-locale cookies and prefixes', () => {
  const enabled = dealer.enabledLocales;
  const defaultLocale = dealer.defaultLocale;
  try {
    dealer.enabledLocales = ['en']; dealer.defaultLocale = 'en';
    const response = proxy(new NextRequest('https://example.test/bg/2/cars?q=BMW', {headers: {cookie: 'cars-app-locale=bg'}}));
    assert.equal(response.headers.get('location'), 'https://example.test/en/2/cars?q=BMW');
    const next = proxy(new NextRequest(response.headers.get('location')!, {headers: {cookie: 'cars-app-locale=bg'}}));
    assert.equal(next.status, 200); assert.equal(next.headers.get('location'), null);
  } finally {dealer.enabledLocales = enabled; dealer.defaultLocale = defaultLocale;}
});
it('keeps this preview non-submitting while accepting HEAD requests', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const response = proxy(new NextRequest('https://example.test/en', {method}));
    assert.equal(response.status, 405); assert.equal(response.headers.get('allow'), 'GET, HEAD');
  }
  assert.equal(proxy(new NextRequest('https://example.test/en', {method: 'HEAD'})).status, 200);
});
it('forwards the standalone App path, current origin and trusted locale together', () => {
  const response = proxy(new NextRequest('https://example.test/bg/cars', {headers: {'x-cars-public-path': '/untrusted', 'x-cars-public-origin': 'https://untrusted.test'}}));
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-path'), '/bg/cars');
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-origin'), 'https://example.test');
  assert.equal(response.headers.get('x-middleware-request-x-cars-app-locale'), 'bg');
});
it('retains the actual configured mount in public App paths', () => {
  const request = new NextRequest('https://example.test/variant-4/bg/cars', {nextConfig: {basePath: '/variant-4'}});
  const response = proxy(request);
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-path'), '/variant-4/bg/cars');
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-origin'), 'https://example.test');
});
it('retains the local preview origin and port', () => {
  const response = proxy(new NextRequest('http://localhost:6473/bg/cars', {headers: {host: '127.0.0.1:6473'}}));
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-origin'), 'http://127.0.0.1:6473');
});
it('uses the public host and HTTPS protocol behind the deployment proxy', () => {
  const response = proxy(new NextRequest('http://localhost:3000/bg/cars', {headers: {host: 'dn-client-app.vercel.app', 'x-forwarded-proto': 'https'}}));
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-origin'), 'https://dn-client-app.vercel.app');
});
