import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { registryProjects } from '../dashboard/registry.mjs';

function fixture(t, independent, verified = true) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-dashboard-proof-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'docs'));
  const dealer = { slug: 'example', repository: 'fixture/cars-example', variants: [{key:'auto-best'}],
    sourceOwnership: independent ? 'independent-repository' : undefined,
    evidence: {source: {commit: 'a'.repeat(40), remoteVerified: verified}} };
  fs.writeFileSync(path.join(root, 'docs/DEPLOYMENT-INVENTORY.json'), JSON.stringify({dealers:[dealer]}));
  return registryProjects(root).projects.get('example');
}
test('independent dashboard source and design links use the verified dealer repository', t => {
  const p = fixture(t, true);
  assert.equal(p.githubUrl, 'https://github.com/fixture/cars-example/tree/' + 'a'.repeat(40));
  assert.equal(p.designUrls['auto-best'], p.githubUrl + '/auto-best');
});
test('independent dashboard does not invent remote publication', t => assert.equal(fixture(t,true,false).githubUrl,null));
test('legacy dashboard source links keep their recorded Cars ownership', t => {
  assert.equal(fixture(t,false).githubUrl, 'https://github.com/darkapoparka/cars/tree/'+'a'.repeat(40)+'/clients/example');
});
