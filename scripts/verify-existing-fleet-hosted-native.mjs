import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { auditNativeCatalogs, NATIVE_CHECKS } from './lib/native-localization.mjs';
import { APPLICATIONS, FAMILIES, HOSTED_QA_PROFILE, IMPORT_GREP, REQUEST_BASENAME, TEMPLATE_REVISION,
  canonical, parseHelperResults, readRequest, sha256, validateOriginalProofs } from './lib/hosted-native-qa.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const QA_FILES = [
  '.github/workflows/existing-fleet-hosted-native-qa.yml', 'scripts/verify-existing-fleet-hosted-native.mjs',
  'scripts/lib/hosted-native-qa.mjs', 'scripts/verify-existing-fleet-hosted-native.test.mjs',
  'templates/auto-best/scripts/qa-locale-storage.mjs', 'templates/modern/apps/e2e/localization-harness.mjs',
  'templates/modern/apps/e2e/localization-preferences-client.mjs', 'templates/import/tests/localization.e2e.ts'
];
export const CATALOGS = {
  'auto-best': [{format:'typescript-pair',path:'src/lib/locale/catalog.ts',en:'en',bg:'bg'}],
  modern: [
    {format:'typescript-pair',path:'packages/internationalization/preferences-messages.ts',en:'en',bg:'bg'},
    {format:'typescript-pair',path:'packages/internationalization/public-messages.ts',en:'en',bg:'bg'},
    {format:'typescript-rows',path:'packages/marketplace/content/inventory-copy.ts',export:'inventoryCopy'},
    {format:'typescript-locale-object',path:'packages/marketplace-ui/lib/marketplace-control-copy.ts',export:'copyByLanguage'}
  ],
  import: [
    {format:'typescript-pair',path:'src/lib/locale/messages.ts',en:'en',bg:'bg'},
    {format:'typescript-pair',path:'src/lib/i18n/native.ts',en:'nativeEn',bg:'nativeBg'},
    {format:'typescript-pair',path:'src/lib/content/localized.ts',en:'contentEn',bg:'contentBg'},
    {format:'typescript-rows',path:'src/lib/content/inventory-localized.ts',export:'inventoryCopy'},
    {format:'typescript-source-map',path:'src/lib/content/extra-localized.ts',export:'extraEnglish'}
  ]
};
const MODERN_POLICY_TESTS = [
  'packages/security/inventory-credentials.test.ts', 'packages/internationalization/preferences.test.ts',
  'packages/security/proxy.test.ts', 'apps/web/lib/public-form-security.test.ts',
  'packages/marketplace-ui/lib/browser-preferences.test.ts', 'apps/web/lib/public-proxy-policy.test.ts',
  'packages/internationalization/proxy.test.ts', 'apps/web/lib/public-locale-policy.test.ts'
];
const IMPORT_POLICY_TESTS = ['src/lib/locale/policy.spec.ts', 'src/lib/i18n/native.spec.ts',
  'src/lib/i18n/native-source.spec.ts', 'src/lib/i18n/final-review.spec.ts'];
const NORMALIZED = bytes => Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'));
const gitBlob = bytes => createHash('sha1').update(Buffer.from('blob ' + bytes.length + '\0')).update(bytes).digest('hex');
const consumedSourceInput = (key, relative) => {
  if (['package.json','package-lock.json','pnpm-lock.yaml','pnpm-workspace.yaml'].includes(relative)) return true;
  if (key === 'modern') return relative.startsWith('packages/') || relative.startsWith('apps/web/') ||
    relative.endsWith('/package.json') || relative === 'scripts/localization-contract.test.mjs';
  return relative.startsWith('src/') || relative.startsWith('scripts/') || relative.startsWith('tests/') ||
    ['vite.config.ts','svelte.config.js','playwright.config.ts','tsconfig.json'].includes(relative);
};
const git = (root, ...args) => {
  const result = spawnSync('git', args, {cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},encoding:'utf8',maxBuffer:16*1024**2});
  assert.equal(result.status, 0, result.stderr || 'Git read failed'); return result.stdout.trim();
};

