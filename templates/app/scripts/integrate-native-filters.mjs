import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import sharp from 'sharp';
const root = 'reference/2026-09-26-continuation';
async function readChecked(file, sha) {const source = await readFile(file, 'utf8'); if (createHash('sha256').update(source).digest('hex') !== sha) throw Error(`Concurrent edit: ${file}`); return source;}
let source = await readChecked('components/InventoryClient.tsx', '2e2c681343d040ab4dd8593330c1bca0da1a55edd9ebd7e22587a2074230adbe');
function replace(before, after) {if (source.split(before).length !== 2) throw Error(`Expected unique match ${before}`); source = source.replace(before, after);}
replace("import {formatPrice,vehicles,type Vehicle} from '@/lib/data';", "import {vehicles,type Vehicle} from '@/lib/data';\nimport NativeFilterPane from '@/components/NativeFilterPane';\nimport {useInventoryHistory} from '@/components/useInventoryHistory';\nimport {filterTabs as tabs,filterMakes as makes,emptyFilters,hasActiveFilters,matchesInventory as matches,type Filters,type FilterTab as Tab} from '@/lib/inventory-filters';");
const definitionsStart = source.indexOf('const tabs=['), definitionsEnd = source.indexOf('const sortGroups=');
if (definitionsStart < 0 || definitionsEnd < 0) throw Error('Missing filter definition boundary');
source = source.slice(0, definitionsStart) + source.slice(definitionsEnd);
const paneStart = source.indexOf('function FilterPane('), paneEnd = source.indexOf('function CheckRow(');
if (paneStart < 0 || paneEnd < 0) throw Error('Missing pane boundary');
source = source.slice(0, paneStart) + source.slice(paneEnd);
const matchesStart = source.indexOf('function matches('), matchesEnd = source.indexOf('const s=stylex.create({');
if (matchesStart < 0 || matchesEnd < 0) throw Error('Missing predicate boundary');
source = source.slice(0, matchesStart) + source.slice(matchesEnd);
replace(" const [assistant,setAssistant]=useState(false);", " const [assistant,setAssistant]=useState(false);\n useInventoryHistory({query,filters,sort,emiMax},{setQuery,setFilters,setSort,setEmiMax});");
replace(" const filtered=Boolean(emiMax!==undefined||query.trim()||filters.brands.length||filters.models.length||filters.budget.length||filters.bodies.length||filters.fuel.length||filters.year||filters.mileage||filters.minimum!==8000||filters.maximum!==950000||Object.values(filters.extra).some(values=>values.length));", " const filtered=Boolean(emiMax!==undefined||query.trim()||hasActiveFilters(filters));");
replace('<FilterPane active={active} filters={filters} update={setFilters}/>', '<NativeFilterPane active={active} filters={filters} update={setFilters}/>');
replace("paddingBottom:31,paddingInline:22,borderTopColor", "paddingBottom:34,paddingInline:22,borderTopColor");
// Remove only style entries no longer referenced after replacing the old pane.
const ast = ts.createSourceFile('InventoryClient.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let declaration;
for (const statement of ast.statements) if (ts.isVariableStatement(statement)) for (const item of statement.declarationList.declarations) if (item.name.getText(ast) === 's') declaration = item;
if (!declaration?.initializer || !ts.isCallExpression(declaration.initializer)) throw Error('StyleX declaration not found');
const object = declaration.initializer.arguments[0];
if (!ts.isObjectLiteralExpression(object)) throw Error('StyleX object missing');
const functionalSource = source.slice(0, source.indexOf('const s=stylex.create({'));
const used = new Set([...functionalSource.matchAll(/\bs\.([a-zA-Z0-9_]+)/g)].map(match => match[1]));
const styles = object.properties.filter(property => used.has(property.name?.getText(ast))).map(property => property.getText(ast));
source = functionalSource + `const s=stylex.create({\n ${styles.join(',\n ')}\n});\n`;
await writeFile('components/InventoryClient.tsx', source);

let data = await readChecked('lib/data.ts', 'da1bff01c3d0c958e62c7274a03c87e44bd0e51b097efe559947f51852b8bcde');
data = data.replace('  originalMileage?: number;', '  originalMileage?: number;\n  cylinders?: number;\n  zeroDownPayment?: boolean;');
await writeFile('lib/data.ts', data);
const inventory = await readChecked('lib/captured-inventory.ts', '594c37722d937102aa001050998d320605ca1c11f37c284c6f4c4d7b15c12dec');
const vehicles = JSON.parse(inventory.slice(inventory.indexOf(' = [') + 3).trim().replace(/;$/, ''));
const original = JSON.parse(await readFile(`${root}/data-mobile.json`, 'utf8')).cards;
for (const vehicle of vehicles) {
  const captured = original.find(card => card.carItem?.appointmentId === vehicle.referenceId)?.carItem;
  if (!captured) continue;
  const cylinders = Number(captured.noOfCylinders);
  if (Number.isFinite(cylinders) && cylinders > 0) vehicle.cylinders = cylinders;
  vehicle.zeroDownPayment = captured.emiDetails?.financeEligibility === 'ZERO_DOWN_PAYMENT';
}
await writeFile('lib/captured-inventory.ts', inventory.slice(0, inventory.indexOf(' = [') + 3) + JSON.stringify(vehicles, null, 2) + ';\n');

let css = await readChecked('app/app.css', 'fe339d4e31ef527f686094e867696f5b8e99a121ef16819258b4bb81b489d8d8');
css += `\n/* Native dual-range and filter controls. Only these components use the classes. */
.cars24-vertical-range { appearance: none; position: absolute; top: 0; left: 0; width: 29px; height: 264px; margin: 0; padding: 0; writing-mode: vertical-lr; direction: rtl; background: transparent; pointer-events: none; }
.cars24-vertical-range::-webkit-slider-runnable-track { appearance: none; width: 2px; height: 100%; background: transparent; }
.cars24-vertical-range::-webkit-slider-thumb { appearance: none; width: 29px; height: 29px; margin-left: -13.5px; border: 3px solid #f17700; border-radius: 50%; background: #fff; pointer-events: auto; cursor: ns-resize; }
.cars24-vertical-range::-moz-range-track { width: 2px; background: transparent; }
.cars24-vertical-range::-moz-range-thumb { width: 23px; height: 23px; border: 3px solid #f17700; border-radius: 50%; background: #fff; pointer-events: auto; cursor: ns-resize; }
.cars24-vertical-range:focus-visible { outline: 2px solid #99b4e8; outline-offset: 4px; }
input.cars24-filter-checkbox, input.cars24-filter-radio { appearance: none; flex-shrink: 0; width: 18px; height: 18px; margin: 0; border: 1px solid #bac7dc; border-radius: 4px; background: #fff; cursor: pointer; }
input.cars24-filter-radio { border-color: #aaa; border-radius: 50%; }
input.cars24-filter-checkbox:checked { border-color: #4736fe; background: #4736fe url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3E%3Cpath d='m4 9 3 3 7-7' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E") center/18px no-repeat; }
input.cars24-filter-checkbox:indeterminate { border-color: #4736fe; background: linear-gradient(#4736fe,#4736fe) center/10px 2px no-repeat; }
input.cars24-filter-radio:checked { border-color: #4736fe; background: radial-gradient(circle, #4736fe 0 4px, #fff 4.5px); }
`;
await writeFile('app/app.css', css);

const artSources = [];
for (let index = 0; index < 14; index++) {
  const x = index % 2 ? 313 : 182, y = 148 + Math.floor(index / 2) * 103;
  const image = sharp(`${root}/filter-body.png`), meta = await image.metadata(), scale = meta.width / 427;
  const region = {left: Math.round(x * scale), top: Math.round(y * scale), width: Math.round(82 * scale), height: Math.round(43 * scale)};
  await image.extract(region).png().toFile(`public/reference-assets/continuation/filter-body-${index}.png`);
  artSources.push({source: 'filter-body.png', name: `filter-body-${index}`, region});
}
for (const [name, y] of [['prime',149],['luxe',261],['lite',374],['private',504]]) {
  const image = sharp(`${root}/filter-cartype.png`), meta = await image.metadata(), scale = meta.width / 427;
  const region = {left: Math.round(206 * scale), top: Math.round(y * scale), width: Math.round(92 * scale), height: Math.round(24 * scale)};
  await image.extract(region).png().toFile(`public/reference-assets/continuation/filter-type-${name}.png`);
  artSources.push({source: 'filter-cartype.png', name: `filter-type-${name}`, region});
}
await writeFile(`${root}/filter-art-sources.json`, JSON.stringify(artSources, null, 2));
console.log('Integrated all native filter panes, catalog cylinder/zero-down flags, and 18 reference illustrations.');
