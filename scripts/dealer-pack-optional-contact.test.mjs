import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import test from 'node:test';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import {applyDealerPackOptionalContact} from './lib/dealer-pack-optional-contact.mjs';
import {UK_IMPORT_PHONE_INPUT_PATHS, repairImportUkOptionalPhone} from './lib/client-refresh-uk-native.mjs';
import {applyOptionalContactFallback, applyModernOptionalContactFallback, MODERN_PHONE_BOUNDARIES} from './publishing/dealer-contact-fallback.mjs';
import {applyAutoBestOptionalContactFallback, AUTO_BEST_PHONE_BOUNDARIES} from './publishing/auto-best-optional-contact.mjs';
import {refreshAdapterInternals} from './lib/client-refresh-adapters.mjs';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || path.join(root, 'runtime/dealer-pack-tools/package.json'));
const typescript = require('typescript');
const factPolicy = 'dealer-pack-optional-v1';
const native = name => fs.readFileSync(path.join(root, 'templates', name));
const manifest = {slug:'contact-facts', sourceFormat:'dealer-pack', packaging:{version:'5'},
  shareIdentity:{publicOrigin:'https://contact-facts.webpreviews.site'},
  variants:[{key:'modern',base:'/variant-2'},{key:'import',base:'/variant-3'}],localization:{defaultLocale:'en'}};

// Preserve the actual selected telephone controls, schema and CSS. Only the
// generated dealer facts and one authored guidance sentence are fixture data.
function fixture(countryCode = 'AE', address = 'Recorded street') {
  const profile = {factPolicy, business:{countryCode, address, phoneDisplay:'', phoneHref:'', phoneE164:''}};
  const files = new Map();
  for (const name of [...Object.keys(MODERN_PHONE_BOUNDARIES),
    'modern/packages/marketplace-domain/site-config.ts', 'modern/packages/marketplace/site-config.ts']) files.set(name, native(name));
  files.set('modern/packages/marketplace/lead-site.ts', Buffer.from('export const leadSite = {\n  address: '+JSON.stringify(address)+',\n  phoneDisplay: "",\n  phoneHref: "",\n  contactUrl: "",\n};\n'));
  for (const name of UK_IMPORT_PHONE_INPUT_PATHS) files.set('import/'+name, native('import/'+name));
  files.set('import/src/lib/config/dealer.ts', Buffer.from('export const daynightContact = '+JSON.stringify({primaryPhoneLabel:'',primaryPhoneHref:'',marketplacePhoneLabel:'',marketplacePhoneHref:'',emailHref:''},null,2)+' as const;\n'));
  files.set('import/src/lib/data/blog.ts', Buffer.from('export const guidance = "Contact the dealership on  and identify the exact vehicle before visiting.";\n'));
  const home = 'import/src/lib/components/home1/Home1Hero.svelte';
  files.set(home, Buffer.from(String(files.get(home)).replace("const mobileShowroomPhoneHref = 'tel:0877733110';", "const mobileShowroomPhoneHref = 'tel:';")));
  for (const relative of [...Object.keys(AUTO_BEST_PHONE_BOUNDARIES),'src/lib/data/navigation.ts']) files.set('auto-best/'+relative, native('auto-best/'+relative));
  files.set('auto-best/src/lib/config/brand.ts', Buffer.from('export const brand = {\n  phone: "",\n  phoneHref: "tel:",\n};\n'));
  files.set('auto-best/src/lib/data/dealer-profile.json', Buffer.from(JSON.stringify(profile)));
  files.set('business-facts.json', Buffer.from(JSON.stringify({business:profile.business})));
  return {files, profile};
}

function loadTypescript(source) {
  const output = typescript.transpileModule(source, {compilerOptions:{module:typescript.ModuleKind.CommonJS,target:typescript.ScriptTarget.ES2022}}).outputText;
  const module = {exports:{}};runInNewContext(output, {module,exports:module.exports,require,URL,Intl});return module.exports;
}

