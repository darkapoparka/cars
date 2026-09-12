from pathlib import Path
import json
root=Path('J:/cars/templates/auto-best')
p=root/'scripts/mobile-quality.mjs'
s=p.read_text(encoding='utf-8').replace("const out = 'artifacts/mobile-quality';", "const engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';\nconst out = `artifacts/mobile-quality-${engine}`;")
p.write_text(s,encoding='utf-8')
p=root/'package.json'; data=json.loads(p.read_text(encoding='utf-8'))
data['scripts']['check:resilience']='node scripts/mobile-resilience.mjs'
data['scripts']['quality']='npm run validate && npm run smoke && npm run check:mobile && npm run check:resilience'
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Quality command includes mobile accessibility, media budgets and resilience; browser-engine reports are separated.')
