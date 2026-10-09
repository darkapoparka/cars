import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validatePackagingManifest } from './package-dealer.mjs';
import { FIVE_DESIGN_KEYS, FIVE_DESIGN_PACKAGING_CANDIDATE, planFiveDesignSelection, resolveFiveDesignCohort } from './lib/five-design-release.mjs';
import { SIX_DESIGN_KEYS, SIX_DESIGN_PACKAGING_CANDIDATE, planSixDesignSelection } from './lib/six-design-release.mjs';

const ROOT = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const git = (...args) => execFileSync('git', ['--no-optional-locks', '-C', ROOT, ...args], { encoding: 'utf8', windowsHide: true }).trim();
const inRoot = target => { const relative = path.relative(ROOT, target); return relative && !relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative); };

/** Source-only snapshot. It never builds, updates a dealer, writes files or calls a provider. */
export function inspectFiveDesignRelease({ includeKarento = false } = {}) {
  const desiredFamilies = includeKarento ? SIX_DESIGN_KEYS : FIVE_DESIGN_KEYS;
  const planSelection = includeKarento ? planSixDesignSelection : planFiveDesignSelection;
  const head = git('rev-parse', 'HEAD');
  const registry = readJson(path.join(ROOT, 'docs/DEPLOYMENT-INVENTORY.json'));
  const selected = resolveFiveDesignCohort(registry);
  const releases = readJson(path.join(ROOT, 'templates.lock.json')).templates;
  const templates = desiredFamilies.map(key => {
    const release = releases[key];
    const working = git('status', '--porcelain=v1', '--untracked-files=normal', '--', 'templates/' + key).split('\n').filter(Boolean);
    let headTree = null;
    try { headTree = git('rev-parse', head + ':templates/' + key); } catch { /* Report missing source rather than approve it. */ }
    const packageFile = path.join(ROOT, 'templates', key, 'package.json');
    const declaredNode = fs.existsSync(packageFile) ? readJson(packageFile).engines?.node ?? null : null;
    return { key, declaredNode, status: release?.status ?? 'not-selected', approvedCommit: release?.commit ?? null,
      approvedTree: release?.source?.tree ?? null, headTree, changedEntries: working.length,
      dirtyExamples: working.slice(0, 4),
      sourceMatchesApprovedTree: Boolean(headTree && release?.status === 'approved' && headTree === release?.source?.tree && working.length === 0) };
  });
  const dealers = selected.map(record => {
    const result = { slug: record.slug, project: record.delivery.projectName, projectId: record.delivery.projectId,
      repository: record.repository, currentUrl: record.delivery.url, blockers: [] };
    result.recordedGitBinding = record.delivery.gitRepository ?? null;
    if (!result.recordedGitBinding) result.blockers.push('Saved registry has no Git binding; reconcile with live provider before selecting a deployment trigger');
    try {
      const expected = path.join(ROOT, 'clients', record.slug);
      const source = fs.realpathSync(expected);
      if (!inRoot(source)) throw Error('Canonical dealer source is outside Cars; do not traverse or regenerate it');
      result.independentSource = fs.existsSync(path.join(source, '.git'));
      const manifest = readJson(path.join(source, 'dealer.json'));
      if (manifest.slug !== record.slug || manifest.repository !== record.repository) throw Error('Dealer manifest identity differs from registry');
      result.currentPackagingVersion = manifest.packaging?.version;
      result.currentFamilies = manifest.variants.map(v => v.key);
      const selection = planSelection(manifest.variants);
      result.proposedSelection = selection;
      result.missingDealerFamilies = desiredFamilies.filter(key => !fs.existsSync(path.join(source, key, 'package.json')));
      if (result.missingDealerFamilies.length) result.blockers.push('Missing personalized source: ' + result.missingDealerFamilies.join(', '));
      if (selection.replaceMount) result.blockers.push('Carwow replacement requires source/data adaptation and old vehicle URL mapping');
      const candidate = { ...manifest, packaging: { ...manifest.packaging, version: includeKarento ? SIX_DESIGN_PACKAGING_CANDIDATE : FIVE_DESIGN_PACKAGING_CANDIDATE }, variants: selection.variants };
      try { validatePackagingManifest(candidate); result.publisherAcceptsCandidate = true; }
      catch (error) { result.publisherAcceptsCandidate = false; result.blockers.push('Current publisher: ' + error.message); }
      if (result.independentSource) result.blockers.push('Use independent-source workflow, never the Cars-owned exporter');
      result.blockers.push('Fresh all-' + desiredFamilies.length + '-design artifact builds, asset budgets and hosted acceptance are not established by this source-only check');
    } catch (error) { result.blockers.push(error.message); }
    return result;
  });
  if (git('rev-parse', 'HEAD') !== head) throw Error('Source HEAD advanced during inspection; repeat after writer coordination');
  return { schemaVersion: 1, checkedAt: new Date().toISOString(), mode: 'read-only-source-preflight', sourceRoot: ROOT,
    sourceCommit: head, targetProviderRecommendation: includeKarento ? 'qualify-requested-provider-before-fleet' : 'cloudflare-pilot-before-fleet', desiredFamilies,
    readyToDeploy: false, providerLimits: 'Not queried here; current account plan, quota and artifact compatibility must be verified separately',
    templates, dealers,
    summary: { cohort: dealers.length, unchangedApprovedTemplates: templates.filter(t => t.sourceMatchesApprovedTree).length,
      missingMobileSource: dealers.filter(d => d.missingDealerFamilies?.includes('mobile')).length,
      ...(includeKarento ? { missingKarentoSource: dealers.filter(d => d.missingDealerFamilies?.includes('karento-best')).length } : {}),
      independentDealers: dealers.filter(d => d.independentSource).length,
      publisherCandidateAccepted: dealers.filter(d => d.publisherAcceptsCandidate).length,
      note: 'Planning and selector support are not a ' + desiredFamilies.length + '-design build or a completed deployment.' } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.slice(2).some(arg => !['--json', '--include-karento'].includes(arg))) throw Error('Usage: node scripts/check-five-design-release.mjs [--json] [--include-karento]');
    const report = inspectFiveDesignRelease({ includeKarento: process.argv.includes('--include-karento') });
    if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(JSON.stringify({ checkedAt: report.checkedAt, sourceCommit: report.sourceCommit, ...report.summary, readyToDeploy: report.readyToDeploy }, null, 2));
      for (const template of report.templates) console.log(`${template.key}: ${template.status}, ${template.changedEntries} changed entries, exact approved source = ${template.sourceMatchesApprovedTree}`);
      console.log('Use --json for the per-dealer proposed mounts and blockers. No files or remote resources were changed.');
    }
    process.exitCode = report.readyToDeploy ? 0 : 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
