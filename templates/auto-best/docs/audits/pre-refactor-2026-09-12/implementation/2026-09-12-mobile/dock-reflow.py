from pathlib import Path
root=Path('J:/cars/templates/auto-best')
p=root/'src/lib/components/layout/Header.svelte'
s=p.read_text(encoding='utf-8')
s=s.replace("  import { lockPageScroll }", "  import { observeDockSize } from '$lib/ui/dock';\n  import { lockPageScroll }")
for name in ['dn-mobile-detail-bar','dn-mobile-bottom-nav']:
    old=f'<nav class="{name}"'; assert s.count(old)==1,name
    s=s.replace(old,f'<nav {{@attach observeDockSize}} class="{name}"')
s=s.replace('      height: calc(var(--dn-mobile-nav-height)', '      min-height: calc(var(--dn-mobile-nav-height)')
s=s.replace('      height: calc(var(--dn-mobile-detail-bar-height)', '      min-height: calc(var(--dn-mobile-detail-bar-height)')
p.write_text(s,encoding='utf-8')
p=root/'src/lib/styles/composition.css'; s=p.read_text(encoding='utf-8')
s=s.replace('padding-bottom: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom))', 'padding-bottom: var(--dn-active-dock-height, calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom)))')
s=s.replace('padding-bottom: calc(var(--dn-mobile-detail-bar-height) + env(safe-area-inset-bottom))', 'padding-bottom: var(--dn-active-dock-height, calc(var(--dn-mobile-detail-bar-height) + env(safe-area-inset-bottom)))')
p.write_text(s,encoding='utf-8')
p=root/'scripts/mobile-render-check.mjs'; s=p.read_text(encoding='utf-8')
s=s.replace('    const overflow =', "    await page.waitForFunction(() => { const dock = document.querySelector('.dn-mobile-detail-bar, .dn-mobile-bottom-nav'); return !dock || Math.abs(parseFloat(document.body.style.getPropertyValue('--dn-active-dock-height')) - dock.getBoundingClientRect().height) < 1; });\n    const overflow =")
p.write_text(s,encoding='utf-8')
print('Mobile docks now grow with their labels and reserve their measured height, instead of clipping enlarged actions.')
