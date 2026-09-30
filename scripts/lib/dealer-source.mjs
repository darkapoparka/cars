import fs from 'node:fs';
import path from 'node:path';
import { gitRead, repositoryIdentity } from '../workspace-doctor.mjs';

const same = (a, b) => fs.realpathSync(a).toLowerCase() === fs.realpathSync(b).toLowerCase();
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
export function assertCarsOwnedDealer(root, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) throw new Error('Invalid dealer slug');
  const registryFile = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
  const record = fs.existsSync(registryFile) ? read(registryFile).dealers?.find(d => d.slug === slug) : null;
  const directory = path.join(root, 'clients', slug);
  const manifestFile = path.join(directory, 'dealer.json');
  const manifest = fs.existsSync(manifestFile) ? read(manifestFile) : null;
  if (record?.sourceOwnership === 'independent-repository' || manifest?.sourceOwnership === 'independent-repository' || fs.existsSync(path.join(directory, '.git'))) {
    throw new Error(`Independent dealer ${slug}: work in ${record?.checkoutPath || directory} and publish its own repository; this is not Cars-canonical source, so do not use the Cars legacy exporter/refresh.`);
  }
  return directory;
}

export function assertIndependentCheckout(root, record, directory, readGit = gitRead) {
  if (record.localPath !== null || !record.checkoutPath || record.canonicalSourceRepository !== record.repository || !same(record.checkoutPath, directory)) {
    throw new Error('Independent source has a competing or mismatched checkout: ' + record.slug);
  }
  if (!fs.existsSync(path.join(directory, '.git')) || !same(readGit(directory, ['rev-parse', '--show-toplevel']), directory)) {
    throw new Error('Independent source needs its own Git repository: ' + record.slug);
  }
  if (repositoryIdentity(readGit(directory, ['remote', 'get-url', 'origin'])) !== record.repository.toLowerCase()) throw new Error('Independent source origin differs: ' + record.slug);
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(directory));
  if (!relative.startsWith('..') && !path.isAbsolute(relative) && readGit(root, ['ls-files', '--', relative]).trim()) throw new Error('Independent source is also tracked by Cars: ' + record.slug);
}

// Keep a newly created independent checkout out of the parent Git index.
// Its dedicated repository remains the source; this is not a submodule.
export function excludeIndependentTarget(root, target, readGit = gitRead) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  if (relative.startsWith('..') || path.isAbsolute(relative)) return;
  const normalized = relative.replaceAll('\\', '/');
  // Legacy registered destinations outside clients/ retain their existing behavior.
  if (!normalized.startsWith('clients/')) return;
  if (!/^clients\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) throw new Error('Independent checkout must be a direct client folder');
  if (readGit(root, ['ls-files', '--', normalized]).trim()) throw new Error('Existing Cars-owned source cannot become an independent checkout automatically');
  const file = path.resolve(root, readGit(root, ['rev-parse', '--git-path', 'info/exclude']));
  const pattern = '/' + normalized + '/';
  const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (!old.split(/\r?\n/).includes(pattern)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, old + (old.endsWith('\n') || !old ? '' : '\n') + pattern + '\n');
  }
}
