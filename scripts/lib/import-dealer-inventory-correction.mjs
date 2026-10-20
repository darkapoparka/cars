import {createHash} from 'node:crypto';
import {repairImportDealerInventoryCatalog} from './import-dealer-inventory-copy.mjs';
import {readTypeScriptCatalog} from './catalog-literal.mjs';
import {assertNativeQualification,sealNativeQualification,ADOPTION_FILE} from './native-localization.mjs';
import {baseNativeManifest} from '../publishing/app-variant.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
/** Explicit source-only repair. The existing native seal must pass first. */
export function prepareImportDealerInventoryCorrection({files,manifest,context,root,reviewedCopy}){
 const base=baseNativeManifest(manifest),beforeReceipt=assertNativeQualification(files,base,context,{root});
 if(!base.variants.some(v=>v.key==='import'))throw Error('Import inventory correction requires selected native Import');
 const path='import/src/lib/content/inventory-localized.ts',feedPath='import/src/lib/data/daynight-listings.json',mockPath='modern/packages/marketplace-domain/testing/mock-data.ts';
 const beforeCopy=files.get(path),feedBytes=files.get(feedPath),mock=files.get(mockPath);if(!beforeCopy||!feedBytes||!mock)throw Error('Exact Import feed/catalog and preserved listing slugs required');
 const feed=JSON.parse(feedBytes),slugs=readTypeScriptCatalog(mock.toString('utf8'),'mockListings').map(row=>row.slug);
 const repaired=repairImportDealerInventoryCatalog({source:beforeCopy.toString('utf8'),feed,listingSlugs:slugs,reviewedCopy});
 const source=new Map(files);source.set(path,Buffer.from(repaired.source));
 const afterReceipt=sealNativeQualification(source,base,beforeReceipt.releases,context,{root});assertNativeQualification(source,base,context,{root});
 const changes=[path,ADOPTION_FILE].filter(p=>!source.get(p).equals(files.get(p))).map(p=>({path:p,beforeSha256:sha(files.get(p)),afterSha256:sha(source.get(p))}));
 for(const [p,b]of files)if(![path,ADOPTION_FILE].includes(p)&&!source.get(p)?.equals(b))throw Error('Import correction changed undeclared input: '+p);
 return{files:source,changes,proof:{schemaVersion:1,kind:'cars-import-dealer-inventory-catalog-source-correction',dealer:manifest.slug,feedInputSha256:sha(feedBytes),listingCount:feed.listings.length,addedSources:repaired.added,beforeNativeInput:beforeReceipt.input,afterNativeInput:afterReceipt.input,beforeReceiptSha256:sha(files.get(ADOPTION_FILE)),afterReceiptSha256:sha(source.get(ADOPTION_FILE)),unchangedListingFacts:true,unchangedQAParents:true,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,requiresChangedImportCompile:true,requiresActualNativePolicy:true,requiresHostedAcceptance:true}};
}