for (const country of ['AE','US']) test(country+' missing phones reuse every native consumer and retain exact facts', () => {
  const {files,profile} = fixture(country), before = new Map(files);
  const receipt = applyDealerPackOptionalContact(files, manifest, {profile,typescript});
  assert.equal(receipt.applied,true);assert.equal(receipt.phoneInvented,false);assert(receipt.modern.telephoneActionsHidden>=20);assert.equal(receipt.importPaths.length,26);
  const packaged = applyOptionalContactFallback(files, manifest);
  assert.equal(packaged.autoBestOptionalContact.telephoneActionsHidden,17);assert.equal(packaged.autoBestOptionalContact.phoneInvented,false);
  for (const name of ['business-facts.json','modern/packages/marketplace/lead-site.ts','import/src/lib/config/dealer.ts','auto-best/src/lib/config/brand.ts','auto-best/src/lib/data/dealer-profile.json']) assert.equal(files.get(name),before.get(name),name+' facts unchanged');
  for (const name of [...Object.keys(MODERN_PHONE_BOUNDARIES),...Object.keys(AUTO_BEST_PHONE_BOUNDARIES).map(name=>'auto-best/'+name)]) {
    const tags = source => source.match(/<\/?[A-Za-z][\w.:-]*(?=[\s/>])/g) ?? [];
    const styles = source => source.match(/<style\b[\s\S]*?<\/style>/g) ?? [];
    assert.deepEqual(tags(String(files.get(name))),tags(String(before.get(name))),name+' native elements');
    assert.deepEqual(styles(String(files.get(name))),styles(String(before.get(name))),name+' native styles');
  }
  const modern = loadTypescript(String(files.get('modern/packages/marketplace-domain/site-config.ts')));
  const contact = {address:'Recorded street',city:'Recorded city',phoneDisplay:'',phoneHref:'',contactUrl:receipt.modern.href,email:'',mapsUrl:'https://example.com/map',mapsEmbedUrl:'https://example.com/embed',socialLinks:{}};
  assert.equal(modern.publicSiteSchema.shape.contact.safeParse(contact).success,true);
  assert.equal(modern.publicSiteSchema.shape.contact.safeParse({...contact,phoneHref:'tel:invalid'}).success,false);
  const name='import/src/lib/config/site.ts', ast=typescript.createSourceFile(name,String(files.get(name)),typescript.ScriptTarget.Latest,true);
  const validator=ast.statements.find(node=>typescript.isFunctionDeclaration(node)&&node.name?.text==='validateSiteConfig');assert(validator);
  const imported=loadTypescript(validator.getText(ast)), value={identity:{origin:manifest.shareIdentity.publicOrigin,name:'Recorded dealer',displayName:'Recorded dealer',logo:'/logo.png',logoOnDark:'/dark.png',favicon:'/favicon.ico'},
    contact:{phone:'',phoneHref:'',mapHref:'https://example.com/map',contactHref:packaged.href,messageHref:'https://example.com/contact'},theme:{accent:'#111111'},locale:{currency:country==='AE'?'AED':'USD',supported:['en','bg'],default:'en'},finance:{annualRate:0,months:12,downPaymentPercent:0}};
  assert.equal(imported.validateSiteConfig(value),value);
  assert.throws(()=>imported.validateSiteConfig({...value,contact:{...value.contact,phoneHref:'tel:+14155552671'}}),/published telephone/);
});

test('pack phone policy is explicit and legacy non-GB preparation remains byte-identical', () => {
  const {files,profile}=fixture('US'), before=[...files];
  assert.equal(applyDealerPackOptionalContact(files,{...manifest,sourceFormat:undefined},{profile,typescript}).applied,false);
  assert.equal(applyDealerPackOptionalContact(files,manifest,{profile:{...profile,factPolicy:undefined},typescript}).applied,false);
  assert.equal(applyModernOptionalContactFallback(files,manifest,{profile,typescript}).applied,false);
  assert.equal(applyAutoBestOptionalContactFallback(files,manifest,{profile}).applied,false);
  assert.deepEqual(repairImportUkOptionalPhone(new Map(),profile),[]);assert.deepEqual([...files],before);
});

