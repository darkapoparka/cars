import fs from 'node:fs';
import path from 'node:path';

/** Read-only accounting of Vercel's final artifact, not node_modules or build caches. */
export function auditVercelOutput(outputRoot, { maxBytes = 512 * 1024 * 1024, maxFunctionBytes = 200 * 1024 * 1024 } = {}) {
  for (const limit of [maxBytes,maxFunctionBytes]) if(!Number.isSafeInteger(limit)||limit<1) throw Error('Invalid output byte budget');
  const root = path.resolve(outputRoot);
  if (!fs.existsSync(path.join(root, 'config.json'))) throw Error('Expected Vercel output/config.json');
  if (fs.lstatSync(root).isSymbolicLink()) throw Error('Do not follow linked output roots');
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  if (config.version !== 3) throw Error('Unsupported Vercel output schema');
  const groups = new Map(); const unsafe = [], functionAliases = [], functionEntrypoints = [];
  function auditFunctionHandler(directory, relative) {
    const file = path.join(directory, '.vc-config.json');
    if (!fs.existsSync(file)) return;
    try {
      const functionConfig = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (functionConfig.handler === undefined && !/^nodejs/.test(functionConfig.runtime ?? '')) return;
      const handler = functionConfig.handler;
      if (typeof handler !== 'string' || !handler || handler.includes('\\') || handler.includes('\0') || path.posix.isAbsolute(handler) || /^[a-z]:/i.test(handler)) throw Error('Invalid handler');
      const target = path.resolve(directory, ...handler.split('/'));
      const logical = path.relative(directory, target);
      if (logical === '' || logical.startsWith(`..${path.sep}`) || logical === '..' || path.isAbsolute(logical) || !fs.existsSync(target) || !fs.statSync(target).isFile()) throw Error('Escaping or missing handler');
      const real = path.relative(fs.realpathSync(directory), fs.realpathSync(target));
      if (real === '' || real.startsWith(`..${path.sep}`) || real === '..' || path.isAbsolute(real)) throw Error('External handler');
      functionEntrypoints.push({ function: relative, handler });
    } catch { unsafe.push({ path: relative + '/.vc-config.json', reason: 'unsafe-or-missing-function-handler' }); }
  }
  function walk(dir, group = 'metadata') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name), relative = path.relative(root, full).replaceAll('\\', '/');
      if (entry.isSymbolicLink()) {
        try {
          const target=fs.realpathSync(full), targetRelative=path.relative(root,target).replaceAll('\\','/');
          if (!relative.endsWith('.func') || !/(?:^|\/)functions\//.test(relative) || targetRelative.startsWith('../') || path.isAbsolute(targetRelative) || !targetRelative.endsWith('.func') || !/(?:^|\/)functions\//.test(targetRelative) || !fs.statSync(target).isDirectory() || !fs.existsSync(path.join(target,'.vc-config.json'))) throw Error('Unrecognized function alias');
          functionAliases.push({path:relative,target:targetRelative});
        } catch { unsafe.push({ path: relative, reason: 'unrecognized-or-external-output-link' }); }
        continue;
      }
      // Keep the enclosing output category. A runtime dependency named static/
      // is still part of its Function; public URL folders are still static assets.
      const parts = relative.split('/');
      const own = group !== 'metadata' ? group
        : parts.at(-1) === 'static' ? relative
        : relative.match(/^(.*?functions\/.*?\.func)(?:\/|$)/)?.[1] || group;
      if (entry.isDirectory()) {
        if (own === relative && own.endsWith('.func')) auditFunctionHandler(full, relative);
        walk(full, own); continue;
      }
      if (!entry.isFile()) continue;
      const row = groups.get(own) || { name: own, files: 0, bytes: 0 };
      row.files++; row.bytes += fs.statSync(full).size; groups.set(own, row);
      if (/(?:^|\/)(?:\.git|\.env[^/]*|\.qa|artifacts|playwright-report|test-results)(?:\/|$)/.test(relative)) unsafe.push({ path: relative, reason: 'source-or-private-artifact-in-deployment' });
    }
  }
  walk(root);
  const rows = [...groups.values()], totalBytes = rows.reduce((n, row) => n + row.bytes, 0);
  for (const alias of functionAliases) if (!rows.some(row => row.name === alias.target)) unsafe.push({path:alias.path,reason:'unaccounted-function-alias'});
  const oversizedFunctions = rows.filter(row => row.name.endsWith('.func') && row.bytes > maxFunctionBytes);
  return { schemaVersion: 1, root, groups: rows, functionAliases, functionEntrypoints, totalBytes, limits: { maxBytes, maxFunctionBytes }, unsafe, oversizedFunctions,
    passed: totalBytes <= maxBytes && !oversizedFunctions.length && !unsafe.length,
    accounting: 'Logical bytes in final Vercel output only. Not a Vercel billing-meter measurement.' };
}


