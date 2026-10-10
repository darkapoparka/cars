/** Specialize an already verified App dealer package; never mutate template masters. */
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex');
const encode=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
export const REFERENCE_SERVER_SHA='bb443e51760d7acedabed8039d0f6c220081cde0931bcf8bdf22f5d8657719a0';
const serverPath='app/lib/reference-data.server.ts',snapshotsPath='app/lib/captured-vehicle-details.json';
const specialized=`import 'server-only';
import type {ReferenceVehicleDetail} from './reference-types';
// Dealer build specialization: the verified original returns undefined / [] in dealer mode.
// Reference captures remain in the canonical template, not this dealership's published data.
export function getReferenceVehicleDetail(_slug: string): ReferenceVehicleDetail | undefined {
  return undefined;
}
export function referenceInspectionSlugs(): string[] {
  return [];
}
`;
export function specializeDealerReferencePackage(files,manifest){
 const read=name=>{const bytes=files.get(name);if(!bytes)throw Error('Missing reference-boundary input: '+name);return bytes;};
 const originalDealerConfig=read('app/lib/dealer.json'),config=JSON.parse(originalDealerConfig);
 const defaults={welcomeEnabled:true,socialLinks:[],referenceClaimsApproved:false};
 const completeConfig={...defaults,...config};
 if(typeof completeConfig.welcomeEnabled!=='boolean'||typeof completeConfig.referenceClaimsApproved!=='boolean'||!Array.isArray(completeConfig.socialLinks))throw Error('Invalid App presentation contract');
 if(config.mode!=='dealer'||config.id!==manifest.slug)throw Error('Reference specialization is allowed only for the named dealer');
 const configModule=read('app/lib/dealer-config.ts').toString('utf8');
 if(!configModule.includes("export const isDealer = dealer.mode === 'dealer';"))throw Error('Dealer mode boundary changed');
 const original=read(serverPath);if(hash(original.toString('utf8').replace(/\r\n/g,'\n'))!==REFERENCE_SERVER_SHA)throw Error('Reference server boundary changed; review the new source before specializing');
 const snapshots=read(snapshotsPath);
 const references=[];
 for(const [name,bytes]of files){
  if(!/^app\/(?:app|components|lib)\//.test(name)||name===snapshotsPath||name===serverPath||! /\.(?:[cm]?[jt]sx?|json)$/.test(name))continue;
  if(bytes.toString('utf8').includes('captured-vehicle-details'))references.push(name);
 }
 if(references.length)throw Error('Another consumer requires captured details: '+references.join(', '));
 const originalPolicy=read('app/public-assets.policy.json'),policy=JSON.parse(originalPolicy);
 if(policy.schemaVersion!==1||policy.family!=='app'||!Array.isArray(policy.candidates))throw Error('Unexpected reference asset policy');
 const pending=new Map(files);pending.set('app/lib/dealer.json',encode(completeConfig));pending.set(serverPath,Buffer.from(specialized));pending.delete(snapshotsPath);
 const candidates=new Set(policy.candidates.map(c=>c.path));let added=0;
 for(const [name,bytes]of files){
  if(!/^app\/public\/reference-assets\/.*\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm)$/i.test(name))continue;
  const relative=name.slice('app/public/'.length);if(candidates.has(relative))continue;
  policy.candidates.push({path:relative,sha256:hash(bytes),reason:'Captured reference-only media; omit only when the specialized dealer source has no literal, computed, server or format-variant consumer.'});candidates.add(relative);added++;
 }
 policy.candidates.sort((a,b)=>a.path.localeCompare(b.path,'en'));
 pending.set('app/public-assets.policy.json',encode(policy));
 const receipt={schemaVersion:1,dealer:manifest.slug,kind:'dealer-mode-reference-boundary-specialization',
  originalDealerConfigSha256:hash(originalDealerConfig),completedDealerConfigSha256:hash(encode(completeConfig)),presentationDefaultsAdded:Object.keys(defaults).filter(k=>!Object.hasOwn(config,k)),originalServerSha256:hash(original),specializedServerSha256:hash(Buffer.from(specialized)),
  removedData:{path:snapshotsPath,sha256:hash(snapshots),bytes:snapshots.length,reason:'Only importer was the reviewed server module; both exports return no captured detail in dealer mode.'},
  originalPolicySha256:hash(originalPolicy),newPolicySha256:hash(pending.get('app/public-assets.policy.json')),additionalHashBoundCandidates:added,
  publicAssetsDeletedByThisStep:0,originalSourceReceiptPreserved:true,templatesUnchanged:true,
  budgetOverride:false,rule:'The existing conservative retention planner still retains every referenced, dynamic, customized or server-read asset.'};
 pending.set('.cars-dealer-reference-specialization.json',encode(receipt));
 for(const name of files.keys())if(!pending.has(name))files.delete(name);for(const [name,bytes]of pending)files.set(name,bytes);
 return receipt;
}