import assert from 'node:assert/strict';
import {it} from 'node:test';
import {buildDealerShareMetadata} from '../lib/cars-dealer-share';

const incoming = (origin: string, pathname: string) => new Headers({'x-cars-public-origin': origin, 'x-cars-public-path': pathname});

it('keeps canonical, language and social links on the independent App host', () => {
  const metadata = buildDealerShareMetadata({title: 'Cars', alternates: {languages: {en: '/en/cars'}}}, incoming('https://dn-client-app.vercel.app', '/bg/cars?brand=BMW'));
  assert.equal(metadata.alternates?.canonical, 'https://dn-client-app.vercel.app/bg/cars');
  assert.equal(metadata.alternates?.languages?.en, 'https://dn-client-app.vercel.app/en/cars');
  const serialized = JSON.stringify(metadata);
  assert.ok(serialized.includes('https://dn-client-app.vercel.app/dealer-brand/'));
  assert.ok(!serialized.includes('day-and-night-a.vercel.app'));
  assert.ok(!serialized.includes('/variant-4'));
});

it('keeps the local preview port and an existing mounted public path', () => {
  const local = buildDealerShareMetadata({}, incoming('http://127.0.0.1:6473', '/bg/cars'));
  assert.equal(local.alternates?.canonical, 'http://127.0.0.1:6473/bg/cars');
  const mounted = buildDealerShareMetadata({}, incoming('https://example.test', '/variant-4/bg/cars'));
  assert.equal(mounted.alternates?.canonical, 'https://example.test/variant-4/bg/cars');
});

it('accepts only a safe configured public origin and rejects unsafe public paths', () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://app.example.test/';
    assert.equal(buildDealerShareMetadata({}, incoming('https://preview.example.test', '/bg/shop')).alternates?.canonical, 'https://app.example.test/bg/shop');
    for (const invalid of ['javascript:alert(1)', 'https://user:password@app.example.test', 'https://app.example.test/other']) {
      process.env.NEXT_PUBLIC_SITE_URL = invalid;
      assert.equal(buildDealerShareMetadata({}, incoming('https://preview.example.test', '//untrusted.test')).alternates?.canonical, 'https://preview.example.test/');
    }
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
