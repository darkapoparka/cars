import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {refreshAdapterInternals as adapters} from './lib/client-refresh-adapters.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {repairAutoBestUkInventoryContract, UK_AUTO_BEST_INVENTORY_PATHS} from './lib/client-refresh-uk-auto-best.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pin = '2afd974c23d4f4cfb290ed99a00f46074793be3a';
const created = 'eb4f0136fa8d5da7606df363fcf1b4963faf6937';
const asCommit = '4631f7182ca575faec140f00962542fe42e2eb9d';
const broadbentSlug = 'stockport-broadbent-car-and-servicing';
const asSlug = 'batley-as-motor-group';
const prefix = 'clients/' + broadbentSlug + '/auto-best/';
const inventoryPath = 'src/lib/data/inventory.ts';
const env = {...process.env, GIT_NO_LAZY_FETCH:'1', GIT_TERMINAL_PROMPT:'0'};
const ts = createRequire(path.join(root, 'templates/mobile/package.json'))('typescript');
const cache = new Map();
function git(args) {
  return execFileSync('git', ['-C',root,...args], {encoding:'utf8',env,timeout:10000,
    maxBuffer:4194304,stdio:['ignore','pipe','pipe']});
}
function at(commit, name) {
  const key = commit + ':' + name;
  if (!cache.has(key)) {
    let bytes;
    try { bytes = Buffer.from(git(['show',key])); }
    catch (error) {
      // The sparse PC may lack this new commit/blob; the exact GitHub read is
      // retained under ignored runtime, and its immutable Git blob is checked.
      if (commit !== asCommit || name !== 'clients/' + asSlug + '/auto-best/' + inventoryPath) throw error;
      const blob = 'a30cab0c115825cd448361c7ccda3e693bc58750';
      bytes = fs.readFileSync(path.join(root,'runtime/uk-cloudflare-hosted-20261010/auto-best-as-' + blob + '.txt'));
      assert.equal(createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'), blob);
    }
    cache.set(key, bytes.toString('utf8').replace(/\r\n/g,'\n'));
  }
  return cache.get(key);
}
const batch = JSON.parse(fs.readFileSync(path.join(root,'leads/uk-2026-10-10-build-manifest.json'),'utf8'));
const profiles = batch.dealers.map(dealer => loadDealerProfile(path.join(root,dealer.brief),dealer.slug));
const broadbent = profiles.find(profile => profile.slug === broadbentSlug);
const asProfile = profiles.find(profile => profile.slug === asSlug);
const nativeInventory = at(pin,'templates/auto-best/' + inventoryPath);
const retained = (profile = broadbent) => new Map([[inventoryPath, Buffer.from(at(
  profile.slug === asSlug ? asCommit : created, 'clients/' + profile.slug + '/auto-best/' + inventoryPath))]]);
const text = value => Buffer.isBuffer(value) ? value.toString('utf8') : value;
const inventoryLiteral = source => {
  const match = [...source.matchAll(/^export const featuredVehicles: Vehicle\[\] = (\[\n[\s\S]*?\n\]);$/gm)];
  assert.equal(match.length,1); return match[0][1];
};
const ast = (source, name = 'source.ts') => ts.createSourceFile(name,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
const isExported = node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
function publicNames(source) {
  return ast(source).statements.flatMap(node => !isExported(node) ? [] :
    ts.isVariableStatement(node) ? node.declarationList.declarations.map(declaration => declaration.name.getText()) :
    ts.isTypeAliasDeclaration(node) ? [node.name.text] : []);
}
function vehicleMembers(source) {
  const node = ast(source).statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'Vehicle');
  assert.ok(node && ts.isTypeLiteralNode(node.type));
  return new Map(node.type.members.map(member => [member.name.getText(),
    {optional:!!member.questionToken,type:member.type.getText()}]));
}
function script(source) {
  return source.includes('<script') ? [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]).join('\n') : source;
}
function inventoryImports(source) {
  return ast(script(source)).statements.filter(node => ts.isImportDeclaration(node) &&
    /(?:^|[/$])inventory(?:\.ts)?$/.test(node.moduleSpecifier.text));
}
function consumers(commit, base) {
  const paths = git(['grep','-l','inventory',commit,'--',base+'src']).trim().split(/\r?\n/).filter(Boolean)
    .map(value => value.slice(commit.length+1));
  return paths.map(name=>({name,source:at(commit,name)})).filter(value=>inventoryImports(value.source).length);
}
const approvedConsumers = consumers(pin,'templates/auto-best/');
const canonicalConsumers = consumers(created,prefix);

