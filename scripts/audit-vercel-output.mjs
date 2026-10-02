import fs from 'node:fs';
import path from 'node:path';
import {auditVercelOutput} from './publishing/vercel-output-budget.mjs';
export {auditVercelOutput, auditNextTraces} from './publishing/vercel-output-budget.mjs';
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  try {
    if (process.argv.includes('--help')) console.log('Usage: node scripts/audit-vercel-output.mjs PATH/TO/.vercel/output [REPORT.json]');
    else {
      if (!process.argv[2]) throw Error('Supply the final Vercel output directory');
      const report = auditVercelOutput(process.argv[2]);
      if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2) + '\n');
      console.log(JSON.stringify(report, null, 2)); if (!report.passed) process.exitCode = 1;
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
