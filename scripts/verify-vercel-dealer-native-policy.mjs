import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync,execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';

export const SOURCE_COMMIT='bf6303bbde4268c649efb91df2b04ad3240b347b';
export const TEMPLATE_COMMIT='b1f0f5609c7c249cfd0649c122849ff2cbb8dfde';
export const KEYS=Object.freeze(['auto-best','modern','import']);
const six=['auto-best','modern','import','app','mobile','karento-best'];
const nodes={autobest:'22.23.2',modern:'22.23.2',importer:'24.21.0',app:'22.23.2',mobile:'22.23.2',signature:'24.21.0'};
export const POLICY_COMMANDS=Object.freeze([
 {name:'auto-best-catalog-check',key:'auto-best',args:['scripts/build-locales.mjs','--check'],supports:['catalog-completeness']},
 {name:'auto-best-source-audit',key:'auto-best',args:['scripts/locale-source-audit.mjs'],supports:['hardcoded-ui']},
 {name:'auto-best-native-policy-tests',key:'auto-best',args:['--test','--test-concurrency=1','scripts/locale-policy.test.mjs','scripts/locale-copy-audit.test.mjs','scripts/locale-catalog.test.mjs','scripts/locale-source-audit.test.mjs','scripts/locale-mobile-copy.test.mjs'],supports:['catalog-completeness','hardcoded-ui','native-routing','request-isolation','security-write-blocking']},
 {name:'modern-catalog-source-contracts',key:'modern',args:['--test','scripts/localization-contract.test.mjs'],supports:['catalog-completeness','native-routing']},
 {name:'modern-native-policy-tests',key:'modern',packageCli:'vitest',cli:'vitest.mjs',args:['run','--config','apps/web/vitest.config.mts','packages/security/inventory-credentials.test.ts','packages/internationalization/preferences.test.ts','packages/security/proxy.test.ts','apps/web/lib/public-form-security.test.ts','packages/marketplace-ui/lib/browser-preferences.test.ts','apps/web/lib/public-proxy-policy.test.ts','packages/internationalization/proxy.test.ts','apps/web/lib/public-locale-policy.test.ts'],supports:['native-routing','request-isolation','security-write-blocking']},
 {name:'import-native-policy-tests',key:'import',packageCli:'vitest',cli:'vitest.mjs',args:['run','src/lib/locale/policy.spec.ts','src/lib/i18n/native.spec.ts','src/lib/i18n/native-source.spec.ts','src/lib/i18n/final-review.spec.ts'],supports:['catalog-completeness','hardcoded-ui','native-routing','request-isolation','security-write-blocking']}
]);
export function selectedPolicyScope(scope){assert(scope===undefined||scope==='corrected-import-only','Unknown policy command scope');return{importOnly:scope!==undefined,selectedKeys:scope===undefined?KEYS:['import'],selectedCommands:scope===undefined?POLICY_COMMANDS:POLICY_COMMANDS.filter(row=>row.key==='import')};}
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),h64=v=>/^[a-f0-9]{64}$/.test(v??''),h40=v=>/^[a-f0-9]{40}$/.test(v??'');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const validTime=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
export const safePath=name=>typeof name==='string'&&name.length>0&&name.length<=1024&&!/[\\:\u0000-\u001f\u007f]/.test(name)&&!name.startsWith('/')&&!name.split('/').some(p=>!p||p==='.'||p==='..'||p==='.git'||p==='node_modules'||p.startsWith('.env'));
function physical(root,name,{exists=true}={}) {
 assert(safePath(name),'Unsafe input path');const file=path.resolve(root,name);
 assert(file.startsWith(fs.realpathSync(root)+path.sep),'Input outside physical root');
 let cursor=path.dirname(file);while(cursor!==root&&cursor.startsWith(root+path.sep)){if(fs.existsSync(cursor))assert(!fs.lstatSync(cursor).isSymbolicLink(),'Linked input directory');cursor=path.dirname(cursor);}
 if(exists){assert(fs.lstatSync(file).isFile()&&!fs.lstatSync(file).isSymbolicLink(),'Physical regular input required');assert.equal(fs.realpathSync(file),file);}
 return file;
}
function proof(root,ref) {
 assert(ref&&Object.keys(ref).sort().join(',')==='reference,sha256'&&h64(ref.sha256),'Exact hashed proof reference required');
 const file=physical(root,ref.reference),stat=fs.statSync(file);assert(stat.size>0&&stat.size<=8*1024**2,'Oversized proof');
 const bytes=fs.readFileSync(file);assert.equal(sha(bytes),ref.sha256,'Proof bytes changed');return {file,bytes,value:JSON.parse(new TextDecoder('utf8',{fatal:true}).decode(bytes))};
}
function git(root,args,{input,encoding='utf8',maxBuffer=16*1024**2}={}) {
 return execFileSync('git',['-C',root,...args],{input,encoding,maxBuffer,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},stdio:['pipe','pipe','pipe']});
}
function readBlob(root,oid,max=8*1024**2) {
 assert(h40(oid));const size=Number(git(root,['cat-file','-s',oid]).trim());assert(Number.isSafeInteger(size)&&size>=0&&size<=max,'Source blob exceeds bound');
 const bytes=git(root,['cat-file','blob',oid],{encoding:null,maxBuffer:max+1024});assert.equal(bytes.length,size);
 assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),oid,'Raw Git blob changed');return bytes;
}
export function validatePreparedPolicyPackage(request,p,compileProof) {
 assert.equal(request.schemaVersion,1);assert.equal(request.kind,'cars-vercel-native-policy-request');assert.equal(request.provider,'vercel');assert.equal(request.scope,'existing-dealer-source-policy');
 assert.equal(request.readyForDispatch,true);assert.equal(request.reviewed,true);assert(validTime(request.reviewedAt));
 assert.equal(request.sourceCommit,SOURCE_COMMIT);assert.equal(request.sourceRevision,TEMPLATE_COMMIT);
 assert.equal(request.dealer,'promosale-varna');assert.equal(request.repository,'darkapoparka/cars-promosalevarna');assert.equal(request.projectId,'prj_yjXIu0an7sqCiY26hKWgOGUl5hbY');
 for(const field of ['sourceTree','packageTree'])assert(h40(request[field]));
 assert(h64(request.packageDigest)&&h64(request.compilationInputProofHelper.sha256));
 for(const approval of ['nativeApproval','hostedApproval','globalReleaseApproval','ownerAccepted'])assert.equal(request[approval],false,'Policy phase cannot claim acceptance');
 assert.equal(p.schemaVersion,1);assert.equal(p.kind,'private-vercel-pilot-prepared-package');
 for(const field of ['dealer','repository','sourceCommit','packageTree','packageDigest'])assert.equal(p[field],request[field],'Prepared package identity differs: '+field);
 assert(Number.isSafeInteger(p.runId)&&p.runId>0&&p.runId===request.prepareRunId);
 for(const approval of ['nativeApproval','hostedApproval','globalReleaseApproval'])assert.equal(p[approval],false);
 assert.equal(p.compiled.length,6);assert.equal(new Set(p.compiled.map(c=>c.service)).size,6);
 assert(Object.entries(nodes).every(([service,node])=>p.compiled.some(c=>c.service===service&&c.node===node&&c.result==='PASS'&&validTime(c.startedAt)&&validTime(c.finishedAt)&&Date.parse(c.finishedAt)>=Date.parse(c.startedAt))),'Six original real compilation receipts required');
 assert.equal(p.transport.packageTree,request.packageTree);assert.equal(p.transport.sourceCommit,request.sourceCommit);
 assert.equal(p.tooling.nativeClientBytesChanged,false);assert.equal(p.tooling.canonicalMainChanged,false);
 assert.equal(compileProof.schemaVersion,1);assert.equal(compileProof.kind,'immutable-package-compilation-input-proof');assert.equal(compileProof.passed,true,'Reviewed passing compilation input proof required');
 assert.equal(compileProof.packageDigest,request.packageDigest);assert(h64(compileProof.actualRetainedDigest)&&h64(compileProof.expectedRetainedDigest));
 assert.equal(compileProof.actualRetainedDigest,compileProof.expectedRetainedDigest);assert.deepEqual(compileProof.unexpected,[]);
 for(const approval of ['nativeApproval','hostedApproval','globalReleaseApproval'])assert.equal(compileProof[approval],false);
 // Original failed proof is retained separately. A recovered proof is bound by exact bytes and helper lease, never by changing the original six build rows.
 assert(h64(p.compilationInputProofSha256));assert(h64(request.originalCompilationInputProofHelperSha256));
 assert.equal(p.compilationInputProofSha256,request.compilationInputProofHelper.sha256);assert(same(p.compilationInputProof,compileProof),'Prepared/recovered input proof differs');
 assert(Number.isSafeInteger(request.nativeCompilationSourceRunId)&&request.nativeCompilationSourceRunId>0);
 if(p.compilationProofRecovery){assert.equal(p.nativeCompilationSourceRunId,request.nativeCompilationSourceRunId);const recovery=p.compilationProofRecovery;assert.equal(recovery.buildsRepeated,0);assert.equal(recovery.originalProofPassed,false);assert(h64(recovery.originalProofSha256)&&h64(recovery.moduleSha256));assert.equal(recovery.moduleSha256,request.compilationProofRecoverySha256);assert.equal(recovery.actualRetainedDigest,compileProof.actualRetainedDigest);assert.equal(recovery.lease.sourceRunId,request.nativeCompilationSourceRunId);assert.equal(recovery.lease.packageTree,request.packageTree);assert.equal(recovery.lease.packageDigest,request.packageDigest);assert.equal(recovery.lease.files?.proof?.sha256,recovery.originalProofSha256);assert.equal(recovery.lease.originalCompilationInputProofSha256,request.originalCompilationInputProofHelperSha256);}else assert.equal(p.runId,request.nativeCompilationSourceRunId);
 assert.equal(request.sourceReleases&&Object.keys(request.sourceReleases).sort().join(','),[...six].sort().join(','));
 for(const key of six){const source=request.sourceReleases[key];assert.equal(source.repository,'darkapoparka/cars');assert.equal(source.revision,TEMPLATE_COMMIT);assert.equal(source.path,'templates/'+key);assert(h40(source.tree)&&h64(source.digest));}
 return p;
}

