import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const relativePaths = [
  'auto-best/src/lib/data/dealer-stock.json', 'auto-best/src/lib/data/dealer-editorial.ts',
  'auto-best/src/lib/data/editorial.ts', 'auto-best/src/lib/data/home.ts',
  'auto-best/src/lib/data/company.ts', 'auto-best/src/lib/config/brand.ts',
  'auto-best/src/lib/data/inventory.ts', 'auto-best/src/lib/data/listing.ts',
  'modern/packages/marketplace-domain/dealer-stock.json',
  'modern/packages/marketplace/dealer-editorial.ts', 'modern/packages/marketplace/lead-site.ts',
  'modern/apps/web/lib/vehicle-guides.ts', 'modern/apps/web/app/[locale]/contact/page.tsx',
  'carwow/src/lib/data/dealer-stock.json', 'carwow/src/lib/data/dealer-editorial.ts',
  'carwow/src/lib/data/daynight-blog.ts', 'carwow/src/lib/data/daynight-faq.ts'
];
const fromStdin = process.argv.includes('--stdin');
const root = fromStdin ? null : fileURLToPath(new URL('../', import.meta.url));
const input = fromStdin ? JSON.parse(fs.readFileSync(0, 'utf8')) : {
  files: Object.fromEntries(relativePaths.map(p => [p, fs.readFileSync(path.join(root, p), 'utf8')])),
  slug: path.basename(root.replace(/[\\/]$/, ''))
};
const requireFrom = createRequire(fromStdin ? import.meta.url : path.join(root, 'auto-best/package.json'));
const ts = input.typescriptPath ? requireFrom(input.typescriptPath) : requireFrom('typescript');
const files = input.files;
const corePaths = [
  'auto-best/src/lib/data/dealer-editorial.ts',
  'modern/packages/marketplace/dealer-editorial.ts',
  'carwow/src/lib/data/dealer-editorial.ts'
];
function resolveModule(specifier, from) {
  if (specifier === '@repo/marketplace') return 'modern/packages/marketplace/dealer-editorial.ts';
  let base;
  if (specifier.startsWith('$config/')) base = 'auto-best/src/lib/config/' + specifier.slice(8);
  else if (specifier.startsWith('$data/')) base = 'auto-best/src/lib/data/' + specifier.slice(6);
  else base = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
  return [base, base+'.ts', base+'.json'].find(p => Object.hasOwn(files,p));
}
const moduleCache = new Map();
function evaluate(file) {
  if (moduleCache.has(file)) return moduleCache.get(file);
  assert.ok(Object.hasOwn(files,file), `Missing isolated dependency: ${file}`);
  if (file.endsWith('.json')) return JSON.parse(files[file]);
  const module = {exports: {}};
  moduleCache.set(file,module.exports);
  const result = ts.transpileModule(files[file], {fileName:file, compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}});
  new Function('require','module','exports',result.outputText)(specifier => {
    const resolved = resolveModule(specifier,file);
    assert.ok(resolved, `Unprovided dependency ${specifier} in ${file}`);
    return evaluate(resolved);
  },module,module.exports);
  return module.exports;
}
const parsingErrors=[];
for (const [file,source] of Object.entries(files)) {
  assert.ok(!source.includes(String.fromCharCode(65533)),`Replacement character: ${file}`);
  if (!/\.tsx?$/.test(file)) continue;
  const sf=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  for(const d of sf.parseDiagnostics) parsingErrors.push({file,code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' ')});
}
assert.equal(parsingErrors.length,0,JSON.stringify(parsingErrors));

// Exact supplied data modules; the marketplace barrel is intentionally narrowed
// to its new editorial exports. This is NOT a full app/workspace typecheck.
const virtualRoot='/__cars_editorial__/';
const canon=value=>value.replaceAll('\\','/');
const virtualFiles=new Map(Object.entries(files).map(([p,s])=>[virtualRoot+p,s]));
const options={strict:true,noEmit:true,skipLibCheck:true,esModuleInterop:true,resolveJsonModule:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler};
const host=ts.createCompilerHost(options);
const systemRead=host.readFile.bind(host),systemExists=host.fileExists.bind(host),systemSource=host.getSourceFile.bind(host);
host.readFile=p=>virtualFiles.get(canon(p))??systemRead(p);
host.fileExists=p=>virtualFiles.has(canon(p))||systemExists(p);
host.getSourceFile=(p,languageVersion,onError,shouldCreateNewSourceFile)=>virtualFiles.has(canon(p))?ts.createSourceFile(p,virtualFiles.get(canon(p)),languageVersion,true,p.endsWith('.json')?ts.ScriptKind.JSON:ts.ScriptKind.TS):systemSource(p,languageVersion,onError,shouldCreateNewSourceFile);
host.writeFile=()=>{throw new Error('Isolated checker must never emit files');};
host.resolveModuleNames=(names,containingFile)=>names.map(specifier=>{
  const relative=canon(containingFile).replace(virtualRoot,'');
  const found=resolveModule(specifier,relative);
  return found?{resolvedFileName:virtualRoot+found,extension:found.endsWith('.json')?ts.Extension.Json:ts.Extension.Ts}:undefined;
});
const roots=Object.keys(files).filter(p=>p.endsWith('.ts')).map(p=>virtualRoot+p);
const program=ts.createProgram(roots,options,host);
const diagnostics=ts.getPreEmitDiagnostics(program).map(d=>({file:d.file?.fileName,code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' ')}));
assert.equal(diagnostics.length,0,JSON.stringify(diagnostics));

