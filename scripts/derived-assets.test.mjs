import assert from 'node:assert/strict';import test from 'node:test';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {writeDerivedFile} from './lib/derived-assets.mjs';
import {regenerateDealerCatalogs} from './dealer-updates/update-dealer-template.mjs';
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-derived-artifacts-'));t.after(()=>{const resolved=fs.realpathSync(root);assert(resolved.startsWith(fs.realpathSync(os.tmpdir())+path.sep)&&path.basename(resolved).startsWith('cars-derived-artifacts-'));fs.rmSync(resolved,{recursive:true,force:true});});return root;}
test('derived binary assets share their own pool while source and text files stay independent',t=>{
 const root=fixture(t),bytes=Buffer.from([137,80,78,71,0,4,5]),pool=path.join(root,'pool');
 const source=path.join(root,'source.png');fs.writeFileSync(source,bytes);
 for(const name of ['one.png','two.png'])writeDerivedFile(path.join(root,name),bytes,{assetPool:pool});
 assert(fs.statSync(path.join(root,'one.png')).nlink>=2);assert.equal(fs.statSync(source).nlink,1);
 assert(fs.readFileSync(path.join(root,'two.png')).equals(bytes));
 for(const name of ['one.json','two.json'])writeDerivedFile(path.join(root,name),Buffer.from('{"value":1}'),{assetPool:pool});
 fs.writeFileSync(path.join(root,'one.json'),'{"value":2}');assert.equal(fs.readFileSync(path.join(root,'two.json'),'utf8'),'{"value":1}');
});
test('a changed pooled object is rejected before creating another artifact',t=>{
 const root=fixture(t),pool=path.join(root,'pool'),bytes=Buffer.from([1,0,3]);writeDerivedFile(path.join(root,'one.webp'),bytes,{assetPool:pool});
 const object=path.join(pool,fs.readdirSync(pool)[0]);fs.chmodSync(object,0o644);fs.writeFileSync(object,'changed');
 assert.throws(()=>writeDerivedFile(path.join(root,'two.webp'),bytes,{assetPool:pool}),/content changed/);assert(!fs.existsSync(path.join(root,'two.webp')));
});
test('the existing locale generator reflects updated dealer catalog inputs on repeated runs',async t=>{
 const root=fixture(t),candidate=path.join(root,'candidate'),dealer=path.join(candidate,'auto-best');
 for(const dir of ['scripts','localization','src/lib/locale'])fs.mkdirSync(path.join(dealer,dir),{recursive:true});
 const master=path.resolve('templates/auto-best');for(const name of ['build-locales.mjs','locale-catalog.mjs'])fs.copyFileSync(path.join(master,'scripts',name),path.join(dealer,'scripts',name));
 fs.writeFileSync(path.join(dealer,'localization/common.json'),'{}');for(const name of ['catalog','template'])fs.writeFileSync(path.join(dealer,'localization',name+'.reviewed.json'),'[]');
 fs.writeFileSync(path.join(dealer,'src/lib/locale/policy.ts'),'// fixture policy\n');
 const input=path.join(dealer,'localization/dealer.reviewed.json');const row={key:'dealer.city',source:'Град',en:'Dealer City',bg:'Град'};
 fs.writeFileSync(input,JSON.stringify([row]));await regenerateDealerCatalogs(candidate);
 const file=path.join(dealer,'src/lib/locale/catalog.ts'),first=fs.readFileSync(file,'utf8');assert(first.includes('Dealer City'));
 row.en='Updated Dealer City';fs.writeFileSync(input,JSON.stringify([row]));await regenerateDealerCatalogs(candidate);const second=fs.readFileSync(file,'utf8');assert(second.includes('Updated Dealer City'));assert.notEqual(first,second);
 await regenerateDealerCatalogs(candidate);assert.equal(fs.readFileSync(file,'utf8'),second);
 const manifest=JSON.parse(fs.readFileSync(path.join(dealer,'localization/generated-manifest.json')));assert.equal(manifest.messages,1);
});
