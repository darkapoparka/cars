import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const root='J:/cars/templates/auto-best';
const out='J:/cars/audits/2026-09-08/auto-best/evidence';
process.chdir(root);
process.env.BASE_URL='http://127.0.0.1:6461';
process.env.PLAYWRIGHT_EXECUTABLE_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe';
for(const name of process.argv.slice(2)) {
 let code=await fs.readFile(`${root}/scripts/${name}.mjs`,'utf8');
 code=code.replaceAll("from 'playwright'",`from '${pathToFileURL(root+'/node_modules/playwright/index.mjs')}'`)
  .replaceAll('chromium.launch()',"chromium.launch({channel:'chrome'})")
  .replaceAll('chromium.launch({ headless: true })',"chromium.launch({ headless: true, channel:'chrome' })")
  .replaceAll(`'artifacts/${name}'`,`'${out}/${name}'`);
 const dest=`${out}/runner-${name}.mjs`;await fs.writeFile(dest,code);
 console.log('START '+name);
 try {await import(pathToFileURL(dest));console.log('COMPLETE '+name);}catch(e){console.log('FAILED '+name+'\n'+e.stack);}
}
