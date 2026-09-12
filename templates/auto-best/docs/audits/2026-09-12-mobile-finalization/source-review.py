from pathlib import Path
import re,json,sys
root=Path.cwd(); files=list((root/'src').rglob('*')); out=root/'docs/audits/2026-09-12-mobile-finalization/evidence'
for group in ['home','listing','vehicles','company','editorial','ui','layout','data','routes','css']:
 chunks=[]
 for f in files:
  if not f.is_file():continue
  name=f.relative_to(root).as_posix(); isgroup=(f'/components/{group}/' in name or (group=='data' and '/data/' in name) or (group=='routes' and '/routes/' in name) or (group=='css' and f.suffix=='.css'))
  if not isgroup:continue
  lines=f.read_text(encoding='utf-8').splitlines(); content=[]
  for n,line in enumerate(lines,1):
   if f.suffix=='.svelte' and line.strip()=='<style>':break
   # SVG geometry is indexed but omitted from this readable review bundle.
   if len(line)>700:line=line[:700]+' [long line truncated: inspect original when needed]'
   content.append(f'{n}: {line}')
  if group=='css':
   content=[f'{n}: {line[:500]}' for n,line in enumerate(lines,1) if re.search(r'@media|:has|:global|!important|position:\s*(fixed|sticky)|display:\s*contents|overflow|z-index|font-size|grid-template|--dn-|#[0-9a-fA-F]{3,8}',line)]
  chunks.append('\n## '+name+'\n'+'\n'.join(content))
 (out/f'review-{group}.txt').write_text('\n'.join(chunks),encoding='utf-8')
print('Review bundles created')
