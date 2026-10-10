import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { sha256, normalized, filesAt, inside, writeJson } from './workflow.mjs';

export const UK_FAMILY_NODES = Object.freeze({
  'auto-best':'22.23.2', modern:'22.23.2', import:'24.21.0',
  app:'22.23.2', mobile:'22.23.2', 'karento-best':'26.10.0', router:'22.23.2'
});
export const UK_NEXT_FAMILIES = new Set(['modern','app','mobile']);
export const safeArtifactPath = value => typeof value === 'string' && value.length > 0 &&
  !/[\\:\u0000-\u001f\u007f]/.test(value) && !value.startsWith('/') &&
  value.split('/').every(part => part && part !== '.' && part !== '..');

export function parseQualificationRuns(value) {
  const values = typeof value === 'string' ? value.split(',').map(item => item.trim()) : [];
  if (!values.length || values.length > 8 || values.some(item => !/^[1-9][0-9]{0,14}$/.test(item)) ||
      new Set(values).size !== values.length) throw Error('Use one to eight distinct numeric qualification run IDs.');
  return values;
}

export function validateFileInventory(manifest) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.files) || !manifest.files.length ||
      new Set(manifest.files.map(row => row.path)).size !== manifest.files.length ||
      manifest.files.some(row => !safeArtifactPath(row.path) || !/^[a-f0-9]{64}$/.test(row.sha256 ?? '') ||
        !Number.isSafeInteger(row.bytes) || row.bytes < 0) ||
      manifest.digest !== sha256(JSON.stringify(manifest.files)) ||
      manifest.bytes !== manifest.files.reduce((sum,row) => sum + row.bytes,0)) throw Error('Artifact file inventory is malformed or changed.');
  return manifest;
}

export function verifyInventoryBytes(manifest, name, bytes) {
  validateFileInventory(manifest);
  const rows = manifest.files.filter(row => row.path === name);
  if (rows.length !== 1 || rows[0].bytes !== bytes.length || rows[0].sha256 !== sha256(bytes)) {
    throw Error('Artifact receipt bytes differ: ' + name);
  }
}

export function validateQualification({key, run, artifact, manifest, source, qualification, frozen}, expected) {
  if (!Object.hasOwn(UK_FAMILY_NODES,key) || key === 'router' || run.event !== 'workflow_dispatch' ||
      run.head_branch !== 'main' || run.repository?.full_name !== 'darkapoparka/cars' ||
      run.head_repository?.full_name !== 'darkapoparka/cars' ||
      run.path !== '.github/workflows/qualify-cloudflare-templates.yml' ||
      !/^[a-f0-9]{40}$/.test(run.head_sha ?? '') ||
      artifact.workflow_run?.id !== run.id || artifact.workflow_run?.head_sha !== run.head_sha ||
      artifact.expired || !/^sha256:[a-f0-9]{64}$/.test(artifact.digest ?? '')) {
    throw Error('Qualification is not an immutable manual Cars main artifact: ' + key);
  }
  const q = qualification, pinned = source.source;
  if (q.schemaVersion !== 1 || q.status !== 'passed' || q.key !== key || q.repository !== 'darkapoparka/cars' ||
      q.commit !== run.head_sha || String(q.runId) !== String(run.id) || q.node !== 'v' + UK_FAMILY_NODES[key] ||
      q.hosted !== false || q.publishingReady !== false ||
      artifact.name !== 'cloudflare-qualification-' + key + '-' + run.id + '-' + q.attempt ||
      manifest.key !== key || manifest.commit !== run.head_sha || manifest.status !== 'passed' ||
      source.key !== key || pinned?.repository !== 'darkapoparka/cars' || pinned.path !== 'templates/' + key ||
      ['revision','tree','digest'].some(field => pinned[field] !== expected[field]) ||
      source.release?.status !== 'approved' || source.dealerAdoption !== false || source.publishingReady !== false) {
    throw Error('Qualification receipt does not prove this exact approved family: ' + key);
  }
  const phases = UK_NEXT_FAMILIES.has(key) ? ['install-' + key,'build-' + key,'freeze-' + key] :
    [key + '-dependencies',key + '-build',key + '-dry-run','freeze'];
  if (!Array.isArray(q.steps) || q.steps.some(step => step.status !== 'passed') ||
      phases.some(phase => q.steps.filter(step => step.phase === phase).length !== 1)) {
    throw Error('Qualification has missing or failed build/freeze phases: ' + key);
  }
  validateFileInventory(manifest);
  const lock = UK_NEXT_FAMILIES.has(key) ? frozen : frozen[key];
  if (!lock || lock.schemaVersion !== 1 || (UK_NEXT_FAMILIES.has(key) && lock.key !== key)) throw Error('Missing qualified frozen lock: ' + key);
  return lock;
}

