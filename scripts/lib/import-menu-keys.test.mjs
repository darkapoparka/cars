import test from 'node:test';
import assert from 'node:assert/strict';
import {ensureImportMenuKeys,importMenuKeyContract as contract} from './import-menu-keys.mjs';
test('repairs URL-only keys without changing surrounding markup',()=>{
 const source='<nav>\n'+contract.previous+'\n<a>{vehicle.label}</a>\n{/each}\n</nav>';
 assert.equal(ensureImportMenuKeys(source),source.replace(contract.previous,contract.corrected));
});
test('preserves the existing local repair while making identical cards safe',()=>{
 assert.equal(ensureImportMenuKeys(contract.interim),contract.corrected);
 const vehicles=[{href:'/inventory',label:'Audi A4'},{href:'/inventory',label:'Audi A4'},{href:'/inventory',label:'BMW 320'}];
 const keys=vehicles.map((vehicle,index)=>`${vehicle.href}:${vehicle.label}:${index}`);
 assert.equal(new Set(keys).size,vehicles.length);
});
test('is idempotent for the complete repair',()=>{
 assert.equal(ensureImportMenuKeys(contract.corrected),contract.corrected);
});
test('fails rather than rewriting an unknown or ambiguous component',()=>{
 assert.throws(()=>ensureImportMenuKeys('<nav />'),/contract changed/);
 assert.throws(()=>ensureImportMenuKeys(contract.previous+contract.previous),/contract changed/);
 assert.throws(()=>ensureImportMenuKeys(null),TypeError);
});
