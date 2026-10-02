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
  const groups = new Map(); const unsafe = [], functionAliases = [];
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
      if (entry.isDirectory()) { walk(full, own); continue; }
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
  return { schemaVersion: 1, root, groups: rows, functionAliases, totalBytes, limits: { maxBytes, maxFunctionBytes }, unsafe, oversizedFunctions,
    passed: totalBytes <= maxBytes && !oversizedFunctions.length && !unsafe.length,
    accounting: 'Logical bytes in final Vercel output only. Not a Vercel billing-meter measurement.' };
}

/** Next traces are dependency accounting, not a sum of deployed Lambda storage. */
export function auditNextTraces(appRoot, { distDir = '.next', traceRoot = appRoot, maxUniqueBytes = 160 * 1024 * 1024, maxRouteBytes = 96 * 1024 * 1024 } = {}) {
  for (const limit of [maxUniqueBytes, maxRouteBytes]) if (!Number.isSafeInteger(limit) || limit < 1) throw Error('Invalid trace byte budget');
  if (!/^\.next[a-zA-Z0-9_-]*$/.test(distDir)) throw Error('Expected an explicit Next output directory');
  const root = path.resolve(appRoot), output = path.join(root, distDir), allowed = fs.realpathSync(traceRoot);
  if (!fs.existsSync(path.join(output, 'BUILD_ID'))) throw Error('Production Next build is missing');
  const traces = [], missing = [], unsafe = [], unique = new Map(), dependencyAliases = new Map();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.name === 'node_modules') continue; // Runtime dependencies are accounted through their explicit NFT references.
      if (entry.isSymbolicLink()) throw Error('Linked build output requires review');
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
    limits: { maxUniqueBytes, maxRouteBytes }, missing, unsafe,
    passed: uniqueBytes <= maxUniqueBytes && largestRouteBytes <= maxRouteBytes && !missing.length && !unsafe.length,
    accounting: 'Unique traced runtime bytes and largest individual trace; shared dependencies are not multiplied per route.' };
}