export function sourceLeases(root = ROOT, request = null) {
  const leases = [], files = new Map();
  if (request) for (const key of APPLICATIONS) assert.equal(git(root, 'rev-parse', TEMPLATE_REVISION + ':templates/' + key), request.sourceReleases[key].tree, 'Selected S1 subtree differs: ' + key);
  for (const key of Object.keys(FAMILIES)) {
    const prefix = 'templates/' + key + '/';
    const rows = git(root, 'ls-tree', '-r', TEMPLATE_REVISION, '--', prefix).split('\n').filter(Boolean);
    assert(rows.length, 'Missing exact S1 source tree: ' + key);
    for (const line of rows) {
      const match = line.match(/^(\d+) blob ([a-f0-9]{40})\t(.+)$/);
      if (!match || QA_FILES.includes(match[3]) || !consumedSourceInput(key, match[3].slice(prefix.length))) continue;
      const relative = match[3], filename = path.resolve(root, relative);
      assert(fs.existsSync(filename) && fs.realpathSync(filename) === filename && fs.statSync(filename).isFile(), 'Missing physical S1 input: ' + relative);
      const bytes = NORMALIZED(fs.readFileSync(filename));
      assert.equal(gitBlob(bytes), match[2], 'Application/catalog/test/lock input changed from S1: ' + relative);
      leases.push({path:relative,blob:match[2],sha256:sha256(bytes)});
      if (CATALOGS[key].some(item => relative === prefix + item.path)) files.set(key + '/' + relative.slice(prefix.length), bytes);
    }
  }
  return {leases,catalogs:Object.fromEntries(Object.keys(FAMILIES).map(key => [key,auditNativeCatalogs(files,key,CATALOGS[key])]))};
}

