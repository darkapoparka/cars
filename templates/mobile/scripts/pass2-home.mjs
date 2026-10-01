import fs from 'node:fs';
import ts from 'typescript';
const p='src/components/HomeScreen.tsx';let t=fs.readFileSync(p,'utf8');
function patch(a,b){if(!t.includes(a))throw Error('Missing home patch '+a.slice(0,45));t=t.replace(a,b);}
patch("import { Button, ui } from './ui';", "import { ui } from './ui';\nimport { HomeDiscovery } from './HomeDiscovery';\nimport { useScrollThreshold } from '@/lib/use-scroll-threshold';");
patch("import { AssistantFab, AssistantPanel } from './AssistantEntry';", "import { AssistantFab } from './AssistantEntry';");
patch('  search: {','  searchPinned: { backgroundColor: colors.panel, boxShadow: \'0 3px 9px #0003\' },\n  search: {\n    position: \'sticky\', top: 68, zIndex: 29,');
patch('  const { filters, viewed } = useAppState();','  const { filters } = useAppState();\n  const scrolled = useScrollThreshold(232);');
patch('stylex.props(s.search)','stylex.props(s.search, scrolled && s.searchPinned)');
patch('<Icon name="search" size={24} />','<Icon name="smartSearch" size={24} />');
const a=t.indexOf('      <div {...stylex.props(s.below)}>');const b=t.indexOf('      <p {...stylex.props(s.footer)}>',a);if(a<0||b<0)throw Error('Home lower block missing');t=t.slice(0,a)+'      <HomeDiscovery />\n'+t.slice(b);
patch('<AssistantFab />','<AssistantFab compact={scrolled} />');
const ast=ts.createSourceFile(p,t,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const ranges=[];
function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='s'&&n.initializer&&ts.isCallExpression(n.initializer)){const obj=n.initializer.arguments[0];if(obj&&ts.isObjectLiteralExpression(obj))for(const prop of obj.properties){const key=prop.name?.getText(ast);if(key&&!new RegExp('\\bs\\.'+key+'\\b').test(t.slice(n.end))){ranges.push([prop.getFullStart(),t[prop.end]===','?prop.end+1:prop.end]);}}}ts.forEachChild(n,visit);}visit(ast);for(const [a,b] of ranges.sort((a,b)=>b[0]-a[0]))t=t.slice(0,a)+t.slice(b);fs.writeFileSync(p,t);
const icon='src/components/Icon.tsx';let i=fs.readFileSync(icon,'utf8');i=i.replace("| 'transmission';","| 'transmission' | 'smartSearch';");i=i.replace("  if (name === 'sparkles')",`  if (name === 'smartSearch') return <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><path d="M14 4a8 8 0 1 0 5 7M17 18l6 6"/><path d="m19 1 1.2 3.2L23 5.5l-2.8 1.3L19 10l-1.2-3.2L15 5.5l2.8-1.3Z" fill="currentColor" stroke="none"/></svg>;
  if (name === 'sparkles')`);fs.writeFileSync(icon,i);
const search='src/components/SearchScreen.tsx';let st=fs.readFileSync(search,'utf8').replace('<Icon name="search" size={24} />','<Icon name="smartSearch" size={24} />');fs.writeFileSync(search,st);
console.log('Replaced invented Home sections with captured native discovery structure.');
