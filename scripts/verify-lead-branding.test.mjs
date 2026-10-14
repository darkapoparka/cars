import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { resolveBrandingSharp, verifyLeadBranding } from './verify-lead-branding.mjs';
import {rebindDerivedProfileLogoContracts,assertDerivedProfileLogoContracts,PUBLIC_ROOTS} from './publishing/lead-branding.mjs';

const sharp = resolveBrandingSharp();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
async function fixture(run) {
  const base = fs.realpathSync(os.tmpdir());
  const root = fs.mkdtempSync(path.join(base, 'cars-branding-check-'));
  try {
    fs.mkdirSync(path.join(root, 'branding')); fs.mkdirSync(path.join(root, 'dealer-brand'));
    const rgba = Buffer.alloc(8 * 4 * 4);
    for (let y = 1; y < 3; y++) for (let x = 1; x < 7; x++) {
      const p = (y * 8 + x) * 4; rgba[p] = 60; rgba[p + 1] = 120; rgba[p + 2] = 80; rgba[p + 3] = 255;
    }
    const bytes = await sharp(rgba, { raw: { width: 8, height: 4, channels: 4 } }).png().toBuffer();
    fs.writeFileSync(path.join(root, 'dealer-brand/logo.png'), bytes);
    const contract = { dealer: 'fixture', generationId: 'retained-actual-tool-reference',
      identityStatus: 'Generated demonstration proposal', assets: Object.fromEntries(['onLight', 'onDark', 'onAccent'].map(key => [key, { publicPath: '/dealer-brand/logo.png', sha256: sha(bytes) }])) };
    const write = () => fs.writeFileSync(path.join(root, 'branding/logo-contract.json'), JSON.stringify(contract));
    write(); await run({ root, bytes, contract, write });
  } finally {
    const exact = fs.realpathSync(root), relative = path.relative(base, exact);
    assert(relative.startsWith('cars-branding-check-') && !relative.includes(path.sep) && exact !== path.parse(exact).root);
    fs.rmSync(exact, { recursive: true });
  }
}

test('requires a contract and actual generation provenance', async () => fixture(async ({ root, contract, write }) => {
  fs.unlinkSync(path.join(root, 'branding/logo-contract.json'));
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /contract.*missing/);
  delete contract.generationId; write();
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /Image Gen provenance/);
}));
test('checks all three treatments and byte integrity', async () => fixture(async ({ root, contract, write }) => {
  delete contract.assets.onAccent; write();
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /onAccent/);
  contract.assets.onAccent = { ...contract.assets.onLight, sha256: 'a'.repeat(64) }; write();
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /bytes differ/);
}));
test('rejects real opaque PNG despite correct hash', async () => fixture(async ({ root, contract, write }) => {
  const opaque = await sharp({ create: { width: 8, height: 4, channels: 4, background: '#fff' } }).png().toBuffer();
  fs.writeFileSync(path.join(root, 'dealer-brand/logo.png'), opaque);
  for (const asset of Object.values(contract.assets)) asset.sha256 = sha(opaque); write();
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /Opaque or empty/);
}));
test('reports actual alpha and bounds without claiming rendered contrast', async () => fixture(async ({ root }) => {
  const result = await verifyLeadBranding({ client: root, sharp });
  assert.equal(result.status, 'passed'); assert.equal(result.surfaces.length, 3);
  assert.equal(result.surfaces[0].transparentPixels, 20);
  assert.deepEqual(result.surfaces[0].visibleBounds, { left: 1, top: 1, width: 6, height: 2 });
  assert.equal(result.renderedContrastVerified, false);
}));
test('rejects traversal before reading a treatment', async () => fixture(async ({ root, contract, write }) => {
  contract.assets.onLight.publicPath = '/dealer-brand/../../outside.png'; write();
  await assert.rejects(verifyLeadBranding({ client: root, sharp }), /raster treatment missing/);
}));
test('integrated release checks every family copy and detects a wrong dark logo', async () => fixture(async ({ root, contract, bytes }) => {
  const roots = { 'auto-best': 'auto-best/static', modern: 'modern/apps/web/public', import: 'import/static', app: 'app/public', mobile: 'mobile/public', 'karento-best': 'karento-best/static' };
  fs.writeFileSync(path.join(root, 'dealer.json'), JSON.stringify({ variants: Object.keys(roots).map(key => ({ key })) }));
  for (const directory of Object.values(roots)) { fs.mkdirSync(path.join(root, directory, 'dealer-brand'), { recursive: true }); fs.writeFileSync(path.join(root, directory, 'dealer-brand/logo.png'), bytes); }
  const result = await verifyLeadBranding({ client: root, sharp, integrated: true });
  assert.equal(result.surfaces[0].copies.length, 6);
  fs.writeFileSync(path.join(root, roots.mobile, 'dealer-brand/logo.png'), 'wrong logo');
  await assert.rejects(verifyLeadBranding({ client: root, sharp, integrated: true }), /differ in mobile/);
}));

