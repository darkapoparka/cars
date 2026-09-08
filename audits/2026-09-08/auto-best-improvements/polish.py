exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/components/layout/Header.svelte'
edit(p,"  import { afterNavigate }", "  import { lockPageScroll } from '$lib/ui/overlay';\n  import { afterNavigate }")
edit(p,'let mobileMenu = $state<HTMLDivElement>();','let mobileMenu = $state<HTMLDialogElement>();')
edit(p,"let previousBodyOverflow = '';","let releaseScroll: (() => void) | undefined;")
edit(p,'const attachMobileMenu: Attachment<HTMLDivElement>', 'const attachMobileMenu: Attachment<HTMLDialogElement>')
edit(p,"    previousBodyOverflow = document.body.style.overflow;\n    document.body.style.overflow = 'hidden';",'    if (mobileOpen) return;\n    releaseScroll = lockPageScroll();')
edit(p,'    mobileCloseButton?.focus();','    mobileMenu?.showModal();\n    mobileCloseButton?.focus();')
edit(p,"    mobileOpen = false;\n    document.body.style.overflow = previousBodyOverflow;",'    mobileMenu?.close();\n    mobileOpen = false;\n    releaseScroll?.();')
edit(p,"    if (mobileOpen) document.body.style.overflow = previousBodyOverflow;",'    releaseScroll?.();')
transform(p,lambda s:re.sub(r'  const handleMobileKeydown = .*?\n  };\n','',s,flags=re.S))
transform(p,lambda s:re.sub(r'      <button\s+class="dn-mobile-menu__backdrop".*?</button>\n','',s,flags=re.S))
edit(p,'      <div\n        class="dn-mobile-menu"','      <dialog\n        class="dn-mobile-menu"')
edit(p,'        role="dialog"\n        aria-modal="true"\n','')
edit(p,'        onkeydown={handleMobileKeydown}','        oncancel={(event) => { event.preventDefault(); void closeMobile(); }}\n        onclick={(event) => { if (event.target === event.currentTarget) void closeMobile(); }}')
edit(p,'<p class="dn-mobile-menu__address">{brand.addressLine}</p>\n      </div>','<p class="dn-mobile-menu__address">{brand.addressLine}</p>\n      </dialog>')
edit(p,'<style>','<style>\n  .dn-mobile-menu { top: auto; width: 100%; max-width: none; margin: 0; border: 0; }\n  .dn-mobile-menu::backdrop { background: rgb(10 13 18 / .54); }')
# On a wider viewport the mobile dialog must not trap the desktop page.
edit(p,'<svelte:window onkeydown={handleWindowKeydown} />','<svelte:window onkeydown={handleWindowKeydown} onresize={() => { if (window.innerWidth >= 992 && mobileOpen) void closeMobile(false); }} />')
for component,prop in [('QuickFilterSheet','--dn-quick-scroll'),('VehicleSearchDialog','--dn-dialog-scroll-offset')]:
 p=f'src/lib/components/listing/{component}.svelte'
 edit(p,'<script lang="ts">','<script lang="ts">\n  import { preserveScrollOffset } from \'$lib/ui/overlay\';\n  import { onDestroy } from \'svelte\';\n  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;\n  onDestroy(() => releaseOffset?.(false));')
 if component=='QuickFilterSheet':
  edit(p,'  let scrollY = 0;','')
  edit(p,"    scrollY = window.scrollY;\n    if (!onApply) document.body.style.setProperty('--dn-quick-scroll', `-${scrollY}px`);","    if (!onApply) releaseOffset = preserveScrollOffset('--dn-quick-scroll');")
  edit(p,"      document.body.style.removeProperty('--dn-quick-scroll');\n      window.scrollTo(0, scrollY);",'      releaseOffset?.();')
 else:
  edit(p,'  let pageScrollY = 0;','')
  edit(p,"    pageScrollY = window.scrollY;\n    document.body.style.setProperty('--dn-dialog-scroll-offset', `-${pageScrollY}px`);","    releaseOffset = preserveScrollOffset('--dn-dialog-scroll-offset');")
  edit(p,"    document.body.style.removeProperty('--dn-dialog-scroll-offset');\n    window.scrollTo(0, pageScrollY);",'    releaseOffset?.();')
