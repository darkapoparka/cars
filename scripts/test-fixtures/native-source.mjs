import fs from 'node:fs';
import path from 'node:path';
import { NATIVE_CHECKS } from '../lib/native-localization.mjs';
import { fingerprint } from '../lib/workflow.mjs';

// Synthetic contracts for isolated integration tests, never rollout evidence.
export function nativeFixture(directory, middle = 'modern', slug = 'fixture-dealer') {
  const manifest = { schemaVersion: 1, slug, repository: `darkapoparka/cars-${slug}`,
    defaultBranch: 'main', language: 'bg', packaging: { version: '2' },
    localization: { schemaVersion: 1, dealerId: slug, defaultLocale: 'en', enabledLocales: ['en', 'bg'], dealerCountry: 'AE', inventoryCurrency: 'AED' },
    variants: [{ key: 'auto-best', base: '', entry: '/' },
      { key: middle, base: '/variant-2', entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/' },
      { key: 'carwow', base: '/variant-3', entry: '/variant-3/' }], templateRevisions: {}
  };
  const files = new Map();
  const put = (name, value) => files.set(name, Buffer.isBuffer(value) ? value : Buffer.from(value));
  const defaultSettings = 'schemaVersion: 1, dealerId: "template", defaultLocale: "bg", enabledLocales: ["en", "bg"], dealerCountry: "BG", inventoryCurrency: "EUR"';
  const releases = {};
  for (const [index, { key }] of manifest.variants.entries()) {
    const commit = String(index + 1).repeat(40);
    manifest.templateRevisions[key] = commit;
    put(`${key}/package.json`, '{"type":"module","scripts":{"build":"node build.mjs"}}\n');
    put(`${key}/localization/en.json`, JSON.stringify({ title: 'Inventory', detail: 'View {vehicle}', contact: { title: 'Trade-in enquiry' } }));
    put(`${key}/localization/bg.json`, JSON.stringify({ title: 'Автомобили', detail: 'Вижте {vehicle}', contact: { title: 'Запитване за бартер' } }));
    put(`${key}/${key === 'modern' ? 'apps/web/public' : 'static'}/dealer/logo.webp`, Buffer.from([82, 73, 70, 70, 0, 11, 12, 255]));
    put(`${key}/${key === 'modern' ? 'apps/web/public' : 'static'}/images/hero.webp`, Buffer.from([82, 73, 70, 70, 0, 8, 7, 254]));
    if (key === 'modern') {
      put(`${key}/apps/web/next.config.ts`, 'const nextConfig: {basePath?: string} = {}; const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH; nextConfig.basePath = publicBasePath; export default nextConfig;\n');
      put(`${key}/packages/internationalization/paths.ts`, 'export const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";\n');
      put(`${key}/packages/internationalization/config.ts`, 'export const locales = ["en", "bg"] as const;\ntype Locale = "en" | "bg";\nexport const defaultLocale = "bg" satisfies Locale;\n');
      put(`${key}/apps/web/proxy.ts`, 'import { createLocaleRequestHandler } from "./request";\nexport const proxy = createLocaleRequestHandler();\n');
      put(`${key}/apps/web/lib/locale-configuration.ts`, `export const localeConfiguration = { ${defaultSettings} } as const;\n`);
      put(`${key}/packages/marketplace/lead-site.ts`, 'export const leadSite = { publicDefaultLocale: "bg", publicLocales: ["en", "bg"], countryCode: "BG", currency: "EUR", name: "Fixture Dealer", staticDemoMode: true } as const;\n');
      put(`${key}/apps/web/app/[locale]/layout.tsx`, 'export default function Layout() { return <html><head></head><body>Fixture</body></html>; }\n');
    } else {
      const variable = key === 'carwow' ? 'DAY_LOCALE_BASE' : key === 'import' ? 'TEMPLATE_BASE_PATH' : null;
      put(`${key}/svelte.config.js`, `export default {kit:{paths:{base:${variable ? `process.env.${variable} || ""` : '""'}}}};\n`);
      put(`${key}/src/app.html`, '<!doctype html><html><head></head><body>%sveltekit.body%</body></html>\n');
      if (key === 'import') {
        put(`${key}/src/lib/locale/core.ts`, 'export const localeConfiguration = {dealerId: "import", defaultLocale: site.locale.default};\n');
        put(`${key}/src/lib/config/dealer.ts`, 'export const dealerLocaleSettings = {dealerId: "template", default: "bg", supported: ["en", "bg"], country: "BG", currency: "EUR"} as const;\n');
      } else {
        put(`${key}/src/lib/${key === 'auto-best' ? 'config/locale' : 'locale/config'}.ts`, `export const dealerLocaleConfiguration = { ${defaultSettings} } as const;\n`);
        put(`${key}/src/lib/locale/core.ts`, 'export const nativePolicy = true;\n');
      }
    }
    releases[key] = { status: 'approved', repository: `darkapoparka/cars-template-${key}`, commit, digest: 'a'.repeat(64), qa: {
      nativeLocalization: { schemaVersion: 1, adapter: 'native-v1', repository: `darkapoparka/cars-template-${key}`, commit,
        locales: ['en', 'bg'], widths: [320, 390, 1440], verifiedAt: '2026-09-20T00:00:00Z', evidenceSha256: 'b'.repeat(64),
        checks: NATIVE_CHECKS.map(name => ({ name, status: 'passed', evidenceSha256: 'c'.repeat(64) })),
        catalogs: [{ format: 'json-pair', en: 'localization/en.json', bg: 'localization/bg.json' }]
      }
    } };
  }
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, bytes] of files) {
    const target = path.join(directory, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  fs.writeFileSync(path.join(directory, 'dealer.json'), JSON.stringify(manifest, null, 2) + '\n');
  for (const { key } of manifest.variants) {
    releases[key].digest = fingerprint(path.join(directory, key)).digest;
    releases[key].qa.nativeLocalization.sourceDigest = releases[key].digest;
    releases[key].qa.nativeLocalization.deployment = { id: `dpl_fixture${key.replaceAll('-', '')}`, projectId: `prj_fixture${key.replaceAll('-', '')}`,
      state: 'READY', sourceCommit: releases[key].commit, publicAlias: `https://fixture-${key}.example/` };
  }
  return { source: directory, manifest, files, releases };
}
