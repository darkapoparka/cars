const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let data = null;
let favoritesOnly = false;
let selectedId = null;
let activeDrawerTab = 'overview';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const api = async (url, opt = {}) => {
  const r = await fetch(url, { headers: { 'content-type': 'application/json' }, ...opt });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
};
const asset = (p) => p ? `/api/asset?path=${encodeURIComponent(p)}` : '';
const offered = (row) => row.project?.variants?.length ? row.project.variants : ['auto-best','modern','carwow'];
const designName = (d) => d === 'auto-best' ? 'Auto Best' : d[0].toUpperCase() + d.slice(1);

function toast(text, bad = false) {
  const n = document.createElement('div');
  n.className = `toast ${bad ? 'bad' : ''}`;
  n.textContent = text;
  $('#toasts').append(n);
  setTimeout(() => n.remove(), 4500);
}
function variantCell(row, design) {
  if(!design)return '<td><span class="muted">—</span></td>';
  const p = row.project;
  const built = p?.variants?.includes(design);
  const localBuilt = p?.local?.variants?.includes(design);
  const running = p?.local?.runtime?.find((x) => x.template === design && x.alive);
  const hero = p?.heroPath ? `style="--hero:url('${asset(p.heroPath)}')"` : '';
  return `<td><button class="design ${built ? 'built' : 'missing'}" data-open="${esc(row.id)}" data-tab="designs" ${hero}>
    <span class="shade"></span><span class="design-copy"><b>${designName(design)}</b>
    <span>${running ? 'Running locally' : built ? (localBuilt ? 'Source / local' : 'Source recorded') : 'Source missing'}</span>
    ${running?.url ? '<em>Preview available</em>' : ''}</span></button></td>`;
}
function checks(row) {
  const p = row.project;
  const inventoryLabel = row.inventoryOrigin === 'project'
    ? `${row.inventoryCount ?? 0} demo listings`
    : `${row.inventoryCount ?? 0} research ads`;
  const list = [
    [inventoryLabel, !!row.inventoryCount],
    [`${p?.mediaCount ?? 0} local media`, !!p?.mediaCount],
    ['Local brand asset', !!p?.logoPath],
    ['Local client folder', !!p?.local?.exists],
    [`${p?.local?.variantCount ?? 0}/3 local designs`, p?.local?.variantCount === 3]
  ];
  return `<ul class="checks">${list.map(([t, ok]) =>
    `<li class="${ok ? 'ok' : 'no'}"><span>${ok ? '&#10003;' : '&#8212;'}</span>${esc(t)}</li>`).join('')}</ul>`;
}
function logo(row, cls = 'logo') {
  if (row.project?.logoPath) return `<img class="${cls}" src="${asset(row.project.logoPath)}" alt="${esc(row.name)} logo">`;
  const letters = row.name.split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
  return `<div class="initials">${esc(letters)}</div>`;
}
function buildCell(row) {
  const p = row.project;
  if (!p?.github) return `<span class="status muted">No recorded source</span><small>Research / local only</small>`;
  return `<span class="status ${row.build.tone}">${esc(row.build.label)}</span><small>${esc(p.github.branch)} / ${esc((p.github.sha || '').slice(0, 10))}</small>`;
}
function qaCell(row) {
  const p = row.project;
  const count = p ? `${p.qaPassed}/${p.qaChecked} evidence states` : '';
  return `<span class="status ${row.qa.tone}">${esc(row.qa.label)}</span><small>${esc(count)}</small>`;
}
function rowHtml(row, i) {
  return `<tr class="lead-row">
    <td class="num"><button class="star" data-fav="${esc(row.id)}" aria-label="Favorite">${row.local.favorite ? '&#9733;' : '&#9734;'}</button><span>${i + 1}</span></td>
    <td><button class="dealer" data-open="${esc(row.id)}" data-tab="overview"><b>${esc(row.name)}</b><span>${esc([row.city, row.market].filter(Boolean).join(' / '))}</span><small>${esc(row.id)}</small></button></td>
    <td class="brand">${logo(row)}</td>
    ${Array.from({length:3},(_,i)=>variantCell(row,offered(row)[i])).join('')}
    <td>${checks(row)}</td>
    <td>${buildCell(row)}</td>
    <td>${qaCell(row)}</td>
    <td><select data-stage="${esc(row.id)}">${data.stages.map((s) => `<option value="${s}" ${s === row.local.stage ? 'selected' : ''}>${s.replaceAll('-', ' ')}</option>`).join('')}</select><small>${esc(row.priority || '')}</small></td>
  </tr>`;
}
function filtered() {
  const q = $('#q').value.trim().toLowerCase();
  const market = $('#market').value, gitState = $('#gitState').value;
  const qaState = $('#qaState').value, stage = $('#stage').value;
  return data.rows.filter((r) => {
    if (favoritesOnly && !r.local.favorite) return false;
    if (market && r.market !== market) return false;
    if (gitState === 'none' && r.project?.github) return false;
    if (gitState && gitState !== 'none' && r.project?.github?.location !== gitState) return false;
    if (qaState && (r.project?.qaState || 'missing') !== qaState) return false;
    if (stage && r.local.stage !== stage) return false;
    return !q || `${r.name} ${r.city} ${r.market} ${r.id} ${r.project?.github?.branch || ''}`.toLowerCase().includes(q);
  });
}
function drawerOverview(r) {
  const p = r.project;
  const inventoryText = r.inventoryOrigin === 'project'
    ? `${r.inventoryCount ?? 0} source-backed demo listings`
    : `${r.inventoryCount ?? 0} research advertisements`;
  const github = p?.github
    ? `${p.github.location} / ${p.github.branch}`
    : 'No GitHub trio found';
  const local = p?.local?.exists ? `${p.local.variantCount}/3 designs present locally` : 'Not present in local checkout';
  return `<div class="drawer-grid">
    <section class="panel"><h3>Lead context</h3><p>${esc(r.opportunity || 'No opportunity note recorded.')}</p>
      <dl><div><dt>Market</dt><dd>${esc(r.market || '-')}</dd></div><div><dt>Priority</dt><dd>${esc(r.priority || '-')}</dd></div><div><dt>Inventory</dt><dd>${esc(inventoryText)}</dd></div><div><dt>Lead ID</dt><dd>${esc(r.id)}</dd></div></dl>
      <div class="link-row">${r.sourceUrl ? `<a href="${esc(r.sourceUrl)}" target="_blank">Open source</a>` : ''}${r.website?.url ? `<a href="${esc(r.website.url)}" target="_blank">Open website</a>` : ''}</div>
    </section>
    <section class="panel"><h3>Technical evidence</h3><p><b>${esc(github)}</b></p><p>${esc(local)}</p>
      <div class="metric-grid"><div><b>${p?.variantCount ?? 0}/3</b><span>Source designs</span></div><div><b>${p?.qaPassed ?? 0}/${p?.qaChecked ?? 0}</b><span>Evidence states</span></div><div><b>${p?.local?.variantCount ?? 0}/3</b><span>local designs</span></div></div>
      <dl>${Object.entries(p?.evidence||{}).map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value.state||'unknown')}</dd></div>`).join('')}</dl>
      <div class="link-row">${p?.github?.url ? `<a href="${esc(p.github.url)}" target="_blank">Open GitHub project</a>` : ''}</div>
    </section>
    <section class="panel wide"><h3>Next action</h3><p>${esc(r.local.nextAction || r.nextAction || 'No next action recorded.')}</p></section>
  </div>`;
}
function drawerDesigns(r) {
  const p = r.project;
  return `<div class="drawer-designs">${offered(r).map((d) => {
    const built = p?.variants?.includes(d);
    const localBuilt = p?.local?.variants?.includes(d);
    const running = p?.local?.runtime?.find((x) => x.template === d && x.alive);
    const meta = p?.variantMeta?.[d] || {};
    const state = meta.state || (built ? 'No project metadata' : 'Source missing');
    return `<article class="drawer-design ${built ? 'built' : 'missing'}">
      <div class="drawer-design-media" ${p?.heroPath ? `style="--hero:url('${asset(p.heroPath)}')"` : ''}></div>
      <div><span class="eyebrow">${designName(d)}</span><h3>${built ? 'Source recorded' : 'Source missing'}</h3>
      <p>Source state: ${esc(state)}</p><p>${localBuilt ? 'Present in local checkout.' : built ? 'Recorded source is not present locally.' : 'No application source found.'}</p>
      <div class="link-row">${p?.github?.designUrls?.[d] ? `<a href="${esc(p.github.designUrls[d])}" target="_blank">Open on GitHub</a>` : ''}${running?.url ? `<a href="${esc(running.url)}" target="_blank">Open local preview</a>` : ''}</div></div>
    </article>`;
  }).join('')}</div>`;
}
function drawerNotes(r) {
  return `<section class="panel notes-panel"><h3>Lead and notes</h3>
    <label>Pipeline stage<select id="drawerStage">${data.stages.map((s) => `<option value="${s}" ${s === r.local.stage ? 'selected' : ''}>${s.replaceAll('-', ' ')}</option>`).join('')}</select></label>
    <label>Next action<input id="drawerNext" value="${esc(r.local.nextAction || r.nextAction || '')}" placeholder="What should happen next?"></label>
    <label>Private local note<textarea id="drawerNote" placeholder="Notes stay in runtime/lead-dashboard/state.json">${esc(r.local.note || '')}</textarea></label>
    <button id="drawerSave" class="primary">Save lead state</button>
  </section>`;
}
function drawerControls(r) {
  const p = r.project;
  if (!p?.github && !p?.local?.exists) return `<section class="panel"><h3>Project controls</h3><p>No GitHub or local project exists for this lead.</p></section>`;
  const launchable = p?.local?.exists && p.local.variantCount === 3 && p.local.indexSynced;
  const disabled = launchable ? '' : 'disabled';
  return `<div class="drawer-grid"><section class="panel wide"><h3>Local project controls</h3>
    <p class="muted">Recorded source state is informational. Controls only operate on the local J:/cars checkout.</p>
    <div class="control-grid"><button data-act="open" data-slug="${esc(p.slug)}" ${p?.local?.exists ? '' : 'disabled'}>Open client folder</button><button data-act="prepare" data-slug="${esc(p.slug)}" ${disabled}>Prepare dependencies</button><button class="primary" data-act="start" data-slug="${esc(p.slug)}" ${disabled}>Start 3 designs</button><button class="danger" data-act="stop" data-slug="${esc(p.slug)}" ${p?.local?.runtime?.some((x) => x.alive) ? '' : 'disabled'}>Stop recorded previews</button></div>
    ${p?.github?.url ? `<div class="link-row"><a href="${esc(p.github.url)}" target="_blank">Open GitHub source</a></div>` : ''}
    ${launchable ? '' : `<p class="warning">${p?.local?.exists ? 'Local design folders or clients/index.json are not ready for the launcher.' : 'This build exists on GitHub but is not present in the local checkout yet.'}</p>`}
  </section></div>`;
}
function renderDrawer() {
  if (!selectedId || !data) return closeDrawer();
  const r = data.rows.find((x) => x.id === selectedId);
  if (!r) return closeDrawer();
  const body = activeDrawerTab === 'designs' ? drawerDesigns(r)
    : activeDrawerTab === 'notes' ? drawerNotes(r)
    : activeDrawerTab === 'controls' ? drawerControls(r)
    : drawerOverview(r);
  $('#drawerContent').innerHTML = `<header class="drawer-head"><div class="drawer-brand">${logo(r, 'drawer-logo')}<div><span class="eyebrow">${esc([r.city, r.market].filter(Boolean).join(' / '))}</span><h2>${esc(r.name)}</h2><div><span class="status ${r.build.tone}">${esc(r.build.label)}</span> <span class="status ${r.qa.tone}">${esc(r.qa.label)}</span></div></div></div><button id="drawerClose" class="close-btn" aria-label="Close">&times;</button></header>
    <nav class="drawer-tabs"><button data-drawer-tab="overview" class="${activeDrawerTab === 'overview' ? 'active' : ''}">Overview</button><button data-drawer-tab="designs" class="${activeDrawerTab === 'designs' ? 'active' : ''}">Designs</button><button data-drawer-tab="notes" class="${activeDrawerTab === 'notes' ? 'active' : ''}">Lead & Notes</button><button data-drawer-tab="controls" class="${activeDrawerTab === 'controls' ? 'active' : ''}">Controls</button></nav><div class="drawer-body">${body}</div>`;
  bindDrawer(r);
}
function openDrawer(id, tab = 'overview') {
  selectedId = id;
  activeDrawerTab = tab;
  $('#projectDrawer').classList.add('open');
  $('#projectDrawer').setAttribute('aria-hidden', 'false');
  $('#drawerBackdrop').hidden = false;
  document.body.classList.add('drawer-open');
  renderDrawer();
}
function closeDrawer() {
  selectedId = null;
  $('#projectDrawer').classList.remove('open');
  $('#projectDrawer').setAttribute('aria-hidden', 'true');
  $('#drawerBackdrop').hidden = true;
  document.body.classList.remove('drawer-open');
}
function bindDrawer(r) {
  $('#drawerClose').onclick = closeDrawer;
  $$('[data-drawer-tab]').forEach((x) => x.onclick = () => { activeDrawerTab = x.dataset.drawerTab; renderDrawer(); });
  $$('[data-act]').forEach((x) => x.onclick = () => act(x.dataset.slug, x.dataset.act));
  const saveBtn = $('#drawerSave');
  if (saveBtn) saveBtn.onclick = async () => {
    await save(r.id, { stage: $('#drawerStage').value, nextAction: $('#drawerNext').value, note: $('#drawerNote').value }, false);
    toast('Lead state saved');
    await load(true);
    renderDrawer();
  };
}
function render() {
  const rows = filtered();
  $('#rows').innerHTML = rows.map(rowHtml).join('');
  $('#empty').hidden = rows.length > 0;
  bindRows();
}
function bindRows() {
  $$('[data-open]').forEach((x) => x.onclick = () => openDrawer(x.dataset.open, x.dataset.tab || 'overview'));
  $$('[data-fav]').forEach((x) => x.onclick = async () => {
    const r = data.rows.find((y) => y.id === x.dataset.fav);
    await save(r.id, { favorite: !r.local.favorite });
  });
  $$('[data-stage]').forEach((x) => x.onchange = () => save(x.dataset.stage, { stage: x.value }));
}
async function save(id, patch, refresh = true) {
  try {
    await api(`/api/state/${encodeURIComponent(id)}`, { method: 'POST', body: JSON.stringify(patch) });
    if (refresh) await load(true);
  } catch (e) { toast(e.message, true); }
}
async function act(slug, kind) {
  try {
    await api(`/api/action/${slug}/${kind}`, { method: 'POST', body: '{}' });
    toast(`${kind} requested for ${slug}`);
    setTimeout(() => load(true), 1000);
  } catch (e) { toast(e.message, true); }
}
async function refreshGithub() {
  try {
    $('#refresh').disabled = true;
    $('#refresh').textContent = 'Refreshing...';
    await api('/api/github-refresh', { method: 'POST', body: '{}' });
    await load(true);
    toast('Technical registry refreshed');
  } catch (e) { toast(e.message, true); }
  finally { $('#refresh').disabled = false; $('#refresh').textContent = 'Refresh registry'; }
}
async function load(quiet = false) {
  try {
    data = await api('/api/overview');
    const dirty = data.repo.dirtyFiles ? 'Local checkout has uncommitted changes' : 'Local checkout clean';
    $('#repo').innerHTML = `<b>GitHub main ${esc(data.repo.remoteMainSha)}</b><span>Local ${esc(data.repo.localBranch)} / ${esc(data.repo.localSha)} / ${dirty}</span>`;
    const cards = [
      ['Recorded trios', data.summary.githubTrios],
      ['Commit recorded', data.summary.mainTrios],
      ['Branch only', data.summary.branchTrios],
      ['QA passed', data.summary.qaPassed],
      ['Need QA evidence', data.summary.qaPending],
      ['Running previews', data.summary.running]
    ];
    $('#stats').innerHTML = cards.map(([a, b]) => `<div><b>${b}</b><span>${a}</span></div>`).join('');
    const market = $('#market').value, stage = $('#stage').value;
    $('#market').innerHTML = '<option value="">All markets</option>' + data.summary.markets.map((x) => `<option>${esc(x)}</option>`).join('');
    $('#market').value = market;
    $('#stage').innerHTML = '<option value="">All pipeline stages</option>' + data.stages.map((x) => `<option>${x}</option>`).join('');
    $('#stage').value = stage;
    render();
    if (selectedId) renderDrawer();
    if (!quiet) toast('Dashboard refreshed');
  } catch (e) { toast(e.message, true); }
}

['q','market','gitState','qaState','stage'].forEach((id) =>
  $('#'+id).addEventListener(id === 'q' ? 'input' : 'change', () => data && render())
);
$('#fav').onclick = (e) => { favoritesOnly = !favoritesOnly; e.currentTarget.classList.toggle('active', favoritesOnly); render(); };
$('#refresh').onclick = refreshGithub;
$('#drawerBackdrop').onclick = closeDrawer;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selectedId) closeDrawer(); });
load(true);
