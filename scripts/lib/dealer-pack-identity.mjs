import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const assert = (ok, message) => {if (!ok) throw Error(message);};
const digest = value => createHash('sha256').update(value).digest('hex');
export const PACK_BATCH_FILE = 'leads/expansion-2026-10-18/batches-2026-10-19.json';
export const PACK_BATCH_ID = 'cars-expansion-2026-10-19';
export const packIdentityKey = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** DNS/Worker-safe shortening is deterministic, with the exact research ID retained separately. */
export function canonicalPackSlug(requestedSlug, dealerId, {reserved = []} = {}) {
  assert(typeof requestedSlug === 'string' && typeof dealerId === 'string' && dealerId.length > 0, 'A requested slug and exact expansion identity are required');
  const normalized = requestedSlug.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  assert(normalized, 'The requested slug has no DNS-safe characters');
  const unavailable = new Set(reserved.map(packIdentityKey));
  if (normalized.length <= 43 && !unavailable.has(packIdentityKey(normalized))) return normalized;
  const hash = digest(dealerId + '\0' + normalized);
  for (const size of [10, 12, 16, 20, 24, 32]) {
    const prefix = normalized.slice(0, 42 - size).replace(/-+$/, '');
    const candidate = prefix + '-' + hash.slice(0, size);
    if (!unavailable.has(packIdentityKey(candidate))) return candidate;
  }
  throw Error('The deterministic dealer identity collides with a reserved name');
}

export function expectedPackHosting(slug) {
  assert(typeof slug === 'string' && slug.length <= 43 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), 'Expected a canonical dealer-pack slug');
  return {workerName: 'cars-' + slug, publicOrigin: 'https://' + slug + '.webpreviews.site'};
}

function hostingValues(row) {
  const values = [];
  const visit = (value, identity = false) => {
    if (typeof value === 'string') {if (identity) values.push(value); return;}
    if (Array.isArray(value)) {for (const item of value) visit(item, identity); return;}
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) visit(item, identity || /^(?:workerName|workerPrefix|publicOrigin|configuredPublicOrigin|hostingIdentity|publicAlias|origin|route|url)$/i.test(key));
  };
  visit(row); return values;
}

/** Reports conflicts; only the guarded deployer may separately authorize an exact own-pack receipt. */
export function packRegistryCollisions(manifest, registry = []) {
  const identity = expectedPackHosting(manifest.slug), host = new URL(identity.publicOrigin).hostname;
  const rows = Array.isArray(registry) ? registry : registry.dealers ?? [];
  return rows.flatMap(row => {
    const reasons = [];
    if (packIdentityKey(row.slug) === packIdentityKey(manifest.slug) || row.aliases?.some(alias => packIdentityKey(alias) === packIdentityKey(manifest.slug))) reasons.push('slug');
    if ([row.id, row.dealerId, row.researchId, row.leadId].includes(manifest.dealerId)) reasons.push('dealerId');
    for (const value of hostingValues(row)) {
      const normalized = value.toLowerCase().replace(/\/+$/, '');
      if (normalized === identity.workerName || normalized === identity.publicOrigin || normalized === host || normalized === host + '/*' || normalized === identity.publicOrigin + '/*') reasons.push('hostingIdentity');
    }
    return reasons.length ? [{slug: row.slug ?? null, reasons: [...new Set(reasons)]}] : [];
  });
}

export function assertPackHostingIdentity(manifest, {registry = [], packs = []} = {}) {
  const expected = expectedPackHosting(manifest.slug);
  assert(manifest.cloudflare?.workerPrefix === expected.workerName && manifest.shareIdentity?.publicOrigin === expected.publicOrigin,
    'Dealer packs require exactly ' + expected.workerName + ' and ' + expected.publicOrigin);
  const collisions = packRegistryCollisions(manifest, registry);
  assert(!collisions.length, 'Dealer pack collides with a preserved fleet identity: ' + collisions.map(row => row.slug + ' (' + row.reasons.join(', ') + ')').join('; '));
  assert(!packs.some(row => row.slug !== manifest.slug && (row.dealerId === manifest.dealerId || packIdentityKey(row.slug) === packIdentityKey(manifest.slug))), 'Dealer pack duplicates another pack');
  return expected;
}

