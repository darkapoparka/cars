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


const desktopBlock = source.match(/\/\/ Native desktop preference flow: begin\n([\s\S]*?)\/\/ Native desktop preference flow: end/);
assert(desktopBlock, 'Native desktop preference flow missing');
function desktopFixture(locale) {
  const calls = [];
  let menuOpen = false, dialogOpen = false;
  const menuLabel = locale === 'bg' ? 'Още страници' : 'More pages';
  const page = {
    locator(selector) {
      if (selector === 'html') return {getAttribute: async name => {assert.equal(name,'lang'); calls.push('language:'+locale); return locale;}};
      if (selector === '[data-slot="dealer-desktop-header"]') return {
        getByRole(role, options) {
          assert.equal(role,'button'); assert.deepEqual({...options}, {name:menuLabel,exact:true});
          return {click: async () => {calls.push('native-more:'+locale); menuOpen=true;}};
        }
      };
      if (selector === 'dialog[data-locale-dialog][open]') return {
        waitFor: async () => {assert(dialogOpen, 'Native dialog did not open'); calls.push('native-dialog');}
      };
      throw new Error('Wrong or stale selector: '+selector);
    },
    getByRole(role, options) {
      assert.equal(role,'menu'); assert.deepEqual({...options},{name:menuLabel,exact:true});
      return {
        waitFor: async options => {assert.equal(options.state,'visible'); assert(menuOpen,'Portaled menu must first be opened'); calls.push('portaled-menu:'+locale);},
        locator(selector) {
          assert.equal(selector,'[data-locale-trigger]');
          return {click: async () => {assert(menuOpen,'Locale item is absent until native menu opens'); calls.push('native-locale:'+locale); dialogOpen=true;}};
        }
      };
    }
  };
  const flow = vm.runInNewContext(desktopBlock[1]+'; openClientPreferences', {assert, openPreferences:async (_page,width)=>calls.push('existing-mobile:'+width)});
  return {page,calls,flow};
}
for (const locale of ['en','bg']) test('desktop '+locale+' follows closed native More menu into portaled locale item', async () => {
  const f=desktopFixture(locale);
  assert.throws(()=>f.page.locator('[data-slot="dealer-desktop-header"] [data-locale-trigger]'),/Wrong or stale selector/);
  await f.flow(f.page,1440);
  assert.deepEqual(f.calls, ['language:'+locale,'native-more:'+locale,'portaled-menu:'+locale,'native-locale:'+locale,'native-dialog']);
});
test('mobile delegates to the unchanged native drawer flow',async()=>{
  for(const width of [320,390]) {
    const f=desktopFixture('en');await f.flow(f.page,width);
    assert.deepEqual(f.calls,['existing-mobile:'+width]);
  }
});
test('unsupported desktop language fails before menu controls; all three client call sites retain native flow',async()=>{
  const f=desktopFixture('de');
  await assert.rejects(()=>f.flow(f.page,1440),/Unsupported native page language/);
  assert.deepEqual(f.calls,['language:de']);
  assert.equal((source.match(/await openClientPreferences\(f\.page, width\);/g)||[]).length,3);
  assert.equal((source.match(/await openPreferences\(f\.page, width\);/g)||[]).length,0);
  assert(source.includes("form.locator('[name=\"locale\"]').selectOption(other)"));
});


test('JS dialog uses native confirm copy in its starting locale after selecting the opposite radio; no-JS save stays separate', async()=>{
  const base=new URL('../templates/modern/',import.meta.url);
  const native=fs.readFileSync(new URL('packages/marketplace-ui/components/locale-preferences.tsx',base),'utf8');
  const catalog=fs.readFileSync(new URL('packages/internationalization/preferences-messages.ts',base),'utf8');
  const noJs=fs.readFileSync(new URL('apps/web/app/[locale]/locale-settings/page.tsx',base),'utf8');
  const labelBlock=source.match(/const labels = (\{[\s\S]*?\n\});/);
  assert(labelBlock,'Current helper labels missing');
  const labels=vm.runInNewContext('('+labelBlock[1]+')');
  const dictionaries={};
  for(const [locale,suffix]of [['en','as const'],['bg','satisfies PreferenceMessages']]){
    const escaped=suffix;
    const match=catalog.match(new RegExp('export const '+locale+' = (\\{[\\s\\S]*?\\n\\}) '+escaped+';'));
    assert(match,'Native catalog shape changed:'+locale);
    dictionaries[locale]=vm.runInNewContext('('+match[1]+')');
  }
  assert(native.includes('messages[key].replace('),'Native dialog copy must come from its SSR messages prop');
  assert(native.includes('onChange={() => setLocale(value)}'),'Native radio must only change the selected value');
  assert(native.includes('t(busy ? "locale.saving" : "locale.confirm")'),'Native JS submit changed its copy contract');
  assert(noJs.includes('messages: t') && noJs.includes('t["locale.save"]'),'Native no-JS form must keep its full save label through its native alias');
  assert.equal((source.match(/name: labels\[locale\]\.confirm, exact: true/g)||[]).length,1);
  assert.equal((source.match(/name: labels\[locale\]\.save, exact: true/g)||[]).length,0);
  assert(source.includes("form.locator('button[value=\"save\"]').click()"),'No-JS selector must remain native and unchanged');
  for(const locale of ['en','bg']){
    const other=locale==='en'?'bg':'en',f=fixture(['en','bg'],locale);
    const expected=dictionaries[locale]['locale.confirm'];
    assert.equal(labels[locale].confirm,expected);
    assert.equal(labels[locale].save,dictionaries[locale]['locale.save']);
    assert.notEqual(labels[locale].save,expected,'Old full save selector must fail for this JS dialog');
    await controls(f.scope).choose(other);
    assert.equal(await controls(f.scope).current(),other);
    assert.equal(labels[locale].confirm,expected,'Radio selection must not retarget the dialog copy to the unsaved locale');
    assert.notEqual(labels[other].confirm,expected,'Opposite-locale confirm selector must fail');
  }
});
