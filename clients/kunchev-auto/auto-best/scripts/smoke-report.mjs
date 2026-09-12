import { mkdir, writeFile } from 'node:fs/promises';

/** Persist each case, including exceptions, before continuing to the next one. */
export async function smokeReport(output, base) {
  await mkdir(output, { recursive: true });
  const report = { generatedAt: new Date().toISOString(), base, results: [] };
  async function save() { await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2)); }
  return {
    report,
    async check(name, run) {
      const started = Date.now();
      try { report.results.push({ name, passed: true, evidence: await run(), durationMs: Date.now() - started }); }
      catch (error) { report.results.push({ name, passed: false, error: error.stack, durationMs: Date.now() - started }); }
      await save();
      console.log(`${report.results.at(-1).passed ? 'PASS' : 'FAIL'} ${name}${report.results.at(-1).error ? `: ${report.results.at(-1).error.split('\n')[0]}` : ''}`);
    },
    async finish() { await save(); if (report.results.some(result => !result.passed)) process.exitCode = 1; }
  };
}
