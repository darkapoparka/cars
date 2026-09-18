import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = process.cwd();
const out = path.join(root, 'qa-output');
const dealers = JSON.parse(await fs.readFile(path.join(root, 'scripts/logo-refresh-dealers.json'), 'utf8'));
const ghToken = process.env.GITHUB_TOKEN || '';

async function mkdirp(p) { await fs.mkdir(p, { recursive: true }); }
async function writeJson(p, data) {
  await mkdirp(path.dirname(p));
  await fs.writeFile(p, JSON.stringify(data, null, 2) + '\n');
}
function safeName(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-120);
}
function escSvg(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}
async function gh(endpoint) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(ghToken ? { Authorization: `Bearer ${ghToken}` } : {})
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitHub ${response.status} ${endpoint}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}
async function getContent(repo, filePath, ref) {
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const data = await gh(`/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`);
  if (data.type !== 'file' || !data.content) throw new Error(`No file content for ${repo}:${filePath}@${ref}`);
  return Buffer.from(data.content.replace(/\n/g, ''), 'base64');
}
function candidateScore(filePath) {
  const p = filePath.toLowerCase();
  let score = 0;
  if (/logo-master/.test(p)) score += 100;
  if (/logo-on-(light|dark|accent|yellow)/.test(p)) score += 90;
  if (/generated|candidate/.test(p)) score += 75;
  if (/official|source/.test(p)) score += 70;
  if (/wordmark/.test(p)) score += 60;
  if (/logo/.test(p)) score += 50;
  if (/brand/.test(p)) score += 30;
  if (/favicon|icon-|apple-touch|og-|hero|vehicle|inventory/i.test(p)) score -= 100;
  if (/\.(png|webp)$/i.test(p)) score += 8;
  if (/\.svg$/i.test(p)) score += 4;
  return score;
}
async function collectRepoAssets(dealer) {
  const repoInfo = await gh(`/repos/${dealer.repo}`);
  const branch = repoInfo.default_branch || 'main';
  const head = await gh(`/repos/${dealer.repo}/commits/${encodeURIComponent(branch)}`);
  let referenceCommit = null;
  try { referenceCommit = await gh(`/repos/${dealer.repo}/commits/${dealer.asset_commit}`); }
  catch (error) { referenceCommit = { error: String(error) }; }

  const tree = await gh(`/repos/${dealer.repo}/git/trees/${head.commit.tree.sha}?recursive=1`);
  const rootPrefix = dealer.root ? `${dealer.root.replace(/\/+$/, '')}/` : '';
  const currentPaths = (tree.tree || [])
    .filter((item) => item.type === 'blob')
    .map((item) => item.path)
    .filter((p) => !rootPrefix || p.startsWith(rootPrefix))
    .filter((p) => /\.(png|webp|jpe?g|svg)$/i.test(p))
    .filter((p) => /(logo|wordmark|brand|identity)/i.test(p))
    .filter((p) => !/(favicon|apple-touch|og-image|vehicle|inventory|hero)/i.test(p));

  const commitPaths = Array.isArray(referenceCommit?.files)
    ? referenceCommit.files
        .map((f) => f.filename)
        .filter((p) => /\.(png|webp|jpe?g|svg)$/i.test(p))
        .filter((p) => /(logo|wordmark|brand|identity|source|candidate)/i.test(p))
    : [];

  const ranked = [...new Set([...commitPaths, ...currentPaths])]
    .map((filePath) => ({ filePath, score: candidateScore(filePath) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.filePath.localeCompare(b.filePath))
    .slice(0, 18);

  const saved = [];
  for (const item of ranked) {
    const refs = commitPaths.includes(item.filePath)
      ? [dealer.asset_commit, head.sha]
      : [head.sha];
    let buffer = null;
    let usedRef = null;
    for (const ref of refs) {
      try {
        buffer = await getContent(dealer.repo, item.filePath, ref);
        usedRef = ref;
        break;
      } catch {}
    }
    if (!buffer || buffer.length > 8_000_000) continue;
    const ext = path.extname(item.filePath).toLowerCase();
    const target = path.join(out, 'source-assets', dealer.project, `${safeName(path.basename(item.filePath, ext))}--${usedRef.slice(0,8)}${ext}`);
    await mkdirp(path.dirname(target));
    await fs.writeFile(target, buffer);
    saved.push({
      sourcePath: item.filePath,
      ref: usedRef,
      bytes: buffer.length,
      outputPath: path.relative(root, target).replaceAll('\\','/'),
      score: item.score
    });
  }

  const comparison = (() => {
    if (!referenceCommit?.sha) return null;
    const paths = Array.isArray(referenceCommit.files) ? referenceCommit.files.map((f) => ({
      path: f.filename, status: f.status, additions: f.additions, deletions: f.deletions
    })) : [];
    return { sha: referenceCommit.sha, message: referenceCommit.commit?.message, date: referenceCommit.commit?.author?.date, files: paths };
  })();

  return {
    defaultBranch: branch,
    headSha: head.sha,
    headMessage: head.commit?.message,
    headDate: head.commit?.author?.date,
    rootPrefix,
    treeTruncated: !!tree.truncated,
    referenceCommit: comparison,
    assetCandidates: saved
  };
}

async function labelSvg(label, width, height, fontSize = 26) {
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="18" y="${Math.round(height * 0.65)}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#111827">${escSvg(label)}</text>
  </svg>`);
}
async function renderLogoTile(asset, index) {
  const width = 720, height = 420, previewH = 330, half = width / 2;
  const input = await fs.readFile(path.join(root, asset.outputPath));
  let normalized;
  try {
    normalized = await sharp(input, { density: 300, failOn: 'none' })
      .resize({ width: 300, height: 245, fit: 'inside', withoutEnlargement: false })
      .png()
      .toBuffer();
  } catch {
    normalized = await labelSvg('Unreadable image', 300, 245, 22);
  }
  const meta = await sharp(normalized).metadata();
  const left = Math.round((half - (meta.width || 0)) / 2);
  const top = Math.round((previewH - (meta.height || 0)) / 2);
  const shortPath = asset.sourcePath.length > 74 ? `…${asset.sourcePath.slice(-73)}` : asset.sourcePath;
  const label = await labelSvg(`${index + 1}. ${shortPath}`, width, height - previewH, 20);
  return sharp({
    create: { width, height, channels: 4, background: '#ffffff' }
  }).composite([
    { input: Buffer.from(`<svg width="${width}" height="${previewH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${half}" height="${previewH}" fill="#ffffff"/>
      <rect x="${half}" width="${half}" height="${previewH}" fill="#111827"/>
      <path d="M0 0H${width}V${previewH}H0Z" fill="none" stroke="#d1d5db" stroke-width="2"/>
      <line x1="${half}" y1="0" x2="${half}" y2="${previewH}" stroke="#d1d5db" stroke-width="2"/>
    </svg>`), left: 0, top: 0 },
    { input: normalized, left, top },
    { input: normalized, left: Math.round(half + (half - (meta.width || 0)) / 2), top },
    { input: label, left: 0, top: previewH }
  ]).png().toBuffer();
}
async function makeLogoSheet(dealer, assets) {
  if (!assets.length) return null;
  const selected = assets.slice(0, 12);
  const tiles = [];
  for (let i = 0; i < selected.length; i++) tiles.push(await renderLogoTile(selected[i], i));
  const cols = 2;
  const rows = Math.ceil(tiles.length / cols);
  const width = cols * 720;
  const height = rows * 420;
  const composites = tiles.map((buffer, i) => ({ input: buffer, left: (i % cols) * 720, top: Math.floor(i / cols) * 420 }));
  const target = path.join(out, 'logo-sheets', `${dealer.project}.png`);
  await mkdirp(path.dirname(target));
  await sharp({ create: { width, height, channels: 4, background: '#e5e7eb' } })
    .composite(composites).png().toFile(target);
  return path.relative(root, target).replaceAll('\\','/');
}

async function inspectPage(page) {
  return await page.evaluate(() => {
    const bgChain = (el) => {
      const colors = [];
      let node = el;
      while (node && colors.length < 5) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') colors.push(c);
        node = node.parentElement;
      }
      return colors;
    };
    const imgs = [...document.images]
      .filter((img) => {
        const text = [img.currentSrc, img.src, img.alt, img.className, img.id].filter(Boolean).join(' ');
        return /(logo|brand|wordmark|dealer)/i.test(text);
      })
      .map((img) => {
        const r = img.getBoundingClientRect();
        const cs = getComputedStyle(img);
        return {
          src: img.currentSrc || img.src,
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          clientWidth: Math.round(r.width),
          clientHeight: Math.round(r.height),
          x: Math.round(r.x),
          y: Math.round(r.y),
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          objectFit: cs.objectFit,
          background: cs.backgroundColor,
          backgroundChain: bgChain(img)
        };
      });
    const anchors = [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.href,
      text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
    }));
    return {
      title: document.title,
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      bodyScrollWidth: document.body?.scrollWidth || 0,
      logos: imgs,
      brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
      links: anchors
    };
  });
}
async function captureHeaderFooter(page, label, width, height) {
  const full = await page.screenshot({ fullPage: true, type: 'png' });
  const meta = await sharp(full).metadata();
  const sourceW = meta.width || width;
  const sourceH = meta.height || height;
  const headerH = Math.min(sourceH, Math.max(300, Math.round(sourceW * 0.22)));
  const footerH = Math.min(sourceH - headerH, Math.max(220, Math.round(sourceW * 0.16)));
  const header = await sharp(full).extract({ left: 0, top: 0, width: sourceW, height: headerH })
    .resize({ width: 700, height: 280, fit: 'cover', position: 'top' }).png().toBuffer();
  const footer = await sharp(full).extract({ left: 0, top: Math.max(0, sourceH - footerH), width: sourceW, height: footerH })
    .resize({ width: 700, height: 120, fit: 'cover', position: 'bottom' }).png().toBuffer();
  const labelBar = await labelSvg(label, 700, 50, 21);
  return sharp({ create: { width: 700, height: 450, channels: 4, background: '#ffffff' } })
    .composite([
      { input: header, left: 0, top: 0 },
      { input: footer, left: 0, top: 280 },
      { input: labelBar, left: 0, top: 400 }
    ]).png().toBuffer();
}
async function tryOpenDrawer(page) {
  const buttons = page.locator('button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    if (!(await button.isVisible().catch(() => false))) continue;
    const attrs = await button.evaluate((el) => ({
      aria: el.getAttribute('aria-label') || '',
      title: el.getAttribute('title') || '',
      cls: typeof el.className === 'string' ? el.className : '',
      text: (el.textContent || '').trim().replace(/\s+/g, ' ')
    })).catch(() => null);
    if (!attrs) continue;
    const hay = `${attrs.aria} ${attrs.title} ${attrs.cls} ${attrs.text}`;
    if (/(menu|navigation|nav-toggle|mobile-menu|hamburger|меню)/i.test(hay)) {
      await button.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}
async function auditDealer(browser, dealer) {
  const result = {
    project: dealer.project,
    dealer: dealer.name,
    strategyFromHandoff: dealer.strategy,
    baseUrl: dealer.url,
    variants: {},
    discoveredRoutes: { contact: [], sell: [] },
    consoleErrors: [],
    pageErrors: []
  };
  const cells = [];
  const drawerCells = [];
  for (const [variant, route] of Object.entries(dealer.routes)) {
    result.variants[variant] = {};
    for (const viewportName of ['desktop', 'mobile']) {
      const viewport = viewportName === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 };
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: 'light' });
      const page = await context.newPage();
      const localConsoleErrors = [];
      const localPageErrors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') localConsoleErrors.push(msg.text().slice(0,500)); });
      page.on('pageerror', (err) => localPageErrors.push(String(err).slice(0,500)));
      let responseStatus = null;
      let navError = null;
      const requestedUrl = new URL(route, dealer.url).toString();
      try {
        const response = await page.goto(requestedUrl, { waitUntil: 'networkidle', timeout: 75000 });
        responseStatus = response?.status() ?? null;
      } catch (error) {
        navError = String(error);
        try {
          const response = await page.goto(requestedUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
          responseStatus = response?.status() ?? null;
          await page.waitForTimeout(3000);
        } catch (second) {
          navError += ` | fallback: ${String(second)}`;
        }
      }
      await page.waitForTimeout(1200);
      let pageData = null;
      try { pageData = await inspectPage(page); } catch (error) { navError = `${navError || ''} | inspect: ${String(error)}`; }
      if (pageData) {
        for (const link of pageData.links) {
          const href = link.href;
          const descriptor = `${href} ${link.text}`;
          if (/(contact|kontakt|kontakti|контакт)/i.test(descriptor)) result.discoveredRoutes.contact.push(href);
          if (/(sell|sell-your|prodai|продай|изкупув)/i.test(descriptor)) result.discoveredRoutes.sell.push(href);
        }
      }
      let cell;
      try { cell = await captureHeaderFooter(page, `${dealer.name} · ${variant} · ${viewportName}`, viewport.width, viewport.height); }
      catch (error) { cell = await labelSvg(`Screenshot failed: ${variant} ${viewportName}`, 700, 450, 24); }
      cells.push(cell);
      let drawerOpened = false;
      if (viewportName === 'mobile') {
        try {
          drawerOpened = await tryOpenDrawer(page);
          const drawerShot = await page.screenshot({ type: 'png' });
          const drawerCell = await sharp(drawerShot).resize({ width: 600, height: 760, fit: 'cover', position: 'top' }).png().toBuffer();
          const drawerLabel = await labelSvg(`${variant} mobile drawer · ${drawerOpened ? 'opened' : 'no trigger found'}`, 600, 50, 19);
          drawerCells.push(await sharp({ create: { width: 600, height: 810, channels: 4, background: '#fff' } })
            .composite([{ input: drawerCell, left: 0, top: 0 }, { input: drawerLabel, left: 0, top: 760 }]).png().toBuffer());
        } catch {}
      }
      result.variants[variant][viewportName] = {
        requestedUrl,
        finalUrl: page.url(),
        responseStatus,
        navError,
        drawerOpened,
        page: pageData,
        consoleErrors: [...new Set(localConsoleErrors)],
        pageErrors: [...new Set(localPageErrors)]
      };
      result.consoleErrors.push(...localConsoleErrors.map((text) => ({ variant, viewport: viewportName, text })));
      result.pageErrors.push(...localPageErrors.map((text) => ({ variant, viewport: viewportName, text })));
      await context.close();
    }
  }
  result.discoveredRoutes.contact = [...new Set(result.discoveredRoutes.contact)].slice(0, 12);
  result.discoveredRoutes.sell = [...new Set(result.discoveredRoutes.sell)].slice(0, 12);

  const sheetTarget = path.join(out, 'live-sheets', `${dealer.project}.png`);
  await mkdirp(path.dirname(sheetTarget));
  await sharp({ create: { width: 2100, height: 900, channels: 4, background: '#d1d5db' } })
    .composite(cells.map((input, i) => ({ input, left: (i % 3) * 700, top: Math.floor(i / 3) * 450 })))
    .png().toFile(sheetTarget);
  result.liveSheet = path.relative(root, sheetTarget).replaceAll('\\','/');

  if (drawerCells.length) {
    const drawerTarget = path.join(out, 'drawer-sheets', `${dealer.project}.png`);
    await mkdirp(path.dirname(drawerTarget));
    await sharp({ create: { width: 1800, height: 810, channels: 4, background: '#d1d5db' } })
      .composite(drawerCells.map((input, i) => ({ input, left: i * 600, top: 0 })))
      .png().toFile(drawerTarget);
    result.drawerSheet = path.relative(root, drawerTarget).replaceAll('\\','/');
  }
  return result;
}

await fs.rm(out, { recursive: true, force: true });
await mkdirp(out);
const browser = await chromium.launch({ headless: true });
const summary = {
  generatedAt: new Date().toISOString(),
  purpose: 'Pre-change desktop/mobile live logo audit for the 24 handoff projects',
  dealers: []
};
for (let index = 0; index < dealers.length; index++) {
  const dealer = dealers[index];
  console.log(`[${index + 1}/${dealers.length}] ${dealer.project}`);
  const item = { project: dealer.project, name: dealer.name, strategyFromHandoff: dealer.strategy };
  try {
    item.repo = await collectRepoAssets(dealer);
    item.logoSheet = await makeLogoSheet(dealer, item.repo.assetCandidates);
  } catch (error) {
    item.repoError = String(error);
  }
  try {
    item.live = await auditDealer(browser, dealer);
  } catch (error) {
    item.liveError = String(error);
  }
  summary.dealers.push(item);
  await writeJson(path.join(out, 'audit-progress.json'), summary);
}
await browser.close();
await writeJson(path.join(out, 'audit.json'), summary);
console.log('Audit complete.');
