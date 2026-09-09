'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {createRequire}=require('node:module');
const clientRoot=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const files={
 'home-page-data.ts':path.join(clientRoot,'carwow/src/lib/server/home-page-data.ts'),
 'mock-directory.ts':path.join(clientRoot,'modern/packages/marketplace/mock-directory.ts'),
 'HomePageHead.svelte':path.join(clientRoot,'carwow/src/lib/components/home/HomePageHead.svelte'),
};
const localRequire=createRequire(path.join(clientRoot,'carwow/package.json'));
const ts=process.env.TYPESCRIPT_PATH?require(process.env.TYPESCRIPT_PATH):localRequire('typescript');
const sourceFile=name=>process.env.SOURCE_FIXTURE_ROOT?path.join(process.env.SOURCE_FIXTURE_ROOT,name):files[name];
const results=[];
const sourceHashes={};
function load(file,deps){
 const bytes=fs.readFileSync(sourceFile(file));
 sourceHashes[file]=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
 const r=ts.transpileModule(bytes.toString('utf8'),{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS},reportDiagnostics:true});
 assert.equal((r.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,file+' syntax');
 const module={exports:{}};
 vm.runInNewContext(r.outputText,{module,exports:module.exports,require:name=>{assert.ok(Object.hasOwn(deps,name),'unexpected import '+name);return deps[name]}},{filename:file,timeout:1000});
 return module.exports;
}
function check(id,fn){try{fn();results.push({id,passed:true})}catch(e){results.push({id,passed:false,error:e.message})}}
const cases=[['sunny-varna','СЪНИ'],['rqs-auto-team','R.Q.S. Auto – Team'],['evrocar-varna-09','ЕВРОКАР ВАРНА 09'],['sprint-auto-varna','Спринт ауто'],['europa-varna','Европа']];
for(const [slug,name] of cases){
 const dealer={slug,name,city:'Варна',phoneE164:'+359000000000',sourceUrl:'https://example.invalid/',logo:'/brand/logo.svg',stockNotice:'TEST SNAPSHOT: not live stock.'};
 // Explicit fixtures, not a claim that these are newly researched real cars.
 const cars=Array.from({length:8},(_,i)=>({slug:`${slug}-fixture-${i+1}`,shortTitle:'TEST '+i,brand:i<4?'TEST A':'TEST B',model:'TEST MODEL '+i,year:2010+i,price:2000+i*2000,priceEur:(2000+i*2000)+' €',mileage:'TEST km',fuel:'TEST',transmission:'TEST',image:'/brand/stock-unavailable.svg',badges:[],conditionLine:'TEST',body:i<5?'SUV':'Hatchback'}));
 const home=load('home-page-data.ts',{'$lib/data/daynight-vehicles':{cars,placeholderImageSlugs:new Set(cars.map(c=>c.slug))},'$lib/data/dealer':{dealer},'$lib/data/home-brand-strip':{buildHomeBrandStripItems:v=>v.map(c=>c.brand)}});
 check(slug+': own title and six non-hidden listings',()=>{const d=home.loadHomePageData();assert.equal(d.home.title,name+' · Варна');assert.equal(d.mobileHome.total,8);assert.equal(d.mobileHome.featuredCars.length,6);assert.ok(d.mobileHome.featuredCars.every(c=>c.slug.startsWith(slug)&&c.image==='/brand/stock-unavailable.svg'));});
 check(slug+': explicit empty inventory stays empty',()=>{const d=home.loadHomePageData({title:'EXPLICIT'},'mobile',[]);assert.equal(d.home.title,'EXPLICIT');assert.equal(d.mobileHome.total,0);assert.equal(d.mobileHome.featuredCars.length,0);assert.equal(d.initialViewport,'mobile');});
 check(slug+': passed inventory and budget counts retained',()=>{const v=cars.slice(5);const d=home.loadHomePageData(undefined,'desktop',v);assert.equal(d.mobileHome.total,3);assert.ok(d.mobileHome.featuredCars.every(c=>v.some(x=>x.slug===c.slug)));assert.equal(d.mobileHome.budgetTiles.find(b=>b.value==='under-10000').count,0);assert.equal(d.mobileHome.budgetTiles.find(b=>b.value==='all').count,3);});
 const listings=cars.map((c,i)=>({id:i?'external-'+i:'',slug:c.slug,title:c.shortTitle,price:{amount:c.price,currency:'EUR'},images:i===2?[]:[{url:c.image,alt:'TEST IMAGE'}]}));
 let validations=0;
 const directory=load('mock-directory.ts',{'./dealer-profile':{dealer},'./mock-data':{mockListings:listings},'./directory':{organizationDirectoryEntriesSchema:{parse:value=>{validations++;return value}}}});
 check(slug+': directory imports without obsolete am IDs',()=>{assert.equal(directory.mockOrganizationDirectoryEntries.length,1);const e=directory.mockOrganizationDirectoryEntries[0];assert.equal(e.displayName,name);assert.equal(e.representativeVehicles.length,3);assert.equal(e.representativeVehicles[0].id,listings[0].slug);assert.equal(e.representativeVehicles[2].image,undefined);assert.ok(validations>0);});
 check(slug+': directory has no invented verification or organizations',()=>{const e=directory.mockOrganizationDirectoryEntries[0];assert.equal(e.inventory.activeListingCount,0);assert.equal(e.inventory.localCount,0);assert.equal(e.inventory.sourceStockCount,8);assert.ok(Object.values(e.verification).every(v=>v===false));assert.equal(e.tradeLanes.length,0);assert.equal(e.brandCoverage.length,0);assert.equal(directory.createMockOrganizationDirectoryScaleEntries(120).length,1);});
}
const headBytes=fs.readFileSync(sourceFile('HomePageHead.svelte'));
sourceHashes['HomePageHead.svelte']=crypto.createHash('sha1').update(`blob ${headBytes.length}\0`).update(headBytes).digest('hex');
const head=headBytes.toString('utf8');
check('HomePageHead: dealer metadata and no false PNG/dimension claim',()=>{assert.match(head,/import \{ dealer \}/);assert.match(head,/noindex, nofollow/);assert.doesNotMatch(head,/Day Night Auto|София|content="image\/png"|og:image:width|og:image:height/);});
console.log(JSON.stringify({scope:'Isolated transpiled-module fixtures and static head assertions only. Directory schema was stubbed; NOT full Zod validation, app typecheck, Svelte compilation, build or browser QA.',node:process.version,typescript:ts.version,sourceHashes,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results},null,2));
process.exitCode=results.some(r=>!r.passed)?1:0;
