from pathlib import Path
import shutil, json, subprocess
root=Path('J:/cars/templates/auto-best')
stage=Path('J:/cars/runtime/auto-best-production-check-20260912')
stage.mkdir(parents=True,exist_ok=True)
for name in ['src','static','scripts']:
    shutil.copytree(root/name,stage/name,dirs_exist_ok=True)
for name in ['package.json','package-lock.json','svelte.config.js','vite.config.ts','vite.config.js','tsconfig.json']:
    if (root/name).exists(): shutil.copy2(root/name,stage/name)
if not (stage/'node_modules').exists():
    subprocess.run(['cmd','/c','mklink','/J',str(stage/'node_modules'),str(root/'node_modules')],check=True,capture_output=True)
(root/'docs/implementation/2026-09-12-mobile/production-stage.json').write_text(json.dumps({'directory':str(stage),'note':'Isolated source/static/config copy, shared installed dependencies; live dev generated output untouched.'},indent=2),encoding='utf-8')
print(stage)
