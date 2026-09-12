<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import SiteChromeIcon from './SiteChromeIcon.svelte';
	let { languageOpen = false, onLanguageToggle }: { languageOpen?: boolean; onLanguageToggle: () => void } = $props();
	const mapLinkProps={href:daynightSite.mapUrl,target:'_blank',rel:'noopener'} as const;
</script>
<div class="site-chrome-topbar relative z-[940] h-11 border-b border-sa-red-strong/70 bg-sa-red text-sa-surface max-[1199px]:hidden">
	<div class="mx-auto flex h-full w-full max-w-none items-center justify-between px-6">
		<div class="site-chrome-topbar__contact flex min-w-0 items-center">
			<a class="site-chrome-topbar__inventory mr-4 shrink-0 border-r border-sa-surface/25 pr-4 leading-none text-sa-surface no-underline" href={resolve('/inventory')}>{daynightSite.primaryCta}</a>
			<a {...mapLinkProps} class="site-chrome-topbar__location flex min-w-0 items-center gap-1.5 text-sa-surface no-underline" aria-label={`Отвори в Google Maps: ${daynightSite.location}`}><SiteChromeIcon name="location"/><span class="truncate">{daynightSite.locationShort}</span></a>
			<span class="site-chrome-topbar__dot" aria-hidden="true">·</span>
			<a href={daynightSite.phoneHref} class="site-chrome-topbar__phone flex shrink-0 items-center gap-1.5 text-sa-surface no-underline" aria-label={`Обади се на ${daynightSite.phoneLabel}`}><SiteChromeIcon name="phone"/><span>{daynightSite.phoneLabel}</span></a>
		</div>
		<div class="relative border-l border-sa-surface/25 pl-3" id="language-select">
			<button class="site-chrome-topbar__language inline-flex h-8 items-center gap-1 border-0 bg-transparent px-1 text-sa-surface" type="button" aria-label="Език: Български" aria-haspopup="listbox" aria-controls="headerLanguageMenu" aria-expanded={languageOpen} onclick={onLanguageToggle}><span>БГ</span><SiteChromeIcon name="chevron-down" class="text-sa-surface"/></button>
			<div class={['pointer-events-none invisible absolute top-[calc(100%+8px)] right-0 min-w-[170px] rounded-sa-sm border border-sa-line bg-sa-surface p-2 text-sa-ink opacity-0 shadow-sa-md',languageOpen&&'pointer-events-auto visible opacity-100']} id="headerLanguageMenu"><ul class="m-0 list-none p-0" role="listbox" aria-label="Избор на език"><li class="rounded-sa-xs bg-sa-muted px-2.5 py-2 text-sa-base font-medium" role="option" aria-selected="true">Български (активен)</li></ul></div>
		</div>
	</div>
</div>
<style>.site-chrome-topbar__inventory{font-size:13px;font-weight:700}.site-chrome-topbar__location,.site-chrome-topbar__phone{font-size:13px;color:#fff}.site-chrome-topbar__phone{font-weight:700}.site-chrome-topbar__dot{padding:0 10px;opacity:.4}.site-chrome-topbar__language{font-size:14px;font-weight:700}</style>
