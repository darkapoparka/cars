import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const oid = value => /^[a-f0-9]{40}$/.test(value || '');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function git(root,args,options={}) {return execFileSync('git',['-c','core.sparseCheckout=false',...args],{cwd:root,encoding:'utf8',maxBuffer:32*1024**2,...options}).trim();}
const safePath = value => typeof value === 'string' && value.length < 256 && /^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/.test(value) && !value.split('/').some(p => p === '.' || p === '..');
function treeObjects(root,tree,paths=[]) {
 if(!oid(tree))throw Error('Immutable tree or commit required');
 const output=git(root,['ls-tree','-r','-t','-z',tree,...(paths.length?['--',...paths]:[])]);
 const result=new Set();for(const line of output.split('\0').filter(Boolean)){const [mode,type,id]=line.slice(0,line.indexOf('\t')).split(' ');if(!['blob','tree'].includes(type)||!oid(id))throw Error('Unexpected Git object');result.add(id);}return result;
}
/** Transport only package objects not already in the named committed source paths. */
export function writePackageObjectPack({root,sourceCommit,sourcePaths,packageTree,packageCommit,destination}) {
 if(!oid(sourceCommit)||!oid(packageTree)||!oid(packageCommit)||!Array.isArray(sourcePaths)||!sourcePaths.length||sourcePaths.length>8||sourcePaths.some(p=>!safePath(p))||!path.isAbsolute(destination))throw Error('Exact source/package identities required');
 if(git(root,['rev-parse',packageCommit+'^{tree}'])!==packageTree)throw Error('Package commit differs from selected tree');
 if(fs.existsSync(destination))throw Error('Object transport already exists');
 const known=treeObjects(root,sourceCommit,sourcePaths),objects=treeObjects(root,packageTree);objects.add(packageTree);objects.add(packageCommit);
 const requiredObjects=[...objects].filter(id=>known.has(id)).sort(),newObjects=[...objects].filter(id=>!known.has(id)).sort();
 const fd=fs.openSync(destination,'wx');let result;try{result=spawnSync('git',['pack-objects','--stdout','--no-reuse-delta'],{cwd:root,input:newObjects.join('\n')+'\n',stdio:['pipe',fd,'pipe'],encoding:'utf8',timeout:120000});}finally{fs.closeSync(fd);}
 if(result.error||result.status!==0)throw Error('Object packing failed: '+(result.error?.message||result.stderr));
 const bytes=fs.readFileSync(destination);if(bytes.length>128*1024**2)throw Error('Object transport exceeded 128 MiB');
 return {transport:'git-object-pack-v1',packBytes:bytes.length,packSha256:hash(bytes),sourceCommit,sourcePaths,packageTree,packageCommit,newObjects:newObjects.length,requiredObjects,requiredObjectsDigest:hash(JSON.stringify(requiredObjects))};
}
/** Validate bytes and prerequisites before importing; source worktree and refs stay unchanged. */
export function installPackageObjectPack({root,receipt,file}) {
 if(receipt.transport!=='git-object-pack-v1'||!oid(receipt.packageTree)||!oid(receipt.packageCommit)||!Array.isArray(receipt.requiredObjects)||receipt.requiredObjects.length>100000||new Set(receipt.requiredObjects).size!==receipt.requiredObjects.length||receipt.requiredObjects.some(id=>!oid(id))||hash(JSON.stringify(receipt.requiredObjects))!==receipt.requiredObjectsDigest)throw Error('Invalid object transport receipt');
 const bytes=fs.readFileSync(file);if(bytes.length!==receipt.packBytes||bytes.length>128*1024**2||hash(bytes)!==receipt.packSha256)throw Error('Object transport bytes changed');
 const missing=receipt.requiredObjects.length?git(root,['--no-lazy-fetch','cat-file','--batch-check=%(objectname) %(objecttype)'],{input:receipt.requiredObjects.join('\n')+'\n'}).split('\n').filter(row=>row.endsWith(' missing')):[];
 if(missing.length)throw Error('Required source objects unavailable: '+missing.slice(0,4).join(', '));
 git(root,['index-pack','--stdin'],{input:bytes});if(git(root,['rev-parse',receipt.packageCommit+'^{tree}'])!==receipt.packageTree)throw Error('Transported package tree mismatch');
 return {packageTree:receipt.packageTree,requiredSourceObjects:receipt.requiredObjects.length,newObjects:receipt.newObjects};
}