/** The original six compile basis is not relabeled as the current Modern compilation. */
export function validateCurrentPolicyLease(current,meta,validated,familyTrees){
 assert.equal(current.schemaVersion,1);assert.equal(current.kind,'cars-reviewed-native-policy-package-derivative');
 assert.equal(current.packageTree,'2dcffe5056df6248fe19d591f24f720fbca00473');assert.equal(current.packageDigest,'40bb675e24d630b0c13466c8dce7aebff1dea0c9ccc9ec281ab61731d1b720ef');assert.equal(validated.packageDigest,current.packageDigest);
 assert.equal(meta.sourceCommit,current.correctedSourceCommit);assert.equal(meta.sourceBasisCommit,SOURCE_COMMIT);assert.equal(meta.canonicalSourcePublished,false);
 assert.equal(meta.qualification.sourceCorrectionSha256,current.sourceCorrectionSha256);assert.equal(current.sourceCorrectionSha256,'634dbfeb6b6b59dd224804da36f2f4a9e4f3bffa55c8ac8aa6e75c7f88cae070');
 assert.equal(meta.qualification.nativeInput.digest,current.afterNativeInput.digest);assert.equal(meta.qualification.nativeInput.files,current.afterNativeInput.files);assert.equal(current.afterNativeInput.digest,'ab0a14c1c65fa28c4c59bdf1cd3fa88fc6a0854a448a06bec4f2711612fdc5eb');assert.equal(current.afterNativeInput.files,9131);
 assert.equal(meta.qualification.sourceTree,current.correctedClientTree);assert.equal(current.correctedClientTree,'f4f6ef4725536da86548e560aa049247b9c97fbb');
 assert.equal(familyTrees.modern,'414ff2a4c9f2f7228c8f52fd4f430d043658b107');
 for(const row of meta.qualification.unchangedFamilyCompilations)assert.equal(familyTrees[row.family],row.tree,'Unchanged family proof differs');
 for(const field of ['nativeApproval','hostedApproval','globalReleaseApproval','ownerAccepted'])assert.equal(current[field],false);
 return current;
}

