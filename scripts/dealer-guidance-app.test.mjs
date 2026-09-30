import test from 'node:test';
import assert from 'node:assert/strict';
import {dealerGuidance} from './lib/dealer-guidance.mjs';
test('four-design publishing guidance includes the actual App runtime and mounted entry',()=>{
  const variants=[{key:'auto-best',entry:'/'},{key:'modern',entry:'/variant-2/cars'},{key:'carwow',entry:'/variant-3/'},{key:'app',entry:'/variant-4/'}];
  const text=dealerGuidance({slug:'fixture-cars',variants,workflowCommit:'a'.repeat(40)});
  assert.match(text,/### app\n\nRun from app\/\. Node 22\.x/);
  assert.match(text,/--port=6604/);assert.match(text,/Published entry: \/variant-4\//);
  assert.match(text,/publication never authorizes outreach/);
});
