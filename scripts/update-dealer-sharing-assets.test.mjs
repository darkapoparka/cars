import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';
import {targetManifestForUpgrade} from './dealer-updates/update-dealer-template.mjs';
import {collectSource} from './package-dealer.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const variants=keys.map((key,i)=>({key,base:i===0?'':'/variant-'+(i+1),entry:i===0?'/':i===1?'/variant-2/cars':'/variant-'+(i+1)+'/'}));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1sAAAAASUVORK5CYII=','base64');
function fixture(t,ordinary=false){
 const parent=fs.realpathSync(os.tmpdir()),root=fs.mkdtempSync(path.join(parent,'cars-sharing-root-')),dealerRoot=path.join(root,'dealer'),carsRoot=path.join(root,'cars');
 t.after(()=>{const exact=fs.realpathSync(root),relative=path.relative(parent,exact);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&path.basename(exact).startsWith('cars-sharing-root-'));fs.rmSync(exact,{recursive:true,force:true});});
 const write=(name,b)=>{const f=path.join(dealerRoot,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);};
 const slug='prestige-sharing-fixture',repository='darkapoparka/cars-prestige-sharing-fixture',origin='https://cars-prestige-sharing-fixture.darkapoparka1.workers.dev';
 const manifest={schemaVersion:1,slug,repository,variants,packaging:{version:'5'},templateRevisions:Object.fromEntries(keys.map(k=>[k,'1'.repeat(40)])),templateSources:Object.fromEntries(keys.map(k=>[k,{repository:'darkapoparka/cars',revision:'1'.repeat(40),path:'templates/'+k,digest:'a'.repeat(64),tree:'b'.repeat(40)}])),extraAssets:ordinary?['dealer-brand']:['registered-branding','branding'],branding:{schemaVersion:1,required:true,policy:'template-default',contract:'.cars-branding.json',surfaceBindingsVersion:1},shareIdentity:{name:'Prestige fixture',publicOrigin:origin,logo:{sourcePath:'branding/logo-on-light.png',sha256:hash(png)}}};
 const pins=Object.fromEntries(keys.map(k=>[k,{to:'2'.repeat(40),targetSource:{repository:'darkapoparka/cars',revision:'2'.repeat(40),path:'templates/'+k,digest:'c'.repeat(64),tree:'d'.repeat(40)}}]));
 write('dealer.json',JSON.stringify(manifest));write('business-facts.json',JSON.stringify({business:{name:'Prestige fixture',countryCode:'BG',currency:'EUR',city:'Varna',phone:'+359888000000',website:origin}}));
 write('stock.json',JSON.stringify({listings:[{title:'Fixture vehicle',make:'Fixture',model:'One',year:2020,price:1234,currency:'EUR',image:'/fixture.webp',mileage:1000}]}));for(const key of keys)write(key+'/package.json','{"name":"fixture"}\n');
 write('registered-branding/preserved.txt','retained fixture input\n');
 if(ordinary){const assets=Object.fromEntries(['onLight','onDark','onAccent'].map((surface,i)=>{const publicPath='/dealer-brand/logo-'+i+'.webp',bytes=Buffer.from('fixture-reviewed-webp-'+i);write(publicPath.slice(1),bytes);return[surface,{publicPath,sha256:hash(bytes)}];}));write('branding/logo-contract.json',JSON.stringify({assets}));}
 else{const inputs=[['master','branding/reviewed-master.png'],['mark','branding/reviewed-mark.png'],['onLight','branding/reviewed-surfaces/on-light.png'],['onDark','branding/reviewed-surfaces/on-dark.png'],['onAccent','branding/reviewed-surfaces/on-accent.png']].map(([role,p])=>{write(p,png);return{role,path:p,sha256:hash(png)};});const surfaces=Object.fromEntries(inputs.filter(r=>r.role.startsWith('on')).map(r=>[r.role,{assetPath:r.path,sha256:r.sha256,alphaSha256:'a'.repeat(64),sourceReference:'fixture reviewed raster',retainedSource:{kind:'retained-reviewed-raster',reference:'fixture retained source',sha256:r.sha256,reviewReference:'fixture explicit review',reviewSha256:'b'.repeat(64)}}]));write('.cars-branding.json',JSON.stringify({schemaVersion:1,dealer:slug,policy:'template-default',monochromePairFromOneMaster:false,creationMethod:'reviewed-raster-surface-variants',reviewedSurfaceVariants:{schemaVersion:1,reviewed:true,reviewedAt:'2026-10-15T00:00:00.000Z',sourceMode:'retained-or-mixed-raster',surfaces},packInputs:inputs,packId:hash(JSON.stringify(inputs)).slice(0,16),publicBase:'/dealer-brand/v2-'+hash(JSON.stringify(inputs)).slice(0,16)}));write('branding/logo-on-light.png',png);}
 fs.mkdirSync(path.join(carsRoot,'docs'),{recursive:true});fs.writeFileSync(path.join(carsRoot,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify({dealers:[{slug,repository,delivery:{provider:'cloudflare',url:origin}}]}));
 return{root,dealerRoot,carsRoot,manifest,pins};
}
test('reviewed branding-only sharing never declares a nonexistent dealer-brand directory',async t=>{
 const x=fixture(t),next=targetManifestForUpgrade(x);globalThis.__carsSharingRootSample?.({name:'reviewed-branding-root',manifest:next});
 const files=await collectSource(x.dealerRoot,next);assert.equal(next.shareIdentity.logo.sourcePath,'branding/logo-on-light.png');assert(!next.extraAssets.includes('dealer-brand'));assert.deepEqual(next.extraAssets,['registered-branding','branding']);assert(files.has('branding/logo-on-light.png'));assert(files.has('registered-branding/preserved.txt'));
});
test('ordinary reviewed dealer-brand roots retain the same package declaration and source bytes',async t=>{
 const x=fixture(t,true),next=targetManifestForUpgrade(x);globalThis.__carsSharingRootSample?.({name:'ordinary-dealer-brand-root',manifest:next});
 assert.deepEqual(next.extraAssets,['dealer-brand','branding']);const files=await collectSource(x.dealerRoot,next);assert(files.has(next.shareIdentity.logo.sourcePath));for(let i=0;i<3;i++)assert(files.get('dealer-brand/logo-'+i+'.webp').equals(Buffer.from('fixture-reviewed-webp-'+i)));
});
test('an independently declared missing extra asset still refuses packaging',async t=>{
 const x=fixture(t,true),next=targetManifestForUpgrade(x);next.extraAssets.push('explicit-missing-asset');await assert.rejects(collectSource(x.dealerRoot,next),/Declared extra asset is missing: explicit-missing-asset/);
});
