/** Generates the reviewable initial queue file. Publishing the dedicated branch
 * remains a separate one-time coordinator action; this command never calls APIs.
 */
import fs from 'node:fs';
import path from 'node:path';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue} from './lib/dealer-pack-queue.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
export function initializePackQueueFile({workers,routes,domains,out,now=new Date().toISOString()}={}) {
  assert(workers?.accountId===PACK_DEPLOY_ACCOUNT&&workers.zoneId===PACK_DEPLOY_ZONE&&Array.isArray(workers.workers)&&workers.count===workers.workers.length&&workers.total===workers.count,'Use the complete authenticated modern Worker inventory, with exact count/total');
  assert(Array.isArray(routes?.routes)&&routes.count===routes.routes.length&&Number.isFinite(Date.parse(routes.observedAt)),'Use the complete authenticated zone route inventory');
  assert(domains?.accountId===PACK_DEPLOY_ACCOUNT&&domains.complete===true&&Array.isArray(domains.domains)&&domains.count===domains.domains.length&&Number.isFinite(Date.parse(domains.observedAt)),'Use a complete authenticated Worker Custom Domain inventory, even when empty');
  const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:now,
    authorizationSource:'Owner M2 instruction in the shared Cars session dated 2026-10-19.',reason:'Owner confirmed Workers Paid and approved 100 existing plus 400 new previews, explicitly accepting zero reserve for the final slot. Outreach remains unapproved.',maximumNewDealers:400};
  const baseline={accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:workers.observedAt,workerNames:workers.workers.map(row=>row.name),workers:workers.workers,routes:routes.routes,domains:domains.domains,routeObservedAt:routes.observedAt,domainObservedAt:domains.observedAt};
  const queue=createPackDeploymentQueue({policy,baseline,now});
  if(out){const file=path.resolve(out);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(queue,null,2)+'\n',{flag:'wx'});}
  return queue;
}
if(isEntrypoint(import.meta.url)){
  try{const argv=process.argv.slice(2);if(argv.includes('--help'))console.log('Usage: init-dealer-pack-queue.mjs --workers COMPLETE_WORKERS.json --routes COMPLETE_ROUTES.json --domains COMPLETE_DOMAINS.json --out queue.json\nGenerates only a new file. Do not replace an existing cars-deploy-queue branch.');
    else{const opts={};for(let i=0;i<argv.length;i+=2){assert(['--workers','--routes','--domains','--out'].includes(argv[i])&&argv[i+1]&&!opts[argv[i]],'Invalid queue bootstrap arguments');opts[argv[i]]=argv[i+1];}assert(Object.keys(opts).length===4,'All three complete provider inventories and --out are required');const read=file=>JSON.parse(fs.readFileSync(file,'utf8')),queue=initializePackQueueFile({workers:read(opts['--workers']),routes:read(opts['--routes']),domains:read(opts['--domains']),out:opts['--out']});console.log(JSON.stringify({queueId:queue.queueId,protectedWorkers:queue.baseline.workerNames.length,capacity:queue.policy.allowedScripts,maximumNewDealers:queue.policy.maximumNewDealers,minimumSpareScripts:queue.policy.minimumSpareScripts,file:path.resolve(opts['--out']),providerWrites:0},null,2));}
  }catch(error){console.error(error.message);process.exitCode=1;}
}
