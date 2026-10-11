import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {writeRegistryViews,registryViews,indexDeployments,validateRegistry} from './index-deployments.mjs';
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-views-test-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.mkdirSync(path.join(root,'docs'),{recursive:true});
 fs.mkdirSync(path.join(root,'clients/example'),{recursive:true});
 const registry={schemaVersion:2,aliases:{},dealers:[{slug:'example',name:'Reviewed dealer',localPath:'clients/example',localPresent:true,variants:[{key:'auto-best',entry:'/'}],delivery:{state:'navigation-verified',url:'https://example.invalid/'},evidence:{}}]};
 const source=JSON.stringify(registry,null,2)+'\n';
 fs.writeFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),source);
 fs.writeFileSync(path.join(root,'clients/example/dealer.json'),'invalid stale checkout');
 return {root,registry,source};
}
test('views-only uses reviewed registry and never scans or rewrites dealer source',t=>{
 const f=fixture(t);const result=writeRegistryViews(f.root);
 assert.deepEqual(result,f.registry);
 assert.equal(fs.readFileSync(path.join(f.root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8'),f.source);
 assert.equal(fs.readFileSync(path.join(f.root,'clients/example/dealer.json'),'utf8'),'invalid stale checkout');
 assert.equal(fs.readFileSync(path.join(f.root,'docs/DEPLOYMENTS.md'),'utf8'),registryViews(f.registry).deployments);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root,'clients/index.json'),'utf8')),registryViews(f.registry).index);
});
test('views-only rejects invalid registry before writing output',t=>{
 const f=fixture(t);f.registry.aliases.bad='missing';
 fs.writeFileSync(path.join(f.root,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify(f.registry));
 assert.throws(()=>writeRegistryViews(f.root),/Unresolved registry alias/);assert.equal(fs.existsSync(path.join(f.root,'docs/DEPLOYMENTS.md')),false);
});

test('source indexing finds declared Design 4 without offering a candidate App folder',t=>{
 const f=fixture(t),source=path.join(f.root,'clients/example'),m={schemaVersion:1,slug:'example',repository:'fixture/cars-example',defaultBranch:'main',packaging:{version:'3'},variants:[{key:'auto-best',entry:'/',base:''},{key:'modern',entry:'/variant-2/cars',base:'/variant-2'},{key:'carwow',entry:'/variant-3/',base:'/variant-3'},{key:'app',entry:'/variant-4/',base:'/variant-4'}]};
 for(const {key}of m.variants){fs.mkdirSync(path.join(source,key));fs.writeFileSync(path.join(source,key,'package.json'),'{}');}
 fs.writeFileSync(path.join(source,'dealer.json'),JSON.stringify(m));let d=indexDeployments(f.root).dealers.find(d=>d.slug==='example');assert.equal(d.variants.find(v=>v.key==='app').localPresent,true);
 m.packaging.version='1';m.variants.pop();fs.writeFileSync(path.join(source,'dealer.json'),JSON.stringify(m));d=indexDeployments(f.root).dealers.find(d=>d.slug==='example');assert.equal(d.variants.some(v=>v.key==='app'),false);
});

function sixDesignManifest(second='modern'){
 const keys=['auto-best',second,second==='modern'?'import':'modern','app','mobile','karento-best'];
 return {schemaVersion:1,slug:'example',dealerId:'manifest-new-id',repository:'fixture/cars-example',defaultBranch:'main',packaging:{version:'5'},variants:keys.map((key,index)=>{const base=index?`/variant-${index+1}`:'';return{key,base,entry:base+(key==='modern'?'/cars':'/')};})};
}
function writeApplications(root,manifest,keys=manifest.variants.map(v=>v.key)){
 const directory=path.join(root,'clients/example');
 fs.writeFileSync(path.join(directory,'dealer.json'),JSON.stringify(manifest));
 for(const key of keys){fs.mkdirSync(path.join(directory,key),{recursive:true});fs.writeFileSync(path.join(directory,key,'package.json'),'{}');}
 return directory;
}

for(const second of ['modern','import'])test(`six-design indexing preserves ${second} at variant-2 and retained publication evidence`,t=>{
 const f=fixture(t),manifest=sixDesignManifest(second),prior=f.registry.dealers[0];
 Object.assign(prior,{id:'BG-STABLE-001',sourceOwnership:'cars-repository',canonicalSourceRepository:'darkapoparka/cars',canonicalSourceRef:'main',canonicalSourceCommit:'1'.repeat(40),aliases:['example-alias'],branchSources:[{branch:'legacy',commit:'2'.repeat(40)}]});
 prior.delivery={state:'navigation-verified',projectId:'prj_Preserved',projectName:'cars-example',url:'https://cars-example.vercel.app/',aliases:['cars-example.vercel.app'],deploymentId:'dpl_Preserved',gitRepository:'fixture/cars-example'};
 prior.evidence={source:{state:'published',commit:'1'.repeat(40)},personalization:{state:'reviewed'},build:{state:'unknown'},deployment:{state:'verified'},browser:{state:'pending'},ownerReview:{state:'pending'}};
 prior.variants=[{key:'auto-best',entry:'/',projectId:'prj_AppPreserved',deploymentId:'dpl_AppPreserved',publicUrl:'https://cars-example.vercel.app/',templateSource:{commit:'3'.repeat(40)},qaRecorded:false},{key:'carwow',entry:'/variant-3/',state:'preserved-history',publicUrl:'https://legacy-example.vercel.app/'}];
 f.registry.aliases={'example-alias':'example'};
 const saved=JSON.stringify(f.registry),registryFile=path.join(f.root,'docs/DEPLOYMENT-INVENTORY.json');fs.writeFileSync(registryFile,saved);
 const directory=writeApplications(f.root,manifest),manifestBytes=fs.readFileSync(path.join(directory,'dealer.json'));
 const indexed=indexDeployments(f.root),dealer=indexed.dealers.find(d=>d.slug==='example');
 assert.equal(validateRegistry(indexed,f.root),true);
 for(const variant of manifest.variants){const actual=dealer.variants.find(v=>v.key===variant.key);assert.ok(actual,variant.key);assert.equal(actual.localPresent,true);assert.equal(actual.entry,variant.entry);}
 assert.equal(dealer.variants.filter(v=>v.localPresent).length,6);
 assert.equal(dealer.variants.find(v=>v.key===second).entry,manifest.variants[1].entry);
 assert.equal(dealer.variants.find(v=>v.key==='carwow').localPresent,false);
 assert.equal(dealer.variants.find(v=>v.key==='carwow').state,'preserved-history');
 assert.equal(dealer.id,'BG-STABLE-001');assert.equal(dealer.packagingVersion,'5');assert.equal(dealer.repository,manifest.repository);
 for(const key of ['delivery','aliases','branchSources','evidence','sourceOwnership','canonicalSourceRepository','canonicalSourceRef','canonicalSourceCommit'])assert.deepEqual(dealer[key],prior[key],key);
 const base=dealer.variants.find(v=>v.key==='auto-best');for(const key of ['projectId','deploymentId','publicUrl','templateSource','qaRecorded'])assert.deepEqual(base[key],prior.variants[0][key],key);
 for(const key of ['app','mobile','karento-best']){const v=dealer.variants.find(v=>v.key===key);assert.equal(v.state,'unknown');assert.equal(v.publicUrl,null);assert.equal(v.qaRecorded,null);}
 assert.deepEqual(indexed.aliases,f.registry.aliases);
 assert.equal(fs.readFileSync(registryFile,'utf8'),saved);assert.deepEqual(fs.readFileSync(path.join(directory,'dealer.json')),manifestBytes);
 assert.equal(fs.existsSync(path.join(f.root,'docs/DEPLOYMENTS.md')),false);assert.equal(fs.existsSync(path.join(f.root,'clients/index.json')),false);
});

test('six-design indexing retains a missing application as absent without claiming hosted acceptance',t=>{
 const f=fixture(t),manifest=sixDesignManifest();
 f.registry.dealers[0].variants=manifest.variants.map(v=>({...v,state:'unknown',publicUrl:null,qaRecorded:null}));
 fs.writeFileSync(path.join(f.root,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify(f.registry));
 writeApplications(f.root,manifest,manifest.variants.map(v=>v.key).filter(key=>key!=='mobile'));
 const indexed=indexDeployments(f.root),dealer=indexed.dealers[0];assert.equal(validateRegistry(indexed,f.root),true);
 assert.equal(dealer.variants.find(v=>v.key==='mobile').localPresent,false);
 assert.equal(dealer.variants.find(v=>v.key==='karento-best').localPresent,true);
 assert.deepEqual(dealer.delivery,f.registry.dealers[0].delivery);
 for(const key of ['build','deployment','browser','ownerReview'])assert.equal(dealer.evidence[key].state,'unknown');
});

test('legacy and unmanifested indexing keeps historical families without offering staged six-design candidates',t=>{
 const f=fixture(t),manifest={schemaVersion:1,slug:'example',repository:'fixture/cars-example',defaultBranch:'main',packaging:{version:'1'},variants:[{key:'auto-best',entry:'/',base:''},{key:'import',entry:'/variant-2/',base:'/variant-2'},{key:'carwow',entry:'/variant-3/',base:'/variant-3'}]};
 const directory=writeApplications(f.root,manifest,[...manifest.variants.map(v=>v.key),'app','mobile','karento-best','rencar']);
 let dealer=indexDeployments(f.root).dealers[0];
 assert.deepEqual(dealer.variants.map(v=>v.key),['auto-best','import','carwow','rencar']);
 assert.equal(dealer.variants.find(v=>v.key==='import').entry,'/variant-2/');
 fs.unlinkSync(path.join(directory,'dealer.json'));dealer=indexDeployments(f.root).dealers[0];
 assert.deepEqual(dealer.variants.map(v=>v.key),['auto-best','import','carwow','rencar']);
 assert.equal(dealer.variants.every(v=>v.localPresent),true);
 assert.equal(dealer.delivery.state,'navigation-verified');assert.equal(dealer.evidence.build.state,'unknown');
});
