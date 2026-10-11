import {createHash} from 'node:crypto';
const hash=v=>createHash('sha256').update(v).digest('hex');
/** Missing email is not a dealer fact. The public contact link may instead open
 * this same demonstration's existing contact page without changing emailHref.
 */
export function applyOptionalContactFallback(files,manifest){
 const config='import/src/lib/config/dealer.ts',site='import/src/lib/config/site.ts';
 if(!files.has(config)||!files.has(site))throw Error('Missing Import contact config');
 const original=files.get(config),text=String(original),matches=[...text.matchAll(/^[ \t]*"emailHref":\s*"([^"\r\n]*)",?$/gm)];
 if(matches.length!==1)throw Error('Unrecognized dealer email boundary');
 if(matches[0][1])return {schemaVersion:1,dealer:manifest.slug,applied:false,reason:'Existing sourced contact preserved'};
 const origin=new URL(manifest.shareIdentity.publicOrigin),variant=manifest.variants.find(v=>v.key==='import'),locale=manifest.localization.defaultLocale;
 if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash||!variant||!['/variant-2','/variant-3'].includes(variant.base)||!['bg','en'].includes(locale))throw Error('Invalid existing contact route');
 const href=origin.origin+variant.base+'/'+locale+'/contact',before=files.get(site),source=String(before),token='contactHref: daynightContact.emailHref,';
 if(source.split(token).length!==2)throw Error('Import contact consumer changed');
 const after=Buffer.from(source.replace(token,'contactHref: daynightContact.emailHref || '+JSON.stringify(href)+','));
 files.set(site,after);if(files.get(config)!==original)throw Error('Dealer contact facts changed');
 return {schemaVersion:1,dealer:manifest.slug,applied:true,path:site,href,beforeSha256:hash(before),afterSha256:hash(after),originalDealerConfigSha256:hash(original),emailInvented:false,mode:'Existing same-origin contact page; no external enquiry submitted'};
}
