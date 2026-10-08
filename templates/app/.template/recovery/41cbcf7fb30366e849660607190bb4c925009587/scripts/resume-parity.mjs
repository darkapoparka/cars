import {readFile, writeFile, access, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const changes = [];
async function edit(file, expected, change) {
  const source = await readFile(file, 'utf8');
  if (createHash('sha256').update(source).digest('hex') !== expected) throw Error(`Concurrent change: ${file}`);
  const output = change(source);
  if (output === source) throw Error(`No change: ${file}`);
  changes.push({file, expected, output});
}
function replace(source, from, to) {
  if (source.split(from).length !== 2) throw Error(`Expected one match: ${from.slice(0, 100)}`);
  return source.replace(from, to);
}
await edit('components/VehicleDetailClient.tsx', '67f7c75fb176af453c129f71bd433570d9451da19ff6dc948ccb903afc6c7da4', source => {
  source = replace(source, "import VehiclePriceSheet from '@/components/VehiclePriceSheet';", "import VehiclePriceSheet from '@/components/VehiclePriceSheet';\nimport VehiclePhotoViewer from '@/components/VehiclePhotoViewer';\nimport {vehicleGallery} from '@/lib/vehicle-gallery';");
  source = replace(source, "useModal(overlay==='gallery'||overlay==='warranty'", "useModal(overlay==='warranty'");
  source = replace(source, "const frame=requestAnimationFrame(sync);const onScroll", "const frame=requestAnimationFrame(()=>{sync();onScroll();});const onScroll");
  source = replace(source, `<button type="button" key={tab.label} aria-pressed={photo===index} onClick={()=>setPhoto(index)} {...stylex.props(s.photoTab)}>`, '<Link key={tab.label} href={`/cars/${vehicle.slug}/gallery?category=${index===0?\'Exteriors\':index===1?\'Interiors\':\'Features\'}`} {...stylex.props(s.photoTab)}>');
  source = replace(source, '<span {...stylex.props(s.thumbLabel)}>{tab.label}</span></button>)}</nav>', '<span {...stylex.props(s.thumbLabel)}>{tab.label}</span></Link>)}</nav>');
  const start = source.indexOf("  {overlay==='gallery'||overlay==='warranty'?<div");
  const end = source.indexOf('  <LoginSheet open={login}', start);
  if (start < 0 || end < 0) throw Error('Gallery block boundary missing');
  source = source.slice(0, start) + `  {overlay==='gallery'?<VehiclePhotoViewer photos={vehicleGallery(vehicle)} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='warranty'?<div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&setOverlay(null)}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Cars24 benefits" {...stylex.props(s.sheet)}><header {...stylex.props(s.sheetHeader)}><h2 {...stylex.props(s.sectionTitle)}>Cars24 benefits</h2><button type="button" aria-label="Close vehicle information" onClick={()=>setOverlay(null)} {...stylex.props(s.close)}><X size={23}/></button></header><p {...stylex.props(s.overviewText)}>Drive worry-free with 30-day returns. Lifetime warranty upgrades are available on eligible Cars24 cars.</p><p {...stylex.props(s.referenceNote)}>Captured reference benefits; this local preview does not provide a warranty or accept bookings.</p><Link href="/benefits/warranty" {...stylex.props(s.inlineButton)}>Lifetime Warranty <ArrowRight size={17}/></Link></div></div>:null}
` + source.slice(end);
  source = source.replace('ChevronLeft,ChevronRight,Heart', 'ChevronLeft,Heart');
  return source;
});
await edit('components/VehiclePriceSheet.tsx', '6f35666deaa09f77d2709ad607492d4569175945e0641486e590bc42df867150', source => {
  source = replace(source, '<small>Calculated @ {interest.toFixed(2)}%</small>', '<small {...stylex.props(s.rateDetail)}>Calculated @ {interest.toFixed(2)}%</small>');
  source = replace(source, '<small>AED {formatPrice(loan)}</small>', '<small {...stylex.props(s.rateDetail)}>AED {formatPrice(loan)}</small>');
  return replace(source, '  loanAmount: {', "  rateDetail: {display:'block',marginTop:2,color:'#929292',fontSize:13,lineHeight:'20px'},\n  loanAmount: {");
});
await edit('components/InspectionReport.tsx', '103b04a1ce68975899e3f316df2d51a7968d357a091624d26dd57c29028421c2', source => {
  const start = source.indexOf("  {title: 'Steering, Suspension & Brakes'");
  const end = source.indexOf("  {title: 'Electricals & Controls'", start);
  source = source.slice(0, start) + `  {title: 'Steering, Suspension & Brakes', icon: Wrench, groups: [
    {heading: 'Steering', items: ['Steering wheel']},
    {heading: 'Brake System', items: ['Parking Brake', 'Brake Master Cylinder', 'Brake Fluid']},
    {heading: 'Suspension', items: ['Shock Absorbers']},
  ]},
` + source.slice(end);
  source = replace(source, "title: 'Electricals & Controls'", "title: 'Electricals, Controls & Lights'");
  source = replace(source, "'Head Light Support Condition']", "'Head Light Support Condition', 'Cowl Top']");
  source = replace(source, 'No Flood Damage. Guaranteed to pass RTA testing. Exceeds RTA standards. Captured reference claims.', 'Serviced and checked across 150+ points. Top Quality Assurance. Guaranteed to pass RTA testing. Exceeds RTA standards. Captured reference claims.');
  source = replace(source, '<ClipboardCheck size={29} /><strong>150</strong>', '<ShieldCheck size={43} fill="#50b67f" color="#fff" />');
  source = source.replace('CircleGauge, ClipboardCheck, Cog', 'CircleGauge, Cog');
  source = replace(source, "intro: {paddingTop: 26}", "intro: {paddingTop: 26,paddingBottom:16,marginInline:-20,paddingInline:20,backgroundColor:'#fff'}");
  source = replace(source, "vehicleTitle: {color: '#0737a1', fontSize: 18, fontWeight: 500, lineHeight: '27px'}", "vehicleTitle: {color: '#40506d', fontSize: 16, fontWeight: 600, lineHeight: '24px'}");
  source = replace(source, "trim: {marginTop: 8, fontSize: 14, lineHeight: '22px'}", "trim: {marginTop: 8, fontSize: 18, lineHeight: '27px'}");
  source = replace(source, "marginTop: 20, objectFit: 'cover'", "marginTop: 18, borderRadius:8, objectFit: 'cover'");
  source = replace(source, "minHeight: 127, marginTop: 22, padding: '14px 8px', color: '#376c94', fontSize: 14, lineHeight: '23px', textAlign: 'center', borderColor: '#c6e1f2'", "minHeight: 121, marginTop: 22, padding: '13px 20px', color: '#40506d', fontSize: 14, lineHeight: '22px', textAlign: 'left', borderColor: '#ffebd9'");
  source = replace(source, "borderRadius: 18, backgroundColor: '#dff0fc'", "borderRadius: 8, backgroundColor: '#fffaf5', backgroundImage:'linear-gradient(transparent 28px,#fff0de 28px,#fff0de 46px,transparent 46px)'");
  source = replace(source, "width: '100%', paddingLeft: 16, fontSize: 21", "width: '100%', paddingLeft: 0, fontSize: 21");
  source = replace(source, "reportHeading: {marginTop: 56, marginBottom: 23, color: '#3c4b68', fontSize: 22, fontWeight: 500, lineHeight: '31px'}", "reportHeading: {marginTop: 28, marginBottom: 23, paddingBottom:14, color: '#3c4b68', fontSize: 18, fontWeight: 500, lineHeight: '27px',letterSpacing:'.04em',backgroundImage:'linear-gradient(#fa8300,#fa8300)',backgroundRepeat:'no-repeat',backgroundSize:'41px 4px',backgroundPosition:'left bottom'}");
  return source;
});
await edit('scripts/verify-continuation.mjs', 'fc182d0df6eb21a39621b2e11ff00d0eea918c96434797d76be8cf85972b4f51', source => {
  source = source.split('\n').filter(line => !line.startsWith('const select =')).join('\n');
  source = source.split('\n').map(line => line.includes("await check('Maximum EMI affects") ? "    await check('Maximum EMI affects the matching catalog', `document.querySelectorAll('article[data-price]').length > 0 && [...document.querySelectorAll('article[data-price]')].every(element => Number(element.dataset.monthly) <= 500)`);" : line).join('\n');
  source = replace(source, "    await b.navigate('/cars'); await b.clickText('Sort');", "    await b.navigate('/cars'); await b.clickText('Filter'); await b.clickText('CLEAR ALL'); await closeModal(); await b.clickText('Sort');");
  source = replace(source, "await b.clickText('Exteriors');", "await b.click(labelled('Open vehicle photo gallery'));");
  source = source.replaceAll('[aria-label="Vehicle photo gallery"]', '[aria-label="Vehicle photo viewer"]');
  source = replace(source, "await check('Inspection report has eight observed sections', `document.querySelectorAll('section h2').length >= 9 && document.body.textContent.includes('Electricals & Controls')`);", "await check('Inspection report has the six captured sections', `document.querySelectorAll('section h2').length === 7 && document.body.textContent.includes('Electricals, Controls & Lights')`);");
  source = replace(source, "    await b.clickText('Price breakdown'); await b.capture('price-breakdown');", `    await b.clickText('Exteriors', 'a'); await b.waitFor(\`location.pathname.endsWith('/gallery')\`); await b.capture('gallery-exterior');
    await check('Gallery displays all 17 captured photographs', \`document.querySelectorAll('[data-photo-index]').length === 17\`);
    await b.clickText('Interior'); await b.capture('gallery-interior');
    await b.clickText('Features'); await b.capture('gallery-features');
    await b.click(\`document.querySelector('[data-photo-category="Features"]')\`); await b.capture('gallery-viewer');
    await b.click(labelled('Zoom in')); await check('Viewer zoom changes image scale', \`document.querySelector('[aria-label="Vehicle photo viewer"] img').style.transform.includes('scale(2)')\`);
    await b.key('ArrowRight',39); await check('Keyboard advances photo and resets zoom', \`document.querySelector('[aria-label="Vehicle photo viewer"] img').style.transform.includes('scale(1)')\`);
    await b.back(); await check('Back closes viewer on gallery route', \`!document.querySelector('[role=dialog]')&&location.pathname.endsWith('/gallery')\`);
    await b.back(); await b.waitFor(\`location.pathname === \${JSON.stringify(fortuner)}\`);
    await b.clickText('Price breakdown'); await b.capture('price-breakdown');`);
  source = replace(source, "['features',`${fortuner}/features`],", "['features',`${fortuner}/features`],['gallery',`${fortuner}/gallery`],");
  return source;
});

const root = 'reference/2026-09-26-continuation';
const state = JSON.parse(await readFile(`${root}/fortuner-detail-state.json`, 'utf8')).carDetails.content;
const known = JSON.parse(await readFile('reference/2026-09-26-parity/fortuner-images.json', 'utf8'));
const all = [...state.spinMedia.exteriorImages, ...state.spinMedia.interiorImages];
const ordered = [
  ...all.filter(item => !item.highlightName && item.category.startsWith('Exterior')).sort((a,b)=>a.order-b.order).map(item=>({...item,category:'Exteriors'})),
  ...all.filter(item => !item.highlightName && item.category === 'Interior').sort((a,b)=>a.order-b.order).map(item=>({...item,category:'Interiors'})),
  ...all.filter(item => item.highlightName).sort((a,b)=>a.order-b.order).map(item=>({...item,category:'Features'})),
];
const manifest = [];
for (const item of ordered) {
  const url = `https://media-ae.cars24.com/${item.path}`;
  const existing = known.indexOf(url);
  const src = `/reference-assets/continuation/${existing >= 0 ? `fortuner-gallery-${existing}` : `fortuner-extra-${item.order}`}.jpg`;
  try {await access(`public${src}`);} catch {
    const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw Error(`Missing reference photograph: HTTP ${response.status} ${item.label}`);
    const bytes = await sharp(Buffer.from(await response.arrayBuffer())).resize({width:1200,withoutEnlargement:true}).jpeg({quality:92}).toBuffer();
    await writeFile(`public${src}`, bytes);
  }
  manifest.push({category: item.category, label: item.highlightName || item.label, src, source: url});
}
await edit('lib/vehicle-gallery.ts', '4d4167e62f3da92923b750d6b9d06ed5cd57e16f0312078d85689d1ea4d8edaa', () => `import type {Vehicle} from './data';\n\nexport type GalleryCategory = 'Exteriors' | 'Interiors' | 'Features';\nexport type GalleryPhoto = {category: GalleryCategory; label: string; src: string};\n// Exact order and labels from the captured reference; source manifest is under reference/.\nconst fortunerPhotos: GalleryPhoto[] = ${JSON.stringify(manifest.map(({category,label,src})=>({category,label,src})),null,2)};\nexport function vehicleGallery(vehicle: Vehicle): GalleryPhoto[] {\n  return vehicle.slug === '2024-toyota-fortuner-exr' ? fortunerPhotos : [{category:'Exteriors',label:'Exterior',src:vehicle.image}];\n}\n`);
const image = sharp(`${root}/report-confirmed.png`), meta = await image.metadata(), scale = meta.width / 427;
await image.extract({left:Math.round(20*scale),top:Math.round(512*scale),width:Math.round(387*scale),height:Math.round(182*scale)}).png().toFile('public/reference-assets/continuation/report-guarantees.png');
await mkdir(`${root}/resume`, {recursive:true});
await writeFile(`${root}/resume/gallery-sources.json`, JSON.stringify(manifest,null,2));
// Validate every existing source again before applying the prepared edits.
for (const change of changes) if (createHash('sha256').update(await readFile(change.file)).digest('hex') !== change.expected) throw Error(`Concurrent change before write: ${change.file}`);
for (const change of changes) {await writeFile(change.file, change.output); console.log(`Updated ${change.file}`);}
console.log(`Prepared ${manifest.length} captured gallery photos and missing report artwork.`);
