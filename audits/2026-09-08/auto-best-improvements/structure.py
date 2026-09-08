exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/components/layout/Header.svelte'
f=root/p;s=f.read_text(encoding='utf-8')
start=s.index('      <dialog\n');end=s.index('</dialog>',start)+len('</dialog>')
markup=s[start:end]
csslines=[line for line in s.splitlines() if line.lstrip().startswith('.dn-mobile-menu')]
assert len(csslines)==15,len(csslines)
native=[line for line in csslines if line.startswith('  .')]
responsive=[line for line in csslines if line.startswith('    .')]
component='''<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { Attachment } from 'svelte/attachments';
  import { trapDialogTab } from '$lib/ui/overlay';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';
  import MobileNavIcon from './MobileNavIcon.svelte';
  let { closeMobile, attachMobileMenu, attachMobileCloseButton, listingHeader }: {
    closeMobile: (restoreFocus?: boolean) => Promise<void>;
    attachMobileMenu: Attachment<HTMLDialogElement>;
    attachMobileCloseButton: Attachment<HTMLButtonElement>;
    listingHeader: boolean;
  } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
'''+markup+'\n<style>\n'+'\n'.join(native)+'\n  @media (max-width: 991px) {\n'+'\n'.join(responsive)+'\n  }\n</style>\n'
(root/'src/lib/components/layout/MobileMenu.svelte').write_text(component,encoding='utf-8')
s=s[:start]+'      <MobileMenu {closeMobile} {attachMobileMenu} {attachMobileCloseButton} {listingHeader} />'+s[end:]
s='\n'.join(line for line in s.splitlines() if line not in csslines)+'\n'
s=s.replace("  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';", "  import MobileMenu from './MobileMenu.svelte';").replace('lockPageScroll, trapDialogTab','lockPageScroll');f.write_text(s,encoding='utf-8')
# Preserve the exact cascade order while naming the global styling responsibilities.
f=root/'src/app.css';s=f.read_text(encoding='utf-8')
s=s.replace('  --dn-focus: #0b57d0;\n','');s=s.replace(':root {',':root {\n  --dn-focus: #0b57d0;',1)
s=s.replace('outline: 3px solid #0b57d0','outline: 3px solid var(--dn-focus)')
breaks=[0,s.index('* { box-sizing'),s.index('.dn-header-fixed {'),s.index('.dn-section {'),len(s)]
folder=root/'src/lib/styles';folder.mkdir(exist_ok=True)
names=['tokens','base','navigation','composition']
for i,name in enumerate(names):(folder/f'{name}.css').write_text(s[breaks[i]:breaks[i+1]],encoding='utf-8')
f.write_text('/* Order is intentional: tokens, native defaults, navigation, then shared responsive composition. */\n'+''.join(f'@import "./lib/styles/{name}.css";\n' for name in names),encoding='utf-8')
p='package.json';f=root/p
import json
data=json.loads(f.read_text(encoding='utf-8'));data['scripts']['check:domain']='node scripts/check-domain.mjs';data['scripts']['validate']=data['scripts']['validate'].replace('npm run check &&','npm run check:domain && npm run check &&');data['scripts']['quality']='npm run validate && npm run smoke';f.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
