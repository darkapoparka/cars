import {auditNextTraces,auditVercelOutput} from './vercel-output-budget.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const normalize = bytes => { const text = bytes.toString('utf8'); return Buffer.from(text).equals(bytes) ? Buffer.from(text.replaceAll('\r\n', '\n')) : bytes; };
const roots = { 'auto-best': 'auto-best/static', modern: 'modern/apps/web/public', carwow: 'carwow/static', import: 'import/static', app: 'app/public' };
const read = name => JSON.parse(fs.readFileSync(name, 'utf8'));
function checkedFile(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.startsWith('/') || relative.includes('\\') || relative.split('/').some(s => !s || s === '.' || s === '..' || s.includes(':'))) throw Error('Unsafe generated asset path');
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) return null;
    if (fs.lstatSync(current).isSymbolicLink()) throw Error('Linked generated asset path');
  }
  if (!fs.statSync(current).isFile()) throw Error('Expected generated asset file');
  return current;
}
function loadPlan(root, key) {
  root = fs.realpathSync(root);
  for (let parent = root; ; parent = path.dirname(parent)) {
    if (fs.existsSync(path.join(parent, 'templates.lock.json')) && !root.startsWith(path.join(parent, 'runtime') + path.sep)) throw Error('Refusing to prune canonical template or dealer source');
    if (parent === path.dirname(parent)) break;
  }
  const pkg = read(path.join(root, '.cars-package.json')), dealer = read(path.join(root, 'dealer.json'));
  const bytes = fs.readFileSync(path.join(root, '.cars-vercel-assets.json'));
  const seal = pkg.payload?.find(e => e.path === '.cars-vercel-assets.json');
  if (!seal || seal.sha256 !== hash(normalize(bytes))) throw Error('Vercel asset plan is not sealed by the publishing package');
  const plan = JSON.parse(bytes), variant = plan.variants?.find(v => v.key === key);
  if (plan.schemaVersion !== 1 || plan.dealer !== dealer.slug || pkg.manifest?.slug !== dealer.slug || !variant || !roots[key]) throw Error('Vercel asset package identity mismatch');
  return { root, plan, variant };
}
function publicStats(root) {
  const stack = [root]; let files = 0, bytes = 0;
  while (stack.length) {
    const dir = stack.pop();
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, item.name);
      if (item.isSymbolicLink()) throw Error('Linked public output');
      if (item.isDirectory()) stack.push(name);
      else if (item.isFile()) { files++; bytes += fs.statSync(name).size; }
    }
  }
  return { files, bytes };
}
/** Invoked only in an exact, generated publishing package, never a template/master. */
export function prepareServiceAssets(phase, key, { packageRoot = path.resolve(import.meta.dirname, '..') } = {}) {
  if (!['before', 'after'].includes(phase)) throw Error('Expected before or after');
  const { root, plan, variant } = loadPlan(packageRoot, key);
  const isNext = key === 'modern' || key === 'app';
  const entries = plan.removals.filter(e => e.service === key);
  const reportDir = path.join(root, '.cars-build-assets');
  if (fs.existsSync(reportDir) && fs.lstatSync(reportDir).isSymbolicLink()) throw Error('Linked report output');
  const targets = [], previouslyOmitted = [];
  if (phase === 'before' && key === 'auto-best') {
    const copies = plan.objects.map(object => {
      const source = checkedFile(root, object.path);
      if (!source || hash(fs.readFileSync(source)) !== object.sha256 || fs.statSync(source).size !== object.bytes) throw Error('Shared media source differs from sealed plan');
      if (!object.publicPath.startsWith('auto-best/static/_cars/media/' + plan.dealer + '/')) throw Error('Invalid shared media public target');
      const existing = checkedFile(root, object.publicPath);
      if (existing && hash(fs.readFileSync(existing)) !== object.sha256) throw Error('Shared public target contains different bytes');
      return { source, destination: path.join(root, object.publicPath) };
    });
    for (const copy of copies) { fs.mkdirSync(path.dirname(copy.destination), {recursive:true}); fs.copyFileSync(copy.source,copy.destination); }
  }
  if (phase === 'before') {
    for (const e of entries) {
      const file = checkedFile(root, e.sourcePath);
      if (!file || hash(fs.readFileSync(file)) !== e.sha256 || fs.statSync(file).size !== e.bytes) throw Error('Source asset differs from sealed plan: ' + e.sourcePath);
      if (isNext) targets.push({ ...e, file });
    }
  } else if (isNext) {
    const before = read(path.join(reportDir, key + '.before.json'));
    if (before.planHash !== hash(fs.readFileSync(path.join(root, '.cars-vercel-assets.json')))) throw Error('Asset plan changed during build');
    for (const e of entries) if (checkedFile(root, e.sourcePath)) throw Error('Removed Next public asset was reintroduced: ' + e.relative);
  } else {
    const output = key + '/.vercel/output/static/';
    const reportPath = path.join(root, key, '.svelte-kit/cars-public-assets/retention.json');
    const retention = fs.existsSync(reportPath) ? read(reportPath) : null;
    for (const e of entries) {
      const original = checkedFile(root, e.sourcePath);
      if (!original || hash(fs.readFileSync(original)) !== e.sha256) throw Error('Svelte source changed during build: ' + e.sourcePath);
      const candidates = [...new Set([output + e.relative, ...(variant.base ? [output + variant.base.slice(1) + '/' + e.relative] : [])])];
      const found = candidates.map(rel => checkedFile(root, rel)).filter(Boolean);
      if (!found.length) {
        if (e.reason !== 'reviewed-unused' || !retention?.omitted?.some(o => o.path === e.relative && o.sha256 === e.sha256)) throw Error('Expected built public asset is missing: ' + e.relative);
        previouslyOmitted.push(e.relative); continue;
      }
      for (const file of found) {
        if (hash(fs.readFileSync(file)) !== e.sha256 || fs.statSync(file).size !== e.bytes) throw Error('Built public asset differs: ' + e.relative);
        targets.push({ ...e, file });
      }
    }
  }
  // All selected bytes have been checked before the first generated-file removal.
  for (const e of targets) fs.unlinkSync(e.file);
  const report = { schemaVersion: 1, service: key, phase, planHash: hash(fs.readFileSync(path.join(root, '.cars-vercel-assets.json'))), prunedFiles: targets.length, prunedBytes: targets.reduce((n, e) => n + e.bytes, 0), previouslyOmitted };
  if (phase === 'after') {
    const publicRoot = path.join(root, isNext ? roots[key] : key + '/.vercel/output/static');
    report.public = publicStats(publicRoot);
    const serviceRoot=path.join(root,key==='modern'?'modern/apps/web':key);
    let distDir=process.env.NEXT_DIST_DIR;
    if(isNext&&!distDir){
      const outputs=fs.readdirSync(serviceRoot,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^\.next[a-zA-Z0-9_-]*$/.test(e.name)&&fs.existsSync(path.join(serviceRoot,e.name,'BUILD_ID'))).map(e=>e.name);
      if(outputs.length!==1) throw Error('Expected one fresh production Next output; set NEXT_DIST_DIR explicitly for a reviewed custom build');
      distDir=outputs[0];
    }
    report.runtime=isNext?auditNextTraces(serviceRoot,{traceRoot:key==='modern'?path.join(root,'modern'):serviceRoot,distDir}):auditVercelOutput(path.join(serviceRoot,'.vercel/output'));
    if(!report.runtime.passed) throw Error('Vercel runtime artifact failed storage/security budget: '+JSON.stringify(report.runtime));
    if (report.public.bytes > plan.limits.maxPublicBytes) throw Error('Final Vercel service public output exceeds the deployment asset budget');
    if (key === 'auto-best') for (const e of plan.objects) {
      const rel = 'auto-best/.vercel/output/static/' + e.publicPath.slice(roots['auto-best'].length + 1);
      const file = checkedFile(root, rel);
      if (!file || hash(fs.readFileSync(file)) !== e.sha256) throw Error('Shared media target is missing in root service output');
    }
  }
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, key + '.' + phase + '.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  try { console.log(JSON.stringify(prepareServiceAssets(process.argv[2], process.argv[3]))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
