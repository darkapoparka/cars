import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const token = process.env.GITHUB_TOKEN || '';
const out = path.resolve('artifacts/deployment-source-audit');
const owner = 'darkapoparka';
const dealers = [
  ['priselci','cars-priselci','30055887099ae9d6db20beaa48f37316477b8360'],
  ['outletcars-varna','cars-outletcarsvarna','6345e253e14e074cde5059c2630670fc049519ae'],
  ['promosale-varna','cars-promosalevarna','e667e0738e4eca2c0930033322578a09314f7f75'],
  ['autolife','cars-autolife','e564aa8a8812dd302f4e97de303eb97b6596e2c1'],
  ['astracar','cars-astracar','25a9003fd105f999a06ae16650a95735c5404212'],
  ['al-hamoor-al-thahabi','cars-alhamooralthahabi','aae5d2bee239c095d2eff25774135a5c4d83a81c'],
  ['avangard-auto','cars-avangardauto','385f069927fc57ed18eeafc9c0368656a6c6ea9b'],
  ['f1rst-motors','cars-f1rstmotors','7f097598a9a1ceb7a9f1b5160ea1be96e3ae3fbe'],
  ['al-basma-motors','cars-albasmamotors','47931d3f049592ef4cbbd907fee51d9c15e2af31'],
  ['elit-auto-import','cars-elitautoimport','9aec65b6fbd4f7d275aa955e0abcef52ff111375'],
  ['automarket-varna','cars-automarketvarna','dfbe663ba07a9671955782a4af9bdb962dfebd57'],
  ['eliqauto','cars-eliqauto','2db4964c9aeb5a58774bd110065e3830f6253f12'],
  ['kg-team-auto','cars-kgteamauto','8cf67e2548a00fd9f6cd6783ddb2f3d194d6b8d6'],
  ['champion-auto-pro','cars-championautopro','5e63d480bc4833a40c58175145a21afe577620f6'],
  ['excellent-cars','excellent-cars','ed9d9b15a11300a676483a08036f25d141d32bf0'],
  ['perfect-auto-varna','cars-perfectauto','0eee7f01acf152a8c8392979dfaf762d07f7d3b3'],
  ['asko-96','cars-asko96','40413c4cec58375f5bb890e681932579a43666ba'],
  ['texas-drive-auto','cars-texasdriveauto','ce775992032efbd91daa247d93db1df2b774408b'],
  ['the-dealers-point','cars-thedealerspoint','3a29ca775604f562538fadbe31c5cbeced433c1a'],
  ['ivo-auto','cars-ivoauto','0be64d02119fbbaa54ff81e2099856b6788197a7'],
  ['navara-car','cars-navaracar','5cf05ddccec25fcd7196c885d9558328bef68890'],
  ['legend-auto','cars-legendauto','39acae68b6c2377dc271f6e9346f053d9f07a71a']
];

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
};
async function gh(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}
async function bytes(url) {
  const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}
