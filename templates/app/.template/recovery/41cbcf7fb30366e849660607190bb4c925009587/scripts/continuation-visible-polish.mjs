import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const edits = [];
async function edit(file, sha, changes) {
  let source = await readFile(file, 'utf8');
  if (createHash('sha256').update(source).digest('hex') !== sha) throw Error(`Concurrent edit: ${file}`);
  for (const [before, after, count = 1] of changes) {if (source.split(before).length - 1 !== count) throw Error(`Expected ${count} matches in ${file}: ${before}`); source = source.split(before).join(after);}
  edits.push([file, source]);
}
await edit('components/ReferenceUI.tsx', '9ce8d330baf03c0af77a1a8a666b3650649f177821dd6e26c49ba011df09b763', [
  ['    <img src={`/reference-assets/tab-${tab.key}${active===tab.key?\'-selected\':\'\'}.png`} alt="" width={210} height={210} {...stylex.props(s.tabArt)}/>', '    {!compact?<img src={`/reference-assets/tab-${tab.key}${active===tab.key?\'-selected\':\'\'}.png`} alt="" width={210} height={210} {...stylex.props(s.tabArt)}/>:null}'],
  ["tabTitleCompact:{display:'grid',placeItems:'center',inset:0", "tabTitleCompact:{display:'grid',placeItems:'center',top:0,right:0,bottom:0,left:0"],
]);
await edit('components/SearchClient.tsx', 'c0129338985f76456b1b01a8a1a419129a575d63c607b688c12ea484e5b0aaa0', [
  ['src={`/reference-assets/search-brand-${index}.png`} width={42} height={38}', 'src={`/reference-assets/continuation/search-circle-${index}.png`} width={65} height={66}'],
  ["padding: 4, borderColor: '#e1e7f7', borderStyle: 'solid', borderWidth: 1, borderRadius: '50%', backgroundColor: '#f7f9ff', boxShadow: 'inset 0 0 0 4px #fff'", "padding: 0, borderWidth: 0, borderRadius: '50%', backgroundColor: 'transparent'"],
  ["brandLogo: {width: 42, height: 38", "brandLogo: {width: 65, height: 66"],
  ["recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingBottom: 8", "recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingLeft: 6, paddingBottom: 8"],
]);
const brandMap = "const brandAssets: Record<string, string> = {Toyota:'continuation/sell-logo-0',Nissan:'continuation/sell-logo-1',BMW:'continuation/sell-logo-2',Ford:'continuation/sell-logo-3',Hyundai:'continuation/sell-logo-4',Honda:'continuation/sell-logo-5','Mercedes-Benz':'continuation/sell-logo-6',Audi:'continuation/sell-logo-7',Kia:'continuation/sell-logo-8',Renault:'continuation/sell-logo-9',Abarth:'continuation/sell-logo-10',Acura:'continuation/sell-logo-11',Mitsubishi:'search-brand-2',MG:'search-brand-3'};";
const sell = await readFile('components/SellJourney.tsx', 'utf8');
const oldMap = sell.match(/const brandAssets: Record<string, string> = .*?;/)?.[0];
if (!oldMap) throw Error('Missing sell brand map');
await edit('components/SellJourney.tsx', 'c5cba6c9222b53e840a404ca4c0e09c5e6b05f0c5b3a9eed65e9b47aee87e1f9', [[oldMap, brandMap]]);
await edit('components/FinanceCalculator.tsx', '9c10b85cc345506978b1e608f3452e4860bb23ba5887dc51eefa2c22fe89087d', [
  ["type Field = (typeof fields)[number]['key'];", `type Field = (typeof fields)[number]['key'];
function AmountField({field, value, update}: {field: (typeof fields)[number]; value: number; update: (value: number, minimum: number) => void}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  return <input id={\`budget-\${field.key}\`} type="text" inputMode="numeric" aria-label={field.label} value={editing ? draft : formatPrice(value)} onFocus={() => {setDraft(String(value)); setEditing(true);}} onChange={event => {const text = event.target.value.replace(/[^\\d]/g, ''); setDraft(text); if (text) update(Number(text), 0);}} onBlur={() => {update(Number(draft) || field.min, field.min); setEditing(false);}} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.numberInput)} />;
}`],
  ['<Dirham size={21} /><input id={`budget-${field.key}`} aria-label={field.label} type="number" inputMode="numeric" min={field.min} max={field.max} step={1000} value={values[field.key]} onChange={event => update(field.key, event.target.valueAsNumber, 0, field.max)} onBlur={() => update(field.key, values[field.key], field.min, field.max)} {...stylex.props(s.numberInput)} />', '<Dirham size={18} /><AmountField field={field} value={values[field.key]} update={(value, minimum) => update(field.key, value, minimum, field.max)} />'],
]);
await edit('components/ServiceJourney.tsx', '79e3d7f3d5a0ac8c2b6ac66dbe0f80a2b197ceafd4f48057c981b450af8d8e09', [
  ["    if (stage === 'brand') {router.push('/service'); return;}\n    if (stage === 'model')", "    if (stage === 'brand') {router.push('/service'); return;}\n    if (history.state?.cars24Service) {history.back(); return;}\n    if (stage === 'model')"],
  ["    {stage === 'brand' || stage === 'model' ? <>", "    <div aria-hidden=\"true\" {...stylex.props(s.statusBar)} />\n    {stage === 'brand' || stage === 'model' ? <>"],
  ["  header: {display: 'flex'", "  statusBar: {position: 'fixed', top: 0, left: 0, right: 0, height: 51, zIndex: 101, backgroundColor: '#fff'},\n  header: {position: 'sticky', top: 51, zIndex: 100, backgroundColor: '#fff', display: 'flex'"],
]);
for (const [file, source] of edits) {await writeFile(file, source); console.log('Updated', file);}
const root = 'reference/2026-09-26-continuation', manifest = [];
for (const [index, x] of [22, 102, 182, 263, 342].entries()) {
  const image = sharp(`${root}/inspection-report-view.png`), meta = await image.metadata(), scale = meta.width / 427;
  const crop = {left: Math.round(x * scale), top: Math.round(246 * scale), width: Math.round(65 * scale), height: Math.round(66 * scale)};
  await image.extract(crop).png().toFile(`public/reference-assets/continuation/search-circle-${index}.png`);
  manifest.push({source: 'inspection-report-view.png', target: `search-circle-${index}.png`, crop});
}
for (let index = 0; index < 12; index++) {
  const image = sharp(`${root}/sell-journey.png`), meta = await image.metadata(), scale = meta.width / 427;
  const crop = {left: Math.round(12 * scale), top: Math.round((272 + index * 56) * scale), width: Math.round(32 * scale), height: Math.round(32 * scale)};
  await image.extract(crop).png().toFile(`public/reference-assets/continuation/sell-logo-${index}.png`);
  manifest.push({source: 'sell-journey.png', target: `sell-logo-${index}.png`, crop});
}
await writeFile(`${root}/brand-refinement-sources.json`, JSON.stringify(manifest, null, 2));
console.log('Prepared exact native search-ring and sell-brand artwork.');