// Import the actual retained locale policy, dealer configuration and catalogue
// in memory. No fake formatter or translation is supplied to these behavior tests.
const moduleUrls = new Map();
function moduleUrl(name, override) {
  const key = name + '\0' + (override ?? '');
  if (moduleUrls.has(key)) return moduleUrls.get(key);
  let source = ts.transpileModule(override ?? at(created,prefix+name), {
    compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}
  }).outputText;
  const tree = ast(source), replacements = [];
  for (const node of tree.statements) {
    if (!(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) || !node.moduleSpecifier) continue;
    const specifier = node.moduleSpecifier.text;
    let resolved;
    if (specifier.startsWith('$lib/')) resolved = 'src/lib/' + specifier.slice(5);
    else if (specifier.startsWith('$config/')) resolved = 'src/lib/config/' + specifier.slice(8);
    else if (specifier.startsWith('.')) resolved = path.posix.normalize(path.posix.join(path.posix.dirname(name),specifier));
    else throw Error('Unexpected runtime dependency: ' + specifier);
    if (!path.posix.extname(resolved)) resolved += '.ts';
    replacements.push({start:node.moduleSpecifier.getStart(tree),end:node.moduleSpecifier.end,
      value:JSON.stringify(moduleUrl(resolved))});
  }
  for (const replacement of replacements.sort((a,b)=>b.start-a.start)) {
    source = source.slice(0,replacement.start) + replacement.value + source.slice(replacement.end);
  }
  const url = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  moduleUrls.set(key,url); return url;
}
const importInventory = source => import(moduleUrl(inventoryPath,source));

test('the approved stock exports, Vehicle type and every actual native consumer remain compatible', () => {
  const generated = adapters.autoBestInventory(broadbent), names = publicNames(generated);
  assert.deepEqual(names,publicNames(nativeInventory));
  assert.equal(names.length,8);
  const fields = vehicleMembers(generated);
  for (const [key,value] of vehicleMembers(nativeInventory)) assert.deepEqual(fields.get(key),value,key);
  assert.deepEqual(fields.get('cardBrand'),{optional:true,type:'string'});
  assert.equal(approvedConsumers.length,20); assert.equal(canonicalConsumers.length,20);
  for (const {name,source} of [...approvedConsumers,...canonicalConsumers]) {
    for (const node of inventoryImports(source)) {
      assert.ok(node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings),name);
      for (const binding of node.importClause.namedBindings.elements) {
        assert.ok(names.includes(binding.propertyName?.text ?? binding.name.text),
          name + ' needs ' + (binding.propertyName?.text ?? binding.name.text));
      }
    }
  }
  const labels = canonicalConsumers.filter(value=>inventoryImports(value.source).some(node=>
    node.importClause.namedBindings.elements.some(binding=>binding.name.text === 'formatVehiclePriceLabel')));
  assert.deepEqual(labels.map(value=>value.name.slice(prefix.length)).sort(),[
    'src/lib/components/vehicles/VehicleCard.svelte','src/routes/listing-detail-v1/[id]/+page.svelte']);
});

test('repair of both genuinely created dealers preserves every factual inventory byte', () => {
  assert.deepEqual(UK_AUTO_BEST_INVENTORY_PATHS,[inventoryPath]);
  for (const profile of [broadbent,asProfile]) {
    const files = retained(profile), original = text(files.get(inventoryPath));
    const literal = inventoryLiteral(original);
    assert.deepEqual(repairAutoBestUkInventoryContract(files,profile),[inventoryPath]);
    assert.ok(Buffer.isBuffer(files.get(inventoryPath)));
    const output = text(files.get(inventoryPath));
    assert.equal(inventoryLiteral(output),literal);
    assert.equal(output,adapters.autoBestInventory(profile));
    const sourceWithoutNewContract = output.replace(
      '  /** Optional manufacturer sub-brand used by compact card identity. */\n  cardBrand?: string;\n',''
    ).slice(0,original.length);
    assert.equal(sourceWithoutNewContract,original);
    assert.throws(()=>repairAutoBestUkInventoryContract(files,profile),/boundary changed/);
  }
});

