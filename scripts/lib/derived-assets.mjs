import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const binaryAssets=/\.(?:png|jpe?g|webp|avif|gif|ico|woff2?|ttf|eot|mp4|webm|pdf)$/i;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

/** Deduplicate derived binary assets without linking to editable source files. */
export function writeDerivedFile(target,bytes,{assetPool}={}) {
  if (!assetPool || !binaryAssets.test(target)) {
    fs.writeFileSync(target,bytes,{flag:'wx'});return;
  }
  const pool=path.resolve(assetPool);fs.mkdirSync(pool,{recursive:true});
  if(fs.realpathSync(pool).toLowerCase()!==pool.toLowerCase())throw new Error('Derived asset pool must not resolve through a link');
  const digest=hash(bytes),object=path.join(pool,digest+path.extname(target).toLowerCase());
  try {fs.writeFileSync(object,bytes,{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
  if(!fs.lstatSync(object).isFile()||fs.lstatSync(object).isSymbolicLink()||hash(fs.readFileSync(object))!==digest)throw new Error('Derived asset pool content changed');
  fs.chmodSync(object,0o444);
  try{fs.linkSync(object,target);}catch(error){if(error.code!=='EXDEV')throw error;fs.writeFileSync(target,bytes,{flag:'wx'});}
}