export function buildPackBatchAssignments(manifest) {
  const ids = manifest?.priorityResearchIds;
  assert(Array.isArray(ids) && ids.length === 400 && new Set(ids).size === 400 && ids.every(id => /^(?:gb|us|ae)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)), 'The assignment requires the exact 400 unique priority research IDs');
  const ordered = ['gb-', 'us-', 'ae-'].flatMap(prefix => ids.filter(id => id.startsWith(prefix)));
  return {schemaVersion: 1, kind: 'cars-dealer-pack-batch-assignments', id: PACK_BATCH_ID,
    order: 'Retain manifest order within gb-*, then us-*, then ae-*; split into four consecutive groups of 100.',
    source: 'leads/expansion-2026-10-18/manifest.json', assignmentDigest: digest(JSON.stringify(ordered)), count: ordered.length,
    batches: Array.from({length: 4}, (_, index) => ({number: index + 1, branch: 'astra/batch-' + (index + 1), firstPosition: index * 100 + 1,
      lastPosition: (index + 1) * 100, leadIds: ordered.slice(index * 100, (index + 1) * 100)}))};
}

export function readPackBatchAssignments(root) {
  const file = path.join(root, PACK_BATCH_FILE), manifestFile = path.join(root, 'leads/expansion-2026-10-18/manifest.json');
  assert(fs.existsSync(file), 'The committed dealer-pack batch assignment file is required');
  const value = JSON.parse(fs.readFileSync(file, 'utf8')), expected = buildPackBatchAssignments(JSON.parse(fs.readFileSync(manifestFile, 'utf8')));
  assert(JSON.stringify(value) === JSON.stringify(expected), 'Batch assignments differ from the exact manifest-order four-by-100 split');
  return value;
}

export function assertPackBatch(root, manifest, {batch, env = process.env} = {}) {
  const assignment = readPackBatchAssignments(root), matches = assignment.batches.filter(row => row.leadIds.includes(manifest.dealerId));
  assert(matches.length === 1, 'Dealer pack is outside the authorized 400-lead assignment: ' + manifest.dealerId);
  const selected = matches[0], branch = env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || (fs.existsSync(path.join(root, '.git/HEAD')) ? fs.readFileSync(path.join(root, '.git/HEAD'), 'utf8').trim().replace(/^ref: refs\/heads\//, '') : '');
  const branchBatch = /^astra\/batch-([1-4])$/.exec(branch)?.[1], supplied = batch ?? env.CARS_DEALER_PACK_BATCH ?? branchBatch ?? manifest.pack?.batch?.number;
  const allClaims = [batch, env.CARS_DEALER_PACK_BATCH, branchBatch, manifest.pack?.batch?.number].filter(value => value !== undefined);
  assert(allClaims.every(value => String(value) === String(selected.number)), 'Dealer pack ' + manifest.slug + ' is outside batch ' + allClaims.find(value => String(value) !== String(selected.number)) + '; exact research ID belongs to batch ' + selected.number);
  if (supplied !== undefined) assert(String(supplied) === String(selected.number), 'Dealer pack ' + manifest.slug + ' is outside batch ' + supplied + '; exact research ID belongs to batch ' + selected.number);
  if (manifest.pack?.batch) assert(manifest.pack.batch.assignmentId === assignment.id && manifest.pack.batch.leadId === manifest.dealerId && manifest.pack.batch.position === selected.firstPosition + selected.leadIds.indexOf(manifest.dealerId), 'Dealer pack has a stale or conflicting batch identity');
  return {number: selected.number, assignmentId: assignment.id, leadId: manifest.dealerId, position: selected.firstPosition + selected.leadIds.indexOf(manifest.dealerId)};
}
