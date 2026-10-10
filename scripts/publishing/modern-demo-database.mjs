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
export * as Prisma from "./generated/internal/prismaNamespace";
// Deliberately no runtime PrismaClient, query compiler, database driver or connection.
export const getDatabase = (): PrismaClient => {
  throw new Error("Database access is unavailable in this independent static dealer demonstration");
};
export const database = new Proxy({} as PrismaClient, {
  get() { return getDatabase(); },
  set() { return getDatabase(); },
});
`;
export const PRISMA_CONSUMERS={
  "modern/packages/database/inventory-imports.ts": "5553ca9d2fad0dadb6b0c4ff7f44bc7ce2c4a7aa9c1551e49d9c45092f877b66",
  "modern/packages/database/inventory-ingestion.ts": "eb6e525eee3745d5a1b60498ad677da94bb9dfcd469d847cdb19ce4b773cc2ad",
  "modern/packages/database/kyb-documents.ts": "baa737fc77a68a18a38defbb605cc0fdab05cd6b90892d1609819f47809bb208",
  "modern/packages/database/organizations.ts": "7020189d1ce3157df6000b3db4d5e356473e3c3d7567a0d1301680f20026b7e3"
};
export const DEMO_BRIDGE_PATH="modern/packages/database/cars-demo-client.ts";
const bridge='export type * from "./generated/client";\nexport * from "./generated/enums";\nexport * as Prisma from "./generated/internal/prismaNamespace";\n';
export function specializeModernDemoDatabase(files,manifest){
 if(!(files instanceof Map)||!manifest?.slug||manifest.candidate?.approved!==false||manifest.candidate?.nativeReleaseQualification!==false)throw Error('Only explicit unapproved independent dealer candidates can be specialized');
 const original=files.get(DATABASE_PATH),policy=files.get(POLICY),site=files.get(SITE);
 if(!original||!policy||!site||digest(normalized(original))!==DATABASE_SHA256||blob(normalized(policy))!==POLICY_BLOB)throw Error('Reviewed Modern database or runtime policy boundary changed');
 const sections=String(site).split('// LEAD_SITE_CONFIG_START');
 if(sections.length!==2||sections[1].split('// LEAD_SITE_CONFIG_END').length!==2)throw Error('Missing explicit dealer identity block');
 const config=sections[1].split('// LEAD_SITE_CONFIG_END')[0];
 if(!/^export const leadSite: LeadSiteConfig = \{/m.test(config)||!/^  staticDemoMode: true,$/m.test(config)||!config.includes('  slug: '+JSON.stringify(manifest.slug)+','))throw Error('Dealer is not explicitly static or identity differs');
 const pkg=JSON.parse(String(files.get("modern/packages/database/package.json")||"null"));
 if(pkg?.dependencies?.["@prisma/client"]!=="7.4.2"||(pkg.devDependencies?.prisma??pkg.dependencies?.prisma)!=="7.4.2")throw Error("Requalify generated Prisma namespace for the changed compiler");
 // Use exactly the same generated server namespace as Prisma client.ts, but not its client factory.
 // This retains SQL tag utilities and server types while the database proxy remains unavailable.
 const edits=[];
 if(files.has(DEMO_BRIDGE_PATH))throw Error('Static database bridge already exists');
 for(const [p,expected]of Object.entries(PRISMA_CONSUMERS)){
  const original=files.get(p);if(!original||digest(normalized(original))!==expected)throw Error('Prisma value-import consumer changed: '+p);
  const text=normalized(original).toString(),token='from "./generated/client"';
  if(text.split(token).length!==2)throw Error('Ambiguous Prisma value-import boundary');
  const output=Buffer.from(text.replace(token,'from "./cars-demo-client"'));
  edits.push({path:p,beforeSha256:digest(original),afterSha256:digest(output),bytes:output});
 }
 const output=Buffer.from(STATIC_DATABASE_MODULE);
 const receipt={schemaVersion:1,kind:'modern-static-dealer-database-specialization',dealer:manifest.slug,path:DATABASE_PATH,beforeSha256:digest(original),afterSha256:digest(output),runtimePolicyBlob:POLICY_BLOB,staticDemoMode:true,liveDatabaseEnabled:false,accidentalReadsAndWrites:'throw',generatedEnumsAndTypesRetained:true,securityModulesChanged:false,inventoryAndContactsChanged:false,templateMastersChanged:false,prismaValueImports:edits.map(({bytes,...row})=>row),bridge:{path:DEMO_BRIDGE_PATH,sha256:digest(Buffer.from(bridge))}};
 for(const edit of edits)files.set(edit.path,edit.bytes);files.set(DEMO_BRIDGE_PATH,Buffer.from(bridge));
 files.set(DATABASE_PATH,output);files.set('.cars-modern-demo-database.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
 return receipt;
}
