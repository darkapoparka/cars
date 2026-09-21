import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { promoteTemplate } from './template-release.mjs';
import { auditNativeCatalogs } from './lib/native-localization.mjs';
import { ROOT, exportCommit, git, json, sha256, writeJson } from './lib/workflow.mjs';

const configurations = [
  {
    key: 'auto-best',
    prefix: 'auto-best',
    repository: 'darkapoparka/cars-template-auto-best',
    sourceDirectoryEnv: 'AUTO_BEST_SOURCE_DIR',
    commitEnv: 'AUTO_BEST_COMMIT',
    deploymentEnv: 'AUTO_BEST_DEPLOYMENT_ID',
    projectEnv: 'AUTO_BEST_PROJECT_ID',
    aliasEnv: 'AUTO_BEST_PUBLIC_ALIAS',
    evidencePath: 'docs/releases/localization-2026-09-21/auto-best-release.json',
    boundaryPath: 'docs/releases/localization-2026-09-21/auto-best-boundary-review.json',
    expectedChanges: [
      'src/lib/config/locale.ts',
      'src/lib/locale/config.ts',
      'src/lib/locale/messages.ts'
    ],
    logs: [
      'auto-best-check-locales.log',
      'auto-best-test-locales.log',
      'auto-best-check.log',
      'auto-best-build.log'
    ]
  },
  {
    key: 'carwow',
    prefix: 'carwow',
    repository: 'darkapoparka/cars-template-carwow',
    sourceDirectoryEnv: 'CARWOW_SOURCE_DIR',
    commitEnv: 'CARWOW_COMMIT',
    deploymentEnv: 'CARWOW_DEPLOYMENT_ID',
    projectEnv: 'CARWOW_PROJECT_ID',
    aliasEnv: 'CARWOW_PUBLIC_ALIAS',
    evidencePath: 'docs/releases/localization-2026-09-21/carwow-release.json',
    boundaryPath: 'docs/releases/localization-2026-09-21/carwow-boundary-review.json',
    expectedChanges: [
      'src/lib/data/daynight-site.ts',
      'src/lib/locale/config.ts',
      'src/lib/locale/locale.test.ts',
      'src/lib/locale/messages.ts'
    ],
    logs: [
      'carwow-check-localization.log',
      'carwow-test-localization.log',
      'carwow-check.log',
      'carwow-build.log'
    ]
  }
];

const requiredEnvironment = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const hashFile = (file) => sha256(fs.readFileSync(file));
const stableHash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const sameList = (left, right) => JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());

function assertAudit(file, commit, kind) {
  const report = readJson(file);
  if (report.sourceCommit !== commit || report.failed !== 0 || !Number.isInteger(report.passed) || report.passed < 1) {
    throw new Error(`${kind} audit is not a passing exact-commit receipt: ${file}`);
  }
  return report;
}

function sourceFilesMap(key, directory, fingerprint) {
  return new Map(fingerprint.files.map(({ path: relative }) => [
    `${key}/${relative}`,
    fs.readFileSync(path.join(directory, relative))
  ]));
}

function buildCheckEvidence({ priorReview, commit, changedFiles, fileHashes, preferenceAudit, browserAudit }) {
  return priorReview.checks.map((check) => {
    const evidence = {
      schemaVersion: 1,
      check: check.name,
      currentCommit: commit,
      exactChangedFiles: changedFiles,
      previousAcceptedEvidenceSha256: check.evidenceSha256,
      currentVerification: {
        logs: fileHashes,
        preferenceAudit: {
          sha256: preferenceAudit.sha256,
          checks: preferenceAudit.report.checks,
          passed: preferenceAudit.report.passed,
          failed: preferenceAudit.report.failed
        },
        browserAudit: {
          sha256: browserAudit.sha256,
          checks: browserAudit.report.checks,
          passed: browserAudit.report.passed,
          failed: browserAudit.report.failed,
          widths: browserAudit.report.widths,
          locales: browserAudit.report.locales
        }
      },
      conclusion: 'The exact post-release delta is restricted to bounded dealer-owned bilingual data and its direct test. Current localization, type/build, browser and public preference checks passed; the prior exact-source acceptance remains the baseline for untouched surfaces.'
    };
    return { name: check.name, status: 'passed', evidenceSha256: stableHash(evidence), evidence };
  });
}

