import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root = process.cwd();
const outputRoot = path.resolve('artifacts/logo-identity-audit');
const token = process.env.GITHUB_TOKEN || '';

const dealers = [
  ['priselci', 'cars-priselci'],
  ['outletcars-varna', 'cars-outletcarsvarna'],
  ['promosale-varna', 'cars-promosalevarna'],
  ['autolife', 'cars-autolife'],
  ['astracar', 'cars-astracar'],
  ['al-hamoor-al-thahabi', 'cars-alhamooralthahabi'],
  ['avangard-auto', 'cars-avangardauto'],
  ['f1rst-motors', 'cars-f1rstmotors'],
  ['al-basma-motors', 'cars-albasmamotors'],
  ['elit-auto-import', 'cars-elitautoimport'],
  ['automarket-varna', 'cars-automarketvarna'],
  ['eliqauto', 'cars-eliqauto'],
  ['kg-team-auto', 'cars-kgteamauto'],
  ['champion-auto-pro', 'cars-championautopro'],
  ['excellent-cars', 'excellent-cars'],
  ['perfect-auto-varna', 'cars-perfectauto'],
  ['asko-96', 'cars-asko96'],
  ['texas-drive-auto', 'cars-texasdriveauto'],
  ['day-and-night', 'day-and-night-autodeal'],
  ['the-dealers-point', 'cars-thedealerspoint'],
  ['ivo-auto', 'cars-ivoauto'],
  ['navara-car', 'cars-navaracar'],
  ['legend-auto', 'cars-legendauto'],
  ['isauto-varna', null]
];

const imageExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.avif', '.gif', '.svg']);
const positiveName = /(?:^|[/_.-])(logo|wordmark|brand|identity|lockup|logotype|candidate|generated|official|source)(?:$|[/_.-])/i;
const knownBrandPath = /(?:assets[/\\]brand|branding|lead-logo|wordmark|dealer-logo|logo-on-|logo-master|logo-universal)/i;
const negativeName = /(?:vehicle|hero|banner|showroom|gallery|favicon|icon-box|partner\d|parner\d|manufacturer|car-brand|social|flag|payment|map|avatar|team|qr|youtube|instagram|facebook)/i;

const escapeXml = (value) => String(value).replace(/[<>&"']/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'
})[character]);
const escapeHtml = escapeXml;
const exists = async (target) => fs.access(target).then(() => true, () => false);

async function walk(directory, output = []) {
  if (!(await exists(directory))) return output;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.svelte-kit', 'build', 'dist', '.turbo', 'runtime'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target, output);
    else if (entry.isFile()) output.push(target);
  }
  return output;
}

function collectStrings(value, prefix = '', output = []) {
  if (typeof value === 'string') output.push({ key: prefix, value });
  else if (Array.isArray(value)) value.forEach((item, index) => collectStrings(item, `${prefix}[${index}]`, output));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => collectStrings(child, prefix ? `${prefix}.${key}` : key, output));
  return output;
}

function explicitPathsFromFacts(raw) {
  return collectStrings(raw)
    .filter(({ key, value }) => /logo|wordmark|brand|identity|mark/i.test(`${key} ${value}`))
    .map(({ value }) => String(value).trim())
    .filter((value) => !/^https?:/i.test(value))
    .map((value) => value.replace(/^\/+/, ''));
}

