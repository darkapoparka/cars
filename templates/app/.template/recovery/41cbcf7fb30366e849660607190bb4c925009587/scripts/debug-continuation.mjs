import {readFile, writeFile} from 'node:fs/promises';
import {createBrowser, sleep} from './lib/browser-qa.mjs';
const b = await createBrowser('reference/2026-09-26-continuation/debug-hooks');
try {
  const report = JSON.parse(await readFile('reference/2026-09-26-continuation/verification/results.json', 'utf8'));
  console.log('PREVIOUS FAILURES', JSON.stringify(report.checks.filter(c => !c.passed)));
  console.log('PREVIOUS ERRORS', JSON.stringify(report.errors));
  for (const error of report.errors) for (const frame of error.stackTrace?.callFrames ?? []) {
    if (frame.url?.includes('6103-')) {
      const response = await fetch(frame.url); const source = await response.text();
      const line = source.split('\n')[frame.lineNumber] ?? '';
      console.log('FRAME SOURCE', frame.functionName, frame.lineNumber, frame.columnNumber, line.slice(Math.max(0, frame.columnNumber - 1200), frame.columnNumber + 1000));
      await writeFile('reference/2026-09-26-continuation/debug-hooks/inventory-chunk.txt', source);
    }
  }
  await b.navigate('/cars'); await b.clickText('Filter');
  for (const tab of ['BRAND','BUDGET','DISCOUNTS','EMI','DOWN PAYMENT','YEAR','BODY TYPE','MILEAGE','CAR TYPE','FUEL TYPE','CATEGORIES','FEATURES','ENGINE','BUDGET']) {
    await b.clickText(tab); await sleep(200);
    console.log('TAB', tab, await b.evaluate(`({url:location.href,dialogs:document.querySelectorAll('[role=dialog]').length,headings:[...document.querySelectorAll('[role=dialog] h3')].map(e=>e.textContent)})`));
    if (b.errors.length) break;
  }
  await b.capture('filters-at-end');
  console.log('CURRENT ERRORS', JSON.stringify(b.errors));
} catch(error) {console.log('DIAGNOSTIC ERROR', error.stack);} finally {await b.report(); await b.close();}
