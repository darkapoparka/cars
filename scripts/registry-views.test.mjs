import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {writeRegistryViews,registryViews} from './index-deployments.mjs';
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