const imageExt = /\.(png|webp|jpe?g|avif|svg)$/i;
const candidatePath = (p, slug) => {
  const s = p.toLowerCase();
  if (!imageExt.test(s)) return false;
  if (/(favicon|app-store|google-play|brand-[0-9]|oem|manufacturer|social|tiktok|facebook|instagram|youtube|vehicle|hero|banner|gallery|body-type|phone-portrait|screenshot|evidence\/official-(?:home|contact|detail|catalogue))/.test(s)) return false;
  if (slug !== 'day-and-night' && /(daynight|day-night)/.test(s)) return false;
  return /(logo-master|logo-universal|logo-on-(light|dark|accent|yellow)|wordmark|official-logo|generated-logo|logo-header|dealer\/.*logo|assets\/brand\/.*logo|\/logo(?:-(?:dark|light))?\.(?:png|webp|jpe?g|avif|svg)$)/.test(s);
};
function rank(p, slug) {
  const s = p.toLowerCase();
  let n = 0;
  if (/logo-master/.test(s)) n += 150;
  if (/logo-universal/.test(s)) n += 140;
  if (/logo-on-(light|dark|accent|yellow)/.test(s)) n += 130;
  if (/generated|candidate/.test(s)) n += 70;
  if (/official/.test(s)) n += 65;
  if (/wordmark/.test(s)) n += 50;
  if (/assets\/brand|dealer\/brand/.test(s)) n += 45;
  if (slug.split('-').some(t => t.length > 3 && s.includes(t))) n += 25;
  if (/\.svg$/i.test(s)) n -= 8;
  return n;
}
async function treeFor(repo, ref) {
  const commit = await gh(`https://api.github.com/repos/${owner}/${repo}/git/commits/${encodeURIComponent(ref)}`);
  const tree = await gh(`${commit.tree.url}?recursive=1`);
  return { commit, tree: tree.tree || [] };
}
async function effectiveSource(repo, ref) {
  const source = await treeFor(repo, ref);
  const site = source.tree.find(e => e.path === 'site' && e.mode === '160000' && e.type === 'commit');
  if (!site) return { architecture: 'full-source', repository: `${owner}/${repo}`, ref, tree: source.tree };
  const packageSource = await treeFor('cars', site.sha);
  return { architecture: 'gitlink-wrapper', repository: `${owner}/cars`, wrapperRepository: `${owner}/${repo}`, wrapperRef: ref, ref: site.sha, tree: packageSource.tree };
}
async function renderTile(candidate, index) {
  const W=760,H=390,artH=278,half=380;
  const base=sharp({create:{width:W,height:H,channels:4,background:{r:255,g:255,b:255,alpha:1}}});
  const title=`${index+1}. ${candidate.path}`;
  const detail=`${candidate.format || '?'} · ${candidate.width || '?'}×${candidate.height || '?'} · alpha:${candidate.hasAlpha ? 'yes' : 'no'} · ${(candidate.size/1024).toFixed(1)} KB`;
  const bg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${half}" height="${artH}" fill="#f6f6f4"/><rect x="${half}" width="${half}" height="${artH}" fill="#17191f"/><rect y="${artH}" width="${W}" height="${H-artH}" fill="#fff"/><line x1="${half}" x2="${half}" y2="${artH}" stroke="#888" stroke-opacity=".4"/><text x="16" y="313" font-family="Arial" font-size="17" font-weight="700" fill="#111">${title.replace(/[<>&]/g,'')}</text><text x="16" y="346" font-family="Arial" font-size="15" fill="#444">${detail}</text><text x="16" y="375" font-family="Arial" font-size="13" fill="#666">${candidate.origin.replace(/[<>&]/g,'')}</text></svg>`);
  const layers=[{input:bg,top:0,left:0}];
  if (candidate.renderable && candidate.localPath) {
    const image=await sharp(candidate.localPath,{density:320,failOn:'none'}).rotate().resize({width:330,height:230,fit:'inside',withoutEnlargement:true}).png().toBuffer();
    const m=await sharp(image).metadata();
    const y=Math.max(10,Math.floor((artH-(m.height||0))/2));
    layers.push({input:image,top:y,left:Math.max(10,Math.floor((half-(m.width||0))/2))});
    layers.push({input:image,top:y,left:half+Math.max(10,Math.floor((half-(m.width||0))/2))});
  }
  return base.composite(layers).png().toBuffer();
}
async function renderSheet(slug, candidates) {
  const cols=2,W=760,H=390,head=86,rows=Math.max(1,Math.ceil(candidates.length/cols));
  const width=cols*W,height=head+rows*H;
  const layers=[{input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${head}"><rect width="100%" height="100%" fill="#fff"/><text x="24" y="40" font-family="Arial" font-size="30" font-weight="800">${slug} — exact handoff candidates</text><text x="24" y="69" font-family="Arial" font-size="16" fill="#555">Files resolved from the recorded deployment-source commit, including gitlink targets.</text></svg>`),top:0,left:0}];
  for (let i=0;i<candidates.length;i++) layers.push({input:await renderTile(candidates[i],i),left:(i%cols)*W,top:head+Math.floor(i/cols)*H});
  await sharp({create:{width,height,channels:4,background:{r:235,g:235,b:235,alpha:1}}}).composite(layers).png({compressionLevel:9}).toFile(path.join(out,`${slug}.png`));
}

await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(path.join(out,'files'),{recursive:true});
const report=[];
for (const [slug,repo,assetCommit] of dealers) {
  console.log(`Resolving ${slug}`);
  const currentRepo=await gh(`https://api.github.com/repos/${owner}/${repo}`);
  const current=await effectiveSource(repo,currentRepo.default_branch || 'main');
  const recorded=await effectiveSource(repo,assetCommit);
  const dirs=new Set(recorded.tree.filter(e=>e.type==='tree').map(e=>e.path.split('/')[0]));
  const paths=recorded.tree.filter(e=>e.type==='blob' && candidatePath(e.path,slug)).sort((a,b)=>rank(b.path,slug)-rank(a.path,slug)||a.path.localeCompare(b.path)).slice(0,36);
  const candidates=[];
  for (const entry of paths) {
    const local=path.join(out,'files',slug,entry.path);
    try {
      const rawUrl=`https://raw.githubusercontent.com/${recorded.repository}/${encodeURIComponent(recorded.ref)}/${entry.path.split('/').map(encodeURIComponent).join('/')}`;
      const content=await bytes(rawUrl);
      await fs.mkdir(path.dirname(local),{recursive:true});
      await fs.writeFile(local,content);
      const meta=await sharp(local,{density:320,failOn:'none'}).metadata();
      candidates.push({path:entry.path,origin:`${recorded.repository}@${recorded.ref}`,sha:entry.sha,size:entry.size||content.length,format:meta.format,width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha===true,renderable:true,localPath:local});
    } catch (error) {
      candidates.push({path:entry.path,origin:`${recorded.repository}@${recorded.ref}`,sha:entry.sha,size:entry.size||0,renderable:false,error:String(error),localPath:null});
    }
  }
  await renderSheet(slug,candidates);
  report.push({slug,vercelRepository:`${owner}/${repo}`,defaultBranch:currentRepo.default_branch,recordedAssetCommit:assetCommit,current:{architecture:current.architecture,effectiveRepository:current.repository,effectiveRef:current.ref,wrapperRepository:current.wrapperRepository||null,wrapperRef:current.wrapperRef||null},recorded:{architecture:recorded.architecture,effectiveRepository:recorded.repository,effectiveRef:recorded.ref,wrapperRepository:recorded.wrapperRepository||null,wrapperRef:recorded.wrapperRef||null,topLevelDirectories:[...dirs].sort()},candidates:candidates.map(({localPath,...x})=>x),contactSheet:`${slug}.png`});
}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({generatedAt:new Date().toISOString(),report},null,2));
const rows=report.map(r=>`<tr><td><strong>${r.slug}</strong><br>${r.vercelRepository}</td><td>${r.current.architecture}<br>${r.current.effectiveRepository}@${r.current.effectiveRef}</td><td>${r.recorded.architecture}<br>${r.recorded.effectiveRepository}@${r.recorded.effectiveRef}</td><td>${r.recorded.topLevelDirectories.join(', ')}</td><td><a href="${r.contactSheet}"><img src="${r.contactSheet}" width="760" loading="lazy"></a></td></tr>`).join('\n');
await fs.writeFile(path.join(out,'index.html'),`<!doctype html><html><head><meta charset="utf-8"><style>body{font:14px system-ui;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;vertical-align:top}img{max-width:760px;height:auto}</style></head><body><h1>Deployment source and exact handoff candidate audit</h1><table><tr><th>Dealer</th><th>Current source</th><th>Recorded source</th><th>Top-level</th><th>Candidates</th></tr>${rows}</table></body></html>`);
