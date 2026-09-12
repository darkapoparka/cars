
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const mod=await import(pathToFileURL('J:/cars/templates/modern/node_modules/typescript/lib/typescript.js'));
const ts=mod.default ?? mod;
const cases=JSON.parse(fs.readFileSync(0,'utf8'));
const results=[];
const normalize=p=>p.replaceAll('\\','/');
for(const test of cases){
  const root=`J:/cars/templates/${test.key}/`;
  const memory=new Map(Object.entries(test.files).map(([name,source])=>[normalize(root+name),source]));
  const options={strict:true,noEmit:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,resolveJsonModule:true,esModuleInterop:true,allowSyntheticDefaultImports:true,types:[],baseUrl:root,paths:{'$data/*':['src/lib/data/*'],'$config/*':['src/lib/config/*'],'$lib/*':['src/lib/*'],'@repo/marketplace-domain/*':['packages/marketplace-domain/*'],'@repo/marketplace-domain':['packages/marketplace-domain/index.ts']}};
  const host=ts.createCompilerHost(options);
  const oldRead=host.readFile;
  const allowedRead=p=>/\/node_modules(?:\/|$)/.test(normalize(p));
  host.readFile=p=>memory.get(normalize(p)) ?? (allowedRead(p)?oldRead(p):undefined);
  host.fileExists=p=>memory.has(normalize(p)) || (allowedRead(p)&&ts.sys.fileExists(p));
  host.directoryExists=p=>[...memory.keys()].some(k=>k.startsWith(normalize(p).replace(/\/$/,'')+'/')) || (allowedRead(p)&&ts.sys.directoryExists(p));
  host.realpath=p=>normalize(p);
  host.getCurrentDirectory=()=>root;
  host.getSourceFile=(fileName,languageVersion)=>{const source=host.readFile(fileName);return source===undefined?undefined:ts.createSourceFile(fileName,source,languageVersion,true);};
  host.writeFile=()=>{throw new Error('Filesystem emission is forbidden for this source check');};
  const program=ts.createProgram(test.roots.map(p=>root+p),options,host);
  const diagnostics=ts.getPreEmitDiagnostics(program).map(d=>({code:d.code,path:d.file?normalize(d.file.fileName).replace(root,''):null,line:d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:null,message:ts.flattenDiagnosticMessageText(d.messageText,'\n')}));
  results.push({slug:test.slug,key:test.key,rootFiles:test.roots,diagnostics,passed:diagnostics.length===0});
}
process.stdout.write(JSON.stringify({method:'Targeted data/config TypeScript no-emit check against immutable source in an in-memory compiler host; shared source files were not read as implementation or modified. Not a full application typecheck/build.',typescript:ts.version,node:process.version,results}));
process.exitCode=results.some(r=>!r.passed)?1:0;
