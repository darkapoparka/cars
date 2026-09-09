<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';
	import SiteChromeIcon from './SiteChromeIcon.svelte';
	import SiteChromeLogo from './SiteChromeLogo.svelte';
	import SiteNavigation from './SiteNavigation.svelte';

	let {
		searchOpen = false,
		compareBadge = 0,
		favoritesBadge = 0,
		onSearchToggle
	}: {
		searchOpen?: boolean;
		compareBadge?: number;
		favoritesBadge?: number;
		onSearchToggle: () => void;
	} = $props();

	const phoneHref = `tel:${daynightSite.phone}`;
	const logoSrcset = desktopOnlySrcset(daynightSite.logoDark, 570);
	const logoSizes = desktopOnlySizes('190px');
	const navToolClasses =
		'relative inline-grid size-10 place-items-center rounded-sa-pill text-sa-surface no-underline transition duration-150 ease-sa hover:bg-sa-surface/10 focus-visible:bg-sa-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-[22px]';
	const homePhoneClasses =
		'site-chrome-phone-btn inline-grid size-10 place-items-center rounded-sa-pill text-sa-surface no-underline transition-colors duration-150 ease-sa hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-[22px]';
	const badgeClasses =
		'absolute top-px right-0 grid h-[17px] min-w-[17px] place-items-center rounded-sa-pill bg-sa-red px-1 text-[10px] leading-none font-bold text-sa-surface';
</script>

<div
	class="site-chrome-nav-row relative z-[910] border-y border-sa-surface/10 bg-sa-blue shadow-sa-md"
>
	<div class="relative mx-auto w-full max-w-none px-6">
		<div class="flex h-[58px] min-h-[58px] flex-col">
			<div class="relative flex h-[58px] min-h-[58px] w-full items-center justify-center gap-5">
				<SiteChromeLogo tone="light" role="sticky" />
				<img
					class="absolute top-1/2 left-0 hidden max-h-10 w-[156px] -translate-y-1/2 object-contain max-[1199px]:block"
					src={desktopOnlyImagePlaceholder}
					srcset={logoSrcset}
					sizes={logoSizes}
					alt="logo"
				/>
				<SiteNavigation />
				<div
					class="absolute top-1/2 right-6 ml-5 hidden -translate-y-1/2 items-center gap-2.5 max-[1199px]:flex"
				>
					<a
						href={phoneHref}
						class={homePhoneClasses}
						data-daynight-header-tool="phone"
						aria-label={`Обади се на ${daynightSite.phoneLabel}`}
						title={daynightSite.phoneCta}
					>
						<SiteChromeIcon name="phone" />
					</a>
					<a
						href={resolve('/contact')}
						class={navToolClasses}
						data-daynight-header-tool="account"
						aria-label={daynightSite.accountCta}
						title={daynightSite.accountCta}
					>
						<SiteChromeIcon name="account" />
					</a>
					<button
						type="button"
						class={[
							navToolClasses,
							'cursor-pointer border-0 bg-transparent p-0',
							searchOpen && 'bg-sa-surface/10'
						]}
						id="mobileSearchToggle"
						data-daynight-header-tool="search"
						aria-label="Отвори търсене"
						title="Отвори търсене"
						aria-expanded={searchOpen}
						aria-controls="searchForm"
						onclick={onSearchToggle}
					>
						<SiteChromeIcon name="search" />
					</button>
					<a
						href={resolve('/compare')}
						class={navToolClasses}
						data-daynight-header-tool="compare"
						aria-label="Сравни"
					>
						<SiteChromeIcon name="compare" />
						{#if compareBadge > 0}<span class={badgeClasses} aria-hidden="true">{compareBadge}</span
							>{/if}
					</a>
					<a
						href={resolve('/favorites')}
						class={navToolClasses}
						data-daynight-header-tool="favorites"
						aria-label="Запазени автомобили"
					>
						<SiteChromeIcon name="heart" />
						{#if favoritesBadge > 0}<span class={badgeClasses} aria-hidden="true"
								>{favoritesBadge}</span
							>{/if}
					</a>
					<div class="hidden"><span></span></div>
				</div>
			</div>
		</div>
	</div>
</div>
