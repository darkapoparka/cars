<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import SiteChromeCtaButtons from './SiteChromeCtaButtons.svelte';
	import SiteChromeIcon from './SiteChromeIcon.svelte';
	import SiteChromeLogo from './SiteChromeLogo.svelte';

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

	const headerToolClasses =
		'relative inline-grid size-11 cursor-pointer place-items-center rounded-sa-pill border border-[#dbe4ef] bg-[#f5f7fb] p-0 text-[#172642] no-underline transition-colors duration-150 ease-sa hover:border-[#b9cce5] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue/45 [&_svg]:size-[22px]';
	const homePhoneClasses =
		'site-chrome-phone-btn relative inline-grid size-11 place-items-center rounded-sa-pill border border-[#dbe4ef] bg-[#f5f7fb] text-[#172642] no-underline transition-colors duration-150 ease-sa hover:border-[#b9cce5] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue/45 [&_svg]:size-[22px]';
	const badgeClasses =
		'absolute top-0 right-0 grid h-[17px] min-w-[17px] place-items-center rounded-sa-pill bg-sa-red px-1 text-sa-chrome-badge leading-none font-semibold text-sa-surface';
</script>

<div
	class="header-style-2-main relative z-[930] border-b border-sa-line bg-sa-surface max-[1199px]:hidden"
>
	<div class="mx-auto w-full max-w-none px-6">
		<div class="flex h-[68px] w-full items-center">
			<SiteChromeLogo containerClass="logo" tone="dark" />
			<SiteChromeLogo containerClass="logo-mobile" tone="dark" />
			<div class="flex min-w-0 flex-1 items-center pl-4">
				<div class="ml-auto flex shrink-0 items-center gap-3">
					<div class="flex shrink-0 items-center gap-2">
						<a
							href={phoneHref}
							class={homePhoneClasses}
							data-daynight-header-tool="phone"
							aria-label={`Call ${daynightSite.phoneLabel}`}
							title={daynightSite.phoneCta}
						>
							<SiteChromeIcon name="phone" />
						</a>
						<a
							href={resolve('/contact')}
							class={headerToolClasses}
							data-daynight-header-tool="contact"
							aria-label={daynightSite.accountCta}
							title={daynightSite.accountCta}
						>
							<SiteChromeIcon name="account" />
						</a>
						<button
							type="button"
							class={[headerToolClasses, searchOpen && 'border-[#b9cce5] bg-white text-sa-blue']}
							id="searchToggle"
							data-daynight-header-tool="search"
							aria-label="Open search"
							title="Open search"
							aria-expanded={searchOpen}
							aria-controls="searchForm"
							onclick={onSearchToggle}
						>
							<SiteChromeIcon name="search" />
						</button>
						<a
							href={resolve('/compare')}
							class={headerToolClasses}
							data-daynight-header-tool="compare"
							aria-label="Compare"
							title="Compare"
						>
							<SiteChromeIcon name="compare" />
							{#if compareBadge > 0}<span class={badgeClasses} aria-hidden="true"
									>{compareBadge}</span
								>{/if}
						</a>
						<a
							href={resolve('/favorites')}
							class={headerToolClasses}
							data-daynight-header-tool="favorites"
							aria-label="Saved vehicles"
							title="Saved vehicles"
						>
							<SiteChromeIcon name="heart" />
							{#if favoritesBadge > 0}<span class={badgeClasses} aria-hidden="true"
									>{favoritesBadge}</span
								>{/if}
						</a>
					</div>
					<SiteChromeCtaButtons compact />
				</div>
			</div>
		</div>
	</div>
</div>