function derivedProfileLegacyRasterFixture(){
 const files=new Map(),base='/dealer-brand/v2-0123456789abcdef',old=Buffer.from('exact retained legacy raster'),legacySha=sha(old);
 for(const [key,name]of Object.entries({'auto-best':'auto-best/src/lib/data/dealer-profile.json',import:'import/src/lib/data/dealer-profile.json',modern:'modern/packages/marketplace-domain/testing/dealer-profile.json'})){
  const profile={schemaVersion:1,business:{name:'Retained business',phone:'+441234567890',logo:'/dealer-brand/logo.webp',logoLight:'/dealer-brand/logo.webp',logoDark:'/dealer-brand/logo.webp'},listings:[{id:'retained-stock',askingPrice:4299,description:'Retained dated inventory'}],custom:{paid:'preserved'},logoContract:{schemaVersion:1,dealerId:'retained',provenance:{dealerApproval:false},assets:Object.fromEntries(['onLight','onDark','onAccent'].map(surface=>[surface,{publicPath:'/dealer-brand/logo.webp',sha256:legacySha,width:1024,height:341,background:'opaque_white'}]))}};
  files.set(name,Buffer.from(JSON.stringify(profile,null,2)+'\n'));files.set(PUBLIC_ROOTS[key]+'dealer-brand/logo.webp',old);
  for(const tone of ['on-light','on-dark','on-accent'])files.set(PUBLIC_ROOTS[key]+base.slice(1)+'/logo-'+tone+'.webp',Buffer.from('reviewed final raster '+key+'/'+tone));
 }
 return{files,base,legacySha};
}
test('derived profile legacy missing bytes requires the exact retained raster and preserves facts across all three profiles',()=>{
 const {files,base}=derivedProfileLegacyRasterFixture(),before=new Map(files),rows=rebindDerivedProfileLogoContracts(files,base);
 assert.equal(rows.length,3);for(const row of rows){const original=JSON.parse(before.get(row.path)),after=JSON.parse(files.get(row.path));assert.deepEqual(after.listings,original.listings);assert.deepEqual(after.custom,original.custom);assert.deepEqual(after.logoContract.provenance,original.logoContract.provenance);for(const surface of ['onLight','onDark','onAccent'])assert(Number.isSafeInteger(after.logoContract.assets[surface].bytes)&&after.logoContract.assets[surface].bytes>0);assert.equal(after.business.name,original.business.name);assert.equal(after.business.phone,original.business.phone);assert.equal(after.business.logo,base+'/logo-on-light.webp');assert.equal(after.business.logoDark,base+'/logo-on-dark.webp');}
 assertDerivedProfileLogoContracts(files,base);const once=new Map(files);rebindDerivedProfileLogoContracts(files,base);for(const [name,bytes]of once)assert(files.get(name).equals(bytes),'Second application changed '+name);
});
test('derived profile malformed present bytes and missing or hash-mismatched legacy rasters refuse atomically',()=>{
 for(const mutate of [f=>{const p='auto-best/src/lib/data/dealer-profile.json',x=JSON.parse(f.files.get(p));x.logoContract.assets.onDark.bytes=0;f.files.set(p,Buffer.from(JSON.stringify(x)));},f=>{const p='auto-best/src/lib/data/dealer-profile.json',x=JSON.parse(f.files.get(p));x.logoContract.assets.onDark.bytes=null;f.files.set(p,Buffer.from(JSON.stringify(x)));},f=>f.files.delete('auto-best/static/dealer-brand/logo.webp'),f=>f.files.set('auto-best/static/dealer-brand/logo.webp',Buffer.from('foreign raster'))]){
  const f=derivedProfileLegacyRasterFixture();mutate(f);const before=new Map(f.files);assert.throws(()=>rebindDerivedProfileLogoContracts(f.files,f.base),/Malformed derived profile logo surface/);assert.deepEqual([...f.files.keys()],[...before.keys()]);for(const [name,bytes]of before)assert(f.files.get(name).equals(bytes),'Refusal changed '+name);
 }
});

