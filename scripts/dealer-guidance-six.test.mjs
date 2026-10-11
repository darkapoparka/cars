import test from 'node:test';import assert from 'node:assert/strict';import {dealerGuidance} from './lib/dealer-guidance.mjs';
test('all six dealer designs have portable publishing instructions',()=>{
 const keys=['auto-best','modern','import','app','mobile','karento-best'];const result=dealerGuidance({slug:'test',variants:keys.map((key,i)=>({key,base:i?'/variant-'+(i+1):'',entry:i?'/variant-'+(i+1)+'/':'/'})),workflowCommit:'a'.repeat(40)});
 for(const key of keys)assert.ok(result.includes('### '+key));assert.match(result,/Node 22.x/);assert.match(result,/Node 24 adapter/);assert.doesNotMatch(result,/undefined/);
});
