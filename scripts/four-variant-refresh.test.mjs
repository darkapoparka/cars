import assert from 'node:assert/strict';
import test from 'node:test';
import {selectPinnedRevisions, updateManifestPins} from './dealer-updates/three-way-upgrade.mjs';
import {targetManifestForUpgrade} from './dealer-updates/update-dealer-template.mjs';

for (const middle of ['modern', 'import']) test(`four-design ${middle} refresh keeps App and dealer identity`, () => {
  const keys=['auto-best',middle,'carwow','app'];
  const from='1'.repeat(40),to='2'.repeat(40),tree='3'.repeat(40),digest='4'.repeat(64);
  const source=key=>({repository:'darkapoparka/cars',revision:to,path:`templates/${key}`,tree,digest});
  const manifest={schemaVersion:1,slug:'test-dealer',dealerId:'test-dealer',repository:'darkapoparka/cars-testdealer',defaultBranch:'main',language:'bg',packaging:{version:'3'},localization:{schemaVersion:1,dealerId:'test-dealer',defaultLocale:'bg',enabledLocales:['en','bg'],dealerCountry:'BG',inventoryCurrency:'EUR'},switcher:{language:'bg',accent:'#123456'},variants:keys.map((key,i)=>({key,base:['','/variant-2','/variant-3','/variant-4'][i],entry:['/',middle==='modern'?'/variant-2/cars':'/variant-2/','/variant-3/','/variant-4/'][i]})),templateRevisions:Object.fromEntries(keys.map(k=>[k,from])),templateSources:Object.fromEntries(keys.map(k=>[k,{...source(k),revision:from}])),appVariant:{source:{...source('app'),revision:from},baseDeployment:{id:'dpl_retained'}}};
  const lock={templates:Object.fromEntries(keys.map(key=>[key,{status:'approved',commit:to,digest,snapshotPath:`templates/${key}`,source:source(key)}]))};
  const pins=selectPinnedRevisions(manifest,lock);
  const next=updateManifestPins(manifest,pins);
  assert.deepEqual(next.variants,manifest.variants);
  assert.equal(next.repository,manifest.repository);
  assert.equal(next.packaging.version,'3');
  assert.deepEqual(next.appVariant.source,source('app'));
  assert.deepEqual(next.appVariant.baseDeployment,manifest.appVariant.baseDeployment);
  assert.equal(manifest.templateRevisions.app,from);
  assert.equal(Object.keys(pins).length,4);
  const target=targetManifestForUpgrade({dealerRoot:process.cwd(),manifest,pins});
  assert.equal(target.packaging.version,'3');
  assert.deepEqual(target.variants,manifest.variants);
});
