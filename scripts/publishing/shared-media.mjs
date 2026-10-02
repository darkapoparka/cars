import {createHash} from 'node:crypto';
import {familyRetention} from './vercel-asset-plan.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const roots={'auto-best':'auto-best/static/',modern:'modern/apps/web/public/',import:'import/static/',carwow:'carwow/static/',app:'app/public/'};
const services={'auto-best':'autobest',modern:'modern',import:'importer',carwow:'carwow',app:'app'};
const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',avif:'image/avif',gif:'image/gif',svg:'image/svg+xml',woff:'font/woff',woff2:'font/woff2',mp4:'video/mp4',webm:'video/webm'};
const escaped=value=>value.replace(/[.*+?^${}()|[\]\\:]/g,'\\$&');

/** Add immutable media rewrites without changing any application source bytes. */
export function applySharedMedia(files,catalog){
 if(files.has('.cars-shared-media.json'))throw Error('Package already has shared media; regenerate from its original source');
 const manifest=JSON.parse(files.get('dealer.json').toString());
 const config=JSON.parse(files.get('vercel.json').toString());
 if(!Array.isArray(config.rewrites)||!config.services)throw Error('Shared media requires Services routing');
 const entries=[],rewrites=[];
 for(const variant of manifest.variants){
  const prefix=roots[variant.key];if(!prefix)throw Error('Unsupported media service');
  // Omit reviewed unused output before allocating external routing rules.
  const omitted = new Set(familyRetention(files, variant.key).omitted.map(entry => entry.path));
  for(const [file,bytes]of files){
   if(!file.startsWith(prefix) || omitted.has(file.slice(prefix.length)))continue;
   const digest=hash(bytes),asset=catalog[digest];if(!asset)continue;
   const relative=file.slice(prefix.length);
   if(!relative||relative.split('/').some(p=>!p||p==='.'||p==='..')||/[^a-zA-Z0-9/_.@-]/.test(relative))throw Error('Unsupported media URL path '+relative);
   const url=new URL(asset.url);
   if(url.protocol!=='https:'||!url.hostname.endsWith('.public.blob.vercel-storage.com')||url.username||url.password||url.search||url.hash||!url.pathname.startsWith('/cars/v1/'+digest+'.')||asset.sha256!==digest||asset.bytes!==bytes.length)throw Error('Invalid immutable media catalog entry');
   if(mime[relative.split('.').at(-1).toLowerCase()]!==asset.contentType)throw Error('Media MIME type differs from original extension');
   const sourceUrlPath=variant.base+'/'+relative;
   entries.push({service:variant.key,relative,sourceUrlPath,sha256:digest,bytes:bytes.length,remoteUrl:asset.url});
   rewrites.push({source:escaped(sourceUrlPath),destination:asset.url});
  }
  if(entries.some(e=>e.service===variant.key)){
   const service=config.services[services[variant.key]];
   if(!service?.buildCommand)throw Error('Missing explicit service build command');
   const helper=variant.key==='modern'?'../../../scripts/prune-shared-media.mjs':'../scripts/prune-shared-media.mjs';
   const prune=`node ${helper} ${variant.key}`;
   // Next's Vercel adapter captures public assets inside next build's completion
   // hook, before a shell post-build command runs. Remove generated public copies
   // first. Any future static import of a removed asset fails the build safely.
   service.buildCommand=['modern','app'].includes(variant.key)?`${prune} && ${service.buildCommand}`:`${service.buildCommand} && ${prune}`;
  }
 }
 if(new Set(rewrites.map(r=>r.source)).size!==rewrites.length)throw Error('Conflicting shared media routes');
 // Reserve room for framework-generated routes below the platform's 2048 limit.
 if(rewrites.length+config.rewrites.length+(config.redirects?.length??0)+(config.headers?.length??0)>1500)throw Error('Shared media exceeds conservative route budget');
 config.rewrites.unshift(...rewrites);
 // Public aliases retain their old filenames. Cache content at the CDN, but make
 // browsers revalidate so a later deployment can point the same URL at new bytes.
 config.headers??=[];
 config.headers.push({source:'/(.*\\.(?:png|jpg|jpeg|webp|avif|gif|svg|woff|woff2|mp4|webm))',headers:[{key:'Cache-Control',value:'public, max-age=0, must-revalidate'},{key:'CDN-Cache-Control',value:'public, max-age=86400'},{key:'x-vercel-enable-rewrite-caching',value:'1'}]});
 files.set('vercel.json',Buffer.from(JSON.stringify(config,null,2)+'\n'));
 const unique = new Map(entries.map(entry => [entry.sha256, entry.bytes]));
 const receipt={schemaVersion:1,dealer:manifest.slug,entries,bytes:entries.reduce((n,e)=>n+e.bytes,0),
  storage:{references:entries.length,uniqueObjects:unique.size,uniqueBytes:[...unique.values()].reduce((n,b)=>n+b,0)}};
 files.set('.cars-shared-media.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
 return receipt;
}