function isCandidate(relative, explicitPaths = []) {
  const normalized = relative.replaceAll('\\', '/');
  const extension = path.extname(normalized).toLowerCase();
  if (!imageExtensions.has(extension)) return false;
  if (explicitPaths.some((candidate) => normalized.endsWith(candidate) || normalized.endsWith(candidate.replace(/^assets\//, '')))) return true;
  if (negativeName.test(normalized) && !/logo-on-|logo-master|logo-universal|lead-logo/i.test(normalized)) return false;
  return positiveName.test(normalized) || knownBrandPath.test(normalized);
}

async function githubJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function download(url, target) {
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, buffer);
}

async function deploymentCandidates(repo, targetRoot) {
  if (!repo) return [];
  const repository = await githubJson(`https://api.github.com/repos/darkapoparka/${repo}`);
  const branch = repository.default_branch || 'main';
  const tree = await githubJson(`https://api.github.com/repos/darkapoparka/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  const paths = (tree.tree || [])
    .filter((entry) => entry.type === 'blob' && isCandidate(entry.path))
    .map((entry) => entry.path)
    .sort((left, right) => {
      const score = (value) => {
        let result = 0;
        if (/logo-master|logo-universal|logo-on-(light|dark|accent)/i.test(value)) result += 100;
        if (/candidate|generated/i.test(value)) result += 45;
        if (/official|source/i.test(value)) result += 40;
        if (/lead-logo|wordmark/i.test(value)) result += 25;
        if (/\.svg$/i.test(value)) result -= 10;
        return result;
      };
      return score(right) - score(left) || left.localeCompare(right);
    })
    .slice(0, 50);

  const output = [];
  for (const relative of paths) {
    const target = path.join(targetRoot, relative);
    try {
      await download(`https://raw.githubusercontent.com/darkapoparka/${repo}/${encodeURIComponent(branch)}/${relative.split('/').map(encodeURIComponent).join('/')}`, target);
      output.push({ source: `deployment:${repo}@${branch}`, relative, target });
    } catch (error) {
      output.push({ source: `deployment:${repo}@${branch}`, relative, target: null, downloadError: String(error) });
    }
  }
  return output;
}

async function localCandidates(slug) {
  const clientRoot = path.join(root, 'clients', slug);
  if (!(await exists(clientRoot))) return { candidates: [], facts: null, urls: [], clientExists: false };
  let facts = null;
  const factsPath = path.join(clientRoot, 'business-facts.json');
  if (await exists(factsPath)) {
    try { facts = JSON.parse((await fs.readFile(factsPath, 'utf8')).replace(/^\uFEFF/, '')); }
    catch { facts = null; }
  }
  const explicit = explicitPathsFromFacts(facts || {});
  const files = await walk(clientRoot);
  const candidates = files
    .filter((target) => isCandidate(path.relative(clientRoot, target), explicit))
    .map((target) => ({ source: 'monorepo-client', relative: path.relative(clientRoot, target).replaceAll('\\', '/'), target }));

  const evidenceTexts = [];
  for (const relative of ['business-facts.json', 'CLIENT.md', 'BUILD-STATUS.md', 'assets/provenance.json']) {
    const target = path.join(clientRoot, relative);
    if (await exists(target)) evidenceTexts.push(await fs.readFile(target, 'utf8').catch(() => ''));
  }
  const urls = [...new Set(evidenceTexts.flatMap((text) => text.match(/https?:\/\/[^\s)\]"'<>]+/g) || []))].sort();
  return { candidates, facts, urls, clientExists: true };
}

async function metadataFor(candidate) {
  if (!candidate.target) return { ...candidate };
  try {
    const instance = sharp(candidate.target, { density: 300, animated: false, failOn: 'none' });
    const metadata = await instance.metadata();
    const stats = await instance.ensureAlpha().stats().catch(() => null);
    return {
      ...candidate,
      format: metadata.format || path.extname(candidate.relative).slice(1),
      width: metadata.width || null,
      height: metadata.height || null,
      hasAlpha: metadata.hasAlpha === true,
      alphaMin: stats?.channels?.[3]?.min ?? null,
      alphaMax: stats?.channels?.[3]?.max ?? null,
      fileSize: (await fs.stat(candidate.target)).size,
      renderable: true
    };
  } catch (error) {
    return { ...candidate, renderable: false, metadataError: String(error) };
  }
}

async function renderTile(candidate, index) {
  const tileWidth = 760;
  const tileHeight = 390;
  const artHeight = 280;
  const leftWidth = Math.floor(tileWidth / 2);
  const label = `${index + 1}. ${candidate.source} :: ${candidate.relative}`;
  const detail = `${candidate.format || '?'} · ${candidate.width || '?'}×${candidate.height || '?'} · alpha:${candidate.hasAlpha ? `yes/min ${candidate.alphaMin}` : 'no'} · ${(candidate.fileSize / 1024).toFixed(1)} KB`;
  const base = sharp({
    create: { width: tileWidth, height: tileHeight, channels: 4, background: { r: 248, g: 248, b: 248, alpha: 1 } }
  });
  const composites = [
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}"><rect width="${leftWidth}" height="${artHeight}" fill="#f5f5f4"/><rect x="${leftWidth}" width="${tileWidth-leftWidth}" height="${artHeight}" fill="#17191f"/><rect y="${artHeight}" width="${tileWidth}" height="${tileHeight-artHeight}" fill="#ffffff"/><line x1="${leftWidth}" y1="0" x2="${leftWidth}" y2="${artHeight}" stroke="#777" stroke-opacity=".3"/><text x="18" y="316" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#111">${escapeXml(label.slice(0, 92))}</text><text x="18" y="348" font-family="Arial, sans-serif" font-size="16" fill="#444">${escapeXml(detail)}</text><text x="18" y="376" font-family="Arial, sans-serif" font-size="14" fill="#777">${escapeXml(label.slice(92, 190))}</text></svg>`), top: 0, left: 0 }
  ];

  if (candidate.renderable && candidate.target) {
    const rendered = await sharp(candidate.target, { density: 320, animated: false, failOn: 'none' })
      .rotate()
      .resize({ width: leftWidth - 50, height: artHeight - 50, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    const info = await sharp(rendered).metadata();
    const top = Math.max(10, Math.floor((artHeight - (info.height || 0)) / 2));
    const leftA = Math.max(10, Math.floor((leftWidth - (info.width || 0)) / 2));
    const leftB = leftWidth + Math.max(10, Math.floor(((tileWidth - leftWidth) - (info.width || 0)) / 2));
    composites.push({ input: rendered, top, left: leftA }, { input: rendered, top, left: leftB });
  } else {
    composites.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${artHeight}"><text x="380" y="140" text-anchor="middle" font-family="Arial" font-size="28" fill="#b00020">UNRENDERABLE</text></svg>`), top: 0, left: 0 });
  }
  return base.composite(composites).png().toBuffer();
}

async function renderSheet(slug, candidates) {
  const columns = 2;
  const tileWidth = 760;
  const tileHeight = 390;
  const headerHeight = 86;
  const rows = Math.max(1, Math.ceil(candidates.length / columns));
  const width = columns * tileWidth;
  const height = headerHeight + rows * tileHeight;
  const tiles = [];
  for (let index = 0; index < candidates.length; index += 1) {
    const input = await renderTile(candidates[index], index);
    tiles.push({ input, left: (index % columns) * tileWidth, top: headerHeight + Math.floor(index / columns) * tileHeight });
  }
  const header = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${headerHeight}"><rect width="100%" height="100%" fill="#ffffff"/><text x="24" y="40" font-family="Arial,sans-serif" font-size="30" font-weight="800" fill="#111">${escapeXml(slug)} — identity candidates</text><text x="24" y="69" font-family="Arial,sans-serif" font-size="16" fill="#555">Each candidate shown unchanged on light and dark surfaces. ${candidates.length} files.</text></svg>`);
  const sheet = sharp({ create: { width, height, channels: 4, background: { r: 235, g: 235, b: 235, alpha: 1 } } })
    .composite([{ input: header, left: 0, top: 0 }, ...tiles]);
  await sheet.png({ compressionLevel: 9 }).toFile(path.join(outputRoot, `${slug}.png`));
}

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(path.join(outputRoot, 'downloaded'), { recursive: true });
const reports = [];

for (const [slug, repo] of dealers) {
  console.log(`Auditing ${slug} (${repo || 'monorepo-only'})`);
  const local = await localCandidates(slug);
  const downloadedRoot = path.join(outputRoot, 'downloaded', slug);
  let deployed = [];
  try { deployed = await deploymentCandidates(repo, downloadedRoot); }
  catch (error) { deployed = [{ source: `deployment:${repo}`, relative: '', target: null, downloadError: String(error) }]; }
  const combined = [];
  const seen = new Set();
  for (const candidate of [...local.candidates, ...deployed]) {
    const key = `${candidate.source}:${candidate.relative}`;
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(await metadataFor(candidate));
  }
  combined.sort((left, right) => {
    const score = (candidate) => {
      let value = 0;
      if (/logo-master|logo-universal|logo-on-(light|dark|accent)/i.test(candidate.relative)) value += 100;
      if (/candidate|generated/i.test(candidate.relative)) value += 45;
      if (/official|source/i.test(candidate.relative)) value += 40;
      if (/wordmark|lead-logo/i.test(candidate.relative)) value += 25;
      if (candidate.hasAlpha) value += 10;
      if (candidate.width && candidate.width >= 800) value += 8;
      if (/\.svg$/i.test(candidate.relative)) value -= 8;
      return value;
    };
    return score(right) - score(left) || left.relative.localeCompare(right.relative);
  });
  const capped = combined.slice(0, 48);
  await renderSheet(slug, capped);
  reports.push({
    slug,
    repository: repo ? `darkapoparka/${repo}` : 'darkapoparka/cars',
    clientExists: local.clientExists,
    facts: local.facts,
    publishedAndEvidenceUrls: local.urls,
    candidates: capped.map(({ target, ...candidate }) => candidate),
    omittedCandidateCount: Math.max(0, combined.length - capped.length),
    contactSheet: `${slug}.png`
  });
}

await fs.writeFile(path.join(outputRoot, 'report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2));
const rows = reports.map((report) => `<tr><td><strong>${escapeHtml(report.slug)}</strong><br>${escapeHtml(report.repository)}</td><td>${report.publishedAndEvidenceUrls.map((url) => `<div>${escapeHtml(url)}</div>`).join('')}</td><td>${report.candidates.length}${report.omittedCandidateCount ? ` (+${report.omittedCandidateCount} omitted)` : ''}</td><td><a href="${report.contactSheet}"><img loading="lazy" src="${report.contactSheet}" width="760"></a></td></tr>`).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dealer identity audit</title><style>body{font:14px/1.45 system-ui,sans-serif;margin:24px;color:#171717}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:10px;vertical-align:top}th{position:sticky;top:0;background:#fff}td:nth-child(2){max-width:360px;word-break:break-all}img{height:auto;max-width:760px}</style></head><body><h1>Dealer identity audit</h1><p>Generated ${new Date().toISOString()}. Candidate files are shown unchanged on both light and dark backgrounds.</p><table><thead><tr><th>Dealer/source</th><th>Published and evidence URLs</th><th>Candidates</th><th>Contact sheet</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
await fs.writeFile(path.join(outputRoot, 'index.html'), html);
