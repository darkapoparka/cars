/** Immutable source intake, not dealer generation or package unmounting.
 * Preserve the accepted raw checkpoint and explicitly reviewed source deltas.
 * Publication consumes Git object IDs directly; only missing blobs need bytes.
 */
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {retainedAtCommit} from '../package-dealer.mjs';
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const oid=v=>/^[a-f0-9]{40}$/.test(v||'');const hex=v=>/^[a-f0-9]{64}$/.test(v||'');
const safe=p=>typeof p==='string'&&p.length<512&&!/[\\:\u0000-\u001f\u007f]/.test(p)&&!p.startsWith('/')&&p.split('/').every(x=>x&&x!=='.'&&x!=='..');
const hash=b=>createHash('sha256').update(b).digest('hex');
const object=(type,b)=>createHash('sha1').update(type+' '+b.length+'\0').update(b).digest('hex');
export function retainedSourceBlob(bytes){return object('blob',bytes);}
/** The Git tree wire format, using literal path components and retained modes. */
export function retainedSourceTree(entries){
 const root=new Map(),trees=new Map();
 for(const e of entries){assert(safe(e.path)&&oid(e.blob)&&['100644','100755'].includes(e.mode),'Unsafe retained source entry');const parts=e.path.split('/');let dir=root;for(const name of parts.slice(0,-1)){if(!dir.has(name))dir.set(name,new Map());assert(dir.get(name) instanceof Map,'File/directory path collision');dir=dir.get(name);}assert(!dir.has(parts.at(-1)),'Duplicate retained source path');dir.set(parts.at(-1),e);}
 const seal=(dir,prefix='')=>{const rows=[...dir].map(([name,value])=>({name,tree:value instanceof Map,value})).sort((a,b)=>Buffer.compare(Buffer.from(a.name+(a.tree?'/':'')),Buffer.from(b.name+(b.tree?'/':''))));const payload=Buffer.concat(rows.flatMap(row=>{const name=prefix?prefix+'/'+row.name:row.name,id=row.tree?seal(row.value,name):row.value.blob;return [Buffer.from((row.tree?'40000':row.value.mode)+' '+row.name+'\0'),Buffer.from(id,'hex')];}));const sha=object('tree',payload);trees.set(sha,payload);return sha;};
 return {tree:seal(root),trees};
}
function checkedEntries(input){assert(Array.isArray(input)&&input.length>0&&input.length<=50000,'Bounded complete source inventory required');const entries=input.map(e=>({path:e.path,mode:e.mode,blob:e.blob,...(Number.isSafeInteger(e.bytes)&&e.bytes>=0?{bytes:e.bytes}:{})})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);retainedSourceTree(entries);return entries;}
function sameEntries(a,b){return JSON.stringify(a.map(({path,mode,blob})=>({path,mode,blob})))===JSON.stringify(b.map(({path,mode,blob})=>({path,mode,blob})));}

export function validateRetainedSourceIdentity({dealer,record,previousDelivery,freshPrivate,manifest}){
 assert(record?.slug===dealer&&previousDelivery?.slug===dealer&&freshPrivate?.slug===dealer,'Dealer lease identity differs');
 assert(record.sourceOwnership!=='independent-repository'&&(!record.canonicalSourceRepository||record.canonicalSourceRepository==='darkapoparka/cars'),'Independent dealer remains in its own source and publication repository');
 assert(record.repository===previousDelivery.repository&&freshPrivate.repository===record.repository&&freshPrivate.privateMain===previousDelivery.commit&&freshPrivate.unchangedSinceYesterday===true,'Exact accepted private head required; newer publishing fixes must be reviewed first');
 assert(record.delivery?.projectId===previousDelivery.projectId&&freshPrivate.projectId===previousDelivery.projectId&&freshPrivate.origin===previousDelivery.origin,'Existing Vercel project/origin changed');
 assert(manifest.slug===dealer&&manifest.repository===record.repository&&manifest.packaging?.version==='5'&&manifest.variants?.length===6,'Actual retained six-design source manifest required');
 assert.deepEqual(manifest.variants.map(v=>v.key).sort(),[...keys].sort());assert.equal(new URL(manifest.shareIdentity.publicOrigin).origin,previousDelivery.origin);
 for(const key of keys){const source=manifest.templateSources?.[key];assert(source?.repository==='darkapoparka/cars'&&source.path==='templates/'+key&&oid(source.revision)&&oid(source.tree)&&hex(source.digest)&&manifest.templateRevisions[key]===source.revision,'Exact historical template locator required: '+key);}
}

