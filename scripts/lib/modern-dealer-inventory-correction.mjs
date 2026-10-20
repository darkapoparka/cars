import {createHash} from 'node:crypto';
import {renderModernDealerInventoryCopy,parseModernPersonalizedListings} from './modern-dealer-inventory-copy.mjs';
import {assertNativeQualification,sealNativeQualification,ADOPTION_FILE} from './native-localization.mjs';
import {baseNativeManifest} from '../publishing/app-variant.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
/** Explicit source-only correction caller; input source seals must pass before changing two declared files. */
export function prepareModernDealerInventoryCorrection({files,manifest,context,root,reviewedCopy}){
 const base=baseNativeManifest(manifest),beforeReceipt=assertNativeQualification(files,base,context,{root});
 if(!base.variants.some(v=>v.key==='modern'))throw Error('Modern companion correction requires selected native Modern');
 const path='modern/packages/marketplace/content/inventory-copy.ts',mockPath='modern/packages/marketplace-domain/testing/mock-data.ts';
 const beforeCopy=files.get(path),mock=files.get(mockPath);if(!beforeCopy||!mock)throw Error('Exact Modern source inputs required');
 const source=new Map(files),rows=parseModernPersonalizedListings(mock.toString('utf8'));
 source.set(path,Buffer.from(renderModernDealerInventoryCopy(rows,{reviewedCopy})));
 const afterReceipt=sealNativeQualification(source,base,beforeReceipt.releases,context,{root});
 assertNativeQualification(source,base,context,{root});
 const changes=[path,ADOPTION_FILE].filter(p=>!source.get(p).equals(files.get(p))).map(p=>({path:p,beforeSha256:sha(files.get(p)),afterSha256:sha(source.get(p))}));
 if(changes.some(x=>![path,ADOPTION_FILE].includes(x.path)))throw Error('Unexpected Modern source correction');
 for(const [p,b]of files)if(![path,ADOPTION_FILE].includes(p)&&!source.get(p)?.equals(b))throw Error('Modern source correction changed undeclared input: '+p);
 return {files:source,changes,proof:{schemaVersion:1,kind:'cars-modern-dealer-inventory-copy-source-correction',dealer:manifest.slug,mockInputSha256:sha(mock),listingCount:rows.length,beforeNativeInput:beforeReceipt.input,afterNativeInput:afterReceipt.input,beforeReceiptSha256:sha(files.get(ADOPTION_FILE)),afterReceiptSha256:sha(source.get(ADOPTION_FILE)),unchangedListingFacts:true,unchangedQAParents:true,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,requiresChangedModernCompile:true,requiresActualNativePolicy:true,requiresHostedAcceptance:true}};
}