test('real 71-record UK generation preserves facts and formats every published price in GBP', async () => {
  let count = 0, unknown = [];
  for (const profile of profiles) {
    const source = adapters.autoBestInventory(profile), module = await importInventory(source);
    assert.equal(module.featuredVehicles.length,profile.listings.length);
    for (const [index,item] of profile.listings.entries()) {
      const vehicle = module.featuredVehicles[index];
      assert.equal(vehicle.id,index+1); assert.equal(vehicle.title,item.title);
      assert.equal(vehicle.make,item.make); assert.equal(vehicle.priceEur,item.priceAmount);
      assert.equal(vehicle.yearNumber,item.year); assert.equal(vehicle.image,item.image);
      assert.equal(vehicle.mileageValue,item.mileageValue); assert.equal(vehicle.mileageUnit,item.mileageUnit);
      assert.equal(vehicle.fuel,item.fuel); assert.equal(vehicle.transmission,item.transmission);
      assert.equal(vehicle.evidenceUrl,item.sourceUrl); assert.equal(vehicle.verification,'sample');
      for (const locale of ['en','bg']) {
        const expected = new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'bg-BG',
          {style:'currency',currency:'GBP',currencyDisplay:'narrowSymbol',maximumFractionDigits:0}).format(item.priceAmount);
        assert.equal(module.formatVehiclePrice(vehicle.priceEur,locale),expected);
        assert.equal(module.formatVehiclePriceLabel(vehicle.priceEur,locale),expected);
      }
      if (item.transmissionType === 'other') unknown.push([profile.slug,item.id,vehicle.transmission,vehicle.fuel]);
      count++;
    }
  }
  assert.equal(profiles.length,10); assert.equal(count,71);
  assert.deepEqual(unknown,[[broadbentSlug,'860026521888','Not published','Not published']]);
});

test('unknown prices use the actual bilingual catalogue and the native label behavior', async () => {
  const generated = adapters.autoBestInventory(broadbent), module = await importInventory(generated);
  const priceStatements = ast(nativeInventory).statements.filter(node=>ts.isVariableStatement(node) &&
    node.declarationList.declarations.some(declaration=>['formatVehiclePrice','formatVehiclePriceLabel'].includes(declaration.name.getText())))
    .map(node=>node.getText()).join('\n');
  const native = await importInventory(
    "import {formatPrice,localeContract,type Locale} from '$lib/locale/core';\n" +
    "import {templateText} from '$lib/locale/messages';\n" + priceStatements);
  for (const amount of [0,-1,NaN,3995,10000,250000]) for (const locale of ['en','bg']) {
    assert.equal(module.formatVehiclePriceLabel(amount,locale),native.formatVehiclePriceLabel(amount,locale));
  }
  assert.equal(module.formatVehiclePriceLabel(0,'en'),'Price on request');
  assert.notEqual(module.formatVehiclePriceLabel(0,'bg'),'Price on request');
  assert.doesNotMatch(module.formatVehiclePriceLabel(0,'bg'),/[0-9£€]/);
  assert.throws(()=>module.formatVehiclePriceLabel(Infinity,'en'),/finite/);
  const unknown = structuredClone(broadbent);
  unknown.listings[0].priceAmount = 0;
  const withUnknown = await importInventory(adapters.autoBestInventory(unknown));
  assert.equal(withUnknown.featuredVehicles[0].priceEur,0);
  assert.equal(withUnknown.formatVehiclePriceLabel(withUnknown.featuredVehicles[0].priceEur),'Price on request');
});

