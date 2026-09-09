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
const designName = (d) => d === 'auto-best' ? 'Auto Best' : d[0].toUpperCase() + d.slice(1);

function toast(text, bad = false) {
  const n = document.createElement('div');
  n.className = `toast ${bad ? 'bad' : ''}`;
  n.textContent = text;
  $('#toasts').append(n);
  setTimeout(() => n.remove(), 4500);
}
function variantCell(row, design) {
  const p = row.project;
  const built = p?.variants?.includes(design);
  const running = p?.runtime?.find((x) => x.template === design && x.alive);
  const hero = p?.heroPath ? `style="--hero:url('${asset(p.heroPath)}')"` : '';
  return `<td><button class="design ${built ? 'built' : 'missing'}" data-open="${esc(row.id)}" data-tab="designs" ${hero}>
    <span class="shade"></span><span class="design-copy"><b>${designName(design)}</b>
    <span>${running ? 'Running' : built ? 'Built' : 'Not built'}</span>
    ${running?.url ? `<em>Preview available</em>` : ''}</span></button></td>`;
}
function checks(row) {
  const p = row.project;
  const inventoryLabel = row.inventoryOrigin === 'project'
    ? `${row.inventoryCount ?? 0} demo listings`
    : `${row.inventoryCount ?? 0} research ads`;
  const list = [
    [inventoryLabel, !!row.inventoryCount],
    [`${p?.mediaCount ?? 0} local media`, !!p?.mediaCount],
    ['Brand asset', !!p?.logoPath],
    ['Client folder', !!p?.exists],
    [`${p?.variantCount ?? 0}/3 designs`, p?.variantCount === 3],
    ['Index synced', !!p?.indexSynced]
  ];
  return `<ul class="checks">${list.map(([t, ok]) =>
    `<li class="${ok ? 'ok' : 'no'}"><span>${ok ? '&#10003;' : '&#8212;'}</span>${esc(t)}</li>`).join('')}</ul>`;
}
function logo(row, cls = 'logo') {
  if (row.project?.logoPath) return `<img class="${cls}" src="${asset(row.project.logoPath)}" alt="${esc(row.name)} logo">`;
  const letters = row.name.split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
  return `<div class="initials">${esc(letters)}</div>`;
}
function row(row, i) {
  const p = row.project;
  return `<tr class="lead-row">
    <td class="num"><button class="star" data-fav="${esc(row.id)}" aria-label="Favorite">${row.local.favorite ? '&#9733;' : '&#9734;'}</button><span>${i + 1}</span></td>
    <td><button class="dealer" data-open="${esc(row.id)}" data-tab="overview"><b>${esc(row.name)}</b><span>${esc([row.city, row.market].filter(Boolean).join(' / '))}</span><small>${esc(row.id)}</small></button></td>
    <td class="brand">${logo(row)}</td>
    ${['auto-best', 'modern', 'carwow'].map((d) => variantCell(row, d)).join('')}
    <td>${checks(row)}</td>
    <td><select data-stage="${esc(row.id)}">${data.stages.map((s) => `<option value="${s}" ${s === row.local.stage ? 'selected' : ''}>${s.replaceAll('-', ' ')}</option>`).join('')}</select><small>${esc(row.priority || '')}</small></td>
    <td><span class="status ${row.status.tone}">${esc(row.status.label)}</span><small>${p?.exists ? `${p.variantCount}/3 designs` : 'No project yet'}</small></td>
  </tr>`;
}
function filtered() {
  const q = $('#q').value.trim().toLowerCase(), market = $('#market').value;
  const stage = $('#stage').value, build = $('#build').value;
  return data.rows.filter((r) => {
    if (favoritesOnly && !r.local.favorite) return false;
    if (market && r.market !== market) return false;
    if (stage && r.local.stage !== stage) return false;
    if (build === 'full' && r.project?.variantCount !== 3) return false;
    if (build === 'partial' && !(r.project?.exists && r.project.variantCount < 3)) return false;
    if (build === 'none' && r.project?.exists) return false;
    return !q || `${r.name} ${r.city} ${r.market} ${r.id}`.toLowerCase().includes(q);
  });
}
function drawerOverview(r) {
  const p = r.project;
  const inventoryText = r.inventoryOrigin === 'project'
    ? `${r.inventoryCount ?? 0} source-backed demo listings`
    : `${r.inventoryCount ?? 0} research advertisements`;
  return `<div class="drawer-grid">
    <section class="panel"><h3>Lead context</h3><p>${esc(r.opportunity || 'No opportunity note recorded.')}</p>
      <dl><div><dt>Market</dt><dd>${esc(r.market || '-')}</dd></div><div><dt>Priority</dt><dd>${esc(r.priority || '-')}</dd></div><div><dt>Inventory</dt><dd>${esc(inventoryText)}</dd></div><div><dt>Lead ID</dt><dd>${esc(r.id)}</dd></div></dl>
      <div class="link-row">${r.sourceUrl ? `<a href="${esc(r.sourceUrl)}" target="_blank">Open source</a>` : ''}${r.website?.url ? `<a href="${esc(r.website.url)}" target="_blank">Open website</a>` : ''}</div>
    </section>
    <section class="panel"><h3>Project state</h3><p><code>${esc(p?.path || 'No local client project yet')}</code></p>
      <div class="metric-grid"><div><b>${p?.variantCount ?? 0}/3</b><span>designs</span></div><div><b>${p?.mediaCount ?? 0}</b><span>local media</span></div><div><b>${p?.qaPassed ?? 0}/${p?.qaChecked ?? 0}</b><span>QA flags</span></div></div>
      <p class="muted">${p?.indexSynced ? 'Project index matches discovered designs.' : 'Project index does not match discovered designs.'}</p>
    </section>
    <section class="panel wide"><h3>Next action</h3><p>${esc(r.local.nextAction || r.nextAction || 'No next action recorded.')}</p></section>
  </div>`;
}
function drawerDesigns(r) {
  const p = r.project;
  return `<div class="drawer-designs">${['auto-best','modern','carwow'].map((d) => {
    const built = p?.variants?.includes(d), running = p?.runtime?.find((x) => x.template === d && x.alive);
    const meta = p?.variantMeta?.[d] || {};
    return `<article class="drawer-design ${built ? 'built' : 'missing'}"><div class="drawer-design-media" ${p?.heroPath ? `style="--hero:url('${asset(p.heroPath)}')"` : ''}></div>
      <div><span class="eyebrow">${designName(d)}</span><h3>${built ? 'Application present' : 'Not built locally'}</h3><p>${meta.state ? `State: ${esc(meta.state)}` : 'No project metadata found.'}</p>
      <p>${meta.templateVersion ? `Template: ${esc(meta.templateVersion)}` : ''}</p>${running?.url ? `<a href="${esc(running.url)}" target="_blank">Open running preview</a>` : ''}</div></article>`;
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
  if (!p?.exists) return `<section class="panel"><h3>Project controls</h3><p>No local client folder exists for this lead yet.</p></section>`;
  const disabled = p.indexSynced ? '' : 'disabled';
  return `<div class="drawer-grid"><section class="panel wide"><h3>Local project controls</h3><p class="muted">These actions operate only on your local Cars workspace. They do not deploy or contact the dealer.</p>
    <div class="control-grid"><button data-act="open" data-slug="${p.slug}">Open client folder</button><button data-act="prepare" data-slug="${p.slug}" ${disabled}>Prepare dependencies</button><button class="primary" data-act="start" data-slug="${p.slug}" ${disabled}>Start 3 designs</button><button class="danger" data-act="stop" data-slug="${p.slug}">Stop recorded previews</button></div>
    ${!p.indexSynced ? '<p class="warning">Start/prepare are disabled until clients/index.json matches the discovered design folders.</p>' : ''}
  </section></div>`;
}
function renderDrawer() {
  if (!selectedId || !data) return closeDrawer();
  const r = data.rows.find((x) => x.id === selectedId);
  if (!r) return closeDrawer();
  const body = activeDrawerTab === 'designs' ? drawerDesigns(r) : activeDrawerTab === 'notes' ? drawerNotes(r) : activeDrawerTab === 'controls' ? drawerControls(r) : drawerOverview(r);
  $('#drawerContent').innerHTML = `<header class="drawer-head"><div class="drawer-brand">${logo(r, 'drawer-logo')}<div><span class="eyebrow">${esc([r.city, r.market].filter(Boolean).join(' / '))}</span><h2>${esc(r.name)}</h2><div><span class="status ${r.status.tone}">${esc(r.status.label)}</span></div></div></div><button id="drawerClose" class="close-btn" aria-label="Close">&times;</button></header>
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
  $('#rows').innerHTML = rows.map(row).join('');
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
async function load(quiet = false) {
  try {
    data = await api('/api/overview');
    const dirty = data.repo.dirtyFiles ? 'Local checkout has uncommitted changes' : 'Local checkout clean';
    $('#repo').innerHTML = `<b>${esc(data.repo.branch)} / ${esc(data.repo.sha)}</b><span>${dirty} / darkapoparka/cars</span>`;
    const cards = [['Leads',data.summary.total],['3-design projects',data.summary.full],['Research only',data.summary.research],['Needs QA',data.summary.qa],['Ready',data.summary.ready],['Running previews',data.summary.running]];
    $('#stats').innerHTML = cards.map(([a,b]) => `<div><b>${b}</b><span>${a}</span></div>`).join('');
    const market = $('#market').value, stage = $('#stage').value;
    $('#market').innerHTML = '<option value="">All markets</option>' + data.summary.markets.map((x) => `<option>${esc(x)}</option>`).join('');
    $('#market').value = market;
    $('#stage').innerHTML = '<option value="">All stages</option>' + data.stages.map((x) => `<option>${x}</option>`).join('');
    $('#stage').value = stage;
    render();
    if (selectedId) renderDrawer();
    if (!quiet) toast('Dashboard refreshed');
  } catch (e) { toast(e.message, true); }
}
['q','market','stage','build'].forEach((id) => $('#'+id).addEventListener(id === 'q' ? 'input' : 'change', () => data && render()));
$('#fav').onclick = (e) => { favoritesOnly = !favoritesOnly; e.currentTarget.classList.toggle('active', favoritesOnly); render(); };
$('#refresh').onclick = () => load();
$('#drawerBackdrop').onclick = closeDrawer;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selectedId) closeDrawer(); });
load(true);
