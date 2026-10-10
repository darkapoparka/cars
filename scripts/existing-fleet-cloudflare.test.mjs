import test from 'node:test';import assert from 'node:assert/strict';import {buildMatrix,outputBudget} from './build-existing-fleet-cloudflare.mjs';
const leads=[{slug:'promosale-varna',proposedRepository:'darkapoparka/cars-promosalevarna'}];
test('six applications and one router',()=>{const m=buildMatrix({schemaVersion:1,dealers:['promosale-varna']},leads);assert.equal(m.include.length,7);assert.equal(new Set(m.include.map(x=>x.key)).size,7);});
test('unknown and duplicate dealers fail closed',()=>{for(const dealers of [['unknown'],['promosale-varna','promosale-varna']])assert.throws(()=>buildMatrix({schemaVersion:1,dealers},leads));});
test('conservative Free output budget',()=>{assert.throws(()=>outputBudget([{path:'big',bytes:26*1024**2}],[]));assert.throws(()=>outputBudget([],[{path:'main',compressedBytes:4*1024**2}]));});
