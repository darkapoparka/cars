import fs from 'node:fs';
const readLog=path=>{const b=fs.readFileSync(path);return b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8');};
const maps={
'avangard-auto':{'auto-best':['qa-final/validate-auto-best.log'],'modern':['evidence/build-modern.log','qa-final/typecheck-modern.log'],'carwow':['qa-final/check-carwow.log','qa-final/build-carwow-final.log']},
'champion-auto-pro':{'auto-best':['qa/validate-auto-best.log'],'modern':['qa/build-modern.log','qa-final/typecheck-modern.log'],'carwow':['qa-final/check-carwow.log','qa-final/build-carwow.log']},
'astracar':{'auto-best':['qa-final/validate-auto-best.log'],'modern':['qa-final/prisma.log','qa-final/typecheck-modern.log','qa-final/build-modern.log'],'carwow':['qa-final/check-carwow.log','qa-final/build-carwow.log']}};
for(const [c,templates]of Object.entries(maps)){const records=[];for(const [template,files]of Object.entries(templates))for(const f of files){const path=`J:/cars/clients/${c}/${f}`;const s=readLog(path);const pass=/typecheck/.test(f)?/Types generated successfully/.test(s)&&!/error TS\d/.test(s):/prisma/.test(f)?/Generated Prisma Client/.test(s):/check-carwow/.test(f)?/found 0 errors/.test(s):/modern/.test(f)?/prerendered as static HTML/.test(s):/✔ done/.test(s);records.push({template,path,modifiedAt:fs.statSync(path).mtime.toISOString(),pass,warnings:[...s.matchAll(/found 0 errors and (\d+) warnings?/g)].map(x=>Number(x[1]))});if(!pass)throw Error(`Missing successful check: ${path}`);}fs.writeFileSync(`J:/cars/clients/${c}/qa-final/checks.json`,JSON.stringify(records,null,2));}


