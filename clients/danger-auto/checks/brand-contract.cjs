/* Source/asset contract only: not full app typing, build, or browser QA. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
let ts;
try { ts = createRequire(path.join(root, 'auto-best/package.json'))('typescript'); }
catch { ts = require('typescript'); }
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const bytes = p => fs.readFileSync(path.join(root, p));
const gitHash = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const checks = [];
function check(name, fn) { fn(); checks.push(name); }
const assets = {
  'brand/danger-auto-ink.svg': 'f19f076c7a46d0edc205f10ad15ee72f28c729b7',
  'brand/danger-auto-white.svg': 'a27ae9d79c7a99f36f49cd77c03e78de91f8c5e6',
  'brand/favicon.svg': '510cb9d87d66fe646849a03546a3424c502a2bbe',
  'brand/apple-touch-icon.png': 'bceb1f0ea237d1d2a0ef81cbdefd9444b0080746',
  'favicon.ico': 'ae572b3e95a08a08e6f1d6745b9c40c805f3e345',
};
const roots = ['auto-best/static', 'modern/apps/web/public', 'carwow/static'];
const sources = [
  'auto-best/src/lib/config/brand.ts',
  'carwow/src/lib/data/daynight-site.ts',
  'modern/packages/marketplace/lead-site.ts',
  'modern/packages/marketplace-ui/components/dealer-desktop-header.tsx',
  'modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',
  'modern/apps/web/app/[locale]/layout.tsx',
  'modern/apps/web/app/robots.ts',
];
for (const base of roots) {
  for (const [asset, sha] of Object.entries(assets)) {
    check(`${base}/${asset}: exact committed asset bytes`, () => assert.equal(gitHash(bytes(`${base}/${asset}`)), sha));
    if (asset.endsWith('.svg')) check(`${base}/${asset}: self-contained accessible vector`, () => {
      const svg = read(`${base}/${asset}`);
      assert.match(svg, /<title id="title">DANGER AUTO<\/title>/);
      assert.match(svg, /<path /);
      assert.doesNotMatch(svg, /<(?:text|image|script|foreignObject)\b|(?:href|font-family)=|url\(/i);
    });
  }
  check(`${base}: valid PNG and ICO dimensions`, () => {
    const png = bytes(`${base}/brand/apple-touch-icon.png`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 180); assert.equal(png.readUInt32BE(20), 180);
    const ico = bytes(`${base}/favicon.ico`);
    assert.equal(ico.readUInt16LE(0), 0); assert.equal(ico.readUInt16LE(2), 1);
    assert.equal(ico.readUInt16LE(4), 1); assert.equal(ico[6], 32); assert.equal(ico[7], 32);
  });
  check(`${base}: manifest identity, entry, and local icon targets`, () => {
    const manifest = JSON.parse(read(`${base}/site.webmanifest`));
    assert.equal(manifest.name, 'DANGER AUTO — демо');
    assert.equal(manifest.lang, 'bg');
    assert.equal(manifest.start_url, base.startsWith('modern') ? '/cars' : '/');
    for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join(root, base, icon.src.slice(1))));
  });
}
for (const file of sources) check(`${file}: TypeScript/TSX syntax`, () => {
  const result = ts.transpileModule(read(file), { fileName: file, reportDiagnostics: true, compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve, moduleResolution: ts.ModuleResolutionKind.Bundler,
  } });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ')).join('\n'));
});
for (const app of ['auto-best', 'carwow']) {
  check(`${app}: HTML bootstrap preserved, own icons, noindex`, () => {
    const html = read(`${app}/src/app.html`);
    for (const term of ['%sveltekit.head%', '%sveltekit.body%', '/brand/favicon.svg', '/brand/apple-touch-icon.png', 'noindex, nofollow']) assert.ok(html.includes(term));
    assert.doesNotMatch(html, /daynight-favicon/);
  });
  check(`${app}: robots disallows crawling`, () => assert.match(read(`${app}/static/robots.txt`), /Disallow: \/\s*$/));
}
for (const file of sources.slice(0, 3)) check(`${file}: logo consumers wired`, () => {
  assert.ok(read(file).includes('/brand/danger-auto-ink.svg'));
  assert.ok(!read(file).includes('identity-pending.svg'));
});
check('Modern mobile: no inherited logo clipping, retained bar and contact controls', () => {
  const file = read(sources[4]);
  assert.doesNotMatch(file, /clipPath|clip-path|inset\(0 68%/);
  for (const term of ['w-[144px] max-w-[48vw]', 'grid-cols-[44px_minmax(0,1fr)_44px]', 'onClick={onNavigate}', 'href={leadSite.mapsUrl}', 'href={leadSite.phoneHref}', 'object-contain', '/brand/danger-auto-white.svg']) assert.ok(file.includes(term));
});
check('Modern metadata: proper icon types, manifest, noindex', () => {
  const file = read(sources[5]);
  for (const term of ['image/svg+xml', '/brand/favicon.svg', '/brand/apple-touch-icon.png', 'robots: { index: false, follow: false }', 'manifest: "/site.webmanifest"']) assert.ok(file.includes(term));
});
check('Modern robots: no allow-all or inherited sitemap', () => {
  assert.match(read(sources[6]), /disallow: "\/"/); assert.doesNotMatch(read(sources[6]), /sitemap|\ballow:/);
});
function inverse(file, undo, expected) {
  check(`${file}: exact source preserved outside explicit patch`, () => {
    const source = undo(read(file));
    const variants = [source, source.replace(/\n$/, ''), source.replace(/(?<!\r)\n/g, '\r\n')];
    assert.ok(variants.some(s => gitHash(Buffer.from(s)) === expected));
  });
}
inverse(sources[0], s => s.replace('// The local vector logo is a proposed demo refresh, not an official dealer asset.\n', '').replace('/brand/danger-auto-ink.svg', '/assets/images/lead/identity-pending.svg'), 'c9e1d781abc6220f4be128215e8d1e5ce08e3cd4');
inverse(sources[1], s => s.replace('/brand/danger-auto-white.svg', '/brand/identity-pending.svg').replace('/brand/danger-auto-ink.svg', '/brand/identity-pending.svg'), '7f9283d7a53b857ba8220a69c2df8ae68197e4bc');
inverse(sources[3], s => s.replace('alt={leadSite.name}', 'alt=""').replace('src="/brand/danger-auto-white.svg"', 'src={leadSite.logoPath}'), '57d77790ed4f3d0d1a0efdb2b9f7f35209c70c86');
const inputGitBlobs = Object.fromEntries(sources.map(p => [p, gitHash(bytes(p))]));
console.log(JSON.stringify({
  scope: 'Narrow asset/source contract. Not semantic app typecheck, Svelte compilation, build, route or browser QA.',
  runtime: process.version, typescript: ts.version, passed: checks.length, failed: 0, checks, inputGitBlobs, assetGitBlobs: assets,
}, null, 2));
