import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {admitRetainedInputs} from './admit-retained-inputs.mjs';
const sourceRun=38313225253,base='9298ab0ed3a6774da9935de44dc224db789caee2';
const rows={
 'al-hamoor-al-thahabi':[11776130125,'6acf1f217fbb328854aceda81d2a410c748a257a8a26433b453decb7b2915dcb','bcd6ee2df67a8c296c1a765beb48d1a050063756e892447b91ff690529fec408',8],
 'asko-96':[11775219059,'2abd5f7218162ab48c0e513b0ca4c81c8a5364205e9427b5844dc56359b82431','0293a42cbf9b9f0cde6fe929f91397c83b53fe84d086eae0c9992f0605563306',16],
 'astracar':[11775846685,'1270141a00f0ce6a30b92257a0bcfc801468a453b277e12148b431757e84b21e','b6cd313889e033273138838f7962c6a21859d5d9ae946d79fc97555693ac5a54',15],
 'autolife':[11775344266,'f3406b9a0c9c89c1e822bf05da0bb9aff438ad5d06884bef9b822a8118caddc0','31545e8c4717e3161166c060c3c9210478aa8f46bede1d9215b1343e98af5a22',16],
 'champion-auto-pro':[11775259790,'52d947da2bb978013a4909ab3992eea093d9584ae36dc91beb5e61d66bebc1e3','44515ec5f045db765dac8ef81afe50f9f9aaf3470943f5837f0b0ec632f3a233',16],
 'elit-auto-import':[11776110965,'441574686196f1d41700c05bbfade592758cd0df3340da2d7ed5883fe7710af7','9f87f37a5d0a45ab617f7164a702f348da77584ca6e1f6d6ed49be57a77b88a1',15]
};
const common=['auto-best/localization/dealer.reviewed.json','auto-best/localization/generated-manifest.json','auto-best/src/lib/config/brand.ts','auto-best/src/lib/config/locale.ts','auto-best/src/lib/data/company.ts','auto-best/src/lib/data/dealer-profile.json','auto-best/src/lib/data/inventory.ts','auto-best/src/lib/locale/catalog.ts','modern/apps/web/app/[locale]/sell/page.tsx','modern/packages/marketplace-domain/testing/dealer-profile.json','modern/packages/marketplace-domain/testing/mock-data.ts','modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx','modern/packages/marketplace-ui/components/seller-identity-card.tsx','modern/packages/marketplace/content/inventory-copy.ts','modern/packages/marketplace/lead-site.ts','modern/packages/marketplace/mock-directory.ts','app/docs/ARCHITECTURE.md','app/lib/dealer-inventory.json','app/lib/dealer.json','app/scripts/qa-production.mjs'];
const hash=b=>createHash('sha256').update(b).digest('hex');
const encode=v=>JSON.stringify(v,null,2)+'\n';
const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:4*1024**2}).trim();
const read=p=>fs.readFileSync(p);
function exactJson(row,field,expected){
 const text=row[field].split(/(?<=\n)/).filter(l=>(l.startsWith('+')&&!l.startsWith('+++'))||l.startsWith(' ')).map(l=>l.slice(1)).join('');
 assert.equal(hash(Buffer.from(text)),row[expected],'Incomplete or different retained JSON '+row.path);return JSON.parse(text);
}
export async function reviewedRequest(slug){
 assert(Object.hasOwn(rows,slug),'This recovery owns six ordinary Batch B sources only; Eliq customization has a separate review');
 assert.equal(process.env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(process.env.GITHUB_REF,'refs/heads/codex/vercel-batch-b-20261013');assert.equal(process.env.GITHUB_EVENT_NAME,'push');
 const request=admitRetainedInputs(slug),[artifactId,zipHash,reviewHash,count]=rows[slug];
 const area=path.resolve('runtime/vercel-batch-b-reviewed-inputs',slug);fs.mkdirSync(area,{recursive:true});
 const metadata=JSON.parse(execFileSync('gh',['api','repos/darkapoparka/cars/actions/artifacts/'+artifactId],{encoding:'utf8'}));
 assert.equal(metadata.expired,false);assert.equal(metadata.workflow_run.id,sourceRun);assert.equal(metadata.workflow_run.head_sha,base);assert.equal(metadata.digest,'sha256:'+zipHash);
 const zip=path.join(area,'reviewed-summary.zip');const fd=fs.openSync(zip,'wx');let download;try{download=spawnSync('gh',['api','repos/darkapoparka/cars/actions/artifacts/'+artifactId+'/zip'],{stdio:['ignore',fd,'pipe'],timeout:120000});}finally{fs.closeSync(fd);}assert(!download.error&&download.status===0,'Exact retained review download failed');assert.equal(hash(read(zip)),zipHash);
 execFileSync('python3',['-c',"import sys,pathlib,zipfile\na=pathlib.Path(sys.argv[2]);z=zipfile.ZipFile(sys.argv[1]);rr=z.infolist();assert len(rr)<30 and sum(r.file_size for r in rr)<150*1024**2\nfor r in rr:\n p=pathlib.PurePosixPath(r.filename);assert not p.is_absolute() and '..' not in p.parts and '\\\\' not in r.filename and ((r.external_attr>>16)&0o170000)!=0o120000\nz.extractall(a)",zip,area]);
 const plan=path.join(area,'existing-fleet-source',sourceRun+'-1',slug,'plan');
 const bytes=read(path.join(plan,'review.json'));assert.equal(hash(bytes),reviewHash);
 const review=JSON.parse(bytes),run=JSON.parse(read(path.join(plan,'run.json')));
 assert.equal(run.dealerSlug,slug);const tree=git(['rev-parse',base+':clients/'+slug]);assert.equal(git(['rev-parse','HEAD:clients/'+slug]),tree,'Current dealer source lease changed');
 const expected=common.filter(p=>slug!=='autolife'||p!=='auto-best/src/lib/config/brand.ts').sort();assert.deepEqual(review.conflicts.map(c=>c.path).sort(),expected,'Unreviewed conflict set');
 const conflicts=new Map(review.conflicts.map(c=>[c.path,c]));const config=conflicts.get('app/lib/dealer.json'),profileRow=conflicts.get('auto-best/src/lib/data/dealer-profile.json');
 const previous=exactJson(profileRow,'dealerDiff','dealerSha256'),profile=exactJson(profileRow,'templateDiff','afterSha256');assert.equal(profile.slug,slug);assert.equal(previous.listings.length,count);assert.equal(profile.listings.length,count);
 for(let i=0;i<count;i++){for(const [k,v]of Object.entries(previous.listings[i]))assert.deepEqual(profile.listings[i][k],v,'Own inventory field changed: '+i+'/'+k);assert.equal(profile.listings[i].mileageOnRequest,false);}
 for(const[k,v]of Object.entries(previous))if(k!=='listings')assert.deepEqual(profile[k],v,'Own dealer profile field changed: '+k);
 const current=exactJson(config,'dealerDiff','dealerSha256');assert.equal(current.inventoryNotice,'Dated listing samples. Confirm price, availability and vehicle information with the dealer.');
 const genericPath='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/al-basma-motors/reviewed-resolutions.json';
 const genericBytes=execFileSync('git',['show','13152f136105e149129e81c227090955081b994d:'+genericPath]);assert.equal(hash(genericBytes),'cb2f880f8c38504eeddf215a317fc060f07b677f9d48a9eec039bfcfd44c8716');
 const seller='modern/packages/marketplace-ui/components/seller-identity-card.tsx',generic=JSON.parse(genericBytes),manual=generic.resolutions[seller],sellerRow=conflicts.get(seller);
 assert.equal(hash(Buffer.from(manual.text)),'43d7e8b4c2dc44755591e94651753783e108ab954db20c6362ffa6d07a0b1819');
 assert.equal(sellerRow.beforeSha256,'b73a3580b20c4535c8e2b07a632282bb29211f2479d37761e1ee14d1a6d5ef3a');assert.equal(sellerRow.afterSha256,'448a2fa7a15e8eeca52c43e4a57cf43ddd60ec255a7b2d62ff769a5225fafe68');assert.equal(sellerRow.dealerSha256,'648a8e8bc5de53a25fc83ce6c749954b909fd577076dd3a11e42a9b26847c0cb');
 const targetSources=Object.fromEntries(Object.entries(run.bases).map(([k,v])=>[k,v.target]));assert(Object.values(targetSources).every(s=>s.revision===request.sourceRevision));
 const resolutions=Object.fromEntries(expected.map(p=>[p,p===seller?manual:'template']));
 const document={schemaVersion:1,kind:'cars-batch-b-exact-ordinary-preservation-review',dealer:slug,baseline:{commit:base,tree},templateRevision:request.sourceRevision,targetSources,
 evidence:{sourceRun,controlCommit:base,artifactId,artifactSha256:zipHash,reviewSha256:reviewHash,conflicts:review.conflicts.map(c=>({path:c.path,beforeSha256:c.beforeSha256??null,afterSha256:c.afterSha256??null,dealerSha256:c.dealerSha256??null}))},
 appInventoryNoticePreservation:{schemaVersion:1,kind:'cars-current-app-inventory-notice-preservation',dealer:slug,baseline:{commit:base,tree},path:'app/lib/dealer.json',currentConfigSha256:config.dealerSha256,currentNoticeSha256:hash(Buffer.from(current.inventoryNotice)),profileSha256:profileRow.afterSha256,unmodifiedTargetConfigSha256:config.afterSha256,targetSources,reviewed:true,reviewedBy:'Batch B review of exact retained run38313225253: preserve current own concise dated notice and every factual inventory field'},
 resolutions,reviewNotes:{ownRows:count,sourceOnly:true,productionVerified:false,templateChoices:'Own-profile personalized b1 targets, not donor template facts. Native palette and accepted composition retained.',sellerIdentity:'Same reviewed native seller-card bytes, bound to own leadSite.logoOnLight; no donor contact fields.',historicalTests:'Existing template-wide QA is not relabeled as this dealer production acceptance.'}};
 const output='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/batch-b-20261013/'+slug+'/reviewed-resolutions.json';fs.mkdirSync(path.dirname(output),{recursive:true});assert(!fs.existsSync(output));fs.writeFileSync(output,encode(document),{flag:'wx'});request.inputs[slug].resolutions={path:output,sha256:hash(read(output))};
 fs.writeFileSync(path.join(area,'resolution-admission.json'),encode({dealer:slug,artifactId,artifactSha256:zipHash,reviewSha256:reviewHash,baselineTree:tree,resolutionPin:request.inputs[slug].resolutions,ownRows:count,templateRelease:'cars-vercel-b1f0f560-20261013',productionVerified:false}));
 return request;
}