test('partial phone facts and changed Import consumers fail without applying staged Modern changes', () => {
  for (const failure of ['partial-phone','import-boundary']) {
    const {files,profile}=fixture('US');
    if (failure==='partial-phone') profile.business.phoneDisplay='Sourced label without link';
    else files.set('import/src/lib/components/contact/ContactLocation.svelte',Buffer.from('unreviewed contact consumer'));
    const before=[...files];
    assert.throws(()=>applyDealerPackOptionalContact(files,manifest,{profile,typescript}),/Incomplete published|boundary changed/);
    assert.deepEqual([...files],before);
  }
});

test('a sourced phone is preserved and empty street address composes with absent-phone preparation', () => {
  const known=fixture('US'), before=[...known.files];
  Object.assign(known.profile.business,{phoneDisplay:'+1 415 555 2671',phoneHref:'tel:+14155552671',phoneE164:'+14155552671'});
  assert.equal(applyDealerPackOptionalContact(known.files,manifest,{profile:known.profile,typescript}).applied,false);assert.deepEqual([...known.files],before);
  const absent=fixture('AE',''), receipt=applyDealerPackOptionalContact(absent.files,manifest,{profile:absent.profile,typescript});
  assert.equal(receipt.phoneInvented,false);assert.equal(receipt.modern.addressInvented,false);
  const schema=loadTypescript(String(absent.files.get('modern/packages/marketplace-domain/site-config.ts')));
  assert.equal(schema.publicSiteSchema.shape.contact.shape.address.safeParse('').success,true);
  assert.match(String(absent.files.get('modern/packages/marketplace/lead-site.ts')),/address: ""/);
});

for (const country of ['GB','AE','US']) test(country+' optional phone composes with the maintained Svelte identity personalizer', t => {
  const {files,profile}=fixture(country), home='src/lib/components/home1/Home1Hero.svelte';
  Object.assign(profile.business,{name:'Recorded dealer',shortName:'Recorded dealer'});
  const candidate=fs.mkdtempSync(path.join(os.tmpdir(),'cars-optional-phone-'));
  t.after(()=>fs.rmSync(candidate,{recursive:true,force:true}));
  const target=path.join(candidate,home);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,native('import/'+home));
  refreshAdapterInternals.patchImportText(candidate,profile,{typescript});
  const personalized=fs.readFileSync(target);
  assert.match(String(personalized),/const mobileShowroomPhoneHref = "tel:";/);
  files.set('import/'+home,personalized);
  const facts=files.get('import/src/lib/config/dealer.ts'), originalProfile=structuredClone(profile);
  if(country==='GB') {
    const relative=new Map(UK_IMPORT_PHONE_INPUT_PATHS.map(name=>[name,files.get('import/'+name)]));
    for(const name of repairImportUkOptionalPhone(relative,profile)) files.set('import/'+name,relative.get(name));
  } else {
    const receipt=applyDealerPackOptionalContact(files,manifest,{profile,typescript});
    assert.equal(receipt.phoneInvented,false);
  }
  const prepared=String(files.get('import/'+home));
  assert.match(prepared,/const mobileShowroomPhoneHref = site.contact.phoneHref;/);
  assert.match(prepared,/\{#if mobileShowroomPhoneHref\}/);
  assert.doesNotMatch(prepared,/tel:0877733110|const mobileShowroomPhoneHref = ["']tel:["'];/);
  assert.equal(files.get('import/src/lib/config/dealer.ts'),facts);
  assert.deepEqual(profile,originalProfile);
});

test('absent Import phone binding still rejects nonempty, unknown and duplicate literals atomically', () => {
  const name='import/src/lib/components/home1/Home1Hero.svelte';
  const original="\tconst mobileShowroomPhoneHref = 'tel:';";
  for(const replacement of [
    '\tconst mobileShowroomPhoneHref = "tel:+971500000000";',
    '\tconst mobileShowroomPhoneHref = `tel:`;',
    original+'\n'+original,
    original+'\n\tconst mobileShowroomPhoneHref = "tel:";'
  ]) {
    const {files,profile}=fixture('AE');
    files.set(name,Buffer.from(String(files.get(name)).replace(original,replacement)));
    const before=[...files];
    assert.throws(()=>applyDealerPackOptionalContact(files,manifest,{profile,typescript}),/absent phone binding/);
    assert.deepEqual([...files],before);
  }
});
