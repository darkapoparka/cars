import test from 'node:test';
import assert from 'node:assert/strict';
import {applyLogoSurfaceBindings,assertLogoSurfaceBindings,AUTO_BEST_LOGO_CONFIG,MODERN_LOGO_CONFIG,MOBILE_LOGO_HEADER} from './publishing/logo-surface-bindings.mjs';
import {bindCurrentImportLogoAssets} from './lib/client-presentation-policy.mjs';

const base='/dealer-brand/v2-0123456789abcdef';
function inputs(){return new Map([
 [AUTO_BEST_LOGO_CONFIG,Buffer.from('export const brand = {\n  name: "Dealer",\n  logo: "/dealer-brand/logo.webp",\n  logoOnDark: "/dealer-brand/logo.webp",\n};')],
 [MODERN_LOGO_CONFIG,Buffer.from('export const leadSite = {\n  logoPath: "/dealer-brand/logo.webp",\n};')],
 [MOBILE_LOGO_HEADER,Buffer.from(`filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },
              <Image
                src={showroom.logo}
                alt={showroom.name}
              />`)],
]);}

test('one old opaque alias becomes distinct Auto Best desktop/mobile and Modern dark sources',()=>{
 const files=inputs();applyLogoSurfaceBindings(files,base);
 const autoBest=files.get(AUTO_BEST_LOGO_CONFIG).toString();
 assert.match(autoBest,/name: "Dealer"/);
 assert.match(autoBest,/logo: "\/dealer-brand\/v2-0123456789abcdef\/logo-on-light.webp"/);
 assert.match(autoBest,/logoOnDark: "\/dealer-brand\/v2-0123456789abcdef\/logo-on-dark.webp"/);
 assert.match(files.get(MODERN_LOGO_CONFIG).toString(),/logoInversePath: "\/dealer-brand\/v2-0123456789abcdef\/logo-on-dark.webp"/);
 assertLogoSurfaceBindings(files,base);
 const first=[...files].map(([name,bytes])=>[name,bytes.toString()]);
 applyLogoSurfaceBindings(files,base);
 assert.deepEqual([...files].map(([name,bytes])=>[name,bytes.toString()]),first);
});

test('a dark Auto Best header cannot be bound back to the light raster',()=>{
 const files=inputs();applyLogoSurfaceBindings(files,base);
 files.set(AUTO_BEST_LOGO_CONFIG,Buffer.from(files.get(AUTO_BEST_LOGO_CONFIG).toString().replace('logoOnDark: "'+base+'/logo-on-dark.webp"','logoOnDark: "'+base+'/logo-on-light.webp"')));
 assert.throws(()=>assertLogoSurfaceBindings(files,base),/Auto light\/dark surfaces have no exact committed raster bindings/);
});

test('Import accepts authenticated native PNG and versioned WebP paths without changing its palette',()=>{
 const source='export const daynightAssets = {\n logoLight: "/old.svg",\n logoDark: "/old.svg",\n} as const;\nexport const palette = {accent: "#ff0000"};';
 for(const paths of [
  {onLight:'/registered-branding/onLight.png',onDark:'/registered-branding/onDark.png'},
  {onLight:base+'/logo-on-light.webp',onDark:base+'/logo-on-dark.webp'},
 ]){
  const output=bindCurrentImportLogoAssets(source,paths);
  assert(output.includes('logoLight: '+JSON.stringify(paths.onLight)));
  assert(output.includes('logoDark: '+JSON.stringify(paths.onDark)));
  assert(output.endsWith('export const palette = {accent: "#ff0000"};'));
 }
 for(const invalid of ['https://example.com/logo.png','/registered-branding/../logo.png','/dealer-brand/unknown/logo.png','/dealer-brand/logo.svg'])assert.throws(()=>bindCurrentImportLogoAssets(source,{onLight:invalid,onDark:base+'/logo-on-dark.webp'}),/Expected reviewed Import raster/);
});

function fixture(){return new Map([[AUTO_BEST_LOGO_CONFIG,Buffer.from('export const brand = {\n  phone: "",\n  logo: "'+base+'/logo-on-light.webp",\n  logoOnDark: "'+base+'/logo-on-light.webp"\n} as const satisfies BrandConfig;')],[MODERN_LOGO_CONFIG,Buffer.from('export const leadSite = {\n  logoPath: "'+base+'/logo-on-light.webp",\n  logoOnLight: "'+base+'/logo-on-light.webp",\n};')],[MOBILE_LOGO_HEADER,Buffer.from(`filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },\n              <Image\n                src={showroom.logo}\n                alt={showroom.name}\n              />`)]]);}
test('native inverse footer and responsive white artwork replace ambiguous fallback/filter',()=>{const files=fixture();applyLogoSurfaceBindings(files,base);assertLogoSurfaceBindings(files,base);assert.ok(files.get(MODERN_LOGO_CONFIG).toString().includes('logoInversePath'));assert.ok(files.get(MOBILE_LOGO_HEADER).toString().includes('data-dealer-logo-surfaces'));const before=JSON.stringify([...files].map(([p,b])=>[p,b.toString()]));applyLogoSurfaceBindings(files,base);assert.equal(JSON.stringify([...files].map(([p,b])=>[p,b.toString()])),before);});
test('reverted inverse binding is rejected',()=>{const files=fixture();applyLogoSurfaceBindings(files,base);files.set(MODERN_LOGO_CONFIG,Buffer.from(files.get(MODERN_LOGO_CONFIG).toString().replace('logoInversePath: "'+base+'/logo-on-dark.webp"','logoInversePath: "'+base+'/logo-on-light.webp"')));assert.throws(()=>assertLogoSurfaceBindings(files,base),/inverse/);});

test('Auto binds both explicit surfaces while retaining all raster and factual bytes',()=>{
 const files=fixture(),raster=Buffer.from([1,2,3]),facts=Buffer.from('recorded business');files.set('auto-best/static/brand.webp',raster);files.set('business-facts.json',facts);
 applyLogoSurfaceBindings(files,base);
 assert.match(String(files.get(AUTO_BEST_LOGO_CONFIG)),/logoOnDark: "\/dealer-brand\/v2-0123456789abcdef\/logo-on-dark\.webp"/);
 assert.match(String(files.get(AUTO_BEST_LOGO_CONFIG)),/phone: ""/);assert.equal(files.get('auto-best/static/brand.webp'),raster);assert.equal(files.get('business-facts.json'),facts);
 const broken=new Map(files);broken.set(AUTO_BEST_LOGO_CONFIG,Buffer.from(String(files.get(AUTO_BEST_LOGO_CONFIG)).replace('/logo-on-dark.webp','/logo-on-light.webp')));
 assert.throws(()=>assertLogoSurfaceBindings(broken,base),/Auto light\/dark/);
});
test('ambiguous Auto overrides fail atomically before another surface is changed',()=>{
 for(const override of ['  ...other,','  ["logoOnDark"]: "other",','  "logoOnDark": "other",']){
  const files=fixture();files.set(AUTO_BEST_LOGO_CONFIG,Buffer.from(String(files.get(AUTO_BEST_LOGO_CONFIG)).replace('  phone:',override+'\n  phone:')));const original=[...files];
  assert.throws(()=>applyLogoSurfaceBindings(files,base),/Auto logo/);for(const [name,bytes]of original)assert.equal(files.get(name),bytes);
 }
});
