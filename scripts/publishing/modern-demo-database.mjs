/** Specialize only a reviewed, source-bound independent static dealer package.
 * Keep generated enums/types; accidental database reads/writes fail instead of succeeding.
 * No template, public data policy, form validation, security or factual inventory is changed.
 */
import {createHash} from 'node:crypto';
export const DATABASE_PATH='modern/packages/database/index.ts';
const POLICY='modern/apps/web/public-runtime.ts',SITE='modern/packages/marketplace/lead-site.ts';
export const DATABASE_SHA256='b4478fecafcf264d872c7a4e611dc93db763f7d5ff9f6ef189b77e8fb0ad5176';
const POLICY_BLOB='9e1a0af638f809d20c8a8851dfadf7d7ec187cdb';
const digest=b=>createHash('sha256').update(b).digest('hex');
const normalized=b=>Buffer.from(String(b).replace(/\r\n/g,'\n'));
const blob=b=>createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
export const STATIC_DATABASE_MODULE=String.raw`import "server-only";
import type { PrismaClient } from "./generated/client";
export type * from "./generated/client";
export * from "./generated/enums";
export { Prisma } from "./generated/browser";
// Deliberately no runtime PrismaClient, query compiler, database driver or connection.
export const getDatabase = (): PrismaClient => {
  throw new Error("Database access is unavailable in this independent static dealer demonstration");
};
export const database = new Proxy({} as PrismaClient, {
  get() { return getDatabase(); },
  set() { return getDatabase(); },
});
`;
export function specializeModernDemoDatabase(files,manifest){
 if(!(files instanceof Map)||!manifest?.slug||manifest.candidate?.approved!==false||manifest.candidate?.nativeReleaseQualification!==false)throw Error('Only explicit unapproved independent dealer candidates can be specialized');
 const original=files.get(DATABASE_PATH),policy=files.get(POLICY),site=files.get(SITE);
 if(!original||!policy||!site||digest(normalized(original))!==DATABASE_SHA256||blob(normalized(policy))!==POLICY_BLOB)throw Error('Reviewed Modern database or runtime policy boundary changed');
 const sections=String(site).split('// LEAD_SITE_CONFIG_START');
 if(sections.length!==2||sections[1].split('// LEAD_SITE_CONFIG_END').length!==2)throw Error('Missing explicit dealer identity block');
 const config=sections[1].split('// LEAD_SITE_CONFIG_END')[0];
 if(!/^export const leadSite: LeadSiteConfig = \{/m.test(config)||!/^  staticDemoMode: true,$/m.test(config)||!config.includes('  slug: '+JSON.stringify(manifest.slug)+','))throw Error('Dealer is not explicitly static or identity differs');
 const output=Buffer.from(STATIC_DATABASE_MODULE);
 const receipt={schemaVersion:1,kind:'modern-static-dealer-database-specialization',dealer:manifest.slug,path:DATABASE_PATH,beforeSha256:digest(original),afterSha256:digest(output),runtimePolicyBlob:POLICY_BLOB,staticDemoMode:true,liveDatabaseEnabled:false,accidentalReadsAndWrites:'throw',generatedEnumsAndTypesRetained:true,securityModulesChanged:false,inventoryAndContactsChanged:false,templateMastersChanged:false};
 files.set(DATABASE_PATH,output);files.set('.cars-modern-demo-database.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
 return receipt;
}