export function artifactInventory(directory, identity = {}) {
  const files = filesAt(directory,{filter:()=>true}).filter(name => name !== 'artifact-manifest.json').map(name => {
    const bytes = fs.readFileSync(inside(directory,name,{mustExist:true}));
    return {path:name,bytes:bytes.length,sha256:sha256(bytes)};
  });
  const manifest = {schemaVersion:1,...identity,digest:sha256(JSON.stringify(files)),
    bytes:files.reduce((sum,row)=>sum+row.bytes,0),files};
  writeJson(path.join(directory,'artifact-manifest.json'),manifest);
  return manifest;
}

export function verifyArtifactDirectory(directory) {
  const manifest = validateFileInventory(JSON.parse(fs.readFileSync(inside(directory,'artifact-manifest.json',{mustExist:true}),'utf8')));
  const actual = filesAt(directory,{filter:()=>true}).filter(name=>name!=='artifact-manifest.json');
  if (JSON.stringify(actual) !== JSON.stringify(manifest.files.map(row=>row.path).sort())) throw Error('Artifact contains missing or undeclared files.');
  for (const row of manifest.files) verifyInventoryBytes(manifest,row.path,fs.readFileSync(inside(directory,row.path,{mustExist:true})));
  return manifest;
}

export function copyBuildArtifact(from, to) {
  const stat = fs.lstatSync(from);
  if (stat.isSymbolicLink()) throw Error('Linked build artifact requires review: ' + from);
  if (stat.isDirectory()) {
    fs.mkdirSync(to,{recursive:true});
    for (const name of fs.readdirSync(from).sort()) {
      if (['.git','node_modules'].includes(name) || name.startsWith('.env') || name.startsWith('.dev.vars')) throw Error('Private/dependency file in compiled output.');
      copyBuildArtifact(path.join(from,name),path.join(to,name));
    }
  } else if (stat.isFile()) {
    fs.mkdirSync(path.dirname(to),{recursive:true});
    fs.copyFileSync(from,to,fs.constants.COPYFILE_EXCL);
  } else throw Error('Unsupported compiled output: ' + from);
}

export function readZipFile(archive, name) {
  if (!safeArtifactPath(name)) throw Error('Unsafe ZIP receipt path.');
  const list = spawnSync('unzip',['-Z1',archive],{encoding:'utf8',maxBuffer:16*1024**2});
  if (list.error || list.status !== 0 || list.stdout.split(/\r?\n/).filter(line=>line===name).length !== 1) {
    throw Error('ZIP receipt is absent or repeated: ' + name);
  }
  const result = spawnSync('unzip',['-p',archive,name],{maxBuffer:32*1024**2});
  if (result.error || result.status !== 0) throw Error('Cannot read bounded ZIP receipt: ' + name);
  return result.stdout;
}

export function assertCompiledConfig(config,target,{router=false}={}) {
  if (![target.config,target.main,target.assets].every(safeArtifactPath) ||
      typeof config.main !== 'string' || typeof config.assets?.directory !== 'string' ||
      [config.main,config.assets.directory].some(value=>!value || /[\\:\u0000-\u001f\u007f]/.test(value) || value.startsWith('/')) ||
      path.posix.normalize(path.posix.join(path.posix.dirname(target.config),config.main)) !== target.main ||
      path.posix.normalize(path.posix.join(path.posix.dirname(target.config),config.assets.directory)) !== target.assets ||
      config.name !== target.workerName || config.workers_dev !== router || config.assets.binding !== 'ASSETS') {
    throw Error('Emitted Wrangler config differs from the sealed target name, entry, assets or exposure.');
  }
  return {name:config.name,main:target.main,assets:target.assets,workersDev:config.workers_dev};
}

