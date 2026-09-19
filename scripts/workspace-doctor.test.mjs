import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gitRead, inspectRepository, repositoryIdentity, fetchCredentialArgs } from './workspace-doctor.mjs';

const expected = 'darkapoparka/cars';
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-doctor-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  git('init','--initial-branch=main');
  git('config','user.name','Workspace test'); git('config','user.email','test@example.invalid');
  git('remote','add','origin','https://github.com/' + expected + '.git');
  fs.writeFileSync(path.join(dir,'sample.txt'),'preserve me'); git('add','sample.txt'); git('commit','-m','fixture');
  git('update-ref','refs/remotes/origin/main','HEAD');
  return { dir, git, item: { key:'cars',path:'.',repository:expected,role:'integration' } };
}

test('normalizes HTTPS and SSH identities without exposing credentials', () => {
  for (const remote of ['https://github.com/darkapoparka/cars.git','git@github.com:darkapoparka/cars.git','https://github.com/darkapoparka/cars']) assert.equal(repositoryIdentity(remote),expected);
  assert.equal(repositoryIdentity('https://unrelated.example/cars.git'),null);
});
test('missing checkout is reported without creating it', () => {
  const root=path.join(os.tmpdir(),'cars-doctor-does-not-exist-' + process.pid);
  assert.deepEqual(inspectRepository(root,{key:'cars',path:'.',repository:expected}).issues,['missing-checkout']);
  assert.equal(fs.existsSync(root),false);
});
test('clean main is safe and inspection leaves its index and files unchanged', t => {
  const f=fixture(t); const before=fs.readFileSync(path.join(f.dir,'.git/index'));
  const result=inspectRepository(f.dir,f.item);
  assert.deepEqual(result.issues,[]); assert.equal(result.ahead,0); assert.equal(result.behind,0);
  assert.equal(result.remoteFreshness,'cached-tracking-ref-only');
  assert.deepEqual(fs.readFileSync(path.join(f.dir,'.git/index')),before);
  assert.equal(fs.readFileSync(path.join(f.dir,'sample.txt'),'utf8'),'preserve me');
});
test('dirty working files are detected and never reset', t => {
  const f=fixture(t); fs.writeFileSync(path.join(f.dir,'sample.txt'),'other agent work');
  const result=inspectRepository(f.dir,f.item);
  assert.ok(result.issues.includes('uncommitted-work')); assert.equal(result.changedEntries,1);
  assert.equal(fs.readFileSync(path.join(f.dir,'sample.txt'),'utf8'),'other agent work');
});
test('behind fetched main is detected without moving HEAD', t => {
  const f=fixture(t); const original=f.git('rev-parse','HEAD');
  const later=f.git('commit-tree','HEAD^{tree}','-p',original,'-m','upstream fixture');
  f.git('update-ref','refs/remotes/origin/main',later);
  const result=inspectRepository(f.dir,f.item);
  assert.ok(result.issues.includes('behind-fetched-main')); assert.equal(result.behind,1);
  assert.equal(f.git('rev-parse','HEAD'),original);
});
test('wrong origin is a blocker', t => {
  const f=fixture(t); f.git('remote','set-url','origin','https://github.com/other/example.git');
  assert.ok(inspectRepository(f.dir,f.item).issues.includes('wrong-origin'));
});
test('unpublished main commit is not mistaken for being up to date', t => {
  const f=fixture(t); f.git('commit','--allow-empty','-m','unpublished');
  const result=inspectRepository(f.dir,f.item);
  assert.equal(result.ahead,1); assert.ok(result.issues.includes('unpublished-local-commits'));
});

test('failed fetch retains local findings and never claims fresh remote evidence', t => {
  const f=fixture(t); fs.writeFileSync(path.join(f.dir,'sample.txt'),'preserve pending edits');
  const before=fs.readFileSync(path.join(f.dir,'.git/index'));
  const result=inspectRepository(f.dir,f.item,{fetch:true,readGit:(cwd,args)=>{
    if(args[0]==='fetch')throw new Error('Simulated network timeout');
    return gitRead(cwd,args);
  }});
  assert.ok(result.issues.includes('fetch-failed'));
  assert.ok(result.issues.includes('uncommitted-work'));
  assert.equal(result.changedEntries,1);
  assert.equal(result.remoteFreshness,'fetch-failed-cached-tracking-ref-only');
  assert.equal(result.ahead,0); assert.equal(result.behind,0);
  assert.deepEqual(fs.readFileSync(path.join(f.dir,'.git/index')),before);
  assert.equal(fs.readFileSync(path.join(f.dir,'sample.txt'),'utf8'),'preserve pending edits');
});

test('Windows chooser resolution is per-command and respects other configured helpers',()=>{
 const flags=fetchCredentialArgs('win32','helper-selector\n');
 assert.deepEqual(flags,['-c','credential.helper=','-c','credential.helper=manager','-c','credential.interactive=false']);
 for(const helper of ['manager','custom-helper','helper-selector\ncustom-helper',''])assert.deepEqual(fetchCredentialArgs('win32',helper),[]);
 assert.deepEqual(fetchCredentialArgs('linux','helper-selector'),[]);
});