/** Produce a lease-bound replacement of one current Cars client subtree. No
 * package-generated mounts are copied, no source/native acceptance is invented.
 * The publisher rechecks canonical HEAD/tree and private HEAD before mutation.
 */
export function planRetainedVercelSourceIntake({dealer,record,previousDelivery,freshPrivate,canonicalBaseline,rawSource,manifestBytes,manifestEnvelope,correctionReview,knownRemoteBlobs=new Set()}){
 const baseline=checkedEntries(canonicalBaseline.entries),raw=checkedEntries(rawSource.entries),manifest=JSON.parse(manifestBytes.toString('utf8').replace(/^\uFEFF/,''));
 validateRetainedSourceIdentity({dealer,record,previousDelivery,freshPrivate,manifest});
 assert(oid(canonicalBaseline.commit)&&oid(canonicalBaseline.tree)&&canonicalBaseline.path==='clients/'+dealer&&retainedSourceTree(baseline).tree===canonicalBaseline.tree,'Current immutable canonical client tree lease required');
 assert(oid(rawSource.commit)&&oid(rawSource.tree)&&rawSource.originalCommit===previousDelivery.sourceCommit&&retainedSourceTree(raw).tree===rawSource.tree,'Exact retained raw-source checkpoint required');
 assert(rawSource.prefix===''||rawSource.prefix==='clients/'+dealer,'Unexpected raw source root/prefix');
 let candidate=raw.filter(e=>retainedAtCommit(e.path,manifest)),sourceCorrection=null;
 if(rawSource.commit!==rawSource.originalCommit){
  assert(correctionReview?.reviewed===true&&hex(correctionReview.sha256)&&correctionReview.parent===rawSource.originalCommit&&correctionReview.sourceCommit===rawSource.commit&&correctionReview.sourceTree===rawSource.tree,'Explicit later raw-source correction review required');
  const original=checkedEntries(rawSource.originalEntries);assert(retainedSourceTree(original).tree===rawSource.originalTree,'Original raw correction base changed');
  const before=new Map(original.map(e=>[e.path,e])),after=new Map(raw.map(e=>[e.path,e]));const changes=[...new Set([...before.keys(),...after.keys()])].filter(p=>before.get(p)?.blob!==after.get(p)?.blob||before.get(p)?.mode!==after.get(p)?.mode).sort();
  assert(Array.isArray(correctionReview.changes)&&correctionReview.changes.length===changes.length&&new Set(correctionReview.changes.map(x=>x.path)).size===changes.length,'Every later raw source change must be reviewed');
  for(const p of changes){const r=correctionReview.changes.find(r=>r.path===p);assert(r&&r.beforeBlob===(before.get(p)?.blob??null)&&r.afterBlob===(after.get(p)?.blob??null)&&r.reason?.trim(),'Unreviewed raw source correction: '+p);}
  sourceCorrection={parent:rawSource.originalCommit,commit:rawSource.commit,tree:rawSource.tree,reviewSha256:correctionReview.sha256,changes:correctionReview.changes};
 }
 const manifestBlob=retainedSourceBlob(manifestBytes),existing=raw.find(e=>e.path==='dealer.json');
 if(existing)assert(existing.blob===manifestBlob,'Raw manifest bytes differ');
 else {
  assert(dealer==='kg-team-auto'&&manifestEnvelope?.kind==='exact-published-dealer-manifest-envelope'&&manifestEnvelope.reviewed===true&&manifestEnvelope.privateCommit===freshPrivate.privateMain&&manifestEnvelope.path==='dealer.json'&&manifestEnvelope.blob===manifestBlob&&manifestEnvelope.sha256===hash(manifestBytes),'Only KG’s explicitly recorded missing-manifest envelope may be added');
  candidate.push({path:'dealer.json',mode:'100644',blob:manifestBlob,bytes:manifestBytes.length});candidate.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 }
 for(const key of keys)assert(candidate.some(e=>e.path===key+'/package.json'),'Retained raw application absent: '+key);
 assert(!candidate.some(e=>e.path==='.cars-package.json'||e.path==='.cars-publish.json'||e.path==='.cars-vercel-assets.json'),'A published deployment package must not be admitted as raw source');
 assert(rawSource.commitTreeVerified===true,'Retained raw commit/root binding must be verified by the exact Git reader');
 const before=new Map(baseline.map(e=>[e.path,e])),after=new Map(candidate.map(e=>[e.path,e]));const changes=[...new Set([...before.keys(),...after.keys()])].filter(p=>before.get(p)?.blob!==after.get(p)?.blob||before.get(p)?.mode!==after.get(p)?.mode).sort().map(p=>({path:p,baseBlob:before.get(p)?.blob??null,baseMode:before.get(p)?.mode??null,candidateBlob:after.get(p)?.blob??null,candidateMode:after.get(p)?.mode??null,resolution:'exact-retained-six-source',reason:'Intake the accepted raw six-design checkpoint; preserve its reviewed corrections and prior canonical source through parented Git history.'}));
 const unique=new Map(candidate.map(e=>[e.blob,e]));const uploads=[...unique].filter(([id])=>!knownRemoteBlobs.has(id)).map(([id,e])=>({blob:id,bytes:e.bytes??null,sourcePath:e.path,manifestEnvelope:e.path==='dealer.json'&&!existing}));const sealed=retainedSourceTree(candidate);
 return {schemaVersion:1,kind:'cars-vercel-retained-source-intake-proposal',dealer,repository:record.repository,canonicalSourceRepository:'darkapoparka/cars',canonicalBaseline:{commit:canonicalBaseline.commit,path:canonicalBaseline.path,tree:canonicalBaseline.tree},privateBaseline:{commit:freshPrivate.privateMain,packageTree:previousDelivery.packageTree,packageDigest:previousDelivery.digest,sourceCommit:previousDelivery.sourceCommit,projectId:previousDelivery.projectId,publicOrigin:previousDelivery.origin},rawSource:{commit:rawSource.commit,tree:rawSource.tree,prefix:rawSource.prefix,originalCommit:rawSource.originalCommit},sourceProjection:{policy:'package-dealer-retainedAtCommit',pathsOmitted:raw.filter(e=>!retainedAtCommit(e.path,manifest)).map(e=>e.path),retainedBytesChanged:false,generatedMountsRewritten:false},preparedTree:sealed.tree,candidateEntries:candidate,sourceCorrection,manifestEnvelope:manifestEnvelope??null,changes,objectTransport:{kind:'exact-git-object-reuse-and-missing-blobs',knownRemoteBlobCount:unique.size-uploads.length,missingBlobs:uploads,missingBlobBytes:uploads.every(x=>x.bytes!==null)?uploads.reduce((n,x)=>n+x.bytes,0):null,treeObjects:[...sealed.trees].map(([sha,b])=>({sha,bytes:b.length,content:b.toString('base64')})),noSourceDirectoryExport:true},nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,reviewed:false,published:false,publicationRequirements:['Re-read actual Cars main/client subtree and exact private main before upload/ref mutation; reject either changed lease.','Verify rawSource.commit plus its exact prefix resolves to rawSource.tree in the named retained object context before publication.','Verify bytes/hash of each missing source blob from its named existing retained object store; no fetch or generated-source substitute.','Create/upload the exact candidate subtree, then a parented scoped Cars commit; no forced ref movement.','Keep independent Al Reef out of Cars-canonical intake.','Run the maintained template updater against this true retained six-design source, then qualify new source; intake itself grants no native or hosted acceptance.']};
}
