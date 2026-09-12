from pathlib import Path
root = Path('J:/cars/templates/auto-best')
p = root / 'src/hooks.server.ts'
s = p.read_text(encoding='utf-8')
start = s.index("  'Content-Security-Policy': [")
end = s.index("  'Permissions-Policy':", start)
p.write_text(s[:start] + s[end:], encoding='utf-8')
p = root / 'scripts/mobile-quality.mjs'
s = p.read_text(encoding='utf-8').replace("{ mkdir, writeFile }", "{ mkdir, writeFile, readFile }")
s = s.replace('await page.addScriptTag({ path: axePath });', "await page.evaluate(await readFile(axePath, 'utf8'));")
p.write_text(s, encoding='utf-8')
p = root / 'scripts/home-hierarchy-smoke.mjs'
s = p.read_text(encoding='utf-8').replace("for (const [section,count] of [['.dn-body-types',8],['.dn-brand-section',12]]) {", "for (const [section,grid] of [['.dn-body-types','#body-types-grid'],['.dn-brand-section','#brands-grid']]) {\n    const count = Number(await page.locator(grid).getAttribute('data-total-count'));")
p.write_text(s, encoding='utf-8')
print('CSP is now framework-owned; accessibility injection does not disable the production policy; hierarchy counts follow data.')
