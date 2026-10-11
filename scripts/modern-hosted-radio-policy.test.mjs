import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../templates/modern/apps/e2e/localization-preferences-client.mjs',import.meta.url),'utf8');
const block=source.match(/\/\/ Native language radio policy: begin\n([\s\S]*?)\/\/ Native language radio policy: end/);
assert(block,'Inline native language policy missing');
const controls=vm.runInNewContext(block[1]+'; nativeLanguageControls',{assert});
function fixture(values=['en','bg'],checked='en') {
  const calls=[];let current=checked;
  return {calls,scope:{locator(selector){calls.push(selector);
    if(selector==='input[type="radio"][name="locale"]')return {evaluateAll:async fn=>fn(values.map(value=>({value})))};
    if(selector==='input[type="radio"][name="locale"]:checked')return {inputValue:async()=>current};
    const value=selector.match(/^input\[type="radio"\]\[name="locale"\]\[value="(bg|en)"\]$/)?.[1];
    assert(value&&values.includes(value),'Absent native radio');
    return {check:async()=>{current=value;calls.push('native-check:'+value);}};
  }}};
}
test('native radio values, checked language and actual check action preserve the existing bilingual policy',async()=>{
  const f=fixture(),policy=controls(f.scope);
  assert.deepEqual(Array.from(await policy.values()),['bg','en']);assert.equal(await policy.current(),'en');
  await policy.choose('bg');assert.equal(await policy.current(),'bg');assert(f.calls.includes('native-check:bg'));
  assert(!f.calls.some(call=>call.includes('select')));
});
test('unknown language fails before native controls or country selection can be touched',async()=>{
  const f=fixture();await assert.rejects(()=>controls(f.scope).choose('de'),/Unsupported native language/);assert.equal(f.calls.length,0);
});
test('missing or duplicate radio groups remain failures, preserving the original exact language-list assertion',async()=>{
  for(const values of [[],['bg','bg','en'],['bg']]) {
    const f=fixture(values),actual=Array.from(await controls(f.scope).values());assert.throws(()=>assert.deepEqual(actual,['bg','en']));
  }
});

