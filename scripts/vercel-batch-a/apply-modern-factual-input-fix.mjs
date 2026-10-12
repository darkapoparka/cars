/** Scoped runtime application of a single reviewed maintained-updater correction.
 * No client source, authoritative facts, template lock or approval records are edited.
 * The full before/after hash is retained with the source job for other batches to reuse.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=process.cwd(),file=path.join(root,'scripts/dealer-updates/update-dealer-template.mjs');
assert.equal(process.env.GITHUB_REPOSITORY,'darkapoparka/cars');
assert.equal(process.env.GITHUB_REF,'refs/heads/codex/vercel-batch-a-20261013');
const bytes=fs.readFileSync(file),blob=b=>createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
assert.equal(blob(bytes),'922df5d49711b59dfdf5ce2e2a2f3e2f2f18f621','Refuse a changed updater; reconcile a newer shared correction instead');
const before="  if(!Array.isArray(value.profileInputs)||JSON.stringify(value.profileInputs.map(x=>x.path).sort())!==JSON.stringify(['business-facts.json','dealer.json','stock.json']))throw Error('Exact original Modern factual input inventory required');";
const after="  const factualNames=['business-facts.json','dealer.json','stock.json'];\n  const originalFactualNames=git(carsRoot,['--no-lazy-fetch','ls-tree','--name-only',value.sourceCommit+':clients/'+dealer,'--',...factualNames]).split(/\\r?\\n/).filter(Boolean);\n  const currentFactualNames=factualNames.filter(name=>fs.lstatSync(path.join(dealerRoot,name),{throwIfNoEntry:false})!==undefined);\n  assertModernFactualInputInventory({declared:value.profileInputs,original:originalFactualNames,current:currentFactualNames});";
const text=bytes.toString('utf8');assert(Buffer.from(text).equals(bytes));assert.equal(text.split(before).length,2);
const output=Buffer.from("import {assertModernFactualInputInventory} from './modern-factual-input-inventory.mjs';\n"+text.replace(before,after));
fs.writeFileSync(file,output);
const report=path.join(root,'runtime/vercel-batch-a-report/tool-fix.json');fs.mkdirSync(path.dirname(report),{recursive:true});
fs.writeFileSync(report,JSON.stringify({schemaVersion:1,kind:'cars-maintained-modern-factual-input-inventory-correction',controlCommit:process.env.GITHUB_SHA,path:path.relative(root,file),beforeBlob:blob(bytes),afterBlob:blob(output),before,after,scope:'Use exactly the immutable and current authoritative input inventory; stock.json is required when present in source, not fabricated when source uses business-facts.json. All existing row byte hashes, immutable blobs, real paths and reviewer checks remain unchanged.'},null,2)+'\n');
console.log(JSON.stringify({path:path.relative(root,file),beforeBlob:blob(bytes),afterBlob:blob(output)}));
