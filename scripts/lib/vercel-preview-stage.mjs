import assert from 'node:assert/strict';

export const PROTECTED_PREVIEW_STAGE = 'protected-preview-qualified';
const families = ['auto-best','modern','import','app','mobile','karento-best'];
const dated = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const origin = value => { const u = new URL(value); assert(u.protocol === 'https:' && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash, 'Invalid release origin'); return u.origin; };
const same = (a,b) => assert.deepEqual(a,b);

/** A protected preview can qualify source, never anonymous production acceptance. */
export function validateVercelPreviewStage(proof, lease, hosted, {readProof, canonicalOrigin}) {
  if (proof.schemaVersion !== 2) {
    assert.equal(proof.acceptanceStage, undefined, 'Legacy acceptance cannot declare a protected stage');
    return null;
  }
  for (const record of [proof,lease,hosted]) {
    assert.equal(record.acceptanceStage, PROTECTED_PREVIEW_STAGE, 'Protected stage must be explicitly leased');
    assert.equal(record.publicAcceptance, false, 'Protected access is not public acceptance');
    assert.equal(origin(record.canonicalPublicOrigin), origin(canonicalOrigin), 'Stable registered origin changed');
  }
  same(proof.productionAcceptance, {state:'pending', origin:origin(canonicalOrigin), required:['anonymous-stable-origin','six-designs','admin-demo','exact-production-commit']});
  same(lease.productionAcceptance, proof.productionAcceptance);
  same(hosted.productionAcceptance, proof.productionAcceptance);
  same(proof.previewAccess, lease.previewAccess);
  same(proof.previewAccess, hosted.previewAccess);
  assert.equal(hosted.unauthenticated, false, 'Authenticated preview must not be reported anonymous');
  const access = readProof(proof.previewAccess).value;
  assert.equal(access.schemaVersion, 1);
  assert.equal(access.kind, 'cars-vercel-protected-preview-access');
  assert.equal(access.executed, true);
  assert.equal(access.method, 'vercel-existing-temporary-share');
  assert.equal(access.anonymous, false);
  assert.equal(access.protectionsChanged, false);
  assert.equal(access.secretsRetained, false);
  assert(dated(access.verifiedAt));
  for (const key of ['repository','projectId','deploymentId']) assert.equal(access[key], proof[key], 'Preview access identity changed: '+key);
  assert.equal(access.privateCommit, proof.publishingCommit);
  assert.equal(origin(access.origin), origin(proof.publicOrigin));
  assert.equal(origin(access.stableOrigin), origin(canonicalOrigin));
  const seen = JSON.stringify(access);
  assert(!seen.includes('_vercel_share=') && !seen.includes('x-vercel-protection-bypass') && !seen.includes('authorization'), 'Access proof must not retain credentials');
  for (const collection of ['anonymousEntries','authenticatedEntries']) {
    const rows = access[collection];
    assert.equal(rows?.length, 6, 'Every family needs explicit access evidence');
    same(rows.map(r=>r.key).sort(), [...families].sort());
    for (const row of rows) {
      assert(row.route?.startsWith('/') && !row.route.startsWith('//') && !row.route.includes('..'));
      assert(dated(row.observedAt));
      if (collection === 'anonymousEntries') {
        assert.equal(row.status, 302, 'Only observed SSO redirects qualify protected access');
        assert.equal(row.redirectOrigin, 'https://vercel.com');
        assert.equal(row.redirectPath, '/sso-api');
      } else {
        assert.equal(row.status, 200, 'Authenticated application must actually load');
        const final = new URL(row.finalUrl);
        assert.equal(final.origin, origin(access.origin));
        assert(!final.searchParams.has('_vercel_share'));
        assert(typeof row.title === 'string' && row.title.trim().length > 0);
        assert(Array.isArray(row.logoSources) && row.logoSources.some(s=>new URL(s,final).origin===final.origin && new URL(s,final).pathname.includes('/dealer-brand/')), 'Own logo delivery is required');
      }
    }
  }
  return proof.previewAccess;
}

/** Deferred rows have no passing/actual execution claim, and bind the real access record. */
export function validatePendingVercelPublicCheck(row, accessReference) {
  assert.equal(row?.name, 'public-journeys');
  assert.equal(row.status, 'pending-production', 'Never relabel protected journeys as public passes');
  assert.equal(row.evidenceSha256, accessReference.sha256);
  same(row.evidence, accessReference);
  assert.equal(row.executed, undefined);
  assert.equal(row.actual, undefined);
}
