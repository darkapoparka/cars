import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {applyDealerLogoContract} from './lib/client-logo-contract.mjs';
import {bindCurrentImportLogoAssets} from './lib/client-presentation-policy.mjs';
const paths={onLight:'/dealer-brand/dark.webp',onDark:'/dealer-brand/white.webp'};
test('current Import keys mean surface colour, for object and generated JSON forms',()=>{
 for(const quoted of [true,false]){
  const k=s=>quoted?JSON.stringify(s):s;
  const source='export const daynightAssets = {\n'+k('logoLight')+': "old-light",\n'+k('logoDark')+': "old-dark",\nhero: "untouched.webp"\n} as const;';
  const after=bindCurrentImportLogoAssets(source,paths);
  assert.match(after,/logoLight"?: "\/dealer-brand\/dark.webp"/);
  assert.match(after,/logoDark"?: "\/dealer-brand\/white.webp"/);
  assert.ok(after.includes('hero: "untouched.webp"'));
  assert.equal(bindCurrentImportLogoAssets(after,paths),after);
 }
});
test('missing or duplicated Import asset slots fail before source replacement',()=>{
 assert.throws(()=>bindCurrentImportLogoAssets('export const daynightAssets = {logoLight:"old"} as const;',paths));
 assert.throws(()=>bindCurrentImportLogoAssets('export const otherAssets = {} as const;',paths));
});


test('Import accepts only declared local PNG logo paths while preserving palette and surface meaning',()=>{
 const source='const accent="#9b81d5";\nexport const daynightAssets = {logoLight:"old-light",logoDark:"old-dark",hero:"native.webp"} as const;\n';
 for(const directory of ['registered-branding','dealer-brand']){
  const selected={onLight:'/'+directory+'/onLight.png',onDark:'/'+directory+'/onDark.png'},after=bindCurrentImportLogoAssets(source,selected);
  assert(after.includes('logoLight:'+JSON.stringify(selected.onLight)));assert(after.includes('logoDark:'+JSON.stringify(selected.onDark)));assert(after.includes('hero:"native.webp"'));assert(after.includes('accent="#9b81d5"'));assert.equal(bindCurrentImportLogoAssets(after,selected),after);
 }
});

test('Import PNG binding rejects external, escaped, relabelled and arbitrary media paths',()=>{
 const source='export const daynightAssets = {logoLight:"old-light",logoDark:"old-dark"} as const;';
 for(const invalid of ['https://example.com/onLight.png','//example.com/onLight.png','/arbitrary/onLight.png','/registered-branding/sub/onLight.png','/registered-branding/../onLight.png','/registered-branding/..\\onLight.png','/registered-branding/%2e%2e%2fonLight.png','/registered-branding/onLight.png?x=1','/registered-branding/onLight.webp','/dealer-brand/onLight.jpg','/registered-branding/.hidden.png']){
  assert.throws(()=>bindCurrentImportLogoAssets(source,{onLight:invalid,onDark:'/registered-branding/onDark.png'}),/Expected reviewed Import raster asset/);
  assert.throws(()=>bindCurrentImportLogoAssets(source,{onLight:'/registered-branding/onLight.png',onDark:invalid}),/Expected reviewed Import raster asset/);
 }
});

test('maintained Import consumer copies exact pinned PNG bytes without changing source raster or native palette',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-import-png-policy-')),parent=fs.realpathSync(os.tmpdir());t.after(()=>{const exact=fs.realpathSync(root);assert.equal(path.dirname(exact),parent);assert(path.basename(exact).startsWith('cars-import-png-policy-'));fs.rmSync(exact,{recursive:true,force:true});});
 const assets=path.join(root,'assets'),candidate=path.join(root,'candidate'),hash=b=>createHash('sha256').update(b).digest('hex'),png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZxoAAAAASUVORK5CYII=','base64'),selected={onLight:{publicPath:'/registered-branding/onLight.png',sha256:hash(png)},onDark:{publicPath:'/registered-branding/onDark.png',sha256:hash(png)},onAccent:{publicPath:'/registered-branding/onDark.png',sha256:hash(png)}};
 fs.mkdirSync(path.join(assets,'registered-branding'),{recursive:true});for(const asset of Object.values(selected))fs.writeFileSync(path.join(assets,asset.publicPath.slice(1)),png);fs.mkdirSync(path.join(assets,'import'));fs.mkdirSync(path.join(candidate,'src/lib/config'),{recursive:true});
 const source='const accent="#9b81d5";\nexport const daynightAssets = {logoLight:"old-light",logoDark:"old-dark",hero:"native.webp"} as const;\n';fs.writeFileSync(path.join(candidate,'src/lib/config/dealer.ts'),source);
 applyDealerLogoContract({key:'import',oldVariant:path.join(assets,'import'),candidate,profile:{logoContract:{assets:selected}}});const after=fs.readFileSync(path.join(candidate,'src/lib/config/dealer.ts'),'utf8');
 assert(after.includes('logoLight:"/registered-branding/onLight.png"'));assert(after.includes('logoDark:"/registered-branding/onDark.png"'));assert(after.includes('accent="#9b81d5"'));assert(after.includes('hero:"native.webp"'));
 for(const asset of Object.values(selected)){const original=fs.readFileSync(path.join(assets,asset.publicPath.slice(1))),copied=fs.readFileSync(path.join(candidate,'static',asset.publicPath.slice(1)));assert(original.equals(png));assert(copied.equals(original));assert.equal(hash(copied),asset.sha256);}
});
