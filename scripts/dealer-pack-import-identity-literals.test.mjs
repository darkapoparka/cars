import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {runInNewContext} from 'node:vm';
import {refreshAdapterInternals as adapters} from './lib/client-refresh-adapters.mjs';

const root = path.resolve(import.meta.dirname, '..');
const ts = createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || new URL('../templates/import/package.json', import.meta.url))('typescript');
// Exact identity-bearing TS blobs of selected Import release 5d052ea655714f3d0ca3656daa7dbff411e2f747,
// tree87950ec43fdb33fd85dbf6d6b6160e1a779777c6. No generated app/assets or historical download.
const selected = [
  ['src/lib/auxero/about.ts', '5cb475c1774ce28bf73c4d0810e3894638354709'],
  ['src/lib/auxero/agent-detail.ts', '3596eefa332d56be33813cd6d1589cee7014420a'],
  ['src/lib/auxero/faqs.ts', '1713daecf35b4cc5ac361a4078106cded764d1bd'],
  ['src/lib/auxero/home-five.ts', '208c4898d9f2980cf442af1053efc6c57101b827'],
  ['src/lib/auxero/home-two.ts', '7d555ca0132a115bcb141a647b1e23cc5e71684d'],
  ['src/lib/auxero/reviews.ts', '8d7edf36ec000afe7c45af5071ec5c3a7078bc41'],
  ['src/lib/auxero/terms.ts', '714b50d34f3615b1eb7739c80ef098f804131cff'],
  ['src/lib/config/dealer.ts', 'a629f1c93fa935090a08c698e5f6c701e5cb8dd2'],
  ['src/lib/content/contact.ts', '3bbf478c6ad2c7a1ca9551abc5bd851821ab3a3e'],
  ['src/lib/content/extra-localized.ts', '80be366f3b3ec6760da6398899ad18d1eef192ea'],
  ['src/lib/content/localized.ts', '05514d2985db5c4806ce64f8cdb156981f4139e4'],
  ['src/lib/content/sell-your-car.ts', 'd728e76614b5064f1b4543b0bcbb985dc0329c36'],
  ['src/lib/content/services.ts', '83784b4a6f6344e38522a9e5105d26fb078481bc'],
  ['src/lib/data/blog.ts', 'c919ce22215ba4b87d86cb7b537f853d5da262c7'],
  ['src/lib/data/daynight.ts', 'bbfb9f3b5718e95c299564b1de47ae626e961d96'],
  ['src/lib/data/dealers.ts', 'da26176d2a52482e9999ab79d30a3e3acbdbe736'],
  ['src/lib/i18n/final-review.spec.ts', 'c99fae7994e0da0f7f7a178552281233cfb4ce05'],
  ['src/lib/i18n/messages.ts', '76515cc603e60c2d0df23f2dc36491fd2aafb5db'],
  ['src/lib/i18n/native.ts', '3fd546d415be0ae158934391dff7c386bbe7b0ec'],
  ['src/lib/server/account-dashboard-state.ts', '5d0b4ae9efbe9a74c485b7639c69eeeeb4723329'],
  ['src/lib/server/account-listings-state.ts', 'e220238a883d695ba37e513d597a4e9b7032a330'],
  ['src/lib/server/account-message-state.ts', '65d45e5db86e5d63bc5fadc78fd2552ed7513e1f'],
  ['src/lib/server/account-users-state.ts', 'a2a9999eb2cdf4e5a55ccf00cce816c0398b4f3a'],
  ['src/lib/server/admin-cms.ts', '1b0baeebad2af474addc5d16cca676adb5a76102'],
  ['src/lib/server/admin-copilot.ts', 'ee0722607454b54bb01ad547c5cdbb29806ed67d'],
  ['src/lib/server/agents.ts', '2ed840f07464ad355a3cb7567e9485cd9edb595b'],
  ['src/lib/server/api-auth.ts', '52fb3dd6d3aabb634b4586f3cf9a81a97bc74cb9'],
  ['src/lib/server/auth.ts', '62d681bbc92d23cef0ea59c36102f7a724a048a1'],
  ['src/lib/server/auxero-account-data.ts', '4bb3ef0631c67e7110d8daf7d4a02e4be473ad06'],
  ['src/lib/server/auxero-home-data.ts', 'fffc996123b3d57cf11195abef621ba329868c7c'],
  ['src/lib/server/auxero-listing-data.ts', '6b20d8bcf9d6caf9041e0597069a0b718a8b0217'],
  ['src/lib/server/auxero-page.ts', '81e8eb4c040fd1905ca8c32b84aebad734d93947'],
  ['src/lib/server/auxero-public-shell.ts', 'ab3b08a6f02dba90bae56f0e5729c0049afb5635'],
  ['src/lib/server/auxero-support-data.ts', '0a42a5a29e06e1da88ee6561039d833df7f3c721'],
  ['src/lib/server/auxero-template.ts', 'f3af22dce9eb6f817f6aaf27446344ad4cabcd1a'],
  ['src/lib/server/cms-workflow.ts', '8abc593c252ce31bfbb2e587d90e8bf5802b380c'],
  ['src/lib/server/db.ts', 'd946794ae12267a692f7065500801d5305ff32d2'],
  ['src/lib/server/inventory-options.ts', '93d78f65b1dcf08f957b656b32db1c1ac8d8e114'],
  ['src/routes/account/compare/+page.server.ts', 'a1a46438ca5ebbf8eca6d50090955b4855c4d62a'],
  ['src/routes/account/listings/new/+page.server.ts', 'dc5160d4bf728ba9d192c60e024fc5cc136ec410'],
  ['src/routes/account/messages/+page.server.ts', '3c10fa85e1b4921555687237ff51e8f2846fa75e'],
  ['src/routes/account/password/+page.server.ts', 'b37869dedd4eca45c293cdad0fcf8e9d0c94575c'],
  ['src/routes/admin/login/+page.server.ts', 'e57723c2c8fac44fb16b1b0c62e10676b552f8a0'],
  ['src/routes/admin/messages/+page.server.ts', '4247b014b3150b79386735b8a00508c9524dfac2'],
  ['src/routes/api/account/garage/+server.ts', '2f6a6f9ac7605293e144896aff294983544960e5'],
  ['src/routes/api/account/password/+server.ts', '85932cc1626da2d220ab487b9434545c4f6c119b'],
  ['src/routes/api/account/profile/+server.ts', '3ee5e2de5e681bea15dd037a11fc974476c5daaa'],
  ['src/routes/api/agents/+server.ts', 'bfb838617fa78ea75f8cdc29f487d2c7fa3b2430'],
  ['src/routes/api/auth/login/+server.ts', '2363299ec2cec42145251f476931bafb3bc832a5'],
  ['src/routes/api/auth/recovery/+server.ts', '5fc9ea76944601a821637a196a4b6d7043ad5ed5'],
  ['src/routes/api/auth/register/+server.ts', '52b70077f6392825e29408b451587900e2346d8f'],
  ['src/routes/api/inquiries/+server.ts', 'b7c3bbb83e82d8ceb0bdf754524d0b19aba68002'],
  ['src/routes/api/inventory/listings/+server.ts', '19a862d6a2b0598d805ed7e722a08645f32f37a4'],
  ['src/routes/api/inventory/submissions/+server.ts', 'f1275787795ca905888eb23bed6fd53b39599893'],
  ['src/routes/api/messages/+server.ts', '3236aff9ddb67f8e72dac3479444793bd9ebe201'],
  ['src/routes/api/users/+server.ts', 'fd27897257089076722788020145fa1c2ed38053']
];
const distinctCatalogs = new Set(['src/lib/i18n/messages.ts', 'src/lib/locale/messages.ts', 'src/lib/i18n/native.ts',
  'src/lib/content/localized.ts', 'src/lib/content/inventory-localized.ts', 'src/lib/content/extra-localized.ts']);
