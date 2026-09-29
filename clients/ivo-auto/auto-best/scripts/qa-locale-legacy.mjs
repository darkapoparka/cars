import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=new URL(process.env.DEALER_BASE_URL||process.env.BASE_URL);
const out=process.env.LOCALE_QA_OUT||path.resolve('artifacts/locale-legacy');
fs.mkdirSync(out,{recursive:true});const results=[];
const aliases=Object.fromEntries([...Array.from({length:9},(_,i)=>['/home'+String(i+2).padStart(2,'0'),'/']),['/blog-grid','/blog'],...['/listing-grid2','/listing-list','/listing-grid-map','/listing-list-map'].map(p=>[p,'/listing-grid']),['/faq','/contact'],...Array.from({length:4},(_,i)=>['/listing-detail-v'+(i+2)+'/1','/listing-detail-v1/1'])]);
for(const locale of ['en','bg'])for(const explicit of [false,true])for(const [alias,target]of Object.entries(aliases)){
 const requested=(explicit?'/'+locale:'')+alias+'?probe=legacy&topic=trade-in';let url=new URL(requested,base),hops=[];const name=[locale,explicit?'explicit':'legacy',alias].join(' ');
 try{for(let i=0;i<5;i++){const r=await fetch(url,{redirect:'manual',headers:{'accept-language':locale,cookie:'cars_locale='+locale},signal:AbortSignal.timeout(15000)});hops.push({url:url.href,status:r.status});if([301,302,303,307,308].includes(r.status)){const next=new URL(r.headers.get('location'),url);assert.equal(next.origin,base.origin);assert(!hops.some(h=>h.url===next.href),'Redirect loop');url=next;continue;}assert.equal(r.status,200);assert.equal(r.headers.get('content-language'),locale);break;}assert.equal(url.pathname,'/'+locale+(target==='/'?'':target));assert.equal(url.search,'?probe=legacy&topic=trade-in');assert.equal(hops.at(-1).status,200);assert(hops.length<=3);results.push({name,pass:true,hops});}catch(error){results.push({name,pass:false,error:error.message,hops});}
 fs.writeFileSync(path.join(out,'RESULTS.json'),JSON.stringify({checkedAt:new Date().toISOString(),base:base.origin,results},null,2));
}
const failed=results.filter(r=>!r.pass);console.log(JSON.stringify({checks:results.length,passed:results.length-failed.length,failed}));if(failed.length)process.exitCode=1;