export async function githubIdentity(request, {fetchImpl = fetch, token = process.env.GITHUB_TOKEN} = {}) {
  assert(token, 'A read-only GitHub token is required for immutable metadata GETs');
  const get = async suffix => {
    const response = await fetchImpl('https://api.github.com/repos/darkapoparka/cars/' + suffix, {
      method:'GET',redirect:'error',signal:AbortSignal.timeout(30000),headers:{accept:'application/vnd.github+json',authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'}
    });
    assert(response.ok, 'GitHub metadata GET failed: ' + suffix);
    const text = await response.text(); assert(text.length <= 2*1024**2, 'GitHub metadata exceeds bounded limit'); return JSON.parse(text);
  };
  const run = await get('actions/runs/' + request.buildRunId);
  assert(run.id === request.buildRunId && run.run_attempt === request.buildAttempt && run.status === 'completed' && run.conclusion === 'success' &&
    run.head_sha === request.sourceCommit && run.path === '.github/workflows/existing-fleet-cloudflare.yml', 'Exact successful compiled source run required');
  const artifact = await get('actions/artifacts/' + request.artifactId);
  assert(artifact.id === request.artifactId && artifact.expired === false && artifact.workflow_run?.id === request.buildRunId &&
    artifact.workflow_run?.head_sha === request.sourceCommit && artifact.digest === 'sha256:' + request.artifactArchiveDigest, 'Original artifact metadata differs');
  const branch = await get('branches/main'), mainCommit = branch.commit?.sha;
  assert(/^[a-f0-9]{40}$/.test(mainCommit), 'Authenticated main commit missing');
  const comparison = await get('compare/' + request.sourceCommit + '...' + mainCommit);
  assert(['identical','ahead'].includes(comparison.status) && comparison.merge_base_commit?.sha === request.sourceCommit, 'Compiled source is not an ancestor of main');
  const dealerTree = async revision => {
    const commit = await get('git/commits/' + revision);
    const rootTree = await get('git/trees/' + commit.tree.sha);
    const clients = rootTree.tree?.find(row => row.path === 'clients' && row.type === 'tree'); assert(clients, 'Published clients tree missing');
    const clientsTree = await get('git/trees/' + clients.sha);
    return clientsTree.tree?.find(row => row.path === 'priselci' && row.type === 'tree')?.sha;
  };
  assert.equal(await dealerTree(request.sourceCommit), request.sourceTree, 'Authenticated compiled dealer subtree differs');
  if(mainCommit!==request.sourceCommit)assert.equal(await dealerTree(mainCommit),request.sourceTree,'Current main dealer subtree changed from the reviewed build');
  return {checkedAt:new Date().toISOString(),compiledCommit:request.sourceCommit,verifiedMainCommit:mainCommit,runId:run.id,attempt:run.run_attempt,artifactId:artifact.id,artifactArchiveDigest:request.artifactArchiveDigest};
}

export function helperPlan(root, outputRoot, node22, node24) {
  const base = {CARS_HOSTED_QA_PROFILE:HOSTED_QA_PROFILE};
  return [
    {name:'auto-best-storage',node:node22,cwd:path.join(root,'templates/auto-best'),args:['scripts/qa-locale-storage.mjs'],
      env:{...base,LOCALE_QA_MOUNT:'',LOCALE_QA_WIDTHS:'320,390,1440',LOCALE_QA_OUT:path.join(outputRoot,'auto-best/storage')},result:'auto-best/storage/RESULTS.json'},
    {name:'auto-best-races',node:node22,cwd:path.join(root,'templates/auto-best'),args:['scripts/qa-locale-races.mjs'],
      env:{...base,LOCALE_QA_DESIGNS:'auto-best',LOCALE_QA_SCENARIOS:'cancel-pending-save,immediate-dismiss,reject-external-destination,reopen-pending-dismiss',LOCALE_QA_OUT:path.join(outputRoot,'auto-best/races')},result:'auto-best/races/RESULTS.json'},
    {name:'modern',node:node22,cwd:path.join(root,'templates/modern/apps/e2e'),args:['localization-preferences-client.mjs'],
      env:{...base,LOCALE_QA_MOUNT:'/variant-2',LOCALE_QA_OUT:path.join(outputRoot,'modern')},result:'modern/results.json'},
    {name:'import',node:node24,cwd:path.join(root,'templates/import'),packageCli:'@playwright/test',cli:'cli.js',
      args:['test','tests/localization.e2e.ts','--project=desktop','--workers=1','--retries=0','--reporter=json','--grep',IMPORT_GREP,'--output',path.join(outputRoot,'import/results')],
      env:{...base,PLAYWRIGHT_SKIP_WEBSERVER:'1',LOCALE_FIXTURE_BASE:'/variant-3',CARS_HOSTED_QA_IMPORT_OUTPUT:path.join(outputRoot,'import'),PLAYWRIGHT_JSON_OUTPUT_FILE:path.join(outputRoot,'import/results.json')},result:'import/results.json'}
  ];
}

function childEnvironment(overrides, node) {
  const env = Object.fromEntries(['PATH','HOME','USERPROFILE','TMP','TEMP','TMPDIR','SYSTEMROOT','SystemRoot','PLAYWRIGHT_BROWSERS_PATH','XDG_CACHE_HOME'].filter(name=>process.env[name]).map(name=>[name,process.env[name]]));
  return {...env,PATH:path.dirname(node)+path.delimiter+(env.PATH??''),CI:'true',NEXT_TELEMETRY_DISABLED:'1',DATABASE_URL:'',OPENAI_API_KEY:'',TEMPLATE_ADMIN_ENABLED:'false',TEMPLATE_AI_ENABLED:'false',...overrides};
}
function packageCli(cwd, name, cli) {
  const require = createRequire(path.join(cwd,'package.json'));
  const file = path.join(path.dirname(require.resolve(name+'/package.json')),cli);
  assert(fs.existsSync(file), 'Installed pinned CLI missing: '+name); return file;
}
function runCommand(item, outputRoot, env = {}) {
  const args = item.packageCli ? [packageCli(item.cwd,item.packageCli,item.cli),...item.args] : item.args;
  const startedAt = new Date().toISOString();
  const result = spawnSync(item.node,args,{cwd:item.cwd,env:childEnvironment({...item.env,...env},item.node),encoding:'utf8',maxBuffer:8*1024**2,timeout:12*60*1000});
  const logfile = path.join(outputRoot,'evidence',item.name+'.log');
  fs.writeFileSync(logfile,(result.stdout??'')+(result.stderr??''),{flag:'wx'});
  return {name:item.name,args:args.map(arg=>path.isAbsolute(arg)?path.relative(ROOT,arg):arg),startedAt,finishedAt:new Date().toISOString(),exitCode:result.status,error:result.error?.message??null,log:{path:path.relative(outputRoot,logfile).replaceAll('\\','/'),sha256:sha256(fs.readFileSync(logfile))}};
}
function sourceCommands(root,node22,node24) {
  const ab=path.join(root,'templates/auto-best'),modern=path.join(root,'templates/modern'),im=path.join(root,'templates/import');
  return [
    {name:'auto-best-catalog-check',node:node22,cwd:ab,args:['scripts/build-locales.mjs','--check']},
    {name:'auto-best-source-audit',node:node22,cwd:ab,args:['scripts/locale-source-audit.mjs']},
    {name:'auto-best-native-policy-tests',node:node22,cwd:ab,args:['--test','--test-concurrency=1','scripts/locale-policy.test.mjs','scripts/locale-copy-audit.test.mjs','scripts/locale-catalog.test.mjs','scripts/locale-source-audit.test.mjs','scripts/locale-mobile-copy.test.mjs']},
    {name:'modern-catalog-source-contracts',node:node22,cwd:modern,args:['--test','scripts/localization-contract.test.mjs']},
    {name:'modern-native-policy-tests',node:node22,cwd:modern,packageCli:'vitest',cli:'vitest.mjs',args:['run','--config','apps/web/vitest.config.mts',...MODERN_POLICY_TESTS]},
    {name:'import-native-policy-tests',node:node24,cwd:im,packageCli:'vitest',cli:'vitest.mjs',args:['run',...IMPORT_POLICY_TESTS]}
  ];
}
function executable(node, expected) {
  assert(path.isAbsolute(node??'') && fs.existsSync(node), 'Qualified Node executable required');
  const r=spawnSync(node,['--version'],{encoding:'utf8'});assert.equal(r.status,0);assert.equal(r.stdout.trim(),expected,'Qualified Node version differs');return node;
}
function fileInventory(directory, relative='') {
  const rows=[];
  for(const entry of fs.readdirSync(path.join(directory,relative),{withFileTypes:true})) {
    const name=path.posix.join(relative,entry.name),file=path.join(directory,name);
    assert(!entry.isSymbolicLink(),'Evidence links are prohibited');
    if(entry.isDirectory())rows.push(...fileInventory(directory,name));
    else if(entry.isFile()){const bytes=fs.readFileSync(file);rows.push({path:name,bytes:bytes.length,sha256:sha256(bytes)});}
  }
  return rows.sort((a,b)=>a.path.localeCompare(b.path));
}

export async function verifyHostedNative({root=ROOT,basename=REQUEST_BASENAME,requestSha256,run=false}={}) {
  const original=readRequest(root,basename,requestSha256),request=original.request;
  const proofs=validateOriginalProofs(root,request),sources=sourceLeases(root,request);
  if(!run)return {type:'cars-existing-fleet-hosted-native-qa-plan',requestSha256,sourceCommit:request.sourceCommit,sourceTree:request.sourceTree,versionId:request.versionId,browserCases:55,sourceLeaseCount:sources.leases.length,liveRequests:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
  assert(process.version==='v26.10.0'&&process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_REPOSITORY==='darkapoparka/cars'&&process.env.GITHUB_EVENT_NAME==='workflow_dispatch','Live QA is restricted to the reviewed isolated Actions job');
  assert(process.env.RUNNER_TEMP&&path.isAbsolute(process.env.RUNNER_TEMP),'Physical Actions temporary root required');
  const temp=fs.realpathSync(process.env.RUNNER_TEMP),id=process.env.GITHUB_RUN_ID,attempt=process.env.GITHUB_RUN_ATTEMPT;
  assert(/^[1-9][0-9]*$/.test(id??'')&&/^[1-9][0-9]*$/.test(attempt??''),'Exact QA run identity required');
  const outputRoot=path.join(temp,'cars-hosted-native-qa',id+'-'+attempt);
  assert(!fs.existsSync(outputRoot),'Refusing to overwrite earlier QA evidence');fs.mkdirSync(path.join(outputRoot,'evidence'),{recursive:true});
  const node22=executable(process.env.CARS_QA_NODE22,'v22.23.2'),node24=executable(process.env.CARS_QA_NODE24,'v24.21.0');
  const report={schemaVersion:1,type:'cars-existing-fleet-hosted-native-qa-evidence',status:'running',startedAt:new Date().toISOString(),qaRunId:Number(id),qaAttempt:Number(attempt),qaToolCommit:git(root,'rev-parse','HEAD'),requestSha256,
    identity:request,nativeChecks:Object.fromEntries(NATIVE_CHECKS.map(name=>[name,'pending-complete-evidence'])),sourceCatalogs:sources.catalogs,sourceLeases:sources.leases,
    qaToolFiles:QA_FILES.map(name=>({path:name,sha256:sha256(NORMALIZED(fs.readFileSync(path.join(root,name))))})),
    nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,ownerAccepted:false,providerMutations:0,dealerDataWrites:0,activeVersionRecheckAfter:'required',sourceCommands:[],browserSuites:[]};
  const reportFile=path.join(outputRoot,'evidence','hosted-native-qa.json'),save=()=>fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');save();
  try {
    report.githubBefore=await githubIdentity(request);
    const runtimePin={schemaVersion:1,type:'cars-hosted-native-qa-runtime-pin',profile:HOSTED_QA_PROFILE,client:request.client,workerName:request.workerName,publicOrigin:request.publicOrigin,sourceCommit:request.sourceCommit,sourceTree:request.sourceTree,versionId:request.versionId,artifactDigest:request.artifactDigest,outputDigest:request.outputDigest,requestSha256,outputRoot};
    const pinFile=path.join(outputRoot,'runtime-pin.json'),pinBytes=Buffer.from(JSON.stringify(runtimePin,null,2)+'\n');fs.writeFileSync(pinFile,pinBytes,{flag:'wx'});
    const commonEnv={CARS_HOSTED_QA_PIN_FILE:pinFile,CARS_HOSTED_QA_PIN_SHA256:sha256(pinBytes),DEALER_BASE_URL:request.publicOrigin,LOCALE_QA_ORIGIN:request.publicOrigin,PLAYWRIGHT_BASE_URL:request.publicOrigin};
    const reachability=await fetch(request.publicOrigin+'/en/contact',{redirect:'error',signal:AbortSignal.timeout(30000)});assert.equal(reachability.status,200,'Public pilot unreachable before QA');await reachability.arrayBuffer();
    for(const item of sourceCommands(root,node22,node24)){const result=runCommand(item,outputRoot);report.sourceCommands.push(result);save();assert.equal(result.exitCode,0,'Source command failed: '+item.name);}
    for(const item of helperPlan(root,outputRoot,node22,node24)) {
      fs.mkdirSync(path.dirname(path.join(outputRoot,item.result)),{recursive:true});
      const result=runCommand(item,outputRoot,commonEnv),file=path.join(outputRoot,item.result);
      const suite={...result,cases:[],caseCount:0,passed:0,failed:0,
        endpointScope:item.name==='auto-best-races'?'mocked preference latency/destination; actual hosted component':item.name==='modern'?'live native no-JS forms; controlled client responses mocked':'live preference endpoint; named storage/cookie/race simulations'};
      report.browserSuites.push(suite);save();
      assert(fs.existsSync(file),'Original helper results missing: '+item.name);
      const cases=parseHelperResults(item.name,JSON.parse(fs.readFileSync(file,'utf8')));
      Object.assign(suite,{cases,caseCount:cases.length,passed:cases.filter(entry=>entry.passed).length,failed:cases.filter(entry=>!entry.passed).length});
      save();assert.equal(result.exitCode,0,'Browser helper failed: '+item.name);assert(cases.length&&suite.failed===0,'Browser assertions failed: '+item.name);
    }
    report.githubAfter=await githubIdentity(request);
    const after=await fetch(request.publicOrigin+'/en/contact',{redirect:'error',signal:AbortSignal.timeout(30000)});assert.equal(after.status,200,'Public pilot unreachable after QA');await after.arrayBuffer();
    assert.equal(sha256(fs.readFileSync(original.file)),requestSha256,'Request changed during QA');
    validateOriginalProofs(root,request,{fresh:false});sameSourceLeases(report.sourceLeases,sourceLeases(root,request).leases);
    for(const file of report.qaToolFiles)assert.equal(sha256(NORMALIZED(fs.readFileSync(path.join(root,file.path)))),file.sha256,'QA helper changed during execution');
    const boundaryFiles=fileInventory(outputRoot).filter(row=>row.path.endsWith('/network-boundary.jsonl'));
    for(const row of boundaryFiles)for(const line of fs.readFileSync(path.join(outputRoot,row.path),'utf8').trim().split('\n').filter(Boolean))assert.equal(JSON.parse(line).decision,'blocked-third-party-read-rpc','Prohibited business write was attempted');
    report.browserCases=report.browserSuites.reduce((n,suite)=>n+suite.caseCount,0);assert.equal(report.browserCases,55,'Required browser coverage incomplete');
    report.status='awaiting-provider-recheck';
  } catch(error) {report.status='failed';report.error=error.message;}
  report.finishedAt=new Date().toISOString();save();
  const rawRows=fileInventory(outputRoot).filter(row=>/\.json$|\.jsonl$/.test(row.path)&&!row.path.startsWith('evidence/'));
  for(const [index,row] of rawRows.entries())fs.copyFileSync(path.join(outputRoot,row.path),path.join(outputRoot,'evidence',String(index).padStart(3,'0')+'-'+row.path.replaceAll('/','-')));
  if(report.status==='failed') {
    const captures=fileInventory(outputRoot).filter(row=>/\.png$|trace\.zip$/.test(row.path)&&row.bytes<=16*1024**2).slice(0,4);
    for(const [index,row] of captures.entries())fs.copyFileSync(path.join(outputRoot,row.path),path.join(outputRoot,'evidence','failure-'+index+'-'+path.basename(row.path)));
    report.retainedFailureEvidence=captures;save();
  }
  const inventory=fileInventory(path.join(outputRoot,'evidence'));
  fs.writeFileSync(path.join(outputRoot,'evidence','evidence-manifest.json'),JSON.stringify({schemaVersion:1,type:'cars-hosted-native-qa-evidence-inventory',files:inventory,digest:sha256(JSON.stringify(inventory)),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false},null,2)+'\n',{flag:'wx'});
  return {outputRoot,report:reportFile,status:report.status,error:report.error??null,browserCases:report.browserCases??report.browserSuites.reduce((n,suite)=>n+suite.caseCount,0),sha256:sha256(fs.readFileSync(reportFile)),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
}
function sameSourceLeases(left,right){assert.equal(canonical(left),canonical(right),'S1 source input changed during QA');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);if(args.includes('--help'))console.log('Usage: node scripts/verify-existing-fleet-hosted-native.mjs --request priselci-request.json --sha256 RAW_SHA256 [--run]. Default validates exact reviewed proofs and prints a plan without live requests. --run requires the isolated manual Actions job; all release approvals remain false.');
    else {const options={};for(let i=0;i<args.length;i++){if(args[i]==='--run'){assert(!options.run);options.run=true;}else{assert(['--request','--sha256'].includes(args[i])&&args[i+1],'Unknown QA option');const key=args[i]==='--request'?'basename':'requestSha256';assert(!options[key],'Repeated QA option');options[key]=args[++i];}}assert(options.requestSha256,'Expected request SHA256 required');const result=await verifyHostedNative(options);console.log(JSON.stringify(result,null,2));if(result.status==='failed')process.exitCode=1;}
  }catch(error){console.error(error.message);process.exitCode=1;}
}
