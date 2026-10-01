import fs from 'node:fs';
function replace(p,pattern,next){let t=fs.readFileSync(p,'utf8');if(!pattern.test(t))throw Error('Missing '+p+' '+pattern);fs.writeFileSync(p,t.replace(pattern,next));}
replace('src/components/ContactSheet.tsx',/<textarea\s/, '<textarea aria-label="Your message" ');
replace('src/components/SellFlow.tsx',/<select\s/, '<select aria-label={label} ');
replace('src/components/SellFlow.tsx',/<textarea\s/, '<textarea aria-label="Description" ');
replace('src/components/FilterFields.tsx',/<select\s/, '<select aria-label={label} ');
const shell='src/components/AppShell.tsx';let s=fs.readFileSync(shell,'utf8');s=s.replace("import { useEffect, type ReactNode }", "import { useEffect, useSyncExternalStore, type ReactNode }");
s=s.replace('export function AppShell',"const subscribeReady = () => () => {};\nexport function AppShell");s=s.replace('  const pathname = usePathname();','  const pathname = usePathname();\n  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);');s=s.replace(/<div\s+(?=\{\.\.\.stylex.props\(\s*s.root)/,'<div data-hydrated={ready ? \'true\' : \'false\'} ');
if(!s.includes('data-hydrated'))throw Error('AppShell root marker not found');fs.writeFileSync(shell,s);
const qa='scripts/qa-interactions.mjs';let t=fs.readFileSync(qa,'utf8');t=t.replace("return page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });", "const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 }); await page.locator('[data-hydrated=\"true\"]').waitFor(); return response;");fs.writeFileSync(qa,t);
console.log('Stable labels and explicit hydration-ready browser contract integrated.');
