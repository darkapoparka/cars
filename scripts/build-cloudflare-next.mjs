import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const packageRoot=path.resolve(import.meta.dirname,'..');
const receipt=JSON.parse(fs.readFileSync(path.join(packageRoot,'.cars-cloudflare-next.json'),'utf8'));
const [phase,key]=process.argv.slice(2);
if(!['install','prove','check','build','freeze'].includes(phase)||process.argv.length!==4) throw Error('Usage: node scripts/build-cloudflare-next.mjs install|prove|check|build|freeze modern|app|mobile');
const target=receipt.targets.find(item=>item.key===key);
if(!target||receipt.adapter!=='cars-cloudflare-vinext-v1') throw Error('Invalid generated Next Cloudflare target');
if(process.version!=='v22.23.2') throw Error('Use pinned Node 22.23.2 for the Next Cloudflare build');
const cwd=path.join(packageRoot,target.root), dependencyRoot=path.join(packageRoot,key);
if(!cwd.startsWith(packageRoot+path.sep)||!dependencyRoot.startsWith(packageRoot+path.sep)) throw Error('Target outside generated package');
for(let dir=packageRoot;;dir=path.dirname(dir)){
  if(fs.existsSync(path.join(dir,'templates.lock.json'))&&!packageRoot.startsWith(path.join(dir,'runtime')+path.sep)) throw Error('Cloudflare helper runs only in generated packages');
  if(dir===path.dirname(dir))break;
}
const environment={...process.env,...target.environment,NODE_ENV:phase==='build'?'production':'development'};
for(const name of Object.keys(environment))if(name.toLowerCase()==='path')delete environment[name];
environment[process.platform==='win32'?'Path':'PATH']=path.dirname(process.execPath)+path.delimiter+(Object.entries(process.env).find(([name])=>name.toLowerCase()==='path')?.[1]??'');
function run(args,where=cwd){const r=spawnSync(process.execPath,args,{cwd:where,env:environment,stdio:'inherit',windowsHide:true});if(r.error||r.status!==0)throw Error('Next Cloudflare command failed: '+(r.error?.message??r.status));}
function resolveCloudflareNpmCli(nodeExecutable, io, paths) {
  const directory = paths.dirname(io.realpathSync(nodeExecutable));
  const candidates = [
    paths.join(directory, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    paths.resolve(directory, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  const selected = candidates.find(file => io.existsSync(file) && io.statSync(file).isFile());
  if (!selected) throw Error('npm CLI is missing from the pinned Node installation');
  return selected;
}
const npmCli=resolveCloudflareNpmCli(process.execPath,fs,path);
const require=createRequire(path.join(cwd,'package.json'));
function packageInfo(name){for(const directory of require.resolve.paths(name)??[]){const file=path.join(directory,name,'package.json');if(fs.existsSync(file)){const pkg=JSON.parse(fs.readFileSync(file,'utf8'));if(pkg.name===name)return {directory:path.dirname(file),pkg};}}throw Error('Installed package is missing: '+name);}
function bin(name,command){const info=packageInfo(name),relative=typeof info.pkg.bin==='string'?info.pkg.bin:info.pkg.bin?.[command];if(!relative)throw Error('Installed compiler has no expected bin: '+name);return path.resolve(info.directory,relative);}
const hash=value=>createHash('sha256').update(value).digest('hex');
const proofFile=path.join(packageRoot,'.cars-next-'+key+'-dependencies.json');
function inputs(){const rows=[];function add(file){if(fs.existsSync(file))rows.push([path.relative(dependencyRoot,file).replaceAll('\\','/'),hash(fs.readFileSync(file))]);}
  add(path.join(dependencyRoot,'package.json'));add(path.join(dependencyRoot,key==='modern'?'pnpm-lock.yaml':'package-lock.json'));add(path.join(dependencyRoot,'pnpm-workspace.yaml'));
  if(key==='modern')for(const family of ['apps','packages'])for(const name of fs.readdirSync(path.join(dependencyRoot,family)))add(path.join(dependencyRoot,family,name,'package.json'));
  return hash(JSON.stringify(rows.sort()));}
function sourceInputs(){const rows=[];const ignored=new Set(['node_modules','.git','dist','runtime','.vinext','.wrangler','.cloudflare','.turbo']);
  function visit(directory){for(const item of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){if(ignored.has(item.name)||item.name.startsWith('.next')||item.name==='next-env.d.ts'||item.name.endsWith('.tsbuildinfo'))continue;const file=path.join(directory,item.name);if(/packages[\\/]database[\\/]generated(?:[\\/]|$)/.test(file))continue;if(item.isSymbolicLink())throw Error('Linked generated source requires review: '+file);if(item.isDirectory())visit(file);else if(item.isFile())rows.push([path.relative(packageRoot,file).replaceAll('\\','/'),hash(fs.readFileSync(file))]);}}
  visit(dependencyRoot);for(const name of ['dealer.json','.cars-cloudflare-next.json','scripts/build-cloudflare-next.mjs']){const file=path.join(packageRoot,name);if(fs.existsSync(file))rows.push([name,hash(fs.readFileSync(file))]);}
  return hash(JSON.stringify(rows.sort()));}
function verifyPins(){const pkg=JSON.parse(fs.readFileSync(path.join(cwd,'package.json'),'utf8')),installed={};
  for(const name of ['vinext','vite','@vitejs/plugin-rsc','@cloudflare/vite-plugin','wrangler','react','react-dom','react-server-dom-webpack',...(key==='modern'?[]:['@stylexjs/unplugin','unplugin'])]){
    const wanted=pkg.dependencies?.[name]??pkg.devDependencies?.[name],actual=packageInfo(name).pkg.version;
    if(actual!==wanted)throw Error('Installed runtime version mismatch: '+name+' '+actual+' != '+wanted);installed[name]=actual;
  }
  return installed;
}
if(phase==='prove'){
  const proof=fs.existsSync(proofFile)?JSON.parse(fs.readFileSync(proofFile,'utf8')):null;
  if(!proof||proof.node!==process.version||proof.digest!==inputs())throw Error('Dependency installation cannot be reused after changed inputs');
  verifyPins();fs.writeFileSync(proofFile,JSON.stringify({...proof,sourceDigest:sourceInputs()})+'\n');
}else if(phase==='install'){
  if(key==='modern')run([npmCli,'exec','--yes','--package=pnpm@11.4.0','--','pnpm','install',receipt.dependencyLock==='frozen'?'--frozen-lockfile':'--no-frozen-lockfile','--prod=false'],dependencyRoot);
  else run([npmCli,receipt.dependencyLock==='frozen'?'ci':'install','--include=dev'],dependencyRoot);
  verifyPins();fs.writeFileSync(proofFile,JSON.stringify({schemaVersion:1,node:process.version,digest:inputs(),sourceDigest:sourceInputs()})+'\n');
}else{
  const proof=fs.existsSync(proofFile)?JSON.parse(fs.readFileSync(proofFile,'utf8')):null;
  if(!proof||proof.digest!==inputs()||proof.sourceDigest!==sourceInputs())throw Error('Run install to seal the current generated dependency lock and source');
  const installedPins=verifyPins();
  if(phase==='freeze'){
    const lockText=fs.readFileSync(path.join(packageRoot,target.lockPath),'utf8');
    const frozen={schemaVersion:1,adapter:receipt.adapter,key,node:process.version,sourcePackageSha256:target.sourcePackageSha256,sourceLockSha256:target.sourceLockSha256,generatedPackageSha256:hash(fs.readFileSync(path.join(cwd,'package.json'))),lockPath:target.lockPath,lockSha256:hash(Buffer.from(lockText)),lockText,installedPins};
    fs.writeFileSync(path.join(packageRoot,'.cars-next-'+key+'-frozen-lock.json'),JSON.stringify(frozen,null,2)+'\n');
    console.log(JSON.stringify({key,phase,lockSha256:frozen.lockSha256}));
  }else run([bin('vinext','vinext'),'check']);
  if(phase==='build'){
    if(key==='modern')run([npmCli,'exec','--yes','--package=pnpm@11.4.0','--','pnpm','--filter','@repo/database','build'],dependencyRoot);
    run([bin('vite','vite'),'build']);
    if(proof.sourceDigest!==sourceInputs())throw Error('Generated Next Cloudflare source changed during build');
    for(const file of [target.generatedConfig,target.main])if(!fs.existsSync(path.join(packageRoot,file)))throw Error('Missing Cloudflare build artifact: '+file);
    // Vite emits compiled assets beneath basePath but copies public namespaces
    // to the asset root. Place only generated copies at their published mount.
    const publicRoot=path.join(cwd,'public'),assetRoot=path.join(packageRoot,target.assets),mounted=path.join(assetRoot,target.base.slice(1));
    if(!mounted.startsWith(assetRoot+path.sep))throw Error('Unbounded generated asset mount');
    fs.mkdirSync(mounted,{recursive:true});
    for(const item of fs.readdirSync(publicRoot,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
      if(item.name==='preview-switcher.js')continue;
      if(item.isSymbolicLink())throw Error('Linked public source requires review');
      const from=path.join(assetRoot,item.name),to=path.join(mounted,item.name);
      if(!from.startsWith(assetRoot+path.sep)||!to.startsWith(mounted+path.sep))throw Error('Unbounded generated public namespace');
      if(!fs.existsSync(from))throw Error('Missing emitted public namespace: '+item.name);
      if(fs.existsSync(to))throw Error('Occupied mounted public namespace: '+item.name);
      fs.renameSync(from,to);
    }
    console.log(JSON.stringify({key,phase,worker:target.workerName,config:target.generatedConfig,assets:target.assets,hosted:'unverified',freeTier:'unverified'}));
  }
}
