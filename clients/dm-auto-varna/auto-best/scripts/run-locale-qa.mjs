import { sourceSnapshot } from './localization-evidence.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const [label='acceptance',base=process.env.BASE_URL,...requested]=process.argv.slice(2);
const names=requested.length?requested:['qa-locale-ssr','qa-locales','qa-locale-http','qa-locale-legacy','qa-locale-preferences','qa-locale-storage','qa-locale-races','qa-locale-journeys','qa-locale-completion','qa-locale-mobile-copy'];
const before=sourceSnapshot(root);
if(!/^[a-zA-Z0-9_-]+$/.test(label)||!names.length) throw Error('Provide label, base URL and script names');
new URL(base);
const directory=path.join(root,'artifacts/localization',label);
fs.mkdirSync(directory,{recursive:true});const results=[];
for(const name of names){
 if(!/^[a-z0-9-]+$/.test(name)||!fs.existsSync(path.join(root,'scripts',name+'.mjs')))throw Error('Unknown QA script: '+name);
 const out=path.join(directory,name);fs.mkdirSync(out,{recursive:true});const start=new Date().toISOString();
 const run=spawnSync(process.execPath,[path.join(root,'scripts',name+'.mjs')],{cwd:root,env:{...process.env,PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH,BASE_URL:base,DEALER_BASE_URL:base,LOCALE_QA_OUT:out,LOCALE_QA_DESIGNS:'auto-best',LOCALE_QA_MOUNT:'',LOCALE_QA_MOUNTS:'',LOCALE_QA_WIDTHS:process.env.LOCALE_QA_WIDTHS||'320,390,1440'},encoding:'utf8',timeout:600000,maxBuffer:32*1024*1024});
 const output=(run.stdout??'')+'\n'+(run.stderr??'')+(run.error?'\n'+run.error.stack:'');fs.writeFileSync(path.join(out,'runner.log'),output);
 results.push({name,start,end:new Date().toISOString(),exitCode:run.status,signal:run.signal,outputSha256:createHash('sha256').update(output).digest('hex'),out});
 fs.writeFileSync(path.join(directory,'runner-results.json'),JSON.stringify({base,node:process.version,serial:true,results},null,2));
 const after=sourceSnapshot(root);
 fs.writeFileSync(path.join(directory,'source-snapshot.json'),JSON.stringify({before,after,stable:before.applicationSha256===after.applicationSha256&&before.assetsSha256===after.assetsSha256},null,2));
 if(before.applicationSha256!==after.applicationSha256||before.assetsSha256!==after.assetsSha256)throw Error('Application source changed during QA');
 console.log(JSON.stringify({name,exitCode:run.status,tail:output.slice(-2200)}));
 if(run.status!==0){process.exitCode=1;break;}
}
