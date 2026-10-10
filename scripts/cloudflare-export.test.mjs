import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {packageDigest, verifyPackage} from './export-dealer.mjs';
import {sha256} from './lib/workflow.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-cloudflare-export-'));
  const created = [];
  const put = (name, contents) => {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), {recursive:true});
    if (!created.includes(target)) created.push(target);
    fs.writeFileSync(target, typeof contents === 'string' ? contents : JSON.stringify(contents));
  };
  t.after(() => {
    for (const target of created) fs.unlinkSync(target);
    const directories = [...new Set(created.map(target=>path.dirname(target)))].sort((a,b)=>b.length-a.length);
    for (const target of directories) if (target !== root) fs.rmdirSync(target);
    fs.rmdirSync(root);
  });
  put('dealer.json', {slug:'fixture-uk'});
  put('app/source.js', 'export const source = 1;\n');
  put('.cars-cloudflare.json', {provider:'cloudflare',acceptance:{dependencyLocksFrozen:true}});
  const payload = packageDigest(root).files;
  put('.cars-package.json', {assetDelivery:{provider:'cloudflare'},payload,payloadDigest:sha256(JSON.stringify(payload))});
  return {root,put};
}

test('Cloudflare build proofs do not invalidate the sealed publishing payload', t => {
  const {root,put} = fixture(t);
  const initial = verifyPackage(root).digest;
  for (const family of ['modern','app','mobile']) {
    put('.cars-next-'+family+'-dependencies.json', {generated:true});
    put('.cars-next-'+family+'-frozen-lock.json', {generated:true});
  }
  put('.cars-cloudflare-svelte-locks.json', {qualification:true});
  put('.cars-build-assets/auto-best.cloudflare-dependencies.json', {generated:true});
  assert.equal(verifyPackage(root).digest, initial);
  put('app/source.js', 'export const source = 2;\n');
  assert.throws(()=>verifyPackage(root), /payload changed/);
});

test('Cloudflare export requires frozen provider dependencies', t => {
  const {root,put} = fixture(t);
  put('.cars-cloudflare.json', {provider:'cloudflare',acceptance:{dependencyLocksFrozen:false}});
  assert.throws(()=>verifyPackage(root), /qualified and frozen/);
});

test('publishing preserves provider and adapter receipts as source evidence', t => {
  const {root,put} = fixture(t);
  put('.cars-cloudflare-next.json', {provider:'cloudflare'});
  put('.cars-cloudflare-svelte.json', {provider:'cloudflare'});
  const names = packageDigest(root).files.map(file=>file.path);
  for (const name of ['.cars-cloudflare.json','.cars-cloudflare-next.json','.cars-cloudflare-svelte.json','.cars-package.json']) assert.ok(names.includes(name),name);
});