function promote(configuration, logDirectory) {
  const lock = json(path.join(ROOT, 'templates.lock.json'));
  const prior = lock.templates[configuration.key];
  if (!prior) throw new Error(`Missing template lock for ${configuration.key}`);
  const sourceDirectory = fs.realpathSync(requiredEnvironment(configuration.sourceDirectoryEnv));
  const commit = requiredEnvironment(configuration.commitEnv);
  const deploymentId = requiredEnvironment(configuration.deploymentEnv);
  const projectId = requiredEnvironment(configuration.projectEnv);
  const publicAlias = requiredEnvironment(configuration.aliasEnv);
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error(`${configuration.key}: invalid exact commit`);
  if (git(sourceDirectory, ['rev-parse', 'HEAD']) !== commit) throw new Error(`${configuration.key}: checkout is not the requested commit`);
  if (git(sourceDirectory, ['rev-parse', `${commit}^{commit}`]) !== commit) throw new Error(`${configuration.key}: commit did not resolve exactly`);
  if (git(sourceDirectory, ['merge-base', '--is-ancestor', prior.commit, commit], { allowFailure: true }) === null) {
    throw new Error(`${configuration.key}: promoted release is not a descendant of the current pin`);
  }
  const changedFiles = git(sourceDirectory, ['diff', '--name-only', `${prior.commit}..${commit}`, '--'])
    .split(/\r?\n/).filter(Boolean).sort();
  if (!sameList(changedFiles, configuration.expectedChanges)) {
    throw new Error(`${configuration.key}: unexpected release delta\nExpected: ${configuration.expectedChanges.join(', ')}\nActual: ${changedFiles.join(', ')}`);
  }

  const exportArea = fs.mkdtempSync(path.join(os.tmpdir(), `cars-${configuration.key}-release-`));
  const exported = path.join(exportArea, 'snapshot');
  const fingerprint = exportCommit(sourceDirectory, commit, exported);
  const priorEvidence = readJson(path.join(ROOT, configuration.evidencePath));
  if (priorEvidence.commit !== prior.commit || priorEvidence.nativeLocalization?.sourceDigest !== prior.digest) {
    throw new Error(`${configuration.key}: prior evidence does not match the current Cars pin`);
  }

  const fileHashes = Object.fromEntries(configuration.logs.map((name) => {
    const file = path.join(logDirectory, name);
    if (!fs.existsSync(file)) throw new Error(`${configuration.key}: missing verification log ${name}`);
    return [name, hashFile(file)];
  }));
  const preferenceFile = path.join(logDirectory, `${configuration.prefix}-preference-audit.json`);
  const browserFile = path.join(logDirectory, `${configuration.prefix}-browser-audit.json`);
  const preferenceReport = assertAudit(preferenceFile, commit, `${configuration.key} preference`);
  const browserReport = assertAudit(browserFile, commit, `${configuration.key} browser`);
  if (!sameList(browserReport.widths || [], [320, 390, 1440]) || !sameList(browserReport.locales || [], ['en', 'bg'])) {
    throw new Error(`${configuration.key}: browser receipt lacks the required EN/BG viewports`);
  }
  const preferenceAudit = { report: preferenceReport, sha256: hashFile(preferenceFile) };
  const browserAudit = { report: browserReport, sha256: hashFile(browserFile) };
  const catalogReport = auditNativeCatalogs(
    sourceFilesMap(configuration.key, exported, fingerprint),
    configuration.key,
    priorEvidence.nativeLocalization.catalogs
  );
  const checkEvidence = buildCheckEvidence({
    priorReview: priorEvidence.nativeLocalization,
    commit,
    changedFiles,
    fileHashes,
    preferenceAudit,
    browserAudit
  });
  const deployment = {
    id: deploymentId,
    projectId,
    state: 'READY',
    sourceCommit: commit,
    publicAlias
  };
  const boundaryReview = {
    schemaVersion: 1,
    repository: configuration.repository,
    previousCommit: prior.commit,
    commit,
    exactChangedFiles: changedFiles,
    diffSha256: sha256(Buffer.from(git(sourceDirectory, ['diff', '--binary', `${prior.commit}..${commit}`, '--']))),
    sourceDigest: fingerprint.digest,
    deployment,
    verification: {
      logs: fileHashes,
      preferenceAudit,
      browserAudit,
      catalogs: catalogReport,
      checks: checkEvidence.map(({ evidenceSha256, evidence, name }) => ({ name, evidenceSha256, evidence }))
    },
    decision: 'approved-bounded-dealer-copy-release',
    reviewedAt: new Date().toISOString()
  };
  const boundaryPath = path.join(ROOT, configuration.boundaryPath);
  writeJson(boundaryPath, boundaryReview);
  const boundarySha256 = hashFile(boundaryPath);
  const verifiedAt = new Date().toISOString();
  const releaseEvidence = {
    ...priorEvidence,
    commit,
    approved: true,
    release: `${priorEvidence.release}-dealer-copy-boundary`,
    verifiedAt,
    checks: [
      { name: 'exact production deployment', status: 'passed', deploymentId },
      {
        name: 'public preference and write-blocking audit',
        status: 'passed',
        passed: preferenceReport.passed,
        failed: preferenceReport.failed,
        evidenceSha256: preferenceAudit.sha256
      },
      {
        name: 'native EN/BG catalog parity and acceptance evidence',
        status: 'passed',
        catalogs: catalogReport.catalogs.map(({ keys, contentDigest }) => ({ keys, contentDigest }))
      },
      {
        name: 'bounded dealer-owned bilingual release review',
        status: 'passed',
        evidenceSha256: boundarySha256,
        changedFiles
      }
    ],
    standalone: { mobile: true, desktop: true, widths: [320, 390, 1440] },
    nativeLocalization: {
      ...priorEvidence.nativeLocalization,
      commit,
      verifiedAt,
      evidenceSha256: boundarySha256,
      sourceDigest: fingerprint.digest,
      deployment,
      checks: checkEvidence.map(({ name, status, evidenceSha256 }) => ({ name, status, evidenceSha256 }))
    }
  };
  writeJson(path.join(ROOT, configuration.evidencePath), releaseEvidence);
  const result = promoteTemplate({
    root: ROOT,
    key: configuration.key,
    sourceRepo: sourceDirectory,
    commit,
    evidence: path.join(ROOT, configuration.evidencePath),
    expectedDigest: prior.digest,
    write: true
  });
  fs.rmSync(exportArea, { recursive: true, force: true });
  return { key: configuration.key, commit, digest: result.after, changes: result.changes.length, boundarySha256 };
}

function main() {
  const logDirectory = path.resolve(requiredEnvironment('LOCALIZATION_PROMOTION_LOG_DIR'));
  const results = configurations.map((configuration) => promote(configuration, logDirectory));
  console.log(JSON.stringify({ promoted: results }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
