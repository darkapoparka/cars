import test from 'node:test';
import assert from 'node:assert/strict';
import { repairImportDealerInventoryCatalog } from './lib/import-dealer-inventory-copy.mjs';

test('reviewed Red companion preserves stock and retained copy while unknown colors still refuse', () => {
  const source="export const inventoryCopy = { retained: { bg: 'Запазен', en: 'Retained' } } as const;\nexport const inventorySourceKeys = { 'existing-term': 'retained' } as const;\n";
  const description='Example description with {model}.';
  const listing={slug:'reviewed-red-listing',shortDescription:description,color:'Red',features:[],price:19999,mileage:92500,sourceUrl:'https://example.invalid/listing/1090',images:['/unchanged-illustration.webp']};
  const feed={listings:[listing]},before=JSON.stringify(feed),reviewedCopy={'reviewed-red-listing':{sourceDescription:description,en:{description},bg:{description:'Примерно описание с {model}.'}}};
  const result=repairImportDealerInventoryCatalog({source,feed,listingSlugs:[listing.slug],reviewedCopy});
  assert.equal(result.listingFactsUnchanged,true);assert.equal(JSON.stringify(feed),before);
  assert.deepEqual(result.added.filter(x=>x.kind==='color').map(({source,kind,bg,en})=>({source,kind,bg,en})),[{source:'Red',kind:'color',bg:'Червен',en:'Red'}]);
  assert(result.source.includes("retained: { bg: 'Запазен', en: 'Retained' }"));assert(result.source.includes("'existing-term': 'retained'"));
  const again=repairImportDealerInventoryCatalog({source:result.source,feed,listingSlugs:[listing.slug],reviewedCopy});assert.deepEqual(again.added,[]);assert.equal(again.source,result.source);
  const unknown={listings:[{...listing,color:'Ultraviolet-unreviewed'}]},unknownBefore=JSON.stringify(unknown);
  assert.throws(()=>repairImportDealerInventoryCatalog({source,feed:unknown,listingSlugs:[listing.slug],reviewedCopy}),{message:'Import inventory companion copy: missing color requires explicit reviewed EN/BG copy: "Ultraviolet-unreviewed"'});
  assert.equal(JSON.stringify(unknown),unknownBefore);assert.equal(JSON.stringify(feed),before);
});
