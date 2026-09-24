import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/lib/locale/policy.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {createLocalePolicy}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const config={schemaVersion:1,dealerId:'template-auto-best',dealerName:'Example',defaultLocale:'bg',enabledLocales:['en','bg'],dealerCountry:'BG',inventoryCurrency:'EUR',formatLocales:{en:'en-GB',bg:'bg-BG'},preferenceMaxAge:15552000,promptVersion:'v1',suggestedLanguages:{BG:'bg'}};
const p=createLocalePolicy(config),origin='https://example.test';
const request=(data,headers={},method='POST')=>new Request(origin+'/api/preferences',{method,headers:{origin,'content-type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(data)}:{})});
const valid={action:'save',locale:'en',country:'DE',returnTo:'/bg/contact?topic=trade-in&probe=keep#form'};
test('explicit native path wins all conflicting hints, without accepting cookies',()=>{for(const mount of ['', '/variant-2','/variant-3'])for(const locale of ['en','bg']){const opposite=locale==='en'?'bg':'en';const state=p.resolveLocale({url:new URL(`${mount}/${locale}/contact?lang=${opposite}`,origin),cookie:`cars_locale=${opposite};cars_country=DE`,acceptLanguage:opposite,trustedCountry:'AE'});assert.equal(state.locale,locale);assert.equal(state.country,'DE');assert.equal(state.promptDismissed,false);}});
test('independent countries do not change stock currency or enable unfinished languages',()=>{for(const country of ['AE','BG','DE','UA','TR','RO','GR']){assert.equal(p.resolveLocale({url:new URL('/en',origin),trustedCountry:country}).locale,'en');assert.equal(p.contract.inventoryCurrency,'EUR');}for(const locale of ['ar','de','uk','tr','ro','el'])assert.equal(p.isLocale(locale),false);assert.match(p.formatPrice(15000,'en'),/EUR/);});
test('native mounts and suffixes are idempotent and resources stay outside rewriting',()=>{for(const mount of ['', '/variant-2','/variant-3']){const result=p.localeHref(`${mount}/bg/contact?topic=trade-in#form`,'en');assert.equal(result,`${mount}/en/contact?topic=trade-in#form`);assert.equal(p.localeHref(result,'en'),result);}for(const href of ['/assets/logo.png','/api/preferences','/variant-2/_next/static/a.js','https://other.example/en','tel:+359123','#form','mailto:demo@example.test'])assert.equal(p.localeHref(href,'bg'),href);});
test('safe destinations reject traversal, external origins, encoded separators and resources',()=>{for(const href of ['//bad.example','/\\bad.example','/api/preferences','/%2f%2fbad.example','/../api/preferences','/ar/contact','javascript:alert(1)'])assert.equal(p.safeReturnPath(href,origin),null,href);assert.equal(p.safeReturnPath(valid.returnTo,origin),valid.returnTo);});
test('normalized external returns fail every action and transport without side effects',async()=>{
  for(const returnTo of ['/x/..//invalid.example/path','/%2e%2e//invalid.example/','/..//invalid.example/path?x=1']){
    assert.equal(p.safeReturnPath(returnTo,origin),null,returnTo);
    for(const action of ['save','dismiss'])for(const format of ['json','form']){
      const data={...valid,action,returnTo};
      const response=await p.preferenceResponse(new Request(origin+'/api/preferences',{method:'POST',headers:{origin,'content-type':format==='json'?'application/json':'application/x-www-form-urlencoded'},body:format==='json'?JSON.stringify(data):new URLSearchParams(data).toString()}));
      assert.equal(response.status,400,`${action} ${format} ${returnTo}`);
      assert.equal(response.headers.has('set-cookie'),false);
      assert.equal(response.headers.has('location'),false);
    }
  }
});
test('save sets exactly host-only secure preference cookies and preserves query/anchor',async()=>{const response=await p.preferenceResponse(request(valid));assert.equal(response.status,200);assert.equal((await response.json()).destination,'/en/contact?topic=trade-in&probe=keep#form');const cookies=response.headers.getSetCookie();assert.equal(cookies.length,3);for(const cookie of cookies){assert.match(cookie,/Path=\//);assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Lax/);assert.match(cookie,/Secure/);assert.doesNotMatch(cookie,/Domain=/);}assert.match(response.headers.get('cache-control'),/private.*no-store/);});
test('dismissal records no accepted language or country',async()=>{const response=await p.preferenceResponse(request({...valid,action:'dismiss'}));assert.equal(response.status,200);const cookies=response.headers.getSetCookie();assert.equal(cookies.length,1);assert.match(cookies[0],/^cars_prompt=/);assert.equal((await response.json()).destination,valid.returnTo);});
test('malformed, cross-origin, unsupported and oversized preference writes fail without cookies',async()=>{for(const[data,headers,status]of [[valid,{origin:'https://bad.example'},403],[{...valid,locale:'ar'},{},400],[{...valid,country:'ZZ'},{},400],[{...valid,returnTo:'//bad.example'},{},400],[{...valid,extra:true},{},400],[{...valid,returnTo:'/'+'x'.repeat(5000)},{},413],[valid,{'content-type':'text/plain'},415]]){const response=await p.preferenceResponse(request(data,headers));assert.equal(response.status,status);assert.equal(response.headers.has('set-cookie'),false);}});
test('server resolution has no cross-request state or mutable caller configuration',async()=>{const original=structuredClone(config),policy=createLocalePolicy(original);original.defaultLocale='en';original.enabledLocales.push('ar');assert.equal(policy.resolveLocale({url:new URL('/',origin)}).locale,'bg');assert.equal(policy.isLocale('ar'),false);await Promise.all(Array.from({length:100},async(_,i)=>{const locale=i%2?'bg':'en';const state=policy.resolveLocale({url:new URL('/'+locale,origin),cookie:'cars_locale='+ (i%2?'en':'bg')});await Promise.resolve();assert.equal(state.locale,locale);}));});
