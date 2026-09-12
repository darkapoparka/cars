import http from 'node:http';
import {registryProjects} from './registry.mjs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'dashboard', 'public');
const runtime = path.join(root, 'runtime', 'lead-dashboard');
const statePath = path.join(runtime, 'state.json');
const recordPath = path.join(runtime, 'server.json');
const regions = ['bulgaria.json', 'uae.json', 'usa.json', 'europe.json'];
const designs = ['auto-best', 'modern', 'import', 'carwow'];
const stages = ['research','qualified','building','qa','ready','contacted','replied','won','lost','archived'];
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || 6620);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid port');

const readJson = async (p, fallback = null) => {
  try { return JSON.parse(await fsp.readFile(p, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return fallback; throw e; }
};
const exists = async (p) => { try { return (await fsp.stat(p)).isFile(); } catch { return false; } };
const isDir = async (p) => { try { return (await fsp.stat(p)).isDirectory(); } catch { return false; } };
const safeRel = (p) => path.relative(root, p).split(path.sep).join('/');
const clientSlug = (p) => typeof p === 'string' && p.startsWith('clients/') ? p.split('/')[1] : null;
const git = (args, options = {}) => {
  const result = spawnSync('git', ['-C', root, ...args], {
    encoding: options.binary ? null : 'utf8',
    maxBuffer: options.maxBuffer || 128 * 1024 * 1024
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || 'git command failed').toString().trim());
  return options.binary ? result.stdout : result.stdout.trim();
};
const gitMaybe = (args) => {
  try { return git(args); } catch { return ''; }
};
const gitJson = (ref, repoPath) => {
  const text = gitMaybe(['show', `${ref}:${repoPath}`]);
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
};
const humanize = (slug) => slug.split('-').map((x) => x ? x[0].toUpperCase() + x.slice(1) : x).join(' ');
const sourceBranch = (ref) => ref.startsWith('origin/') ? ref.slice(7) : ref;
const sourceSha = (ref) => gitMaybe(['rev-parse', ref]);
const sourceUrl = (ref, slug, design = '') => {
  const tail = ['clients', slug, design].filter(Boolean).join('/');
  return `https://github.com/darkapoparka/cars/tree/${sourceSha(ref) || encodeURIComponent(sourceBranch(ref))}/${tail}`;
};

function gitInventory() {return {...registryProjects(root),mainSha:sourceSha('origin/main')};}
async function fetchGithub() {
  const result=spawnSync(process.execPath,[path.join(root,'scripts/index-deployments.mjs'),'--write'],{encoding:'utf8',windowsHide:true});
  if(result.status!==0)throw new Error(result.stderr||'Registry refresh failed');
  return {ok:true,source:'docs/DEPLOYMENT-INVENTORY.json'};
}

async function leads() {
  const out = [];
  for (const file of regions) {
    const doc = await readJson(path.join(root, 'leads', file), {});
    for (const lead of doc.leads || []) out.push({ ...doc.defaults, ...lead, market: doc.market || file.replace('.json', ''), sourceFile: `leads/${file}` });
  }
  return out;
}
async function state() { return await readJson(statePath, { schemaVersion: 1, leads: {} }); }
async function writeState(id, patch) {
  const doc = await state();
  doc.leads ||= {};
  const next = { ...(doc.leads[id] || {}) };
  if ('stage' in patch) {
    if (!stages.includes(patch.stage)) throw new Error('Invalid stage');
    next.stage = patch.stage;
  }
  if ('favorite' in patch) next.favorite = !!patch.favorite;
  if ('note' in patch) next.note = String(patch.note || '').slice(0, 5000);
  if ('nextAction' in patch) next.nextAction = String(patch.nextAction || '').slice(0, 2000);
  next.updatedAt = new Date().toISOString();
  doc.leads[id] = next;
  doc.updatedAt = next.updatedAt;
  await fsp.mkdir(runtime, { recursive: true });
  const tmp = `${statePath}.${process.pid}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(doc, null, 2) + '\n');
  await fsp.rename(tmp, statePath);
  return next;
}

function isAlive(pid) {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch { return false; }
}
async function localProject(slug, indexEntry = {}) {
  const base = path.join(root, 'clients', slug);
  const present = await isDir(base);
  const variants = [];
  if (present) for (const d of designs) if (await exists(path.join(base, d, 'package.json'))) variants.push(d);
  const facts = present ? await readJson(path.join(base, 'FACTS-AND-INVENTORY.json'), null) || await readJson(path.join(base,'business-facts.json'),{}) : {};
  const stock = present ? await readJson(path.join(base,'stock.json'),null) : null;
  const stockCount = Array.isArray(facts.stock) ? facts.stock.length : Array.isArray(stock) ? stock.length : null;
  const logos = [
    path.join(base, 'auto-best', 'static', 'dealer', 'logo-light.png'),
    path.join(base, 'modern', 'apps', 'web', 'public', 'dealer', 'logo-light.png'),
    path.join(base, 'carwow', 'static', 'dealer', 'logo-light.png'),
    path.join(base, 'import', 'static', 'dealer', 'logo-light.png'),
    path.join(base, 'auto-best', 'static', 'dealer', 'logo-light.svg')
  ];
  let logoPath = null;
  for (const p of logos) if (await exists(p)) { logoPath = safeRel(p); break; }
  const stockDirs = [
    path.join(base, 'auto-best', 'static', 'dealer', 'stock'),
    path.join(base, 'modern', 'apps', 'web', 'public', 'dealer', 'stock'),
    path.join(base, 'carwow', 'static', 'dealer', 'stock'),
    path.join(base, 'import', 'static', 'dealer', 'stock'),
    path.join(base, 'assets', 'stock')
  ];
  let heroPath = null, mediaCount = 0;
  for (const dir of stockDirs) {
    try {
      const files = (await fsp.readdir(dir)).filter((x) => /\.(png|jpe?g|webp|avif)$/i.test(x)).sort();
      mediaCount = Math.max(mediaCount, files.length);
      if (!heroPath && files[0]) heroPath = safeRel(path.join(dir, files[0]));
    } catch {}
  }
  const indexed = (indexEntry.variants || []).filter((v) => designs.includes(v));
  const indexSynced = variants.length === indexed.length && variants.every((v) => indexed.includes(v));
  const run = await readJson(path.join(root, 'runtime', `review-${slug}.json`), []);
  const runtimeRows = Array.isArray(run) ? run.map((x) => ({
    template: x.Template || x.template, pid: Number(x.PID || x.pid) || null,
    port: Number(x.Port || x.port) || null, url: x.Url || x.url || null,
    alive: isAlive(Number(x.PID || x.pid) || 0)
  })) : [];
  return {
    slug, exists: present, variants, variantCount: variants.length,
    stockCount, mediaCount, business: facts.business || (facts.name ? facts : null),
    logoPath, heroPath, indexSynced, runtime: runtimeRows,
    path: `clients/${slug}`
  };
}
function repoInfo() {
  const run = (args) => gitMaybe(args);
  return {
    localBranch: run(['branch', '--show-current']) || 'unknown',
    localSha: run(['rev-parse', '--short=12', 'HEAD']) || 'unknown',
    remoteMainSha: run(['rev-parse', '--short=12', 'origin/main']) || 'unknown',
    dirtyFiles: run(['status', '--porcelain=v1']).split(/\r?\n/).filter(Boolean).length
  };
}
function pipelineStage(gitProject, lead, localState) {
  if (stages.includes(localState?.stage)) return localState.stage;
  if (!gitProject?.variantCount) return lead?.buildApproved ? 'qualified' : 'research';
  if (gitProject.variantCount < 3) return 'building';
  return gitProject.qaState === 'passed' && gitProject.evidence?.ownerReview?.state === 'passed' ? 'ready' : 'qa';
}
function qaLabel(gitProject) {
  if (!gitProject) return { label: 'Source unknown', tone: 'muted' };
  if (gitProject.variantCount < 3) return { label: 'Partial source', tone: 'blue' };
  if (gitProject.qaState === 'passed') return { label: 'Browser QA passed', tone: 'green' };
  if (gitProject.qaState === 'pending') return { label: 'QA pending', tone: 'amber' };
  return { label: 'QA evidence missing', tone: 'muted' };
}
function buildLabel(project) {
  if(!project?.variantCount)return {label:'No app source',tone:'muted'};
  return {label:project.variantCount+'/3 source present',tone:project.variantCount===3?'blue':'amber'};
}

function mergeProject(gitProject, local, indexEntry = {}) {
  if (!gitProject && !local?.exists) return null;
  const variants = gitProject?.variants || [];
  return {
    slug: gitProject?.slug || local?.slug,
    path: `clients/${gitProject?.slug || local?.slug}`,
    variants,
    variantCount: variants.length,
    variantMeta: gitProject?.meta || {},
    evidence:gitProject?.evidence||{}, delivery:gitProject?.delivery||{},
    stockCount: gitProject?.stockCount ?? local?.stockCount ?? null,
    mediaCount: local?.mediaCount ?? 0,
    business: gitProject?.business || local?.business || null,
    logoPath: local?.logoPath || null,
    heroPath: local?.heroPath || null,
    github: gitProject?.variantCount ? {
      location: gitProject.location, ref: gitProject.ref, branch: gitProject.branch,
      sha: gitProject.sha, url: gitProject.githubUrl, designUrls: gitProject.designUrls,
      refs: gitProject.refsList
    } : null,
    qaState: gitProject?.qaState || 'missing',
    qaChecked: gitProject?.qaChecked || 0,
    qaPassed: gitProject?.qaPassed || 0,
    local: {
      exists: !!local?.exists,
      variants: local?.variants || [],
      variantCount: local?.variantCount || 0,
      indexSynced: !!local?.indexSynced,
      indexVariants: indexEntry.variants || [],
      runtime: local?.runtime || []
    }
  };
}

async function overview() {
  const gitData = gitInventory();
  const [leadRows, index, localState] = await Promise.all([
    leads(),
    readJson(path.join(root, 'clients', 'index.json'), { projects: [], campaignCandidatesWithoutFolders: [] }),
    state()
  ]);
  const byId = new Map((index.projects || []).filter((x) => x.leadId).map((x) => [x.leadId, x]));
  const bySlug = new Map((index.projects || []).map((x) => [x.slug, x]));
  const candidates = new Map((index.campaignCandidatesWithoutFolders || []).map((x) => [x.leadId, x]));
  const used = new Set();
  const rows = [];

  for (const lead of leadRows) {
    const indexEntry = byId.get(lead.id) || null;
    const candidate = candidates.get(lead.id) || null;
    const slug = indexEntry?.slug || clientSlug(lead.existingClientPath) || clientSlug(candidate?.proposedClientPath);
    const gitProject = slug ? gitData.projects.get(slug) || null : null;
    const local = slug ? await localProject(slug, bySlug.get(slug) || indexEntry || {}) : null;
    if (slug) used.add(slug);
    const merged = mergeProject(gitProject, local, bySlug.get(slug) || indexEntry || {});
    const localLead = localState.leads?.[lead.id] || {};
    const stage = pipelineStage(gitProject, lead, localLead);
    rows.push({
      id: lead.id,
      name: lead.name,
      city: lead.city || merged?.business?.city || '',
      country: lead.country || '',
      market: lead.market,
      priority: lead.priority || '',
      sourceUrl: lead.inventory?.sourceUrl || lead.businessContactSource || null,
      website: lead.website || null,
      inventoryCount: merged?.stockCount ?? lead.inventory?.count ?? null,
      inventoryOrigin: merged?.stockCount != null ? 'project' : 'research',
      nextAction: localLead.nextAction || lead.nextAction || '',
      opportunity: lead.opportunityHypothesis || '',
      project: merged,
      local: { stage, favorite: !!localLead.favorite, note: localLead.note || '', nextAction: localLead.nextAction || '' },
      build: buildLabel(gitProject), qa: qaLabel(gitProject)
    });
  }
  for (const entry of index.projects || []) {
    if (entry.aliasOf || used.has(entry.slug)) continue;
    const gitProject = gitData.projects.get(entry.slug) || null;
    const local = await localProject(entry.slug, entry);
    const merged = mergeProject(gitProject, local, entry);
    const id = entry.leadId || `project:${entry.slug}`;
    const localLead = localState.leads?.[id] || {};
    const stage = pipelineStage(gitProject, null, localLead);
    used.add(entry.slug);
    rows.push({
      id,
      name: merged?.business?.name || entry.name || humanize(entry.slug),
      city: merged?.business?.city || '',
      country: '', market: 'Projects', priority: 'project-only',
      sourceUrl: merged?.business?.sourceUrl || null, website: null,
      inventoryCount: merged?.stockCount ?? null, inventoryOrigin: 'project',
      nextAction: localLead.nextAction || '', opportunity: '', project: merged,
      local: { stage, favorite: !!localLead.favorite, note: localLead.note || '', nextAction: localLead.nextAction || '' },
      build: buildLabel(gitProject), qa: qaLabel(gitProject)
    });
  }

  for (const [slug, gitProject] of gitData.projects) {
    if (used.has(slug)) continue;
    const entry = bySlug.get(slug) || {};
    const local = await localProject(slug, entry);
    const merged = mergeProject(gitProject, local, entry);
    const id = `project:${slug}`;
    const localLead = localState.leads?.[id] || {};
    const stage = pipelineStage(gitProject, null, localLead);
    rows.push({
      id,
      name: merged?.business?.name || humanize(slug),
      city: merged?.business?.city || '',
      country: '', market: gitProject.location === 'branch-only' ? 'GitHub branch projects' : 'Projects',
      priority: 'git-discovered', sourceUrl: merged?.business?.sourceUrl || null, website: null,
      inventoryCount: merged?.stockCount ?? null, inventoryOrigin: 'project',
      nextAction: localLead.nextAction || '', opportunity: '', project: merged,
      local: { stage, favorite: !!localLead.favorite, note: localLead.note || '', nextAction: localLead.nextAction || '' },
      build: buildLabel(gitProject), qa: qaLabel(gitProject)
    });
  }
  rows.sort((a, b) =>
    (b.local.favorite - a.local.favorite) ||
    String(a.market).localeCompare(String(b.market)) ||
    String(a.city).localeCompare(String(b.city)) ||
    a.name.localeCompare(b.name)
  );
  const trios = [...gitData.projects.values()].filter((p) => p.variantCount === 3);
  return {
    repo: repoInfo(),
    stages,
    rows,
    summary: {
      rows: rows.length,
      githubTrios: trios.length,
      mainTrios: trios.filter((p) => p.sha).length,
      branchTrios: trios.filter((p) => p.location === 'branch-only').length,
      qaPassed: trios.filter((p) => p.qaState === 'passed').length,
      qaPending: trios.filter((p) => p.qaState !== 'passed').length,
      running: rows.reduce((n, r) => n + (r.project?.local.runtime || []).filter((x) => x.alive).length, 0),
      markets: [...new Set(rows.map((r) => r.market).filter(Boolean))].sort()
    }
  };
}

function action(slug, kind, local) {
  if (process.platform !== 'win32') throw new Error('Controls require Windows');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('Bad slug');
  if (kind === 'open') {
    if (!local.exists) throw new Error('This GitHub project is not present in the local checkout.');
    spawn('explorer.exe', [path.join(root, 'clients', slug)], { detached: true, stdio: 'ignore' }).unref();
    return { ok: true };
  }
  if (kind === 'stop') {
    const stopped = [];
    for (const x of (local.runtime || []).filter((x) => x.alive && x.pid && x.port)) {
      const ps = `$l=@(Get-NetTCPConnection -State Listen -LocalPort ${x.port} -ErrorAction SilentlyContinue);if($l.Count-ne 1-or$l[0].OwningProcess-ne${x.pid}){throw 'ownership changed'};Stop-Process -Id ${x.pid} -ErrorAction Stop`;
      const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', ps], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error((result.stderr || result.stdout || 'stop failed').trim());
      stopped.push(x);
    }
    return { ok: true, stopped };
  }
  if (!local.exists || local.variantCount !== 3) throw new Error('All three designs must exist in the local checkout before launch.');
  if (!local.indexSynced) throw new Error('clients/index.json is not synced with the local design folders.');
  if (!['prepare', 'start'].includes(kind)) throw new Error('Unknown action');
  const args = ['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(root,'scripts','start-client.ps1'),'-Client',slug];
  if (kind === 'prepare') args.push('-Prepare');
  const child = spawn('powershell.exe', args, { cwd: root, detached: true, stdio: 'ignore', windowsHide: true });
  child.unref();
  return { ok: true, started: true };
}

function json(res, code, data) {
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(data));
}
async function body(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
async function asset(url, res) {
  const rel = url.searchParams.get('path')?.replaceAll('\\', '/').replace(/^\/+/, '');
  if (!rel?.startsWith('clients/') || rel.includes('..')) return json(res, 403, { error: 'Bad asset path' });
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(path.join(root, 'clients') + path.sep)) return json(res, 403, { error: 'Bad asset path' });
  try {
    const buffer = await fsp.readFile(abs);
    const ext = path.extname(abs).toLowerCase();
    const mime = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.avif':'image/avif'}[ext] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': mime, 'cache-control': 'no-store' });
    res.end(buffer);
  } catch { json(res, 404, { error: 'Not found' }); }
}
async function staticFile(requestPath, res) {
  const name = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const abs = path.resolve(pub, name);
  if (!abs.startsWith(pub + path.sep) && abs !== path.join(pub, 'index.html')) return json(res, 403, { error: 'Bad path' });
  try {
    const buffer = await fsp.readFile(abs);
    const ext = path.extname(abs);
    const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': mime,
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'"
    });
    res.end(buffer);
  } catch { json(res, 404, { error: 'Not found' }); }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const p = url.pathname;
    if (req.method === 'GET' && p === '/api/overview') return json(res, 200, { ok: true, ...await overview() });
    if (req.method === 'POST' && p === '/api/github-refresh') return json(res, 200, await fetchGithub());
    if (req.method === 'GET' && p === '/api/asset') return asset(url, res);
    if (req.method === 'POST' && p.startsWith('/api/state/')) return json(res, 200, { ok: true, state: await writeState(decodeURIComponent(p.slice(11)), await body(req)) });
    if (req.method === 'POST' && p.startsWith('/api/action/')) {
      const [, , , slug, kind] = p.split('/');
      const index = await readJson(path.join(root, 'clients', 'index.json'), { projects: [] });
      const entry = (index.projects || []).find((x) => x.slug === slug) || {};
      const local = await localProject(slug, entry);
      return json(res, 200, action(slug, kind, local));
    }
    if (req.method === 'GET' && p === '/health') return json(res, 200, { ok: true, root, port, githubMain: gitInventory().mainSha });
    if (req.method === 'GET') return staticFile(p, res);
    json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e.message || 'Dashboard error' });
  }
});
server.listen(port, '127.0.0.1', async () => {
  await fsp.mkdir(runtime, { recursive: true });
  await fsp.writeFile(recordPath, JSON.stringify({ pid: process.pid, port, url: `http://127.0.0.1:${port}`, startedAt: new Date().toISOString() }, null, 2));
  console.log(`Cars Lead Control http://127.0.0.1:${port}`);
});
const close = () => server.close(async () => {
  try { await fsp.rm(recordPath, { force: true }); } catch {}
  process.exit(0);
});
process.on('SIGINT', close);
process.on('SIGTERM', close);
