import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {ROOT,inside,sha256} from './workflow.mjs';

export const AUTO_BEST_LOCALE_OUTPUTS=Object.freeze([
 'auto-best/src/lib/locale/catalog.ts','auto-best/localization/generated-manifest.json'
]);
export const AUTO_BEST_LOCALE_GENERATORS=Object.freeze({
 'scripts/build-locales.mjs':'c62c7f149591308e71cdd0dc9eee2f2ecff9661d',
 'scripts/locale-catalog.mjs':'d1c8b4c43fc073f24137785b69f7a497d9290da8'
});
export const AUTO_BEST_LOCALE_INPUTS=Object.freeze([
 ...Object.keys(AUTO_BEST_LOCALE_GENERATORS),
 'localization/common.json','localization/catalog.reviewed.json',
 'localization/template.reviewed.json','localization/dealer.reviewed.json',
 'src/lib/locale/policy.ts','src/lib/locale/catalog.ts','localization/generated-manifest.json'
]);
const blobHash=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const equal=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
function assert(test,message){if(!test)throw Error(message);}
function runtimeDirectory(runtimeRoot){
 const runtime=path.resolve(ROOT,'runtime'),directory=path.resolve(runtimeRoot??path.join(runtime,'uk-locale-finalization'));
 const relative=path.relative(runtime,directory);
 assert(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative),'Locale finalization must use a bounded directory below Cars runtime.');
 for(let current=directory;;current=path.dirname(current)){
  if(fs.existsSync(current))assert(!fs.lstatSync(current).isSymbolicLink(),'Linked locale finalization directory refused.');
  if(path.relative(runtime,current)==='')break;
  assert(path.dirname(current)!==current,'Locale runtime ancestor boundary is invalid.');
 }
 fs.mkdirSync(directory,{recursive:true});return fs.mkdtempSync(path.join(directory,'auto-best-'));
}
function retainedFiles(directory,relative='',output=[]){
 for(const entry of fs.readdirSync(path.join(directory,relative),{withFileTypes:true})){
  const name=relative?relative+'/'+entry.name:entry.name;
  assert(!entry.isSymbolicLink(),'Native locale generator created a linked output.');
  if(entry.isDirectory())retainedFiles(directory,name,output);
  else{assert(entry.isFile(),'Native locale generator created an unsupported output.');output.push(name);}
 }return output.sort();
}

/** Run the approved native generator after dealer/UK copy changes, before source seals. */
export function finalizeAutoBestLocales({files,runtimeRoot}){
 assert(files instanceof Map,'Locale finalization requires retained source bytes.');
 const input=new Map();let inputBytes=0;
 for(const name of AUTO_BEST_LOCALE_INPUTS){
  const bytes=files.get('auto-best/'+name);
  assert(Buffer.isBuffer(bytes)&&bytes.length>0,'Missing retained native locale input: '+name);
  inputBytes+=bytes.length;assert(inputBytes<=4*1024**2,'Native locale input exceeds its bounded text budget.');
  if(AUTO_BEST_LOCALE_GENERATORS[name])assert(blobHash(bytes)===AUTO_BEST_LOCALE_GENERATORS[name],'Native locale generator differs from the approved Auto Best release: '+name);
  input.set(name,bytes);
 }
 const directory=runtimeDirectory(runtimeRoot);
 for(const [name,bytes]of input){const target=inside(directory,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});}
 const environment={...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'};
 for(const name of ['GH_TOKEN','GITHUB_TOKEN','CLOUDFLARE_API_TOKEN','CLOUDFLARE_API_KEY'])delete environment[name];
 const run=args=>{
  const result=spawnSync(process.execPath,[path.join(directory,'scripts/build-locales.mjs'),...args],
   {cwd:directory,env:environment,encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:1024*1024});
  assert(!result.error&&result.status===0,'Approved native locale generator failed: '+String(result.stderr||result.error?.message||'').slice(0,2000));
  let receipt;try{receipt=JSON.parse(result.stdout.trim());}catch{throw Error('Native locale generator returned an unexpected receipt.');}
  assert(receipt.status===(args.includes('--check')?'checked':'generated')&&Number.isInteger(receipt.messages)&&receipt.messages>0,'Native locale generator did not confirm its result.');
  return receipt;
 };
 const generated=run([]),checked=run(['--check']);
 assert(equal(retainedFiles(directory),[...input.keys()].sort()),'Native locale generator changed its retained file set.');
 const outputs=new Map(),changes=[];
 for(const [name,original]of input){
  const bytes=fs.readFileSync(path.join(directory,name)),full='auto-best/'+name;
  if(!AUTO_BEST_LOCALE_OUTPUTS.includes(full))assert(bytes.equals(original),'Native locale generator modified an authoritative source input: '+name);
  else{
   outputs.set(full,bytes);
   if(!bytes.equals(original))changes.push({path:full,before:sha256(original),after:sha256(bytes)});
  }
 }
 const manifest=JSON.parse(outputs.get('auto-best/localization/generated-manifest.json'));
 assert(manifest.schemaVersion===2&&equal(manifest.enabledLocales,['en','bg'])&&manifest.activeAmbiguousAliases===0&&
  manifest.catalogSha256===sha256(outputs.get('auto-best/src/lib/locale/catalog.ts'))&&
  manifest.policySha256===sha256(input.get('src/lib/locale/policy.ts')),'Native locale manifest differs from the actual generated inputs.');
 const sourceNames=['localization/common.json','localization/catalog.reviewed.json','localization/template.reviewed.json','localization/dealer.reviewed.json'];
 assert(equal(manifest.sources,sourceNames)&&equal(Object.keys(manifest.sourceSha256??{}),sourceNames)&&
  sourceNames.every(name=>manifest.sourceSha256[name]===sha256(input.get(name))),'Native locale source hashes differ from authoritative dealer copy.');
 // Mutate the caller's source Map only after the native command and every check pass.
 for(const [name,bytes]of outputs)files.set(name,bytes);
 return {schemaVersion:1,method:'approved-native-locale-generator',generatorBlobs:AUTO_BEST_LOCALE_GENERATORS,
  inputBytes,inputHashes:Object.fromEntries([...input].filter(([name])=>!AUTO_BEST_LOCALE_OUTPUTS.includes('auto-best/'+name)).map(([name,bytes])=>['auto-best/'+name,sha256(bytes)])),
  generated,checked,changedFiles:changes,outputHashes:Object.fromEntries([...outputs].map(([name,bytes])=>[name,sha256(bytes)])),
  nativeCheckPassed:true,authoritativeInputsUnchanged:true,fixture:path.relative(ROOT,directory).replaceAll('\\','/'),hosted:false,readyToPublish:false};
}
