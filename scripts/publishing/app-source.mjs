import fs from 'node:fs/promises';import path from 'node:path';
const folders=new Set(['app','components','lib','public']);
const rootFiles=new Set(['package.json','package-lock.json','next.config.js','next-env.d.ts','tsconfig.json','babel.config.js','postcss.config.js','eslint.config.mjs','proxy.ts','README.md','TEMPLATE.md','.gitattributes']);
const excluded=['public/reference-assets/vehicle-details/','public/reference-assets/final-pass/','public/reference-assets/catalog/'];
const normalize=bytes=>{if(bytes.includes(0))return bytes;const text=bytes.toString('utf8');return Buffer.from(text).equals(bytes)?Buffer.from(text.replaceAll('\r\n','\n')):bytes;};
export const appSourceRetainsPath = relative => !excluded.some(p=>relative.startsWith(p)) && !relative.endsWith('.tsbuildinfo') &&
 (folders.has(relative.split('/')[0]) || rootFiles.has(relative) || /^(?:LICEN[CS]E|NOTICE|COPYING)(?:\.|$)/.test(relative));
/** Runtime source only. Reference captures remain intact in the master, never replicated to dealers. */
export async function collectAppSource(root){
 const files=new Map();async function visit(relative){
  if(!appSourceRetainsPath(relative))return;
  const full=path.join(root,relative),stat=await fs.lstat(full);if(stat.isSymbolicLink())throw Error('Unexpected link in App source: '+relative);
  if(stat.isDirectory()){for(const child of (await fs.readdir(full)).sort())await visit(relative+'/'+child);}
  else if(stat.isFile())files.set(relative,normalize(await fs.readFile(full)));
 }
 for(const name of (await fs.readdir(root)).sort())if(appSourceRetainsPath(name))await visit(name);
 if(!files.has('app/layout.tsx')||!files.has('proxy.ts')||!files.has('lib/locales/bg.json'))throw Error('Incomplete App source');
 return files;
}