export function generatedBuildPath(name) {
  const roots='(?:auto-best|import|app|mobile|karento-best|cloudflare|modern|modern/(?:apps|packages)/[^/]+)';
  if (new RegExp('^'+roots+'/node_modules(?:/|$)').test(name)) return true;
  if (/^\.cars-build-assets(?:\/|$)/.test(name)) return true;
  if (/^(?:auto-best|import|karento-best)\/(?:\.svelte-kit|\.cars-cloudflare)(?:\/|$)/.test(name)) return true;
  if (/^(?:app|mobile|modern\/apps\/web)\/(?:dist|\.vinext|\.cloudflare|\.next[^/]*)(?:\/|$)/.test(name)) return true;
  if (new RegExp('^'+roots+'/(?:\\.wrangler|\\.turbo|\\.cache|\\.pnpm-store|\\.runtime)(?:/|$)').test(name)) return true;
  if (/^modern\/packages\/database\/generated(?:\/|$)/.test(name)) return true;
  return /^(?:app|mobile|modern\/apps\/web)\/(?:next-env\.d\.ts|tsconfig\.tsbuildinfo)$/.test(name);
}
export function assertPackagePayload(directory, meta, packageSha256) {
  if (sha256(fs.readFileSync(path.join(directory,'.cars-package.json'))) !== packageSha256 ||
      meta.payloadDigest !== sha256(JSON.stringify(meta.payload))) throw Error('Package identity changed during build.');
  const expected = new Set(['.cars-package.json',...meta.payload.map(row=>row.path)]);
  for (const row of meta.payload) {
    if (!safeArtifactPath(row.path)) throw Error('Unsafe sealed package path.');
    const absolute = inside(directory,row.path,{mustExist:true}), stat = fs.lstatSync(absolute);
    if (!stat.isFile() || stat.isSymbolicLink() || sha256(normalized(fs.readFileSync(absolute))) !== row.sha256) {
      throw Error('Sealed package payload changed during build: ' + row.path);
    }
  }
  // Verify every declared byte, then allow only the existing explicit build/cache
  // namespaces and generated compiler receipts. Unknown added source is a failure.
  const visit = (absolute,prefix='') => {
    for (const item of fs.readdirSync(absolute,{withFileTypes:true})) {
      const name = prefix + item.name;
      if (item.isSymbolicLink()) throw Error('Linked package input appeared: ' + name);
      if (generatedBuildPath(name)) continue;
      if (item.isDirectory()) visit(path.join(absolute,item.name),name+'/');
      else if (!expected.has(name) && !/^\.cars-next-(?:modern|app|mobile)-(?:dependencies|frozen-lock)\.json$/.test(name)) {
        throw Error('Undeclared source appeared during build: ' + name);
      }
    }
  };
  visit(directory);
  return {payloadDigest:meta.payloadDigest,files:meta.payload.length,unchanged:true};
}

export async function downloadGitHubArchive(artifact, destination, token) {
  if (!/^sha256:[a-f0-9]{64}$/.test(artifact.digest ?? '') || !Number.isSafeInteger(artifact.size_in_bytes) ||
      artifact.size_in_bytes <= 0 || artifact.size_in_bytes > 2*1024**3) throw Error('Artifact archive size/digest needs review.');
  const response = await fetch('https://api.github.com/repos/darkapoparka/cars/actions/artifacts/' + artifact.id + '/zip',{
    headers:{Authorization:'Bearer ' + token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10'},
    redirect:'manual',signal:AbortSignal.timeout(30000)
  });
  if (response.status !== 302) throw Error('GitHub artifact download did not provide its temporary archive: HTTP ' + response.status);
  const location = new URL(response.headers.get('location'));
  if (location.protocol !== 'https:' || location.username || location.password) throw Error('Invalid GitHub archive transport.');
  // Do not forward the repository credential to signed storage URLs.
  const archive = await fetch(location,{redirect:'error',signal:AbortSignal.timeout(10*60*1000)});
  if (!archive.ok || !archive.body) throw Error('Artifact storage download failed: HTTP ' + archive.status);
  const fd = fs.openSync(destination,'wx'), digest = createHash('sha256'); let bytes = 0;
  try {
    for await (const chunk of archive.body) {
      bytes += chunk.length;
      if (bytes > artifact.size_in_bytes + 1024) throw Error('Artifact archive exceeded its declared size.');
      digest.update(chunk); fs.writeSync(fd,chunk);
    }
  } finally {fs.closeSync(fd);}
  const actual = digest.digest('hex');
  if (bytes !== artifact.size_in_bytes || 'sha256:' + actual !== artifact.digest) throw Error('GitHub archive SHA-256/size differs.');
  return {path:path.basename(destination),bytes,sha256:actual};
}