const expectedStock=JSON.parse(files['auto-best/src/lib/data/dealer-stock.json']);
assert.equal(expectedStock.inventory.length,8);
for(const stockPath of ['modern/packages/marketplace-domain/dealer-stock.json','carwow/src/lib/data/dealer-stock.json']) {
  assert.deepEqual(JSON.parse(files[stockPath]).inventory,expectedStock.inventory,'Variant inventory differs');
}
const coreResults=[];
for(const file of corePaths){
  const data=evaluate(file);
  assert.equal(data.dealerGuides.length,10);
  assert.equal(new Set(data.dealerGuides.map(g=>g.id)).size,10);
  assert.ok(data.dealerGuides.find(g=>g.id===5).description.bg.includes(expectedStock.phone));
  assert.ok(data.dealerGuides.find(g=>g.id===8).sections[0].body.bg.includes(expectedStock.observedAt));
  for(const guide of data.dealerGuides){
    assert.ok(guide.title.bg&&guide.title.en&&guide.description.bg&&guide.description.en);
    assert.equal(guide.sections.length,2);
    for(const section of guide.sections) assert.ok(section.heading.bg&&section.heading.en&&section.body.bg&&section.body.en);
  }
  coreResults.push({file,records:10,localeFields:'bg/en'});
}
const auto=evaluate('auto-best/src/lib/data/editorial.ts');
assert.deepEqual(auto.blogPosts.map(p=>p.id),[1,2,3,4,5,6,7,8,9]);
assert.equal(auto.filterBlogPosts(auto.blogPosts,{q:'',category:''}).length,9);
assert.ok(auto.filterBlogPosts(auto.blogPosts,{q:'',category:'Оглед'}).every(p=>p.category==='Оглед'));
const home=evaluate('auto-best/src/lib/data/home.ts');
assert.deepEqual(home.editorial.map(p=>p.href),['/contact','/blog-detail/1','/blog-detail/2']);
const company=evaluate('auto-best/src/lib/data/company.ts');
assert.equal(company.companyServices.length,4);
assert.deepEqual(company.contactTopics.map(t=>t.id),['general','inspection','import','leasing','trade-in']);
assert.equal(company.resolveImportUrl('javascript:alert(1)'),null);
const carwow=evaluate('carwow/src/lib/data/daynight-blog.ts');
const slugs=['dnevni-novini-daynight-auto-obnovena-nalichnost','novi-avtomobili-v-nalichnost-daynight-auto','kak-da-kupim-upotrebyavan-avtomobil','lizing-upotrebyavan-avtomobil-plovdiv','dokumenti-registratsia-nov-vnos','bmw-mercedes-audi-upotrebyavani','dizel-benzin-hibrid-elektricheski','kak-da-podgotvim-avtomobil-za-prodazhba','kakvo-oznachava-proveren-avtomobil'];
assert.deepEqual(carwow.daynightArticles.map(p=>p.slug),slugs);
assert.ok(carwow.daynightArticles.every(p=>p.kind==='guide'&&p.author==='Демо редакция'&&p.date===expectedStock.observedAt&&p.image==='/dealer/opengraph.png'));
const faq=evaluate('carwow/src/lib/data/daynight-faq.ts').daynightFaqGroups;
assert.equal(faq.length,3);
const questions=faq.flatMap(group=>group.items);
assert.equal(questions.length,12);
assert.equal(new Set(questions.map(q=>q.answer.map(p=>p.text).join(' '))).size,12);
assert.deepEqual(faq.map(g=>g.containerClass),['container mb-60','container mb-60','container']);
assert.ok(questions.find(q=>q.id==='test-drive').answer.some(p=>p.text.includes(expectedStock.address)));
const modern=evaluate('modern/apps/web/lib/vehicle-guides.ts');
assert.deepEqual(modern.vehicleGuides.map(g=>g.slug),['buying-used-car-bulgaria','ev-hybrid-ownership-checklist','dealer-listing-transparency']);
const contact=files['modern/apps/web/app/[locale]/contact/page.tsx'];
assert.ok(!/Studentski|Студентски|Day\s*(?:&|and)?\s*Night|In-house leasing/i.test(contact));
assert.equal((contact.match(/locationLabel: leadSite\.address/g)||[]).length,2);
assert.equal((contact.match(/sellLocationLabel: leadSite\.address/g)||[]).length,2);
console.log(JSON.stringify({slug:input.slug,node:process.version,typescript:ts.version,mode:'isolated source/module checks; no framework build or browser',parsedFiles:Object.keys(files).filter(p=>/\.tsx?$/.test(p)).length,parseErrors:0,strictDataDiagnostics:0,coreResults,autoArticles:9,carwowArticles:9,carwowFaq:12,modernGuides:3,homeLinksRetained:true,contactTopicsRetained:true,contactAddressFields:'source driven in bg/en',stockRecordsUnchanged:8},null,2));
