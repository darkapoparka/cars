import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Resolve only Windows Git's first-run chooser; never replace a deliberately configured helper.
export function fetchCredentialArgs(platform, helpers) {
  return platform === 'win32' && helpers.trim() === 'helper-selector'
    ? ['-c','credential.helper=','-c','credential.helper=manager','-c','credential.interactive=false'] : [];
}

// Reports state only. Never pulls, checks out, stages, moves or deletes source.
export function gitRead(cwd, args) {
  let credentialArgs = [];
  if (args[0] === 'fetch' && process.platform === 'win32') {
    const helpers = spawnSync('git', ['-C', cwd, 'config', '--get-all', 'credential.helper'], { encoding:'utf8', timeout:5000, windowsHide:true });
    credentialArgs = fetchCredentialArgs(process.platform, helpers.stdout || '');
  }
  const result = spawnSync('git', ['-C', cwd, ...credentialArgs, ...args], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' }, windowsHide: true,
  });
  if (result.status !== 0) throw new Error((result.stderr || result.error?.message || 'Git command failed').trim());
  return result.stdout.trim();
}

export function repositoryIdentity(remote) {
  const match = remote.match(/(?:github\.com[/:])([^/]+\/[^/]+?)(?:\.git)?$/i);
  return match ? match[1].toLowerCase() : null;
}

export function inspectRepository(root, item, { fetch = false, readGit = gitRead } = {}) {
  const directory = path.resolve(root, item.path);
  const result = { key: item.key, role: item.role, path: directory, expectedRepository: item.repository, issues: [] };
  if (!fs.existsSync(directory)) return { ...result, issues: ['missing-checkout'] };
  try {
    result.branch = readGit(directory, ['branch', '--show-current']);
    result.head = readGit(directory, ['rev-parse', 'HEAD']);
    const actual = repositoryIdentity(readGit(directory, ['remote', 'get-url', 'origin']));
    result.repositoryMatches = actual === item.repository.toLowerCase();
    if (!result.repositoryMatches) result.issues.push('wrong-origin');
    if (result.branch !== 'main') result.issues.push('not-on-main');
    // Fetch only after verifying identity. This updates tracking refs, not files.
    let fetchedThisRun = false;
    if (fetch && result.repositoryMatches) {
      try { readGit(directory, ['fetch', 'origin', 'refs/heads/main:refs/remotes/origin/main']); fetchedThisRun = true; }
      catch (error) { result.issues.push('fetch-failed'); result.fetchError = String(error.message).slice(0,300); }
    }
    result.changedEntries = readGit(directory, ['status', '--porcelain=v1', '--untracked-files=normal', '--no-renames']).split('\n').filter(Boolean).length;
    if (result.changedEntries) result.issues.push('uncommitted-work');
    try {
      result.remoteHead = readGit(directory, ['rev-parse', '--verify', 'refs/remotes/origin/main']);
      [result.ahead, result.behind] = readGit(directory, ['rev-list', '--left-right', '--count', 'HEAD...refs/remotes/origin/main']).split(/\s+/).map(Number);
      if (result.behind) result.issues.push('behind-fetched-main');
      if (result.ahead) result.issues.push('unpublished-local-commits');
    } catch { result.issues.push('missing-origin-main'); }
    const fetched = path.resolve(directory, readGit(directory, ['rev-parse', '--git-path', 'FETCH_HEAD']));
    result.lastFetchAt = fs.existsSync(fetched) ? fs.statSync(fetched).mtime.toISOString() : null;
    result.remoteFreshness = fetchedThisRun ? 'fetched-this-run' : fetch ? 'fetch-failed-cached-tracking-ref-only' : 'cached-tracking-ref-only';
    try { result.sparse = readGit(directory, ['config', '--get', 'core.sparseCheckout']) === 'true'; } catch { result.sparse = false; }
  } catch (error) {
    result.issues.push('git-inspection-failed');
    result.error = String(error.message).slice(0,300);
  }
  return result;
}

export function inspectWorkspace(root, { fetch = false } = {}) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'workspace.json'), 'utf8'));
  if (config.schemaVersion !== 1 || !Array.isArray(config.repositories)) throw new Error('Unsupported workspace manifest');
  const repositories = config.repositories.map(item => inspectRepository(root, item, { fetch }));
  return { checkedAt: new Date().toISOString(), readOnlyWorkingTrees: true, repositories, safeForUnattendedWrites: repositories.every(item => item.issues.length === 0) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.includes('--help')) {
      console.log('Usage: node scripts/workspace-doctor.mjs [--fetch] [--check] [--json] [--root PATH]\nDefault: read-only report against cached tracking refs. --fetch refreshes origin/main without changing any working file. --check exits 1 on any checkout issue. Never auto-pulls or cleans.');
    } else {
      const allowed = new Set(['--fetch','--check','--json','--root']);
      let root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
      for (let i = 0; i < args.length; i++) {
        if (!allowed.has(args[i])) throw new Error('Unknown argument: ' + args[i]);
        if (args[i] === '--root') { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--root needs a path'); root = path.resolve(args[++i]); }
      }
      const report = inspectWorkspace(root, { fetch: args.includes('--fetch') });
      if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
      else {
        console.log('Cars workspace: no working files changed. Tracking refs are ' + (args.includes('--fetch') ? 'requested for refresh; verify each repository below.' : 'cached; use --fetch before publishing.'));
        for (const item of report.repositories) console.log(item.key + ': ' + (item.issues.join(', ') || 'clean main') + ' | ahead=' + (item.ahead ?? '?') + ' behind=' + (item.behind ?? '?') + ' changed=' + (item.changedEntries ?? '?') + ' | freshness=' + (item.remoteFreshness ?? 'unknown') + ' | ' + item.path);
        if (!report.safeForUnattendedWrites) console.log('Preserve and reconcile the flagged checkout with its writer; do not reset, clean, mass-stage or move it.');
      }
      if (args.includes('--check') && !report.safeForUnattendedWrites) process.exitCode = 1;
    }
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