p='src/lib/components/home/Hero.svelte'
transform(p,lambda s:re.sub(r'  <picture>.*?<div class="dn-hero__overlay"></div>\n','',s,flags=re.S))
# Remove only retired media selectors, preserving all active geometry and typography.
transform(p,lambda s:re.sub(r'  \.dn-hero__media,\s*\.dn-hero__overlay\s*\{[^}]*\}|\s*(?:\.dn-hero )?\.dn-hero(?: \.dn-hero__media|__media|__overlay)\s*\{[^}]*\}','',s))
p='src/lib/components/ui/VehicleCutout.svelte'
edit(p,"framing = 'hero'", "framing = 'hero', media")
edit(p,"    framing?: 'hero' | 'banner';", "    framing?: 'hero' | 'banner';\n    media?: string;")
edit(p,'<picture>','<picture>\n  {#if media}<source {media} srcset={vehicleArtwork[vehicle].src} />{/if}')
edit(p,'{#if mobileVehicle}','{#if mobileVehicle && !media}')
edit(p,'src={vehicleArtwork[vehicle].src}',"src={media ? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' : vehicleArtwork[vehicle].src}")
p='src/lib/components/ui/HeroVehicles.svelte'
edit(p,'{#if mobile}<img','{#if mobile}<picture><source media="(max-width: 767px)" srcset="/assets/images/lead/day-night-urus-front-v1.webp" /><img')
edit(p,'src="/assets/images/lead/day-night-urus-front-v1.webp"','src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="')
edit(p,'decoding="async" />{/if}','decoding="async" /></picture>{/if}')
edit(p,'<VehicleCutout {vehicle}', '<VehicleCutout media="(min-width: 1440px)" {vehicle}')
p='src/routes/about-us/+page.svelte'
edit(p,"  import './about.css';","  import './about.css';\n  import { template } from '$config/template';")
edit(p,'<AboutTeam />\n<AboutPartners />','{#if template.sections.demoTeam}<AboutTeam />{/if}\n{#if template.sections.demoPartners}<AboutPartners />{/if}')
p='src/routes/+layout.svelte'
edit(p,"  import '@fontsource-variable/onest';", "  import '@fontsource-variable/onest';\n  import { template, canIndex } from '$config/template';")
edit(p,'const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);',"const indexable = canIndex();\n  const canonicalUrl = $derived(template.canonicalOrigin ? `${template.canonicalOrigin}${page.url.pathname}` : null);")
edit(p,'  <link rel="canonical" href={canonicalUrl} />','  {#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}\n  {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}')
p='src/hooks.server.ts'
edit(p,'import type',"import { featuredVehicles } from '$data/inventory';\nimport type")
edit(p,'([1-8])','([1-9]\\d*)')
edit(p,'return legacyDetailMatch ?', 'return legacyDetailMatch && featuredVehicles.some(vehicle => vehicle.id === Number(legacyDetailMatch[1])) ?')
# Remove redundant article discovery widgets. The index retains search and categories.
p='src/routes/blog-detail/[id]/+page.svelte'
for widget in ['search','categories','tags']:
 transform(p,lambda s:re.sub(r'        <section class="dn-blog-widget dn-blog-widget--'+widget+r'">.*?</section>\n','',s,flags=re.S))
# Extract the complete supporting responsibility; existing route stylesheet owns its appearance.
f=root/p;s=f.read_text(encoding='utf-8');start=s.index('      <aside');end=s.index('</aside>',start)+len('</aside>');aside=s[start:end]
component='''<script lang="ts">
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { BlogPost } from '$data/editorial';
  let { related }: { related: BlogPost[] } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
'''+aside.replace('data.related','related')+'\n'
(root/'src/lib/components/editorial/ArticleSupport.svelte').write_text(component,encoding='utf-8')
s=s[:start]+'      <ArticleSupport related={data.related} />'+s[end:]
s=s.replace("  import { brand }", "  import ArticleSupport from '$components/editorial/ArticleSupport.svelte';\n  import { brand }").replace('  const phoneLinkAttributes = { href: brand.phoneHref } as const;\n','');f.write_text(s,encoding='utf-8')