function cardDiagnostics(inventory) {
  const nativeCard = script(at(created,prefix+'src/lib/components/vehicles/VehicleCard.svelte'));
  const tree = ast(nativeCard), replacements = [];
  for (const node of tree.statements.filter(ts.isImportDeclaration)) {
    const clause = node.importClause;
    let replacement;
    if (/(?:^|[/$])inventory$/.test(node.moduleSpecifier.text)) {
      replacement = node.getText().replace(node.moduleSpecifier.getText()," './inventory'".trim());
    } else {
      const names = [...(clause?.name ? [clause.name.text] : []),
        ...(clause?.namedBindings && ts.isNamedImports(clause.namedBindings) ? clause.namedBindings.elements.map(x=>x.name.text) : [])];
      replacement = names.map(name=>'declare const ' + name + ': any;').join('\n');
    }
    replacements.push({start:node.getStart(tree),end:node.end,replacement});
  }
  let card = nativeCard;
  for (const entry of replacements.sort((a,b)=>b.start-a.start)) card = card.slice(0,entry.start)+entry.replacement+card.slice(entry.end);
  card += '\ndeclare function $props<T>(): T;\ndeclare function $derived<T>(value:T):T;\n';
  const inventorySource = inventory.replace(/^import [^\n]+\n/gm,'') +
    "\ntype Locale = 'en' | 'bg';\ndeclare const localeContract:{defaultLocale:Locale};\n" +
    'declare function formatPrice(amount:number,locale:Locale):string;\ndeclare function templateText<T>(locale:Locale,value:T):T;\n';
  const virtualRoot = path.join(root,'runtime/uk-auto-best-contract-types');
  const normalize = name=>path.resolve(name).replaceAll('\\','/').toLowerCase();
  const virtual = new Map([[normalize(path.join(virtualRoot,'card.ts')),card],
    [normalize(path.join(virtualRoot,'inventory.ts')),inventorySource]]);
  const options = {noEmit:true,strict:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,
    moduleResolution:ts.ModuleResolutionKind.Bundler,types:[],skipLibCheck:true};
  const host = ts.createCompilerHost(options), read = host.readFile.bind(host), exists = host.fileExists.bind(host);
  host.readFile = file=>virtual.get(normalize(file)) ?? read(file);
  host.fileExists = file=>virtual.has(normalize(file)) || exists(file);
  host.getSourceFile = (file,language)=>{const source=host.readFile(file);return source===undefined ? undefined : ts.createSourceFile(file,source,language,true);};
  host.resolveModuleNames = names=>names.map(name=>name==='./inventory'
    ? {resolvedFileName:path.join(virtualRoot,'inventory.ts'),extension:ts.Extension.Ts}
    : undefined);
  const program = ts.createProgram([path.join(virtualRoot,'card.ts'),path.join(virtualRoot,'inventory.ts')],options,host);
  return ts.getPreEmitDiagnostics(program).filter(item=>item.category===ts.DiagnosticCategory.Error)
    .map(item=>({code:item.code,message:ts.flattenDiagnosticMessageText(item.messageText,' ')}));
}

test('the actual retained VehicleCard script type-checks and both previous failures are reproduced', () => {
  const original = text(retained().get(inventoryPath));
  const before = cardDiagnostics(original);
  assert.ok(before.some(item=>[2305,2724].includes(item.code) && item.message.includes('formatVehiclePriceLabel')), JSON.stringify(before));
  assert.ok(before.some(item=>item.code===2339 && item.message.includes('cardBrand')));
  assert.deepEqual(cardDiagnostics(adapters.autoBestInventory(broadbent)),[]);
});

test('unexpected modules, factual changes and non-UK candidates cannot receive a silent repair', () => {
  for (const transform of [
    source=>source.replace('  make: string;','  make: unknown;'),
    source=>source.replace('export const formatVehiclePrice =','export const renamedPrice ='),
    source=>source.replace('"priceEur": 3995','"priceEur": 3996'),
    source=>source.replace('"title": "2017 Peugeot','"title": "2018 Peugeot'),
    source=>source+'export const unexpected = true;\n'
  ]) {
    const files = retained(), before = Buffer.from(transform(text(files.get(inventoryPath))));
    files.set(inventoryPath,before);
    assert.throws(()=>repairAutoBestUkInventoryContract(files,broadbent),/boundary changed|factual inventory mismatch/);
    assert.equal(files.get(inventoryPath),before);
  }
  const files = retained(), before = files.get(inventoryPath);
  assert.throws(()=>repairAutoBestUkInventoryContract(files,{...broadbent,business:{...broadbent.business,currency:'EUR'}}),/boundary changed/);
  assert.equal(files.get(inventoryPath),before);
  const nonUk = {...broadbent,business:{...broadbent.business,countryCode:'BG',distanceUnit:'km'}};
  assert.deepEqual(repairAutoBestUkInventoryContract(files,nonUk),[]);
  assert.equal(files.get(inventoryPath),before);
  assert.equal(publicNames(adapters.autoBestInventory(nonUk)).includes('formatVehiclePriceLabel'),false);
  assert.throws(()=>repairAutoBestUkInventoryContract(new Map(),broadbent),/source is required/);
});
