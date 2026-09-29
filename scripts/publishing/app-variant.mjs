import {createHash} from 'node:crypto';
export const APP_PACKAGING_VERSION='3';
export const APP_VARIANT=Object.freeze({key:'app',base:'/variant-4',entry:'/variant-4/'});
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const digest=files=>sha256(Buffer.from(JSON.stringify([...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name,bytes])=>[name,sha256(bytes)]))));
export function baseNativeManifest(manifest){
 const base=structuredClone(manifest);if(base.packaging?.version!==APP_PACKAGING_VERSION)return base;
 if(base.variants?.length!==4||JSON.stringify(base.variants[3])!==JSON.stringify(APP_VARIANT))throw Error('Invalid App extension manifest');
 base.packaging.version='2';base.variants=base.variants.slice(0,3);delete base.templateRevisions?.app;delete base.templateSources?.app;delete base.appVariant;return base;
}
export function appendAppService(config){
 const result=structuredClone(config);if(!result.services?.autobest||!result.services?.carwow)throw Error('Expected the existing dealer Services configuration');
 if(result.services.app)throw Error('App service already exists; use an explicit refresh');
 result.services.app={root:'app',framework:'nextjs',installCommand:'npm ci',buildCommand:'node ../scripts/build-app-service.mjs'};
 if(!Array.isArray(result.rewrites))throw Error('Missing existing service routes');
 const fallback=result.rewrites.findIndex(r=>r.source==='/(.*)');if(fallback<0)throw Error('Missing existing root service route');
 result.rewrites.splice(fallback,0,{source:'/variant-4',destination:{service:'app'}},{source:'/variant-4/(.*)',destination:{service:'app'}});
 return result;
}
export function assertAppVariant(files,manifest){
 if(manifest.packaging?.version!==APP_PACKAGING_VERSION)return;
 baseNativeManifest(manifest);
 const receipt=JSON.parse(files.get('.cars-app.json')?.toString()||'null');
 if(receipt?.schemaVersion!==1||receipt.dealer!==manifest.slug||receipt.template.revision!==manifest.templateRevisions?.app)throw Error('App source receipt mismatch');
 const actual=new Map([...files].filter(([p])=>p.startsWith('app/')).map(([p,b])=>[p.slice(4),b]));
 if(digest(actual)!==receipt.appDigest)throw Error('App source changed after personalization; regenerate its receipt and rerun QA');
 const config=JSON.parse(actual.get('lib/dealer.json')?.toString()||'null');
 if(config?.mode!=='dealer'||config.id!==manifest.slug||!config.name||!config.logo?.light)throw Error('Missing dealer-specific App identity');
 if(!actual.has('public'+config.logo.light)||!actual.has('public'+config.logo.dark)||!actual.has('public'+config.logo.icon))throw Error('Missing App logo bytes');
 const inventory=JSON.parse(actual.get('lib/dealer-inventory.json')?.toString()||'null');
 if(!Array.isArray(inventory)||!inventory.length)throw Error('App dealer inventory missing');
 for(const car of inventory)for(const image of car.images||[])if(!actual.has('public'+image))throw Error('Missing App vehicle media '+image);
}
/** Additive, exact-input packaging. Existing runtime and assets are not regenerated. */
export function appendAppVariant({baseFiles,appFiles,template,sourceCommit,sharedSwitcher,provenance,baseDeployment}){
 const original=new Map(baseFiles),files=new Map(baseFiles);
 const manifest=JSON.parse(files.get('dealer.json').toString());
 if(manifest.packaging?.version!=='2'||manifest.variants?.length!==3)throw Error('App append requires a verified native trio');
 if(!/^[a-f0-9]{40}$/.test(template.revision)||!sourceCommit)throw Error('An exact committed App source is required');
 const previous=files.get('.cars-package.json');
 manifest.packaging.version=APP_PACKAGING_VERSION;manifest.variants.push({...APP_VARIANT});
 manifest.templateRevisions={...manifest.templateRevisions,app:template.revision};manifest.templateSources={...manifest.templateSources,app:template};
 manifest.appVariant={schemaVersion:1,format:'app-preview-v1',source:template,baseDeployment};
 for(const [name,bytes] of appFiles){if(name.startsWith('/')||name.includes('\\')||name.split('/').some(s=>['..','.git','node_modules','.next'].includes(s)||s.startsWith('.env')))throw Error('Unsafe App file '+name);files.set('app/'+name,bytes);}
 const switcherName='auto-best/static/preview-switcher.js';
 const oldSwitcher=files.get(switcherName)?.toString()||'';
 const match=oldSwitcher.match(/const config = (\{[\s\S]*?\});\s*(?:const mount|const choices)/);
 if(!match)throw Error('Unknown deployed switcher configuration');const config=JSON.parse(match[1]);
 if(config.variants?.length!==3)throw Error('Unknown deployed design choices');config.variants.push({...APP_VARIANT});
 const boundary='const embeddedConfig = __CARS_SWITCHER_CONFIG__;';
 if(!sharedSwitcher.includes(boundary))throw Error('Missing shared switcher boundary');
 const renderedSwitcher=sharedSwitcher.replace(boundary,()=>`const embeddedConfig = ${JSON.stringify(config).replace(/</g,'\u003c')};`);
 files.set(switcherName,Buffer.from(renderedSwitcher));
 const service=files.get('scripts/build-native-service.mjs')?.toString();
 if(service){const old="manifest.packaging?.version !== '2'";if(!service.includes(old))throw Error('Unrecognized native build manifest check');files.set('scripts/build-native-service.mjs',Buffer.from(service.replace(old,"!['2', '3'].includes(manifest.packaging?.version)")));}
 files.set('scripts/build-app-service.mjs',Buffer.from("import {spawnSync} from 'node:child_process';\nimport path from 'node:path';\nconst cwd=path.resolve(import.meta.dirname,'../app');\nconst result=spawnSync(process.execPath,[path.join(cwd,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BASE_PATH:'/variant-4'},windowsHide:true});\nif(result.error)throw result.error;process.exitCode=result.status??1;\n"));
 files.set('vercel.json',json(appendAppService(JSON.parse(files.get('vercel.json').toString()))));
 files.set('dealer.json',json(manifest));
 const appReceipt={schemaVersion:1,dealer:manifest.slug,template,appDigest:digest(appFiles),provenance,baseDeployment,baseReceiptSha256:previous?sha256(previous):null};
 files.set('.cars-app.json',json(appReceipt));
 const mutable=new Set(['dealer.json','vercel.json','.cars-package.json',switcherName,'scripts/build-native-service.mjs']);
 let preserved=0;for(const [name,bytes]of original){if(mutable.has(name))continue;if(!files.get(name)?.equals(bytes))throw Error('Existing dealer file changed: '+name);preserved++;}
 const payload=[...files].filter(([p])=>p!=='.cars-package.json').sort(([a],[b])=>a<b?-1:a>b?1:0).map(([p,b])=>({path:p,sha256:sha256(b)}));
 files.set('.cars-package.json',json({schemaVersion:1,manifest,sourceCommit,packagingVersion:APP_PACKAGING_VERSION,sourceMode:'additive-preserved-production',preservedBase:{deployment:baseDeployment,receiptSha256:appReceipt.baseReceiptSha256,unchangedFiles:preserved},payloadDigest:sha256(Buffer.from(JSON.stringify(payload))),payload}));
 assertAppVariant(files,manifest);return {files,manifest,appReceipt,preserved};
}