export function packagePolicyInput(name,selectedKeys=KEYS) {
 if(!safePath(name)||name.split('/').some(p=>['static','public','node_modules','.cars-media','.cars-build-assets','.next','.svelte-kit','generated','runtime','docs','.auth','.client'].includes(p)))return false;
 if(['dealer.json','vercel.json','.cars-package.json'].includes(name))return true;
 const [key,...parts]=name.split('/');if(!selectedKeys.includes(key))return false;const relative=parts.join('/');
 if(['package.json','package-lock.json','pnpm-lock.yaml','pnpm-workspace.yaml','.npmrc','.pnpmfile.cjs','vite.config.ts','svelte.config.js','tsconfig.json'].includes(relative))return true;
 if(relative.startsWith('patches/'))return true;
 if(/^scripts\/(?:build-locales|locale-catalog|locale-copy-audit|locale-source-audit|locale-policy\.test|locale-copy-audit\.test|locale-catalog\.test|locale-source-audit\.test|locale-mobile-copy\.test|localization-contract\.test)\.mjs$/.test(relative))return true;
 if(/^(?:src\/|localization\/)/.test(relative))return true;
 if(key==='modern')return /^(?:packages\/|apps\/web\/)/.test(relative)&&/\.(?:[cm]?[jt]sx?|mts|cts|json|css)$/.test(relative)||relative.endsWith('/package.json');
 return ['scripts/public-asset-retention.mjs'].includes(relative);
}
export function validatePreparedPolicyHelper(row, donor, actual, preparedRow) {
 if (actual.equals(donor)) {assert(!row.preparedResourceAdaptation,'Unused prepared test adaptation');return null;}
 const a=row.preparedResourceAdaptation;
 assert(row.role==='test-helper'&&row.path==='modern/packages/internationalization/proxy.test.ts'&&row.blob==='d6b2f09e06af0993cbcad5322703cf1dacfe8697'&&row.sha256==='568154b3d31c9f639eb74d53f469b68a427dc1cb5af1fd384a742cadcbe9356d','Maintained test/helper differs in prepared package: '+row.path);
 assert(a&&a.schemaVersion===1&&a.kind==='cars-reviewed-helper-resource-fixture-adaptation'&&a.reviewed===true&&Number.isFinite(Date.parse(a.reviewedAt)),'Explicit reviewed resource fixture adaptation required');
 assert.equal(a.sourceCommit,SOURCE_COMMIT);assert.equal(a.canonicalPath,'clients/promosale-varna/'+row.path);assert.equal(a.packageTree,'b2144144e88bf43256cfb24435a192e4de7b5620');
 assert.equal(a.preparedBlob,'ad89fa10e81a9792190c0f4de69821b300be9836');assert.equal(preparedRow?.blob,a.preparedBlob);assert.equal(a.preparedSha256,'b8a5b397368f6330168b6ec946bccd2e4fe9c12c1edb1a1ab66d05d15eb03b4b');assert.equal(sha(actual),a.preparedSha256);assert.equal(actual.length,a.preparedBytes);assert.equal(a.preparedBytes,4482);
 assert.equal(sha(donor),row.sha256);assert.equal(a.replacement?.from,'    "/lead-logo.png",');assert.equal(a.replacement?.to,'    "/dealer-brand/v2-a98706ed9a9b259c/logo-on-light.webp",');assert.equal(a.replacement?.occurrences,1);
 const text=new TextDecoder('utf-8',{fatal:true}).decode(donor);assert.equal(text.split(a.replacement.from).length,2);assert(actual.equals(Buffer.from(text.replace(a.replacement.from,a.replacement.to))),'Unreviewed test bytes differ outside exact resource fixture adaptation');
 return {kind:a.kind,sourceCommit:a.sourceCommit,canonicalPath:a.canonicalPath,preparedBlob:a.preparedBlob,preparedSha256:a.preparedSha256,replacement:a.replacement,reviewed:true};
}
export function installPolicyProjection({root,files,inventory,readBlob:read,selectedKeys=KEYS}) {
 assert(same(selectedKeys,KEYS)||same(selectedKeys,['import']),'Only reviewed Import-only projection or original full policy scope');
 assert(!fs.existsSync(root),'Fresh bounded policy projection required');assert(Array.isArray(files)&&files.length>0&&files.length<=60000,'Bounded immutable package metadata required');
 const selected=files.filter(row=>packagePolicyInput(row.path,selectedKeys));assert(selected.length>0&&selected.length<=6000,'Bounded selected policy inputs required');
 assert(inventory.schemaVersion===1&&inventory.kind==='cars-vercel-native-policy-source-inventory'&&inventory.sourceRevision===TEMPLATE_COMMIT);
 assert(Array.isArray(inventory.files)&&inventory.files.length>0&&inventory.files.length<=80);
 fs.mkdirSync(root,{recursive:true});const projected=[],names=new Set(),supplements=new Set();let total=0;
 const add=(row,bytes,origin)=>{assert(projected.length<6000,'Policy projection exceeds bounded files');assert(safePath(row.path)&&!names.has(row.path),'Duplicate or unsafe projection');assert(Buffer.isBuffer(bytes)&&bytes.length<=8*1024**2);total+=bytes.length;assert(total<=48*1024**2,'Policy projection exceeds bounded bytes');names.add(row.path);const file=physical(root,row.path,{exists:false});fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});projected.push({path:row.path,blob:row.blob,sha256:sha(bytes),bytes:bytes.length,origin});};
 for(const row of selected)add(row,read(row.blob),'immutable-prepared-package');
 for(const row of inventory.files.filter(row=>selectedKeys.includes(row.key))){assert(!supplements.has(row.path)&&['test-helper','catalog-data'].includes(row.role),'Duplicate/unreviewed supplement role');supplements.add(row.path);assert(row.role==='catalog-data'?/^auto-best\/localization\/(?:common\.json|(?:catalog|template|dealer)\.reviewed\.json|generated-manifest\.json)$/.test(row.path):(/\/scripts\/[\w-]+(?:\.test)?\.mjs$/.test(row.path)||/\.(?:test|spec)\.ts$/.test(row.path)||row.path==='modern/apps/web/vitest.config.mts'||row.path==='modern/apps/web/test/server-only-stub.ts'),'Runtime source supplement prohibited');assert(KEYS.includes(row.key)&&row.sourcePath==='templates/'+row.key+'/'+row.path.slice(row.key.length+1)&&h40(row.blob)&&h64(row.sha256),'Pinned supplement differs');
  const bytes=read(row.blob);assert.equal(sha(bytes),row.sha256);assert.equal(bytes.length,row.bytes);
  if(names.has(row.path)){const actual=fs.readFileSync(physical(root,row.path));
   if(row.role==='test-helper'){const adaptation=validatePreparedPolicyHelper(row,bytes,actual,files.find(file=>file.path===row.path));if(adaptation)projected.find(file=>file.path===row.path).reviewedPreparedAdaptation=adaptation;}
   if(row.preparedCatalogPersonalization){const a=row.preparedCatalogPersonalization;assert(row.role==='catalog-data'&&['auto-best/localization/dealer.reviewed.json','auto-best/localization/generated-manifest.json'].includes(row.path)&&a.schemaVersion===1&&a.kind==='cars-prepared-dealer-catalog-personalization'&&a.retainedActualPreparedBytes===true);assert.equal(a.sourceCommit,SOURCE_COMMIT);assert.equal(a.canonicalPath,'clients/promosale-varna/'+row.path);assert.equal(a.packageTree,'b2144144e88bf43256cfb24435a192e4de7b5620');assert.equal(files.find(file=>file.path===row.path)?.blob,a.preparedBlob);assert.equal(sha(actual),a.preparedSha256);assert.equal(actual.length,a.preparedBytes);}
   projected.find(f=>f.path===row.path).sourceSupplement={blob:row.blob,sha256:row.sha256,consumed:'actual-prepared-package'};
  }else add(row,bytes,'pinned-test-only-supplement');
 }
 return {files:projected.sort((a,b)=>a.path.localeCompare(b.path)),bytes:total,fullStaticAssetCopies:0};
}
function envFor(node) {
 const allowed=['PATH','HOME','USERPROFILE','TMP','TEMP','TMPDIR','SYSTEMROOT','SystemRoot','XDG_CACHE_HOME','COREPACK_HOME'];
 const env=Object.fromEntries(allowed.filter(n=>process.env[n]).map(n=>[n,process.env[n]]));
 return {...env,PATH:path.dirname(node)+path.delimiter+(env.PATH??''),CI:'true',NEXT_TELEMETRY_DISABLED:'1',DATABASE_URL:'',OPENAI_API_KEY:'',TEMPLATE_ADMIN_ENABLED:'false',TEMPLATE_AI_ENABLED:'false'};
}
function pinNode(node,version) {
 assert(path.isAbsolute(node)&&fs.existsSync(node));const result=spawnSync(node,['--version'],{encoding:'utf8'});assert.equal(result.status,0);assert.equal(result.stdout.trim(),'v'+version);return node;
}
function runCommand(item,area,node) {
 const cwd=physical(area,item.key+'/package.json');let args=item.args;
 if(item.packageCli){const require=createRequire(cwd),cli=path.join(path.dirname(require.resolve(item.packageCli+'/package.json')),item.cli);
  assert(cli.startsWith(area+path.sep)&&fs.existsSync(cli),'Pinned installed policy CLI required');args=[cli,...args];}
 const startedAt=new Date().toISOString(),result=spawnSync(node,args,{cwd:path.dirname(cwd),env:envFor(node),encoding:'utf8',timeout:12*60*1000,maxBuffer:2*1024**2});
 const bytes=Buffer.from((result.stdout??'')+(result.stderr??''));assert(bytes.length<=2*1024**2,'Policy log exceeds bound');
 return {name:item.name,key:item.key,args:item.args,supports:item.supports,node:path.basename(node),nodeVersion:item.key==='import'?'24.21.0':'22.23.2',startedAt,finishedAt:new Date().toISOString(),status:result.status===0&&!result.error?'passed':'failed',exitCode:result.status,error:result.error?.message??null,logBytes:bytes};
}
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
export async function runVercelDealerNativePolicy({carsRoot,controlRoot,request,requestSha256,node22,node24,outDirectory}) {
 assert.equal(process.env.GITHUB_ACTIONS,'true','Actual evidence execution is private Actions only');
 const cars=fs.realpathSync(carsRoot),control=fs.realpathSync(controlRoot),r=proof(control,{reference:request,sha256:requestSha256}).value;
 const {importOnly,selectedKeys,selectedCommands}=selectedPolicyScope(r.commandScope);
 if(importOnly){assert(r.importOnlyPolicy&&r.currentPackage);assert.equal(r.importOnlyPolicy.schemaVersion,1);assert.equal(r.importOnlyPolicy.kind,'cars-reviewed-import-only-policy-lease');assert.equal(r.importOnlyPolicy.previousEquivalence.sha256,'ad53a30adfbcc4da1ebb3fbe5a736bd4059605862ac7bf007bbadbfc89332497');assert.equal(r.importOnlyPolicy.sourceCorrection.sha256,'752433ad5491cf323fe8dc37599f57674a8068c8189ba281ccade79f78e4aa8b');assert.equal(r.importOnlyPolicy.commitProof.sha256,'21b994e64797069e881776cf87c55a6ae34de2640bc03c48da021198e519425a');for(const key of ['nativeApproval','hostedApproval','globalReleaseApproval','ownerAccepted'])assert.equal(r.importOnlyPolicy[key],false);}
 assert.equal(process.env.GITHUB_REPOSITORY,r.repository);assert.equal(process.env.GITHUB_REF,'refs/heads/'+r.controller.branch);
 assert.equal(git(control,['rev-parse','HEAD']).trim(),process.env.GITHUB_SHA);assert.equal(r.controller.repository,r.repository);assert.equal(r.controller.branch,'codex/vercel-refresh-control');assert(h40(r.controller.expectedParentCommit));assert.equal(git(control,['rev-parse','HEAD^']).trim(),r.controller.expectedParentCommit);assert.equal(sha(fs.readFileSync(fileURLToPath(import.meta.url))),r.controller.driverSha256);
 assert.equal(git(cars,['rev-parse','HEAD']).trim(),SOURCE_COMMIT);assert.equal(git(cars,['rev-parse',SOURCE_COMMIT+':clients/'+r.dealer]).trim(),r.sourceTree);
 for(const key of six)assert.equal(git(cars,['rev-parse',TEMPLATE_COMMIT+':templates/'+key]).trim(),r.sourceReleases[key].tree);
 const p=proof(control,r.preparedPackage),cp=proof(control,r.compilationInputProof),inventory=proof(control,r.sourceInventory);validatePreparedPolicyPackage(r,p.value,cp.value);assert(same(r.catalogs,inventory.value.catalogs),'Catalog contract descriptor drift');for(const row of inventory.value.files){assert.equal(git(cars,['rev-parse',TEMPLATE_COMMIT+':'+row.sourcePath]).trim(),row.blob,'Supplement source path blob changed');const a=row.preparedResourceAdaptation??row.preparedCatalogPersonalization;if(a)assert.equal(git(cars,['rev-parse',SOURCE_COMMIT+':'+a.canonicalPath]).trim(),a.preparedBlob,'Reviewed prepared adaptation canonical source changed');}
 const moduleFile=(name,hash)=>{assert(h64(hash));const file=physical(cars,name);assert.equal(sha(fs.readFileSync(file)),hash,'Maintained API bytes differ');return file;};
 const exporter=await import(pathToFileURL(moduleFile('scripts/export-dealer.mjs',r.tooling.exporterSha256)).href);
 const native=await import(pathToFileURL(moduleFile('scripts/lib/native-localization.mjs',r.tooling.nativeLocalizationSha256)).href);
 const build=await import(pathToFileURL(moduleFile('scripts/publishing/build-native-service.mjs',r.tooling.nativeBuildSha256)).href);
 assert.equal(sha(fs.readFileSync(physical(control,r.compilationInputProofHelper.reference))),r.compilationInputProofHelper.sha256);
 let policyPackage={packageTree:r.packageTree,packageDigest:r.packageDigest},currentPackageMeta=null,passedCommandEquivalence=null;
 if(r.currentPackage){
  const c=r.currentPackage;assert.equal(git(cars,['rev-parse',c.commit+'^{tree}']).trim(),c.privateTree);
  const row=c.deltaFiles.find(f=>f.path==='.cars-package.json'),bytes=readBlob(cars,row.blob);assert.equal(sha(bytes),row.sha256);currentPackageMeta=JSON.parse(bytes);
  if(importOnly){
   const narrow=r.importOnlyPolicy,validator=await import(pathToFileURL(moduleFile('scripts/lib/vercel-native-import-derivative.mjs',narrow.validatorSha256)).href);
   const receiptRow=c.deltaFiles.find(f=>f.path==='.cars-publish.json'),receiptBytes=readBlob(cars,receiptRow.blob);assert.equal(sha(receiptBytes),receiptRow.sha256);
   const metaDocument={bytes,value:currentPackageMeta},receiptDocument={bytes:receiptBytes,value:JSON.parse(receiptBytes)},basisMetadata=proof(control,narrow.basisMetadata),basisReceipt=proof(control,narrow.basisReceipt),sourceCorrection=proof(control,narrow.sourceCorrection),commitProof=proof(control,narrow.commitProof);
   const rawSourceCommit=Buffer.from(currentPackageMeta.qualification.correctedSourceObject.rawCommit);const current=validator.validateImportCorrectedPackageDocuments(metaDocument,receiptDocument,{basisMetadata,basisReceipt,sourceCorrection,commitProof,rawCommit:rawSourceCommit,reviewedEnvelopeLeases:narrow.reviewedEnvelopeLeases});assert.equal(current.packageTree,c.packageTree);assert.equal(current.packageDigest,c.packageDigest);assert.equal(current.privateTree,c.privateTree);assert.equal(current.meta.sourceCommit,c.correctedSourceCommit);assert.equal(current.q.sourceTree,c.correctedClientTree);
   const baseValidator=await import(pathToFileURL(moduleFile('scripts/lib/vercel-native-current-package.mjs',narrow.basisValidatorSha256)).href),basis=baseValidator.validateCurrentPackageDocuments(basisMetadata,basisReceipt);
   passedCommandEquivalence=validator.importCorrectedPassedCommandEquivalence(proof(control,narrow.previousEquivalence),basis,current,proof(control,narrow.currentObservation).value);
   assert.equal(passedCommandEquivalence.currentPrivateCommit,c.commit);policyPackage={packageTree:current.packageTree,packageDigest:current.packageDigest};
  }else{
   const validatorRow=c.deltaFiles.find(f=>f.path==='scripts/vercel-modern-input-proof.mjs'),validator=await import(pathToFileURL(moduleFile('runtime/vercel-native-policy-derivative-tools/vercel-modern-input-proof.mjs',validatorRow.sha256)).href);
   const proofRow=c.deltaFiles.find(f=>f.path==='scripts/compilation-input-proof.mjs');moduleFile('runtime/vercel-native-policy-derivative-tools/compilation-input-proof.mjs',proofRow.sha256);
   const validated=validator.validateModernDerivativeMetadata(currentPackageMeta,bytes),familyTrees=Object.fromEntries(six.map(key=>[key,git(cars,['rev-parse',c.packageTree+':'+key]).trim()]));validateCurrentPolicyLease(c,currentPackageMeta,validated,familyTrees);policyPackage={packageTree:c.packageTree,packageDigest:c.packageDigest};
  }
 }
 const original=exporter.verifyPackageTree({root:cars,packageTree:policyPackage.packageTree});assert.equal(original.digest,policyPackage.packageDigest);
 const treeRows=git(cars,['ls-tree','-r','-l','-z',policyPackage.packageTree],{encoding:null}).toString('utf8').split('\0').filter(Boolean).map(line=>{const [head,name]=line.split('\t'),[mode,type,blob,bytes]=head.split(/\s+/);assert(type==='blob'&&['100644','100755'].includes(mode));return{path:name,blob,bytes:Number(bytes)};});
 const area=path.resolve(outDirectory);assert(area.startsWith(path.join(cars,'runtime')+path.sep)&&!fs.existsSync(area),'One fresh Cars runtime projection required');
 fs.mkdirSync(area,{recursive:true});const packageRoot=path.join(area,'package'),evidence=path.join(area,'evidence');fs.mkdirSync(evidence);
 const projection=installPolicyProjection({root:packageRoot,files:treeRows,inventory:inventory.value,readBlob:oid=>readBlob(cars,oid),selectedKeys});
 const manifest=JSON.parse(fs.readFileSync(physical(packageRoot,'dealer.json')));assert.equal(manifest.slug,r.dealer);assert.equal(manifest.repository,r.repository);assert.equal(manifest.packaging.version,'5');
 const auditCatalogs=()=>{const files=new Map();for(const key of selectedKeys)for(const descriptor of r.catalogs[key]){const name=key+'/'+descriptor.path;files.set(name,fs.readFileSync(physical(packageRoot,name)));}return Object.fromEntries(selectedKeys.map(key=>[key,native.auditNativeCatalogs(files,key,r.catalogs[key])]));};
 node22=pinNode(node22,'22.23.2');node24=pinNode(node24,'24.21.0');
 const report={schemaVersion:1,kind:'cars-vercel-native-policy-evidence',commandScope:importOnly?'corrected-import-only':'original-three-family-policy',passedCommandEquivalence,reusedSourceCommands:passedCommandEquivalence?.commands??[],fullSourcePolicyAccepted:false,status:'running',executed:true,startedAt:new Date().toISOString(),runId:Number(process.env.GITHUB_RUN_ID),runAttempt:Number(process.env.GITHUB_RUN_ATTEMPT),controller:{...r.controller,commit:process.env.GITHUB_SHA},requestSha256,dealer:r.dealer,repository:r.repository,projectId:r.projectId,sourceCommit:r.currentPackage?.correctedSourceCommit??r.sourceCommit,sourceBasisCommit:r.sourceCommit,sourceTree:r.currentPackage?.correctedClientTree??r.sourceTree,sourceBasisTree:r.sourceTree,sourceRevision:r.sourceRevision,sourceReleases:r.sourceReleases,packageTree:policyPackage.packageTree,packageDigest:policyPackage.packageDigest,derivativePackage:r.currentPackage??null,originalSixCompilationsApplyToCurrentModern:r.currentPackage?false:true,currentModernProviderCompileProofPending:!!r.currentPackage,canonicalSourcePublished:r.currentPackage?false:null,originalPrepareRunId:r.prepareRunId,nativeCompilationSourceRunId:r.nativeCompilationSourceRunId,originalPreparedPackage:r.preparedPackage,compilationInputProof:r.compilationInputProof,compilationInputProofHelper:r.compilationInputProofHelper,projection,catalogs:null,installs:[],sourceCommands:[],nativeChecks:Object.fromEntries(native.NATIVE_CHECKS.map(name=>[name,'pending-complete-actual-evidence'])),nativeCompiles:0,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,ownerAccepted:false,providerMutations:0,sourceWrites:0};
 const reportFile=path.join(evidence,'native-policy.json'),save=()=>fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');save();
 const checkProjection=()=>{for(const row of projection.files)assert.equal(sha(fs.readFileSync(physical(packageRoot,row.path))),row.sha256,'Policy source changed during execution: '+row.path);};
 try {
  report.catalogs=auditCatalogs();save();
  assert.equal(r.installDependencies,true,'Fresh independent runner requires explicit exact-lock installation review');
  // The maintained API owns install commands. Only its first install step runs; no source build, native compile or provider command is invoked.
  for(const key of selectedKeys) {
   const plan=build.nativeBuildPlan(key,manifest.variants.find(v=>v.key===key).base);assert.equal(plan.steps[0][0],key==='modern'?'npx':'npm');
   const node=key==='import'?node24:node22;
   const script=moduleFile('scripts/publishing/build-native-service.mjs',r.tooling.nativeBuildSha256),startedAt=new Date().toISOString();
   const result=spawnSync(node,['--input-type=module','-e',"const b=await import("+JSON.stringify(pathToFileURL(script).href)+");b.runNativeBuild("+JSON.stringify(key)+",{packageRoot:"+JSON.stringify(packageRoot)+",installOnly:true});"],{cwd:packageRoot,env:envFor(node),encoding:'utf8',timeout:15*60*1000,maxBuffer:2*1024**2});
   const log=Buffer.from((result.stdout??'')+(result.stderr??''));assert(log.length<=2*1024**2);const logName=key+'-install.log';fs.writeFileSync(path.join(evidence,logName),log,{flag:'wx'});
   report.installs.push({key,dependencyInstallPerformed:true,nativeCompilation:false,startedAt,finishedAt:new Date().toISOString(),exitCode:result.status,error:result.error?.message??null,log:{reference:logName,sha256:sha(log),bytes:log.length}});save();assert.equal(result.status,0,'Exact-lock family dependency installation failed');assert(!result.error);
  }
  checkProjection();
  for(const item of selectedCommands){const row=runCommand(item,packageRoot,item.key==='import'?node24:node22),logName=item.name+'.log';fs.writeFileSync(path.join(evidence,logName),row.logBytes,{flag:'wx'});const log={reference:logName,sha256:sha(row.logBytes),bytes:row.logBytes.length};delete row.logBytes;report.sourceCommands.push({...row,log});save();assert.equal(row.status,'passed','Maintained source policy command failed: '+item.name);}
  checkProjection();assert.equal(git(cars,['rev-parse','HEAD']).trim(),SOURCE_COMMIT);assert.equal(proof(control,{reference:request,sha256:requestSha256}).value.packageDigest,r.packageDigest);
  report.status=importOnly?'passed-import-only-source-policy':'passed-source-policy';
 }catch(error){report.status='failed';report.error=error.message;}
 report.finishedAt=new Date().toISOString();save();
 const inventoryRows=fs.readdirSync(evidence).filter(n=>n!=='.').map(name=>{const bytes=fs.readFileSync(path.join(evidence,name));return{path:name,bytes:bytes.length,sha256:sha(bytes)};});
 write(path.join(evidence,'evidence-manifest.json'),{schemaVersion:1,kind:'cars-vercel-native-policy-evidence-inventory',files:inventoryRows,nativeCompiles:0,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false});
 return {status:report.status,report:reportFile,sha256:sha(fs.readFileSync(reportFile)),error:report.error??null,nativeCompiles:0,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),options={};for(let i=0;i<args.length;i++){const names={'--cars-root':'carsRoot','--control-root':'controlRoot','--request':'request','--request-sha256':'requestSha256','--node22':'node22','--node24':'node24','--out':'outDirectory'},key=names[args[i]];assert(key&&args[i+1]&&!Object.hasOwn(options,key),'Unknown/repeated policy option');options[key]=args[++i];}const result=await runVercelDealerNativePolicy(options);console.log(JSON.stringify(result,null,2));if(!['passed-source-policy','passed-import-only-source-policy'].includes(result.status))process.exitCode=1;}catch(error){console.error(error.message);process.exitCode=1;}
}
