import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import { copySource } from '../copy-source.mjs';
import { POLICY, exportCommit, fingerprint, git, gitFiles, writeJson } from './workflow.mjs';

export const isCarsTemplateSource = source => source?.repository === 'darkapoparka/cars' &&
  /^[a-f0-9]{40}$/.test(source.revision || '') && /^templates\/[a-z0-9-]+$/.test(source.path || '') &&
  /^[a-f0-9]{40}$/.test(source.tree || '') && /^[a-f0-9]{64}$/.test(source.digest || '');

export async function materializeTemplateSource({ root, key, release, source, destination, copy = copySource, mutationWriter }) {
  if(mutationWriter&&typeof mutationWriter.writeDetached!=='function')throw Error('Explicit proof-capable materializer writer required');
  source ||= release?.source || { repository: release?.repository, revision: release?.commit,
    path: '', tree: null, digest: release?.digest };
  if (!['auto-best', 'modern', 'carwow', 'import', 'app', 'mobile', 'karento-best'].includes(key) ||
      release?.snapshotPath !== `templates/${key}` || release?.exportPolicy !== POLICY ||
      !/^[a-f0-9]{64}$/.test(release?.digest || '')) {
    throw new Error(`${key}: invalid template release identity or export policy`);
  }
  if (source.digest !== release?.digest) throw new Error(`${key}: selected source digest differs from release`);
  const cars = source.repository === 'darkapoparka/cars' || release.source !== undefined;
  if (cars) {
    if (!isCarsTemplateSource(source) || source.path !== release.snapshotPath ||
        source.repository !== release.repository || source.revision !== release.commit ||
        (release.source && ['repository','revision','path','tree','digest'].some(field => source[field] !== release.source[field]))) {
      throw new Error(`${key}: invalid Cars subtree source descriptor`);
    }
    if (git(root, ['rev-parse', `${source.revision}:${source.path}`]) !== source.tree) {
      throw new Error(`${key}: Cars subtree tree mismatch`);
    }
  } else {
    if(mutationWriter)throw Error('Owned creator requires immutable Cars subtree declarations');
    if (source.repository !== `darkapoparka/cars-template-${key}` ||
        source.repository !== release.repository || source.revision !== release.commit ||
        !/^[a-f0-9]{40}$/.test(source.revision || '') || source.path !== '' || source.tree != null) {
      throw new Error(`${key}: invalid legacy template source descriptor`);
    }
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const copied = await copy(path.join(root, release.snapshotPath), destination, { key, exportPolicy: POLICY });
    if (fingerprint(destination).digest !== release.digest) throw new Error(`Copied source differs from the approved release: ${key}`);
    return copied;
  }
  const exported = exportCommit(root, source.revision, destination, { prefix: source.path });
  if (exported.digest !== source.digest) throw new Error(`${key}: exact Cars source differs from approved digest`);
  const bytes = exported.files.reduce((sum, item) => sum + fs.statSync(path.join(destination, item.path)).size, 0);
  const manifest = { schemaVersion: 2, key, source: source.path, destination: path.resolve(destination),
    copiedAt: new Date().toISOString(), sourceUrl: `https://github.com/${source.repository}/tree/${source.revision}/${source.path}`,
    exactSource: source, exportPolicy: POLICY, files: exported.files, bytes, excluded: [], links: [],
    git: { root: fs.realpathSync(root), branch: null, head: source.revision, tree: source.tree,
      remote: `https://github.com/${source.repository}.git`, status: null, headAfterCopy: source.revision } };
  const manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n');
  const manifestProof=mutationWriter?mutationWriter.writeDetached(path.join(destination,'.template/source-manifest.json'),manifestBytes):null;
  if(!mutationWriter)writeJson(path.join(destination, '.template/source-manifest.json'), manifest);
  const declaredFiles=mutationWriter?gitFiles(root,source.revision,{prefix:source.path}).map(row=>{
    const file=path.join(destination,row.path),stat=fs.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>256*1024**2)throw Error('Unbounded or linked creator source declaration');
    const raw=fs.readFileSync(file),blob=createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex');
    if(blob!==row.blob)throw Error('Creator file differs from its immutable Git blob: '+row.path);
    return {path:row.path,sha256:createHash('sha256').update(raw).digest('hex'),mode:process.platform!=='win32'&&row.mode==='100755'?0o755:0o666&~process.umask()};
  }):null;
  return { key, source: source.path, destination: path.resolve(destination), files: exported.files.length,
    bytes, head: source.revision, tree: source.tree, dirty: false, excluded: 0,
    ...(mutationWriter?{sourceManifest:manifest,declaredFiles:[...declaredFiles,{path:'.template/source-manifest.json',sha256:manifestProof.sha256,mode:manifestProof.mode}]}:{}) };
}
