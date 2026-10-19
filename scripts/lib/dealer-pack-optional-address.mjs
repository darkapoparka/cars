/** A missing street address remains an empty fact in an explicit dealer pack.
 * Only the selected Modern data schema needs adaptation; its known-value
 * constraints and all sourced city, map and contact fields remain unchanged.
 */
import {isDealerPackOptionalFacts} from './dealer-pack-modern-facts.mjs';

export const DEALER_PACK_ADDRESS_SCHEMA_PATH = 'modern/packages/marketplace-domain/site-config.ts';
const leadPath = 'modern/packages/marketplace/lead-site.ts';
const requiredAddress = '      address: z.string().trim().min(1).max(300),';
const optionalAddress = '      address: z.union([z.string().trim().min(1).max(300), z.literal("")]),';

export function adaptPackOptionalAddress(files, profile) {
  if (!isDealerPackOptionalFacts(profile)) return [];
  const address = profile.business?.address;
  if (typeof address !== 'string') throw Error('Expected normalized dealer-pack address fact');
  if (address) return [];
  const lead = files.get(leadPath), original = files.get(DEALER_PACK_ADDRESS_SCHEMA_PATH);
  if (!Buffer.isBuffer(lead) || !Buffer.isBuffer(original)) throw Error('Missing Modern dealer-pack address source');
  const facts = [...String(lead).matchAll(/^  address: ("[^"\r\n]*"),/gm)];
  if (facts.length !== 1 || JSON.parse(facts[0][1]) !== '') throw Error('Modern address differs from the exact empty dealer-pack fact');
  const schema = String(original), rows = schema.match(/^\s+address:.*$/gm) ?? [];
  if (rows.length !== 1 || ![requiredAddress, optionalAddress].includes(rows[0])) throw Error('Modern optional address schema boundary changed');
  // The maintained absent-phone preparation can already have adapted this
  // exact boundary. Accept it without touching either the schema or facts.
  if (rows[0] === optionalAddress) return [];
  files.set(DEALER_PACK_ADDRESS_SCHEMA_PATH, Buffer.from(schema.replace(requiredAddress, optionalAddress)));
  return [DEALER_PACK_ADDRESS_SCHEMA_PATH];
}
