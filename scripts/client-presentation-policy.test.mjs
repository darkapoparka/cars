import test from 'node:test';
import assert from 'node:assert/strict';
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
