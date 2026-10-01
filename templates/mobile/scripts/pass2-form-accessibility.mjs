import fs from 'node:fs';
function patch(p,a,b){let t=fs.readFileSync(p,'utf8');if(!t.includes(a))throw Error('Missing '+p+' '+a);fs.writeFileSync(p,t.replace(a,b));}
patch('src/components/FinanceCalculator.tsx','<select\n          value={months}','<select\n          aria-label="Term"\n          value={months}');
patch('src/components/FinanceCalculator.tsx','type="number"\n          min="0"','type="number"\n          aria-label="Assumed annual interest rate (%)"\n          min="0"');
patch('src/components/ContactSheet.tsx','<textarea\n              value={message}','<textarea\n              aria-label="Your message"\n              value={message}');
patch('src/components/SellFlow.tsx','<select\n          required','<select\n          aria-label={label}\n          required');
patch('src/components/SellFlow.tsx','<textarea\n                    rows={5}','<textarea\n                    aria-label="Description"\n                    rows={5}');
patch('src/components/FilterFields.tsx','<select value={value}','<select aria-label={label} value={value}');
const shell='src/components/AppShell.tsx';let s=fs.readFileSync(shell,'utf8');s=s.replace("import { useEffect, type ReactNode }", "import { useEffect, useSyncExternalStore, type ReactNode }");
s=s.replace('export function AppShell',"const subscribeReady = () => () => {};\nexport function AppShell");s=s.replace('  const pathname = usePathname();','  const pathname = usePathname();\n  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);');s=s.replace('<div {...stylex.props(s.root,','<div data-hydrated={ready ? \'true\' : \'false\'} {...stylex.props(s.root,');
if(!s.includes('data-hydrated'))throw Error('AppShell root marker not found');fs.writeFileSync(shell,s);
const qa='scripts/qa-interactions.mjs';let t=fs.readFileSync(qa,'utf8');t=t.replace("return page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });", "const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 }); await page.locator('[data-hydrated=\"true\"]').waitFor(); return response;");fs.writeFileSync(qa,t);
