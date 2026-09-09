
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const tsModule = await import(pathToFileURL('J:/cars/templates/modern/node_modules/typescript/lib/typescript.js'));
const ts = tsModule.default ?? tsModule;
const compiler = {};
for (const key of ['auto-best','carwow']) {
  const mod = await import(pathToFileURL(`J:/cars/templates/${key}/node_modules/svelte/compiler/index.js`));
  compiler[key] = mod.default ?? mod;
}
const payload = JSON.parse(fs.readFileSync(0,'utf8'));
const report = {node:process.version,typescript:ts.version,svelte:Object.fromEntries(Object.entries(compiler).map(([key,value])=>[key,value.VERSION])),method:'In-memory source parsing only. No bundler, app execution, framework output, files or servers.',files:[],errors:[]};
for (const entry of payload) {
  try {
    let diagnostics=[];
    if (entry.path.endsWith('.svelte')) {
      compiler[entry.key].parse(entry.source,{filename:entry.path,modern:true});
    } else {
      const kind=entry.path.endsWith('.tsx') ? ts.ScriptKind.TSX : entry.path.endsWith('.jsx') ? ts.ScriptKind.JSX : entry.path.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
      const source=ts.createSourceFile(entry.path,entry.source,ts.ScriptTarget.Latest,true,kind);
      diagnostics=source.parseDiagnostics;
    }
    for (const diagnostic of diagnostics) report.errors.push({slug:entry.slug,key:entry.key,path:entry.path,message:ts.flattenDiagnosticMessageText(diagnostic.messageText,'\n'),start:diagnostic.start});
    report.files.push({slug:entry.slug,key:entry.key,path:entry.path,passed:!diagnostics.length});
  } catch (error) {
    report.errors.push({slug:entry.slug,key:entry.key,path:entry.path,message:error.message,line:error.start?.line,column:error.start?.column});
  }
}
process.stdout.write(JSON.stringify(report));
process.exitCode=report.errors.length ? 1 : 0;
