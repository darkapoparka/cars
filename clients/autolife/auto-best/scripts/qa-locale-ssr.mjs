import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const base=new URL(process.env.BASE_URL||process.env.DEALER_BASE_URL);
const out=process.env.LOCALE_QA_OUT||path.join(root,'artifacts/localization/ssr');
fs.mkdirSync(out,{recursive:true});
const paths=['','/listing-grid','/contact','/contact?topic=trade-in','/contact?topic=import','/contact?topic=leasing','/contact?topic=inspection','/about-us','/blog','/locale-settings'];
for(const [file,prefix] of [['inventory','/listing-detail-v1/'],['editorial','/blog-detail/']]) for(const match of fs.readFileSync(path.join(root,'src/lib/data/'+file+'.ts'),'utf8').matchAll(/\bid:\s*(\d+)/g)) paths.push(prefix+match[1]);
const results=[];
for(const locale of ['en','bg']) for(const route of [...new Set(paths)]) {
 const url=new URL('/'+locale+route,base); const started=Date.now();
 try {
  const response=await fetch(url,{redirect:'manual',headers:{'accept-language':locale==='en'?'bg':'en',cookie:'cars_locale='+(locale==='en'?'bg':'en')+'; cars_prompt=v1'},signal:AbortSignal.timeout(15000)});
  const html=await response.text();
  assert.equal(response.status,200);assert.equal(response.headers.get('content-language'),locale);
  assert.match(html,new RegExp('<html[^>]*lang="'+locale+'"')); assert.match(response.headers.get('cache-control'),/private.*no-store/);
  if(route==='\/contact?topic=trade-in') assert.ok(html.includes(locale==='en'?'Sell or trade in':'Продажба или замяна'));
  results.push({locale,route,status:response.status,pass:true,durationMs:Date.now()-started});
 } catch(error) {results.push({locale,route,pass:false,error:error.message,durationMs:Date.now()-started});}
}
fs.writeFileSync(path.join(out,'RESULTS.json'),JSON.stringify({at:new Date().toISOString(),base:base.href,scope:'Native SSR for every retained public route/detail under conflicting preferences',results},null,2));
const failed=results.filter(row=>!row.pass); console.log(JSON.stringify({checks:results.length,passed:results.length-failed.length,failed},null,2));
if(failed.length) process.exitCode=1;
