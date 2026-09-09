/** Focused data/module checks. Does not compile Svelte markup, build or run the app. */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes, createRequire } from 'node:module';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'carwow/src/lib');
const scratch = await mkdtemp(join(tmpdir(), 'danger-team-seo-'));
const require = createRequire(import.meta.url);
const ts = require(require.resolve('typescript', { paths: [join(root, 'carwow'), join(root, 'auto-best')] }));
const inputGitBlobs = {};
const results = [];
const blob = (bytes) => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
async function input(path) {
  const bytes = await readFile(join(root, path));
  inputGitBlobs[path] = blob(bytes);
  return bytes.toString('utf8');
}
function check(name, fn) {
  try { fn(); results.push({ name, outcome: 'passed' }); }
  catch (error) { results.push({ name, outcome: 'failed', message: error.message }); }
}
const oldPaths = ['', 'inventory', 'inventory/map', 'services', 'sell-your-car', 'sell-your-car/request', 'sell-car', 'sell-car/request', 'about', 'about/daynight-auto-plovdiv', 'contact', 'financing', 'reviews', 'calculator', 'compare', 'team', 'team/prodazhbi-daynight-auto', 'blog', 'blog/kak-da-kupim-upotrebyavan-avtomobil', 'faq', 'terms'];
try {
  for (const file of ['data/daynight-site', 'data/daynight-team', 'data/daynight-vehicles', 'data/daynight-faq', 'data/daynight-reviews', 'server/public-routes', 'server/daynight-seo']) {
    const source = await input(`carwow/src/lib/${file}.ts`);
    let output = stripTypeScriptTypes(source);
    output = output.replace(/from\s+(['"])([^'"]+)\1/g, (match, quote, specifier) => {
      if (specifier.endsWith('.json')) return `from ${quote}${specifier}${quote} with { type: 'json' }`;
      const target = specifier.startsWith('$lib/')
        ? relative(dirname(join(sourceRoot, file)), join(sourceRoot, specifier.slice(5))).replaceAll('\\', '/')
        : specifier;
      if (specifier.startsWith('$lib/') || specifier.startsWith('.')) {
        const path = target.startsWith('.') ? target : `./${target}`;
        return `from ${quote}${path}.mjs${quote}`;
      }
      throw new Error(`Unexpected runtime dependency: ${specifier}`);
    });
    const destination = join(scratch, `${file}.mjs`);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, output);
  }
  const stock = await input('carwow/src/lib/data/dealer-stock.json');
  await writeFile(join(scratch, 'data/dealer-stock.json'), stock);
  const load = (path) => import(pathToFileURL(join(scratch, path)).href);
  const { daynightSite: site } = await load('data/daynight-site.mjs');
  const team = await load('data/daynight-team.mjs');
  const { cars } = await load('data/daynight-vehicles.mjs');
  const routes = await load('server/public-routes.mjs');
  const seo = await load('server/daynight-seo.mjs');
  const reviews = await load('data/daynight-reviews.mjs');
  check('business identity and both public phones preserved', () => { assert.equal(site.name, 'DANGER AUTO'); assert.equal(site.phone, '+359878842409'); assert.equal(site.secondaryPhone, '+359888000055'); });
  check('one business contact, not fabricated staff profiles', () => { assert.equal(team.daynightTeam.length, 1); assert.equal(team.daynightTeam[0].role, 'Публикуван контакт на автокъщата'); });
  check('contact values come from shared configuration', () => { const m=team.daynightTeam[0]; assert.equal(m.name,site.name); assert.equal(m.phone,site.phone); assert.equal(m.email,site.email); assert.equal(m.image,site.logoLight); });
  check('no inherited staff portraits or source phone', () => assert.doesNotMatch(JSON.stringify(team.daynightTeam), /daynight-team-|0877733110|Day Night Auto/));
  check('canonical contact lookup returns the business contact', () => assert.equal(team.getDayNightTeamMemberBySlug('showroom-contact'),team.daynightTeam[0]));
  check('all five legacy profile addresses resolve without extra staff', () => { assert.equal(team.legacyDaynightTeamSlugs.length,5); for(const slug of team.legacyDaynightTeamSlugs) assert.equal(team.getDayNightTeamMemberBySlug(slug),team.daynightTeam[0]); });
  check('unknown profile does not invent a person', () => { for(const slug of ['not-a-contact','../contact','']) assert.equal(team.getDayNightTeamMemberBySlug(slug),undefined); });
  check('original 21 public route addresses retained', () => assert.ok(oldPaths.every(path=>routes.getPublicStaticRoute(path))));
  check('22 route entries have unique paths', () => { assert.equal(routes.PUBLIC_STATIC_ROUTES.length,22); assert.equal(new Set(routes.PUBLIC_STATIC_ROUTES.map(r=>r.path)).size,22); });
  check('route normalization contract preserved', () => { assert.equal(routes.normalizePublicRoutePath('///inventory///'),'inventory'); assert.equal(routes.getPublicStaticRoute('/inventory/'),routes.getPublicStaticRoute('inventory')); });
  check('canonical business contact is in sitemap; legacy alias is not', () => { const paths=routes.PUBLIC_SITEMAP_ROUTES.map(r=>r.path); assert.ok(paths.includes('team/showroom-contact')); assert.equal(paths.includes('team/prodazhbi-daynight-auto'),false); });
  check('all public metadata titles identify DANGER AUTO', () => { for(const route of routes.PUBLIC_STATIC_ROUTES) assert.match(route.title,/DANGER AUTO/); });
  check('old dealer and positive verified-stock claims absent from metadata', () => { const text=routes.PUBLIC_STATIC_ROUTES.map(r=>`${r.title} ${r.description}`).join('\n'); assert.doesNotMatch(text,/Day Night Auto|Ден и Нощ|проверени автомобили|прозрачни сделки/); });
  check('unknown-route SEO uses the shared fallback', () => assert.deepEqual(seo.routeSeo('not-a-route'),{title:routes.DAY_SITE_TITLE,description:routes.DEFAULT_DESCRIPTION}));
  check('all known routes use their registered SEO values', () => { for(const r of routes.PUBLIC_STATIC_ROUTES) assert.deepEqual(seo.routeSeo(r.path),{title:r.title,description:r.description}); });
  check('actual eight vehicle records produce dealer-specific SEO', () => { assert.equal(cars.length,8); for(const c of cars){ const s=seo.vehicleSeo(c); assert.ok(s.title.includes(c.title)); assert.ok(s.title.endsWith('| DANGER AUTO')); assert.ok(s.description.includes(c.observedAt)); assert.ok(s.description.includes(c.priceEur)); assert.ok(s.description.includes(c.mileage)); } });
  check('vehicle SEO explicitly qualifies verification and availability', () => { for(const c of cars){const d=seo.vehicleSeo(c).description; assert.match(d,/не са независимо проверени/); assert.match(d,/Потвърдете наличността и цената/); assert.doesNotMatch(d,/Проверен автомобил от|Day Night Auto/);} });
  check('bank finance and demo-form metadata do not claim delivery', () => { assert.match(seo.routeSeo('financing').description,/чрез банка, не собствен лизинг/); assert.match(seo.routeSeo('sell-your-car/request').description,/Няма свързана услуга за доставка/); });
  check('review metadata matches the empty verified-review state', () => { assert.equal(reviews.daynightReviewCount,0); assert.match(seo.routeSeo('reviews').description,/Няма предоставени потвърдени/); });
  const manifest=JSON.parse(await input('checks/team-patch-manifest.json'));
  for(const patch of manifest) {
    const source=await input(patch.path);
    check(`exact source preservation after inverse patch: ${patch.path}`, () => {
      assert.equal(blob(Buffer.from(source)),patch.newBlob);
      let original=source;
      for(const [before,after] of [...patch.replacements].reverse()) original=original.split(after).join(before);
      assert.equal(blob(Buffer.from(original)),patch.baseBlob);
    });
    check(`TypeScript script parses: ${patch.path}`, () => {
      const script=source.match(/<script lang="ts">([\s\S]*?)<\/script>/)?.[1];
      assert.ok(script);
      const parsed=ts.transpileModule(script,{fileName:patch.path+'.ts',reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
      const errors=(parsed.diagnostics??[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
      assert.deepEqual(errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),[]);
    });
    check(`old dealer absent from team component: ${patch.path}`, () => assert.doesNotMatch(source,/Day Night Auto|0877733110|daynight-team-sales/));
  }
  const routeSource=await input('carwow/src/routes/team/[slug]/+page.server.ts');
  check('dynamic contact route retains canonical and compatibility entries', () => { assert.match(routeSource,/daynightTeam\.map/); assert.match(routeSource,/legacyDaynightTeamSlugs\.map/); assert.match(routeSource,/getDayNightTeamMemberBySlug\(params\.slug\)/); });
  check('dynamic contact route uses shared identity and retains 404', () => { assert.match(routeSource,/daynightSite\.name/); assert.match(routeSource,/error\(404,/); assert.doesNotMatch(routeSource,/Day Night Auto|Sale agent/); });
  check('dynamic route TypeScript syntax parses', () => { const parsed=ts.transpileModule(routeSource,{fileName:'+page.server.ts',reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}); assert.deepEqual((parsed.diagnostics??[]).filter(d=>d.category===ts.DiagnosticCategory.Error).map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),[]); });
} finally {
  await rm(scratch,{recursive:true,force:true});
}
const failed=results.filter(result=>result.outcome==='failed').length;
console.log(JSON.stringify({scope:'Actual data-module execution, narrow TypeScript script parsing and inverse-patch source hashes only; not Svelte markup compilation, full app typecheck/build, HTTP or browser QA',runtime:process.version,typescript:ts.version,inputGitBlobs,passed:results.length-failed,failed,results},null,2));
if(failed)process.exitCode=1;
