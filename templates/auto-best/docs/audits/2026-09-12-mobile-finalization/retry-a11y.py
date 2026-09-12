from pathlib import Path
import shutil
root = Path(__file__).parent
for name in ['accessibility.json', 'accessibility.log']:
    src = root/'evidence'/name
    if src.exists(): shutil.copy2(src, src.with_name(src.stem+'-initial'+src.suffix))
p = root/'accessibility.mjs'
s = p.read_text(encoding='utf-8')
s = s.replace("waitUntil:'networkidle'", "waitUntil:'domcontentloaded',timeout:30000")
s = s.replace("await page.addScriptTag({path:axe});", "await page.waitForFunction(() => Boolean(document.querySelector('main'))); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(450); await page.addScriptTag({path:axe});")
p.write_text(s, encoding='utf-8')
