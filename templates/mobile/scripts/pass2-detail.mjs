import fs from 'node:fs';
import ts from 'typescript';
const p='src/components/DetailScreen.tsx';let t=fs.readFileSync(p,'utf8');
function replace(a,b){if(!t.includes(a))throw Error('Missing detail patch '+a.slice(0,50));t=t.replace(a,b);}
replace("import { money, number, serializeFilters }", "import { money, serializeFilters }");
replace("import { vehicles } from '@/lib/catalog';", "import { useScrollThreshold } from '@/lib/use-scroll-threshold';\nimport { VehicleSections } from './VehicleSections';");
replace("import { Icon, type IconName } from './Icon';", "import { Icon } from './Icon';");
replace("import { PriceRating, VehicleCard } from './VehicleCard';", "import { PriceRating } from './VehicleCard';");
replace("import { AssistantFab, AssistantPanel } from './AssistantEntry';", "import { AssistantFab } from './AssistantEntry';");
replace("  info: { padding: 16, paddingTop: 8 },", "  info: { paddingInline: 16, paddingTop: 8 },\n  stickyPrice: { position: 'sticky', top: 60, zIndex: 26, backgroundColor: colors.background, paddingInline: 16, paddingBottom: 12, display: 'flex', flexDirection: 'column' },");
replace('  useEffect(() => markViewed(v.id), [v.id]);','  useEffect(() => markViewed(v.id), [v.id]);\n  const compactAssistant = useScrollThreshold(360);');
const start=t.indexOf('  const spec:');const end=t.indexOf('  async function share()',start);if(start<0||end<0)throw Error('Spec block missing');t=t.slice(0,start)+t.slice(end);
replace('        <div {...stylex.props(s.priceRow)}>','      </section>\n      <section aria-label="Vehicle price and contact" {...stylex.props(s.stickyPrice)}>\n        <div {...stylex.props(s.priceRow)}>');
const a=t.indexOf('      <div {...stylex.props(s.specs)}>');const b=t.indexOf('      <AssistantFab low />',a);if(a<0||b<0)throw Error('Sections block missing');
t=t.slice(0,a)+'      <VehicleSections vehicle={v} onContact={() => setContact(true)} onReport={() => setReport(true)} />\n'+t.slice(b);
replace('<AssistantFab low />','<AssistantFab low compact={compactAssistant} />');
// Remove only obsolete static style entries in this component.
const ast=ts.createSourceFile(p,t,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const removals=[];
function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='s'&&node.initializer&&ts.isCallExpression(node.initializer)){const obj=node.initializer.arguments[0];if(obj&&ts.isObjectLiteralExpression(obj)){const rest=t.slice(node.end);for(const prop of obj.properties){const key=prop.name?.getText(ast);if(key&&!new RegExp('\\bs\\.'+key+'\\b').test(rest)){let end=prop.end;if(t[end]===',')end++;removals.push([prop.getFullStart(),end]);}}}}ts.forEachChild(node,visit);}visit(ast);for(const [a,b] of removals.sort((a,b)=>b[0]-a[0]))t=t.slice(0,a)+t.slice(b);
fs.writeFileSync(p,t);
const qa='scripts/qa-parity.mjs';let q=fs.readFileSync(qa,'utf8');q=q.replace("getByLabel('Used',{exact:true}).check()","getByLabel('Used',{exact:true}).click()");fs.writeFileSync(qa,q);
console.log('Native sticky price/contact section and lower-detail cards integrated.');