const names = ["Let's Sell Your Car", "Million's Auto Cars Ltd", 'O\'Brien "Motors" .+ [UK] / North \\ \u0060 \u0024{globalThis.injected=true} $& $\' $1 $$ $\u0060'];
function candidateFor(t) {
  const base = path.join(root, 'runtime/import-facts-tests'); fs.mkdirSync(base, {recursive:true});
  const candidate = fs.mkdtempSync(path.join(base, 'identity-ts-'));
  t.after(() => {const physical = fs.realpathSync(candidate); assert(physical.startsWith(fs.realpathSync(base)+path.sep)); fs.rmSync(physical, {recursive:true,force:true});});
  return candidate;
}
function write(candidate, name, source) {
  const file = path.join(candidate, name); fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, source); return file;
}
function parse(name, source) {
  const tree = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.deepEqual(tree.parseDiagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ')), [], name+' entire emitted TS parses');
  return tree;
}
function literals(tree) {
  const result = [];
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
        [ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind)) result.push(node);
    ts.forEachChild(node, visit);
  }
  visit(tree); return result;
}
function replacements(profile) {
  const b = profile.business;
  return [['DAY NIGHT AUTO GROUP', b.name.toUpperCase()], ['DAY NIGHT AUTO', b.name.toUpperCase()],
    ['Day Night Auto Group', b.name], ['Day & Night Auto Group', b.name], ['Day Night Auto', b.shortName || b.name], ['Day & Night', b.shortName || b.name],
    ['0877733110', b.phoneE164.replace(/\D/g, '')], ['0877 733 110', b.phoneDisplay], ['гр. София, Студентски град, ул. Атанас Манчев 18', b.address]];
}
function substituted(value, rows) {for (const [from,to] of rows) value = value.split(from).join(to); return value;}
function copyOwners(tree) {
  const result = [];
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) &&
        ['replace','replaceAll'].includes(node.expression.name.text) && node.arguments[1]) result.push(node.arguments[1]);
    ts.forEachChild(node,visit);
  }
  visit(tree); return result;
}
function copyLiteralNodes(owners) {
  return new Set(owners.flatMap(owner => literals(owner).filter(node => {
    for (let parent = node.parent; parent && parent !== owner.parent; parent = parent.parent) if (ts.isFunctionLike(parent)) return false;
    return true;
  })));
}
function mask(source, tree, nodes) {
  for (const node of [...nodes].sort((a,b)=>b.pos-a.pos)) {
    const fragment = [ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind);
    const start = node.getStart(tree)+(fragment?1:0), end = node.end-(fragment?(node.kind===ts.SyntaxKind.TemplateTail?1:2):0);
    source = source.slice(0,start)+'<identity-literal>'+source.slice(end);
  }
  return source;
}
for (const name of names) test('selected Import TS literal personalization: '+name, t => {
  const candidate = candidateFor(t), original = new Map();
  for (const [relative,oid] of selected) {
    const bytes = Buffer.from(fs.readFileSync(path.join(root,'templates/import',relative),'utf8').replaceAll('\r\n','\n'));
    assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'), oid, relative+' selected source binding');
    original.set(relative,bytes.toString()); write(candidate,relative,bytes);
  }
  const profile = {business:{name,shortName:name,phoneE164:'+441234567890',phoneDisplay:'+44 1234 567890',address:'12 "King\'s" Road \\ North'}}, before = JSON.stringify(profile);
  const rows = replacements(profile); adapters.patchImportText(candidate,profile,{typescript:ts});
  let changedSlots = 0, apiSlots = 0, executedCopyOwners = 0;
  for (const [relative,source] of original) {
    const output = fs.readFileSync(path.join(candidate,relative),'utf8'), tree = parse(relative,source), actualTree = parse(relative,output);
    if (distinctCatalogs.has(relative)) continue; // Their regex/replacement-dollar and strict catalog contracts have separate tests.
    const beforeNodes = literals(tree), afterNodes = literals(actualTree), changedBefore = [], changedAfter = [], owners = copyOwners(tree), copies = copyLiteralNodes(owners);
    assert.equal(afterNodes.length,beforeNodes.length,relative+' no inserted syntax/literals');
    beforeNodes.forEach((node,index) => {
      const actual = afterNodes[index], expected = substituted(node.text,copies.has(node) ? rows.map(([from,to])=>[from,String(to).split('$').join('$$')]) : rows);
      assert.equal(actual.text,expected,relative+' exact cooked string value at literal '+index);
      if (expected !== node.text) {changedBefore.push(node);changedAfter.push(actual);changedSlots++;if(relative.startsWith('src/routes/api/'))apiSlots++;}
    });
    assert.equal(mask(output,actualTree,changedAfter),mask(source,tree,changedBefore),relative+' every byte outside changed literal text is preserved (auth, control flow, regex and comments)');
    const afterOwners = copyOwners(actualTree); assert.equal(afterOwners.length,owners.length);
    for (const [index,owner] of owners.entries()) {
      if (!literals(owner).some(node => substituted(node.text,rows) !== node.text)) continue;
      const context = {adminMode:false,primaryListingStatus:'draft',inventoryState:{count:3},vehicles:[1,2,3],vehicle:{title:'Fixture title',description:''},escapeHtml:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')};
      const evaluate = (node,ast) => runInNewContext(stripTypeScriptTypes('const result = ('+node.getText(ast)+'); result;'),{...context});
      const beforeCopy = evaluate(owner,tree), afterCopy = evaluate(afterOwners[index],actualTree), input = 'before ORIGINAL after';
      // Exercise real native replacement expansion. Inserted factual dollars
      // remain literal, while pre-existing capture tokens keep their meaning.
      const expected = substituted(input.replace(/(ORIGINAL)/g,beforeCopy),rows);
      const actual = input.replace(/(ORIGINAL)/g,afterCopy);
      if (owner.getText(tree).startsWith('escapeHtml(')) {
        const escapedName = context.escapeHtml(name);
        assert(actual.includes(escapedName),relative+' factual replacement remains exact through the selected HTML escaper');
      } else assert.equal(actual,expected,relative+' native String.replace retains the human factual name');
      executedCopyOwners++;
    }
  }
  assert.equal(selected.length,56); assert.equal(apiSlots,18); assert(changedSlots>200,'All selected server/lib/route ordinary and template text slots are covered');
  assert(executedCopyOwners>=50,'Actual selected replacement-copy arguments execute with native replacement semantics');
  t.diagnostic(JSON.stringify({selectedTsFiles:selected.length,changedLiteralSlots:changedSlots,apiSlots,executedCopyOwners}));
  for (const [relative,expected] of [
    ['src/routes/api/auth/login/+server.ts','Invalid '+name+' account credentials'],
    ['src/routes/api/inventory/submissions/+server.ts',name+' vehicle submission not found'],
    ['src/routes/account/password/+page.server.ts','Update account credentials for this '+name+' workspace.']
  ]) {
    const source = fs.readFileSync(path.join(candidate,relative),'utf8'); assert(literals(parse(relative,source)).some(node=>node.text===expected),relative+' exact human factual name');
    const raw = substituted(original.get(relative),rows); assert(ts.createSourceFile(relative,raw,ts.ScriptTarget.Latest,true).parseDiagnostics.length>0,'Raw replacement reproduces the released quote failure');
  }
  assert.equal(JSON.stringify(profile),before,'Facts are not changed');
});

test('Import template text is escaped while each expression, comment and regex is unchanged', t => {
  const candidate = candidateFor(t), name = names[2];
  const source = [
    '// Day Night Auto in a comment is unrelated source.',
    'const pattern = /Day Night Auto["\'\u0060]/g;',
    'const role = () => { calls++; return "Admin"; };',
    'const ordinary = "Day Night Auto";',
    'const staticText = \u0060Day Night Auto workspace\u0060;',
    'const message = \u0060Day Night Auto \u0024{role()} API for Day Night Auto\u0060;',
    'const middle = \u0060\u0024{role()} Day Night Auto \u0024{role()}\u0060;',
    'const copied = "ORIGINAL".replace(/(ORIGINAL)/, "Day Night Auto $1 $& $$");',
    'const callback = "ORIGINAL".replace(/ORIGINAL/, () => "Day Night Auto");',
    'const searched = "Day Night Auto".replace("Day Night Auto", "matched");'
  ].join('\n');
  const file = write(candidate,'src/lib/server/identity-fixture.ts',source);
  adapters.patchImportText(candidate,{business:{name,shortName:name,phoneE164:'',phoneDisplay:'',address:''}},{typescript:ts});
  const output = fs.readFileSync(file,'utf8'); parse(file,output);
  assert(output.startsWith(source.split('\n').slice(0,3).join('\n')),'Unrelated comment, regex and auth expression bytes remain exact');
  const context = {calls:0}, result = runInNewContext(stripTypeScriptTypes(output)+';({ordinary,staticText,message,middle,copied,callback,searched});',context);
  assert.equal(result.ordinary,name); assert.equal(result.staticText,name+' workspace');
  assert.equal(result.message,name+' Admin API for '+name); assert.equal(result.middle,'Admin '+name+' Admin');
  assert.equal(result.copied,name+' ORIGINAL ORIGINAL $','Only inserted factual dollars are quoted; old captures still expand');
  assert.equal(result.callback,name,'A native replacement callback returns unquoted factual text'); assert.equal(result.searched,'matched','Native search strings retain literal factual dollars');
  assert.equal(context.calls,3); assert.equal(context.injected,undefined,'Sourced literal interpolation never executes');
});

test('selected Import pattern and raw-template contexts remain explicitly bounded', () => {
  assert.equal(ts.version,'6.0.3'); const patternStrings = [], tagged = [], regexFiles = new Set();
  for (const [relative] of selected) {
    const source = fs.readFileSync(path.join(root,'templates/import',relative),'utf8'), tree = parse(relative,source);
    const identity = text => /Day Night Auto|DAY NIGHT AUTO|Day & Night/.test(text);
    function visit(node) {
      if (ts.isTaggedTemplateExpression(node) && identity(node.template.getText(tree))) tagged.push(relative);
      if (node.kind === ts.SyntaxKind.RegularExpressionLiteral && identity(node.getText(tree))) regexFiles.add(relative);
      if ((ts.isCallExpression(node)||ts.isNewExpression(node)) && /(?:^|\.)RegExp$/.test(node.expression.getText(tree)) && node.arguments?.some(arg=>identity(arg.getText(tree)))) patternStrings.push(relative);
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && ['match','matchAll','search'].includes(node.expression.name.text) && node.arguments[0] && literals(node.arguments[0]).some(arg=>identity(arg.text))) patternStrings.push(relative);
      ts.forEachChild(node,visit);
    }
    visit(tree);
  }
  assert.deepEqual(patternStrings,[],'No identity-bearing RegExp or string-pattern consumer outside the distinct message handler');
  assert.deepEqual(tagged,[],'Selected identity templates have no raw/tag semantics');
  assert.deepEqual([...regexFiles],['src/lib/i18n/messages.ts'],'All identity regex literals retain the existing contextual handler');
});

for (const expression of ['String.raw','customTag']) test('matching tagged template fails closed: '+expression, t => {
  const candidate = candidateFor(t), source = 'const identity = '+expression+'\u0060Day Night Auto\u0060;';
  const file = write(candidate,'src/lib/server/tagged-fixture.ts',source);
  assert.throws(()=>adapters.patchImportText(candidate,{business:{name:"Let's Sell Your Car",phoneE164:'',phoneDisplay:'',address:''}},{typescript:ts}),/tagged template requires review/);
  assert.equal(fs.readFileSync(file,'utf8'),source,'Unsupported raw source is never written');
});

test('malformed Import TS fails before factual substitution or writing', t => {
  const candidate = candidateFor(t), source = 'const broken = "Day Night Auto';
  const file = write(candidate,'src/routes/api/auth/login/+server.ts',source);
  assert.throws(()=>adapters.patchImportText(candidate,{business:{name:"Let's Sell Your Car",phoneE164:'',phoneDisplay:'',address:''}},{typescript:ts}),/must parse before personalization/);
  assert.equal(fs.readFileSync(file,'utf8'),source);
});
