import fs from 'node:fs';
import path from 'node:path';
import { planNewClient, assertMainCheckout } from './new-client.mjs';
import { copySource } from './copy-source.mjs';
import { packageDealer } from './package-dealer.mjs';
import { ROOT, POLICY, args, fingerprint, json, writeJson } from './lib/workflow.mjs';

export function independentGuidance(slug, repository) {
  return `# ${slug}: independent dealer source\n\nThis repository (${repository}) is the ONLY editable source for this dealership. Work on main in its registered permanent checkout; do not create session clones, worktrees or other branches. Cars is the tooling/registry repository, not another source copy for this dealer.\n\n## Default changes\nPersonalize approved PNG/WebP logos and icons, factual business copy, contacts, social links, inventory, metadata and existing accent tokens. Do not redesign heroes, banners, typography, spacing, section order, breakpoints or interactions during branding/content tasks. A requested client-specific feature can change code deliberately; record the scope and rerun checks. Shared improvements belong in the template first.\n\n## Sources and safety\nRead dealer.json, business-facts.json, docs/SOURCES.md and HANDOFF.md. Use one fact/asset pack for all three designs. Preserve source currency, unknown facts and the distinction between demo stock and available vehicles. Never copy another dealer's facts, staff, testimonials or credentials. No invented warranties, finance offers or successful form delivery. Do not replace an approved raster logo with text/CSS/SVG. SVG interface icons are allowed.\n\n## Verification and publishing\nRun node scripts/check-dealer.mjs, the three application checks/builds, and desktop/mobile browser checks before a release. The guard checks are technical evidence, not complete visual approval. Keep the three design routes and one shared Admin demo link. The Admin is not a production backend. Push main once to the existing Git-linked Vercel project; do not duplicate deployment triggers. Preserve uncommitted work and rollback history. No outreach, paid services, database or real enquiry submission is authorized by a website task.\n`;
}

export function resolveIndependentTarget(parent, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid dealer slug');
  const physical = fs.realpathSync(parent);
  if (physical.toLowerCase() !== path.resolve(parent).toLowerCase()) throw new Error('Use the physical independent-clients root, not a junction');
  const target = path.join(physical, slug);
  if (fs.existsSync(target)) throw new Error('Existing independent dealer checkout: ' + target);
  return target;
}

export async function createIndependentDealer({ root = ROOT, client, repository, preset = 'standard', dealerId = null, write = false }) {
  const config = json(path.join(root, 'workspace.json'));
  const parent = config.independentClientsRoot?.[process.platform];
  if (!parent) throw new Error('Record independentClientsRoot for this machine in workspace.json first');
  const plan = planNewClient({ root, client, repository, preset, dealerId });
  const target = resolveIndependentTarget(parent, client);
  const summary = { mode: write ? 'create' : 'dry-run', sourceOwnership: 'independent-repository', repository, target, workflowCommit: plan.checkout.head, templates: plan.plans.map(p => ({ key: p.template, repository: p.release.repository, commit: p.release.commit, digest: p.release.digest, newerDevelopmentAvailable: p.updateAvailable })) };
  if (!write) return summary;
  const runtime = path.join(parent, '.runtime'); fs.mkdirSync(runtime, { recursive: true });
  const lock = path.join(runtime, 'create-independent.lock');
  fs.mkdirSync(lock);
  fs.writeFileSync(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, client, startedAt: new Date().toISOString() }));
  let stage;
  try {
    stage = fs.mkdtempSync(path.join(runtime, client + '-seed-'));
    const seed = path.join(stage, 'seed'); fs.mkdirSync(seed);
    const manifest = { ...plan.manifest, sourceOwnership: 'independent-repository', language: 'en', switcher: { language: 'en', accent: '#c40101' }, templateRevisions: Object.fromEntries(plan.plans.map(p => [p.template, p.release.commit])) };
    writeJson(path.join(seed, 'dealer.json'), manifest);
    for (const item of plan.plans) {
      const dest = path.join(seed, item.template);
      await copySource(item.source, dest, { key: item.template, exportPolicy: POLICY });
      if (fingerprint(dest).digest !== item.release.digest) throw new Error('Template copy mismatch: ' + item.template);
    }
    const candidate = path.join(stage, 'ready');
    await packageDealer({ source: seed, destination: candidate, manifest, sourceCommit: plan.checkout.head, guidance: independentGuidance(client, repository) });
    const generated = json(path.join(candidate, '.cars-package.json'));
    writeJson(path.join(candidate, 'docs/workflow/GENERATION.json'), { ...summary, createdAt: new Date().toISOString(), meaning: 'Approved template source and initial mount transformation, not a finished dealer build', packagingVersion: generated.packagingVersion, initialMountedDigest: generated.payloadDigest });
    fs.renameSync(path.join(candidate, '.cars-package.json'), path.join(candidate, 'docs/workflow/INITIAL-PACKAGE.json'));
    if (assertMainCheckout(root).head !== plan.checkout.head) throw new Error('Cars main changed during preparation');
    resolveIndependentTarget(parent, client);
    fs.renameSync(candidate, target);
    writeJson(path.join(stage, 'creation.json'), summary);
    return { ...summary, state: 'needs-personalization', receipt: path.join(stage, 'creation.json') };
  } catch (error) { if (stage) writeJson(path.join(stage, 'failure.json'), { target, error: error.message }); throw error; }
  finally { fs.renameSync(lock, lock + '.completed-' + process.pid + '-' + Date.now()); }
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Usage: node scripts/create-independent-dealer.mjs --client SLUG --repository OWNER/REPO [--preset standard|import] [--dealer-id ID] [--write]');
    return;
  }
  const options = args(process.argv.slice(2), ['client', 'repository', 'preset', 'dealer-id'], ['write']);
  const result = await createIndependentDealer({ client: options.client, repository: options.repository, preset: options.preset, dealerId: options['dealer-id'], write: Boolean(options.write) });
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
