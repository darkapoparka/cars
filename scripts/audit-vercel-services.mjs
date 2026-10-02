import fs from 'node:fs';
import path from 'node:path';
import {auditVercelOutput} from './publishing/vercel-output-budget.mjs';

/** Inspect every declared final service output together; never build, deploy or delete. */
export function auditVercelServices(manifest, outputs, {maxBytes = 512 * 1024 * 1024, maxFunctionBytes = 200 * 1024 * 1024} = {}) {
  const keys = manifest?.variants?.map(v => v.key);
  if (!Array.isArray(keys) || !keys.length || keys.some(k => typeof k !== 'string' || !/^[a-z][a-z0-9-]*$/.test(k)) || new Set(keys).size !== keys.length) throw Error('Declare each offered service exactly once');
  if (!outputs || typeof outputs !== 'object' || Array.isArray(outputs) || JSON.stringify(Object.keys(outputs).sort()) !== JSON.stringify([...keys].sort())) throw Error('Final output map must match every declared service; no missing or extra designs');
  for (const limit of [maxBytes, maxFunctionBytes]) if (!Number.isSafeInteger(limit) || limit < 1) throw Error('Invalid combined output budget');
  const roots = keys.map(key => {
    if (typeof outputs[key] !== 'string' || !path.isAbsolute(outputs[key])) throw Error('Use explicit absolute final output paths');
    if (fs.lstatSync(outputs[key]).isSymbolicLink()) throw Error('Linked service output is not accepted');
    return fs.realpathSync(outputs[key]);
  });
  const within = (parent, child) => { const r = path.relative(parent, child); return !r || (r !== '..' && !r.startsWith('..' + path.sep) && !path.isAbsolute(r)); };
  for (let i = 0; i < roots.length; i++) for (let j = i + 1; j < roots.length; j++) if (within(roots[i], roots[j]) || within(roots[j], roots[i])) throw Error('Service outputs must be distinct non-overlapping directories');
  const services = keys.map((key, i) => ({key, ...auditVercelOutput(roots[i], {maxBytes, maxFunctionBytes})}));
  const totalBytes = services.reduce((n, s) => n + s.totalBytes, 0);
  const sum = predicate => services.reduce((n, s) => n + s.groups.filter(predicate).reduce((v, g) => v + g.bytes, 0), 0);
  const staticBytes = sum(g => g.name === 'static' || g.name.endsWith('/static'));
  const functionBytes = sum(g => g.name.endsWith('.func'));
  return {schemaVersion: 1, kind: 'combined-final-service-artifact-audit', offeredServices: keys, services, totalBytes, staticBytes, functionBytes,
    otherBytes: totalBytes - staticBytes - functionBytes, limits: {maxBytes, maxFunctionBytes},
    passed: services.every(s => s.passed) && totalBytes <= maxBytes,
    accounting: 'Actual final local Vercel output across every supplied service; not Next trace unions, remote Blob usage, retained history or a Vercel billing meter.'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  try {
    if (process.argv.includes('--help')) console.log('Usage: node scripts/audit-vercel-services.mjs DEALER.json OUTPUT-PATHS.json [NEW-REPORT.json]\nOUTPUT-PATHS maps each manifest variant key to its absolute final .vercel/output directory. No deployment occurs.');
    else {
      const [manifestFile, outputFile, reportFile, ...extra] = process.argv.slice(2);
      if (!manifestFile || !outputFile || extra.length) throw Error('Supply dealer manifest, exact output path map, and optional new report');
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      const outputs = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      if (reportFile) {
        const target = path.resolve(reportFile), physical = path.join(fs.realpathSync(path.dirname(target)), path.basename(target));
        if (fs.existsSync(target)) throw Error('Report already exists');
        for (const root of Object.values(outputs)) {
          const relative = path.relative(fs.realpathSync(root), physical);
          if (!relative || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))) throw Error('Keep audit reports outside deployed output');
        }
      }
      const report = auditVercelServices(manifest, outputs);
      if (reportFile) fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'});
      console.log(JSON.stringify(report, null, 2));
      if (!report.passed) process.exitCode = 1;
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
