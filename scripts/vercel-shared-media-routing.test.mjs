import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {applyVercelAssets,clearVercelAssetPlan,sharedMediaRuntimeRoutes} from './publishing/vercel-asset-plan.mjs';
const bytes=x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)),escape=x=>x.replace(/[.*+?^${}()|[\]\\:]/g,'\\$&');
function fixture(existing=false){
 const variants=[{key:'auto-best',base:'',entry:'/'},{key:'modern',base:'/variant-2',entry:'/variant-2/'}];
 const config={services:{autobest:{buildCommand:'npm run build',...(existing?{routes:[{src:'^/health$',transforms:[{type:'request.path',op:'set',args:'/health'}]}]}:{})},modern:{buildCommand:'npm run build'}},rewrites:[{source:'/(.*)',destination:{service:'autobest'}}]};
 return new Map([['dealer.json',bytes({schemaVersion:1,slug:'fixture-dealer',variants})],['vercel.json',bytes(config)],['auto-best/static/stock/car.webp',bytes('same image')],['modern/apps/web/public/stock/car.webp',bytes('same image')]]);
}
function makeLegacy(files){const plan=JSON.parse(files.get('.cars-vercel-assets.json')),config=JSON.parse(files.get('vercel.json'));config.services.autobest.routes.splice(0,plan.objects.length,...sharedMediaRuntimeRoutes(plan).map(({transforms})=>({src:'^'+escape(transforms[0].args)+'$',transforms})));files.set('vercel.json',bytes(config));}
test('all sealed original aliases and direct shared paths receive the exact shared runtime URL',()=>{
 const files=fixture(),plan=applyVercelAssets(files),routes=sharedMediaRuntimeRoutes(plan);assert.equal(routes.length,1);
 for(const alias of plan.aliases){const original=alias.source.replace(/\\(.)/g,'$1'),route=routes.find(r=>new RegExp(r.src).test(original));assert.equal(route.transforms[0].args,alias.destination.path);assert.equal(route.dest,alias.destination.path);}
 const shared=plan.objects[0].publicPath.slice('auto-best/static'.length);assert(new RegExp(routes[0].src).test(shared));
 for(const bad of ['/stock/carXwebp','/stock/car.webp/x','/unknown.webp',shared+'x'])assert(!routes.some(r=>new RegExp(r.src).test(bad)));
});
test('current and exact previous direct-path prefixes clear and replan without stacked wrappers',()=>{
 for(const legacy of [false,true])for(const existing of [false,true]){const files=fixture(existing),original=new Map(files);applyVercelAssets(files);if(legacy)makeLegacy(files);clearVercelAssetPlan(files);assert.deepEqual(JSON.parse(files.get('vercel.json')),JSON.parse(original.get('vercel.json')));for(const [name,value]of original)if(name!=='vercel.json')assert(files.get(name).equals(value));const next=applyVercelAssets(files);assert.deepEqual(JSON.parse(files.get('vercel.json')).services.autobest.routes.slice(0,1),sharedMediaRuntimeRoutes(next));}
});
test('prefix, transform, alias and build drift are rejected without changing retained input',()=>{
 for(const mutate of [c=>c.services.autobest.routes[0].src+='|.*',c=>c.services.autobest.routes[0].transforms[0].args+='/unknown',c=>c.rewrites[0].source='/unknown',c=>c.services.modern.buildCommand+=' && changed']){const files=fixture();applyVercelAssets(files);makeLegacy(files);const cfg=JSON.parse(files.get('vercel.json'));mutate(cfg);files.set('vercel.json',bytes(cfg));const before=[...files].map(([n,b])=>[n,createHash('sha256').update(b).digest('hex')]);assert.throws(()=>clearVercelAssetPlan(files));assert.deepEqual([...files].map(([n,b])=>[n,createHash('sha256').update(b).digest('hex')]),before);}
});
test('changed generated media and unsealed aliases are rejected',()=>{
 const files=fixture(),plan=applyVercelAssets(files);makeLegacy(files);files.set(plan.objects[0].path,bytes('changed'));assert.throws(()=>clearVercelAssetPlan(files),/media object changed/);
 const bad=structuredClone(plan);bad.aliases[0].source='/unknown/(.*)';assert.throws(()=>sharedMediaRuntimeRoutes(bad),/aliases differ/);
});

test('exact prior union without destination clears, while changed explicit destination refuses',()=>{const files=fixture(),original=JSON.parse(files.get('vercel.json'));applyVercelAssets(files);let config=JSON.parse(files.get('vercel.json'));for(const route of config.services.autobest.routes)delete route.dest;files.set('vercel.json',bytes(config));clearVercelAssetPlan(files);assert.deepEqual(JSON.parse(files.get('vercel.json')),original);applyVercelAssets(files);config=JSON.parse(files.get('vercel.json'));config.services.autobest.routes[0].dest+='/unreviewed';files.set('vercel.json',bytes(config));assert.throws(()=>clearVercelAssetPlan(files),/paths changed/);});
