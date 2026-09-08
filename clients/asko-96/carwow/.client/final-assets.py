import pathlib,re
p=pathlib.Path('.')
for name in ['src/lib/components/home/desktop/DesktopHomeHero.svelte','src/lib/components/layout/DesktopYellowRouteHero.svelte']:
 f=p/name;s=f.read_text(encoding='utf-8');source=(p/'../../../templates/carwow'/name).read_text(encoding='utf-8')
 for var in ['leftCarSrc','rightCarSrc']:
  orig=re.search(r'const '+var+r'\s*=\s*\n?\s*\'[^\']+\';',source).group(0)
  s=re.sub(r'const '+var+r'\s*=\s*\n?\s*\'[^\']+\';',lambda m:orig,s)
 f.write_text(s,encoding='utf-8')
f=p/'.client/autofixer.mjs';s=f.read_text(encoding='utf-8');s=s.replace("spawnSync('C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/cli.js',['svelte-autofixer',f],{encoding:'utf8',shell:true})","spawnSync(process.execPath,['C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/index.mjs','svelte-autofixer',f],{encoding:'utf8'})");f.write_text(s,encoding='utf-8')
f=p/'.client/qa-routes.mjs';s=f.read_text(encoding='utf-8');s=s.replace("const res=await page.goto('http://127.0.0.1:6613'+route,{waitUntil:'domcontentloaded',timeout:120000});","let res; for(let attempt=0;attempt<3;attempt++){try{res=await page.goto('http://127.0.0.1:6613'+route,{waitUntil:'domcontentloaded',timeout:120000});break;}catch(e){if(attempt===2)throw e;await page.waitForTimeout(500);}}")
f.write_text(s,encoding='utf-8')

