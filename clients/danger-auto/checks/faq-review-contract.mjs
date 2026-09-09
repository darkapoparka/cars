/** Execute these two data modules. Not Svelte compilation or app/browser QA. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputGitBlobs = {};
async function load(name) {
  const path = `carwow/src/lib/data/${name}.ts`;
  const bytes = await readFile(resolve(root, path));
  inputGitBlobs[path] = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  const source = bytes.toString('utf8');
  const module = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`);
  return { module, source };
}
const faq = await load('daynight-faq');
const reviews = await load('daynight-reviews');
const groups = faq.module.daynightFaqGroups;
const items = groups.flatMap(group => group.items);
const results = [];
function check(name, fn) {
  try { fn(); results.push({ name, outcome: 'passed' }); }
  catch (error) { results.push({ name, outcome: 'failed', message: error.message }); }
}
check('three existing accordion groups and IDs retained', () => assert.deepEqual(groups.map(g=>g.id), ['how-to-buy','exchanges','refund']));
check('all twelve existing question IDs retained', () => assert.deepEqual(items.map(i=>i.id), ['steps','financing-documents','reserve','payment-methods','test-drive','trade-in-accepted','trade-in-valuation','trade-in-topup','trade-in-documents','warranty','history-check','delivery']));
check('all accordion IDs unique', () => assert.equal(new Set(items.map(i=>i.id)).size, 12));
check('container and heading class boundaries retained', () => { assert.deepEqual(groups.map(g=>g.containerClass), ['container mb-60','container mb-60','container']); assert.deepEqual(groups.map(g=>g.headingClass), ['h3 mb-20 text-center capitalize','h3 mb-20 text-center capitalize','h3 mb-18 text-center capitalize']); });
check('toggle classes and paragraph typography retained', () => { assert.deepEqual(items.filter(i=>i.toggleClass==='flat-toggle').map(i=>i.id), ['financing-documents','trade-in-valuation','history-check']); for(const i of items) for(const p of i.answer) assert.match(p.class, /^(mb-8 )?h7 text-secondary line-height-28$/); });
check('answers are question-specific and nonempty', () => { const texts=items.map(i=>i.answer.map(p=>p.text).join(' ')); assert.equal(new Set(texts).size,12); assert.ok(texts.every(t=>t.length>40)); });
check('old dealer identity removed from public FAQ/review text', () => assert.doesNotMatch(JSON.stringify([groups,reviews.module.daynightReviews,reviews.module.daynightReviewDisclosure]), /Day Night|Ден и Нощ|0877733110/i));
check('bank finance distinguished from own leasing', () => assert.match(items.find(i=>i.id==='financing-documents').answer[0].text, /чрез банка, а не собствен лизинг/));
check('online reservation is explicitly not delivered', () => assert.match(items.find(i=>i.id==='reserve').answer[0].text, /не запазват автомобил, не приемат капаро и не изпращат/));
check('no invented reviews or customer count', () => { assert.deepEqual(reviews.module.daynightReviews, []); assert.equal(reviews.module.daynightReviewCount,0); assert.equal(reviews.module.hasVerifiedDaynightReviews,false); });
check('empty labels do not claim a dealer rating', () => { assert.equal(reviews.module.daynightReviewAverageLabel,'Без изчислена оценка'); assert.equal(reviews.module.daynightReviewCountLabel,'Няма потвърдени отзиви'); });
check('empty distribution has no ratings or invalid percentages', () => { assert.equal(reviews.module.daynightReviewDistribution.length,5); assert.ok(reviews.module.daynightReviewDistribution.every(row=>row.count===0 && row.percent==='0%')); });
const failed=results.filter(r=>r.outcome==='failed').length;
console.log(JSON.stringify({scope:'TypeScript syntax stripping and two data-module runtime contracts only; not whole-app typecheck, Svelte build, or browser QA',runtime:process.version,inputGitBlobs,passed:results.length-failed,failed,results},null,2));
if (failed) process.exitCode=1;