/** Records an actual generated-output link for review; grants no exception. */
export function describeNextOutputLink(name, { outputRoot, traceRoot }) {
  const output=path.resolve(outputRoot),allowed=fs.realpathSync(traceRoot),file=path.resolve(name);
  const relative=path.relative(output,file).replaceAll('\\','/');
  if(!relative||relative==='..'||relative.startsWith('../')||path.isAbsolute(relative)||!fs.lstatSync(file).isSymbolicLink()) throw Error('Expected actual link inside Next output');
  const within=(root,target)=>{const rel=path.relative(root,target);return rel===''||rel!=='..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);};
  const row={schemaVersion:1,kind:'next-output-link-review',path:relative,linkTarget:null,resolvedTarget:null,targetKind:null,confinedToTraceRoot:false,confinedToOutput:false,accepted:false};
  try {
    const target=fs.readlinkSync(file);if(target.length>4096)throw Error('oversized-link-target');row.linkTarget=target;
    const real=fs.realpathSync(file),stat=fs.statSync(real);row.resolvedTarget=path.relative(allowed,real).replaceAll('\\','/');
    row.targetKind=stat.isDirectory()?'directory':stat.isFile()?'file':'other';row.confinedToTraceRoot=within(allowed,real);row.confinedToOutput=within(fs.realpathSync(output),real);
    row.reason=row.confinedToTraceRoot?'confined-output-link-requires-exact-review':'external-output-link';
  } catch(error) {row.reason='unresolved-output-link';row.errorCode=error.code??error.message;}
  return row;
}

/** Next traces are dependency accounting, not a sum of deployed Lambda storage. */
export function auditNextTraces(appRoot, { distDir = '.next', traceRoot = appRoot, maxUniqueBytes = 160 * 1024 * 1024, maxRouteBytes = 96 * 1024 * 1024 } = {}) {
  for (const limit of [maxUniqueBytes, maxRouteBytes]) if (!Number.isSafeInteger(limit) || limit < 1) throw Error('Invalid trace byte budget');
  if (!/^\.next[a-zA-Z0-9_-]*$/.test(distDir)) throw Error('Expected an explicit Next output directory');
  const root = path.resolve(appRoot), output = path.join(root, distDir), allowed = fs.realpathSync(traceRoot);
  if (!fs.existsSync(path.join(output, 'BUILD_ID'))) throw Error('Production Next build is missing');
  const traces = [], missing = [], unsafe = [], unique = new Map(), dependencyAliases = new Map();
  // Next's Vercel adapter emits output-v3 function aliases. Audit the entire
  // embedded artifact first, so an alias target has a safe handler and its bytes
  // are counted exactly once by the maintained Vercel output auditor.
  const embeddedRoot = path.join(output, 'output'), functionAliases = new Map();
  let embeddedVercelOutput = null;
  if (fs.existsSync(path.join(embeddedRoot, 'config.json'))) {
    const rel = path.relative(allowed, fs.realpathSync(embeddedRoot));
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw Error('Embedded Vercel output escaped trace root');
    embeddedVercelOutput = auditVercelOutput(embeddedRoot);
    if (!embeddedVercelOutput.passed) throw Error('Embedded Vercel output failed audit: ' + JSON.stringify({totalBytes:embeddedVercelOutput.totalBytes,unsafe:embeddedVercelOutput.unsafe.slice(0,8),oversizedFunctions:embeddedVercelOutput.oversizedFunctions.slice(0,8)}));
    for (const alias of embeddedVercelOutput.functionAliases) {
      const group = embeddedVercelOutput.groups.find(row => row.name === alias.target);
      const entry = embeddedVercelOutput.functionEntrypoints.find(row => row.function === alias.target);
      if (!group || group.files < 1 || group.bytes < 1 || !entry) throw Error('Unaccounted or unvalidated Next function alias: ' + alias.path);
      functionAliases.set(path.resolve(embeddedRoot, alias.path), path.resolve(embeddedRoot, alias.target));
    }
  }
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.name === 'node_modules') continue; // Runtime dependencies are accounted through their explicit NFT references.
      if (entry.isSymbolicLink()) {
        const target = functionAliases.get(name);
        if (target && fs.realpathSync(name) === target && fs.statSync(target).isDirectory()) continue;
        throw Error('Linked build output requires review: '+JSON.stringify(describeNextOutputLink(name,{outputRoot:output,traceRoot:allowed})));
      }
      if (entry.isDirectory()) { if (!['cache', 'dev'].includes(entry.name)) walk(name); continue; }
      if (!entry.isFile() || !entry.name.endsWith('.nft.json')) continue;
      const data = JSON.parse(fs.readFileSync(name, 'utf8'));
      if (!Array.isArray(data.files)) throw Error('Invalid Next dependency trace');
      let bytes = 0;
      for (const relative of data.files) {
        if (typeof relative !== 'string' || path.isAbsolute(relative)) throw Error('Invalid traced dependency path');
        const file = path.resolve(path.dirname(name), relative);
        if (!fs.existsSync(file)) { missing.push(path.relative(root, file)); continue; }
        const real = fs.realpathSync(file), rel = path.relative(allowed, real).replaceAll('\\', '/');
        if (rel.startsWith('../') || path.isAbsolute(rel) || /(?:^|\/)(?:\.git|\.env[^/]*|\.qa|artifacts|test-results)(?:\/|$)/.test(rel)) unsafe.push(rel);
        if (fs.statSync(real).isDirectory() && fs.lstatSync(file).isSymbolicLink()) {
          dependencyAliases.set(path.relative(root,file).replaceAll('\\','/'),rel); continue; // NFT directory-link metadata is not a request to copy the entire package.
        }
        if (!fs.statSync(real).isFile()) { unsafe.push(rel); continue; }
        const size = fs.statSync(real).size; bytes += size; unique.set(real, size);
      }
      traces.push({ path: path.relative(output, name).replaceAll('\\', '/'), files: data.files.length, bytes });
    }
  }
  walk(output); if (!traces.length) throw Error('No production Next traces found');
  const uniqueBytes = [...unique.values()].reduce((n, bytes) => n + bytes, 0);
  const largestRouteBytes = Math.max(...traces.map(t => t.bytes));
  return { schemaVersion: 1, root, distDir, uniqueBytes, largestRouteBytes, traceCount: traces.length, uniqueFiles: unique.size, dependencyAliases: dependencyAliases.size,
    limits: { maxUniqueBytes, maxRouteBytes }, missing, unsafe, embeddedVercelOutput,
    passed: uniqueBytes <= maxUniqueBytes && largestRouteBytes <= maxRouteBytes && !missing.length && !unsafe.length,
    accounting: 'Unique traced runtime bytes and largest individual trace; shared dependencies are not multiplied per route.' };
}

