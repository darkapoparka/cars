<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { HomeFiveHeaderData, HomeFiveHeaderNavigationItem } from '$lib/auxero/home-five';
	import { Globe2, MapPin, Phone } from '@lucide/svelte';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import SiteSearchModal from '$lib/components/layout/SiteSearchModal.svelte';

	let {
		header,
		hasLocationSheet = false,
		hideMobileLogo = false,
		showAddListing = false
	}: {
		header?: HomeFiveHeaderData;
		hasLocationSheet?: boolean;
		hideMobileLogo?: boolean;
		showAddListing?: boolean;
	} = $props();

	const addListingHref = '/admin/inventory/new';
	const logoIntrinsicWidth = 1285;
	const logoIntrinsicHeight = 235;
	const routeNavMegaSuppressionClass = 'daynight-route-nav-click';
	let megaMenuSuppressionReadyToClear = false;
	let languageOpen = $state(false);
	let searchOpen = $state(false);

	const navItemClass = (item: HomeFiveHeaderNavigationItem) =>
		[
			'menu-item',
			item.megaMenu ? 'menu-item-has-children' : '',
			item.megaMenu?.variant === 'inventory' ? 'menu-item--static' : '',
			item.active ? 'current-menu-item menu-item-main' : ''
		]
			.filter(Boolean)
			.join(' ');

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const languageCode = (option: string) =>
		option === 'English' || option === 'Английски' ? 'en' : 'bg';
	const languageHref = (option: string) => {
		// This temporary URL builder is not retained as component state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams(page.url.searchParams);
		params.set('lang', languageCode(option));
		return `${page.url.pathname}?${params.toString()}`;
	};
	const openMobileLocation = () => {
		const toggle = document.getElementById(
			'daynight-mobile-location-toggle'
		) as HTMLInputElement | null;
		if (toggle && !toggle.checked) toggle.click();
	};
	const clearMegaMenuSuppression = () => {
		if (!megaMenuSuppressionReadyToClear) return;
		document.documentElement.classList.remove(routeNavMegaSuppressionClass);
		megaMenuSuppressionReadyToClear = false;
	};
	const armMegaMenuSuppressionClear = () => {
		if (!document.documentElement.classList.contains(routeNavMegaSuppressionClass)) return;
		megaMenuSuppressionReadyToClear = true;
	};
	const suppressMegaMenuDuringNavigation = (event: MouseEvent) => {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const link = event.currentTarget;
		if (!(link instanceof HTMLAnchorElement)) return;
		if (link.target && link.target !== '_self') return;

		const nextUrl = new URL(link.href, window.location.href);
		if (nextUrl.origin !== window.location.origin) return;
		if (
			nextUrl.pathname === window.location.pathname &&
			nextUrl.search === window.location.search
		) {
			return;
		}

		document.documentElement.classList.add(routeNavMegaSuppressionClass);
		megaMenuSuppressionReadyToClear = false;
	};
</script>

{#if header}
	<!-- Header -->
	<div class="header-wrapper-style-4">
		<div class="shared-mobile-header">
			<MobileAppbar surface="dark" onMap={hasLocationSheet ? openMobileLocation : undefined} />
		</div>
		<header class="header header-style-4 daynight-unified-header" id="header_main">
			<div class="header-container-fluid header-spacing min-height-header relative max-w-1920">
				<div class="header-inner" id="site-header-inner">
					<div class="logo">
						<a href={resolve(header.logo.href as '/')}>
							<img
								src={header.logo.src}
								alt={header.logo.alt}
								width={logoIntrinsicWidth}
								height={logoIntrinsicHeight}
								decoding="async"
							/>
						</a>
					</div>
					<div
						class="logo-mobile"
						hidden={hideMobileLogo}
						aria-hidden={hideMobileLogo ? 'true' : undefined}
						style={hideMobileLogo ? 'display: none !important; visibility: hidden !important;' : ''}
					>
						<a href={resolve(header.logo.href as '/')}>
							<img
								src={header.logo.mobileSrc}
								alt={header.logo.alt}
								width={logoIntrinsicWidth}
								height={logoIntrinsicHeight}
								decoding="async"
							/>
						</a>
					</div>

					<div class="header-right header-right-style-2 main-nav-wrapper gap-20">
						<!-- Menu -->
						<nav
							id="main-nav"
							class="main-nav"
							onpointerenter={clearMegaMenuSuppression}
							onpointerleave={armMegaMenuSuppressionClear}
						>
							<ul id="menu-primary-menu" class="menu menu">
								{#each header.navigation as item (item.href)}
									<li class={navItemClass(item)}>
										<a
											href={resolve(item.href as '/')}
											aria-haspopup={item.megaMenu ? 'true' : undefined}
											onclick={suppressMegaMenuDuringNavigation}
										>
											{item.label}
											{#if item.megaMenu}
												{@render chevronIcon('currentColor')}
											{/if}
										</a>

										{#if item.megaMenu}
											{#if item.megaMenu.variant === 'inventory'}
												<div
													class="sub-menu sub-menu--full sub-menu--listing daynight-mega daynight-mega--vehicles"
												>
													<div class="daynight-mega__content">
														<div class="daynight-mega__vehicle-panel">
															<div class="sub-menu--listing-nav daynight-mega__vehicles">
																{#each item.megaMenu.vehicles as vehicle (vehicle.href)}
																	<a
																		class="daynight-mega-car"
																		href={resolve(vehicle.href as '/')}
																		onclick={suppressMegaMenuDuringNavigation}
																	>
																		<span class="daynight-mega-car__image-wrap">
																			<img
																				class="daynight-mega-car__image"
																				src={vehicle.image}
																				alt={vehicle.label}
																				width="280"
																				height="170"
																				loading="lazy"
																				decoding="async"
																			/>
																		</span>
																		<span class="daynight-mega-car__title">{vehicle.label}</span>
																		<span class="daynight-mega-car__meta">{vehicle.meta}</span>
																		<span class="daynight-mega-car__actions">
																			<span>{header.ui.megaView}</span>
																			<span>{header.ui.megaDetails}</span>
																		</span>
																	</a>
																{/each}
															</div>

															<div class="daynight-mega__footer">
																<a
																	href={resolve(item.megaMenu.footer.ctaHref as '/')}
																	class="btn btn-primary btn-medium font-weight-600 daynight-mega__footer-button"
																	onclick={suppressMegaMenuDuringNavigation}
																>
																	{item.megaMenu.footer.ctaLabel}
																</a>
																<div class="daynight-mega__footer-copy">
																	<strong>{item.megaMenu.footer.title}</strong>
																	<span>{item.megaMenu.footer.copy}</span>
																</div>
															</div>
														</div>

														<div class="sub-menu--listing-image daynight-mega__links">
															{#each item.megaMenu.sections as section (section.title)}
																<div class="sub-menu-item-listing">
																	<p class="h5 menu-item-inner-title mb-16">
																		{section.title}
																		{@render subMenuTitleChevronIcon()}
																	</p>
																	<ul class="sub-menu-item-inner flex flex-col gap-16">
																		{#each section.links as link (link.href)}
																			<li>
																				<a
																					href={resolve(link.href as '/')}
																					onclick={suppressMegaMenuDuringNavigation}
																				>
																					{link.label}
																				</a>
																			</li>
																		{/each}
																	</ul>
																</div>
															{/each}
														</div>
													</div>
												</div>
											{:else}
												<ul class="sub-menu sub-menu--container">
													<li>
														{#each item.megaMenu.links as link (link.href)}
															<a
																href={resolve(link.href as '/')}
																onclick={suppressMegaMenuDuringNavigation}
															>
																{link.label}
															</a>
														{/each}
													</li>
												</ul>
											{/if}
										{/if}
									</li>
								{/each}
							</ul>
						</nav>
						<!-- Menu -->

						<div class="daynight-desktop-utilities">
							<a
								{...hrefAttributes(header.contact.phoneHref)}
								class="daynight-header-icon-button daynight-desktop-action"
								aria-label={header.contact.phoneLabel}
								title={header.contact.phoneLabel}
							>
								<Phone size={21} strokeWidth={1.8} aria-hidden="true" />
							</a>
							<div
								class={['core-dropdown language-select', languageOpen && 'active']}
								id="language-select"
							>
								<button
									class="core-dropdown__button daynight-header-icon-button daynight-desktop-action"
									type="button"
									aria-haspopup="menu"
									aria-expanded={languageOpen}
									aria-label={`${header.language.current} — смени езика`}
									title={header.language.current}
									onclick={() => (languageOpen = !languageOpen)}
									onkeydown={(event) => {
										if (event.key === 'Escape') languageOpen = false;
									}}
								>
									<Globe2 size={21} strokeWidth={1.8} aria-hidden="true" />
								</button>
								<div class="core-dropdown__menu" id="coreDropdownMenu" role="menu">
									<ul class="core-dropdown__list" role="none">
										{#each header.language.options as option (option)}
											<li class="cursor-pointer text-sm" role="none">
												<a
													href={resolve(languageHref(option) as '/')}
													role="menuitem"
													aria-current={option === header.language.current ? 'true' : undefined}
													onclick={() => (languageOpen = false)}
												>
													{option}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>

						<div class="header-button mobile-hidden-header-button flex items-center gap-20">
							<!-- Sign In Button -->
							<a
								href={resolve('/account')}
								class="daynight-header-icon-button daynight-desktop-action open-modal"
								data-modal-id="#LoginModal"
								aria-label={header.ui.signIn}
								title={header.ui.signIn}
							>
								{@render userIcon('currentColor')}
							</a>
							<!-- Sign In Button -->

							{#if showAddListing}
								<!-- Add Listing Button -->
								<a
									href={resolve(addListingHref as '/')}
									class="btn btn-primary btn-large font-weight-600"
								>
									{@render plusCircleIcon('#fff')}
									{header.ui.addListing}
								</a>
								<!-- Add Listing Button -->
							{/if}
						</div>

						<div class="header-actions ml-20">
							{#if hasLocationSheet}
								<button
									type="button"
									class="daynight-mobile-map"
									aria-label={header.contact.addressLabel}
									aria-controls="daynight-mobile-location-panel"
									aria-haspopup="dialog"
									title={header.contact.addressLabel}
									onclick={openMobileLocation}
								>
									<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
									<span class="daynight-mobile-action__label">Карта</span>
								</button>
							{:else}
								<a
									{...hrefAttributes(header.contact.addressHref)}
									class="daynight-mobile-map"
									aria-label={header.contact.addressLabel}
									title={header.contact.addressLabel}
								>
									<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
									<span class="daynight-mobile-action__label">Карта</span>
								</a>
							{/if}
							<a
								{...hrefAttributes(header.contact.phoneHref)}
								class="daynight-mobile-call"
								aria-label={header.contact.phoneLabel}
								title={header.contact.phoneLabel}
							>
								<Phone size={18} strokeWidth={2.35} aria-hidden="true" />
								<span class="daynight-mobile-action__label">Обади се</span>
							</a>
							<div class="header-search-wrapper">
								<button
									type="button"
									class="header-action-btn daynight-desktop-action relative"
									id="searchToggle"
									aria-label={header.ui.searchPlaceholder}
									title={header.ui.searchPlaceholder}
									aria-haspopup="dialog"
									aria-expanded={searchOpen}
									onclick={() => (searchOpen = true)}
								>
									{@render searchIcon('currentColor')}
								</button>
							</div>

							<a
								href={resolve('/compare')}
								class="header-action-btn header-action-icon daynight-desktop-action"
								aria-label={header.ui.compare}
								title={header.ui.compare}
								data-badge={header.actionBadges.compare > 0
									? header.actionBadges.compare
									: undefined}
							>
								{@render compareIcon('currentColor')}
							</a>

							<a
								href={resolve('/account/favorites')}
								class="header-action-btn header-action-icon daynight-desktop-action"
								aria-label={header.ui.wishlist}
								title={header.ui.wishlist}
								data-badge={header.actionBadges.wishlist > 0
									? header.actionBadges.wishlist
									: undefined}
							>
								{@render heartIcon('currentColor')}
							</a>
							<div class="mobile-button"><span></span></div>
						</div>
					</div>
				</div>
			</div>
			<div class="wrapper-header-button hidden">
				<div class="header-button header-button-mobile flex items-center gap-20">
					<!-- Sign In Button -->
					<a
						href={resolve('/account')}
						class="btn btn-primary-3 btn-large font-weight-600 open-modal"
						data-modal-id="#LoginModal"
					>
						{@render userIcon('#fff')}
						{header.ui.signIn}
					</a>
					<!-- Sign In Button -->

					{#if showAddListing}
						<!-- Add Listing Button -->
						<a
							href={resolve(addListingHref as '/')}
							class="btn btn-primary btn-large font-weight-600"
						>
							{@render plusCircleIcon('#fff')}
							{header.ui.addListing}
						</a>
						<!-- Add Listing Button -->
					{/if}
				</div>
			</div>
		</header>
	</div>
	<SiteSearchModal bind:open={searchOpen} placeholder={header.ui.searchPlaceholder} />
	<!-- Header -->
{/if}

{#snippet chevronIcon(stroke: string)}
	<svg
		class="chevron-down icon-chevron"
		width="16"
		height="12"
		viewBox="0 0 16 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 6.5L8 10.5L12 6.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet subMenuTitleChevronIcon()}
	<svg
		class="chevron-down lg-show hidden"
		width="16"
		height="12"
		viewBox="0 0 16 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 6.5L8 10.5L12 6.5"
			stroke="#9FA1A4"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet userIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3 20.25C4.81594 17.1122 8.11406 15 12 15C15.8859 15 19.1841 17.1122 21 20.25"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet plusCircleIcon(stroke: string)}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M8.25 12H15.75"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M12 8.25V15.75"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet searchIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet compareIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M16.5 13.5L19.5 16.5L16.5 19.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 16.5H19.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M7.5 10.5L4.5 7.5L7.5 4.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 7.5H4.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet heartIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	.shared-mobile-header {
		display: none;
	}
	@media (max-width: 767px) {
		.shared-mobile-header {
			display: block;
		}
		:global(.header-wrapper-style-4 #header_main) {
			display: none !important;
		}
	}
	/* Keep compact mega-menu links comfortably targetable without changing
	   their visual rhythm. */
	.sub-menu-item-inner li a {
		display: inline-flex;
		height: auto;
		min-height: 28px;
		align-items: center;
		padding-block: 4px;
		margin-block: -4px;
	}

	:global(.language-select .core-dropdown__button),
	:global(.language-select .core-dropdown__list li) {
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 20px;
	}

	:global(.language-select .core-dropdown__list li a) {
		display: flex;
		min-height: 36px;
		align-items: center;
		padding: 8px 14px;
		color: #262626;
		text-decoration: none;
	}

	:global(.language-select .core-dropdown__list li a:is(:hover, :focus-visible)) {
		background: #f3f4f6;
		color: var(--bc-accent);
	}

	.daynight-mobile-call,
	.daynight-mobile-map {
		display: none;
	}

	.daynight-desktop-utilities {
		display: none;
	}

	.daynight-header-icon-button {
		display: inline-flex;
		width: 44px;
		height: 44px;
		min-height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: rgb(255 255 255 / 0.82);
		transition: color 0.14s ease;
	}

	.daynight-header-icon-button:is(:hover, :focus-visible) {
		color: #ffffff;
	}

	:global(.daynight-desktop-utilities .language-select .core-dropdown__button) {
		width: 44px !important;
		height: 44px !important;
		min-height: 44px;
		border: 0 !important;
		background: transparent !important;
		color: rgb(255 255 255 / 0.82) !important;
		padding: 0 !important;
	}

	:global(.daynight-desktop-utilities .language-select .core-dropdown__label) {
		color: inherit !important;
	}

	/* The Auxero inner-page stylesheet exposes the alternate header logo at
	   tablet widths. Keep the shell's primary logo as the single brand mark;
	   this selector does not affect the logo inside the mobile navigation. */
	:global(.header-wrapper-style-4 .header-inner > .logo-mobile) {
		display: none !important;
		visibility: hidden !important;
	}

	.bg-sign-in {
		width: 44px !important;
		height: 44px !important;
		min-height: 44px;
		padding: 0 !important;
		border: 0 !important;
		background: transparent !important;
		color: rgb(255 255 255 / 0.82) !important;
	}

	.bg-sign-in:is(:hover, :focus-visible) {
		background: transparent !important;
		color: #ffffff !important;
	}

	:global(#language-select:not(.active) #coreDropdownMenu) {
		opacity: 0 !important;
		pointer-events: none !important;
		transform: translateY(-10px) !important;
		transition: none !important;
		visibility: hidden !important;
	}

	:global(#language-select.active #coreDropdownMenu) {
		pointer-events: auto !important;
	}

	:global(
		.header-wrapper-style-4
			.header
			.header-action-btn.header-action-icon[data-badge]:not([data-badge='0'])::after
	) {
		top: -6px;
		right: -9px;
		min-width: 17px;
		height: 17px;
		border: 2px solid #ffffff;
		background: var(--bc-accent);
		box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
		color: #ffffff;
		font-size: 10px;
		font-weight: 700;
	}

	:global(
		.header-wrapper-style-4 .header .header-action-btn.header-action-icon[data-badge='0']::after
	),
	:global(
		.header-wrapper-style-4 .header .header-action-btn.header-action-icon:not([data-badge])::after
	) {
		display: none !important;
	}

	:global(.header-wrapper-style-4 .header #searchToggle) {
		appearance: none;
		border: 0 !important;
		background: transparent !important;
		cursor: pointer;
	}

	:global(.header-wrapper-style-4 .header #searchToggle:focus-visible) {
		outline: 3px solid rgb(255 255 255 / 0.9);
		outline-offset: 2px;
	}

	@media (min-width: 768px) {
		:global(.header-wrapper-style-4) {
			height: 94px !important;
			min-height: 94px !important;
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			height: 94px;
			min-height: 94px;
			border-bottom: 1px solid rgb(255 255 255 / 0.1) !important;
			background: #090a0b !important;
			box-shadow: none !important;
		}

		:global(.header-wrapper-style-4 .header-top-bar) {
			display: none !important;
		}

		/* Sticky state: the theme only visibility-hides the top bar, so its 50px
		   kept inflating the fixed header. Collapse it and shrink to the nav row. */
		:global(.header-wrapper-style-4 .header.header-style-4.is-fixed) {
			height: 94px;
			min-height: 94px;
		}

		:global(.header-wrapper-style-4 .header.header-style-4.is-fixed .header-top-bar) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header-container-fluid),
		:global(.header-wrapper-style-4 .header-inner),
		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper),
		:global(.header-wrapper-style-4 #main-nav) {
			height: 94px !important;
			min-height: 94px !important;
		}

		:global(.header-wrapper-style-4 .header-container-fluid) {
			background: #090a0b !important;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a) {
			align-items: center;
			border: 0 !important;
			box-sizing: border-box;
			display: inline-flex;
			height: 94px;
			font-family: var(--bc-font-body);
			font-size: 20px;
			font-weight: 500;
			letter-spacing: 0;
			line-height: 24px;
			padding-bottom: 0 !important;
			padding-top: 0 !important;
			color: rgb(255 255 255 / 0.78) !important;
			transition: color 0.14s ease;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a:is(:hover, :focus-visible)),
		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a) {
			color: #ffffff !important;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a) {
			box-shadow: none;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a::before) {
			display: block !important;
			height: 2px !important;
			bottom: 28px !important;
			content: '' !important;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a > .icon-chevron),
		:global(.header-wrapper-style-4 #main-nav .menu > li > .sub-menu) {
			display: none !important;
		}

		:global(.header-wrapper-style-4 .header-actions),
		:global(.header-wrapper-style-4 .header #searchToggle),
		:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon) {
			color: rgb(255 255 255 / 0.82) !important;
		}

		:global(.header-wrapper-style-4 .header #searchToggle:hover),
		:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon:hover) {
			color: #ffffff !important;
		}

		:global(.header-wrapper-style-4 .logo),
		:global(.header-wrapper-style-4 .logo a),
		:global(.header-wrapper-style-4 .logo img) {
			border: 0 !important;
			box-sizing: border-box;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex !important;
			flex: 0 1 360px;
			width: min(360px, 31vw);
			max-width: 360px;
			align-items: center;
			min-width: 0;
		}

		:global(.header-wrapper-style-4 .logo a) {
			display: flex;
			width: 100%;
			height: 94px;
			align-items: center;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block !important;
			width: auto !important;
			max-width: 100% !important;
			height: auto !important;
			max-height: 56px !important;
			object-fit: contain;
		}
	}

	@media (min-width: 768px) and (max-width: 1199.98px) {
		/* The theme exposes its mobile hamburger at tablet widths even though the
		   desktop navigation is still rendered. Keep one coherent desktop row. */
		:global(.header-wrapper-style-4 .mobile-button) {
			display: none !important;
		}
	}

	@media (min-width: 1200px) {
		:global(.header-wrapper-style-4 .header-inner) {
			position: relative;
		}

		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper) {
			display: flex !important;
			align-items: center;
			justify-content: flex-end;
			gap: 4px !important;
		}

		:global(.header-wrapper-style-4 #main-nav) {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			width: max-content;
			margin-right: auto !important;
			margin-left: auto !important;
			transform: none;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li) {
			display: flex;
			height: 94px;
			align-items: center;
		}

		:global(.header-wrapper-style-4 .header-actions) {
			gap: 0 !important;
			margin-left: 4px !important;
		}
	}

	@media (min-width: 1440px) {
		.daynight-desktop-utilities {
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			gap: 0;
		}
	}

	:global(.header-wrapper-style-4 .header-actions) {
		flex: 0 0 auto;
	}

	:global(.header-wrapper-style-4 .header .header-action-btn) {
		border: 0 !important;
		box-sizing: border-box;
		line-height: 1;
	}

	@media (min-width: 992px) {
		:global(.header-wrapper-style-4 .header-button .btn:hover),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible),
		:global(.header-wrapper-style-4 .header-button .btn:active) {
			border-color: var(--bc-hover-accent) !important;
			background: var(--bc-hover-accent) !important;
			background-color: var(--bc-hover-accent) !important;
			color: var(--bc-hover-accent-ink) !important;
			box-shadow: none !important;
			transform: none !important;
		}

		:global(.header-wrapper-style-4 .header-button .btn:hover svg),
		:global(.header-wrapper-style-4 .header-button .btn:hover svg *),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg *) {
			color: currentColor !important;
			stroke: currentColor !important;
		}
	}

	:global(.header-wrapper-style-4 .header #searchToggle),
	:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon) {
		display: inline-flex;
		flex: 0 0 44px;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	:global(.header-wrapper-style-4 .mobile-hidden-header-button) {
		flex: 0 0 auto;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children > .sub-menu) {
		left: 50% !important;
		opacity: 0 !important;
		pointer-events: none !important;
		position: absolute !important;
		top: 100% !important;
		transform: translate(-50%, 15px) !important;
		visibility: hidden !important;
		z-index: 30;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children:hover > .sub-menu),
	:global(
		.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children:focus-within > .sub-menu
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		.header-wrapper-style-4 #main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles
	) {
		align-items: stretch;
		background: #ffffff;
		border: 1px solid #eceff3;
		border-radius: 0 0 18px 18px;
		box-shadow: 0 18px 36px rgba(28, 28, 28, 0.08);
		display: flex !important;
		flex-direction: column !important;
		flex-wrap: nowrap !important;
		gap: 0;
		left: 50vw !important;
		max-width: 1410px !important;
		opacity: 0 !important;
		overflow: hidden;
		padding: 0;
		pointer-events: none !important;
		position: fixed !important;
		right: auto !important;
		top: 94px !important;
		transform: translate(-50%, 15px) !important;
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			visibility 180ms ease;
		visibility: hidden !important;
		width: min(1410px, calc(100vw - 60px)) !important;
		z-index: 30;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static:hover
			.sub-menu.daynight-mega--vehicles
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static:focus-within
			.sub-menu.daynight-mega--vehicles
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		html.daynight-route-nav-click
			.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.daynight-mega--vehicles
	) {
		opacity: 0 !important;
		pointer-events: none !important;
		transition: none !important;
		visibility: hidden !important;
	}

	:global(
		.header-wrapper-style-4
			.header.is-fixed.is-custom
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.daynight-mega--vehicles
	) {
		top: 94px !important;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.daynight-mega--vehicles
			.daynight-mega__content
	) {
		align-items: stretch;
		display: flex;
		gap: 44px;
		padding: 30px 42px 32px;
		width: 100%;
	}

	:global(.daynight-mega__vehicle-panel) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
		width: auto;
	}

	:global(.daynight-mega__vehicles) {
		display: grid !important;
		gap: 18px 26px;
		grid-template-columns: repeat(4, minmax(150px, 1fr));
		width: 100% !important;
	}

	:global(.daynight-mega__links) {
		border-left: 1px solid #e7e7e7;
		display: grid !important;
		flex: 0 0 360px;
		gap: 22px;
		grid-template-columns: repeat(2, minmax(120px, 1fr));
		padding-left: 34px;
		width: 360px !important;
	}

	:global(.daynight-mega__links .sub-menu-item-listing) {
		min-width: 0;
	}

	:global(.daynight-mega__links .sub-menu-item-listing .h5) {
		font-size: 15px;
		line-height: 22px;
		margin-bottom: 12px;
	}

	:global(.daynight-mega__links .sub-menu-item-inner) {
		gap: 10px;
	}

	:global(.daynight-mega__links .sub-menu-item-inner a) {
		color: #5c5e62;
		font-size: 14px;
		line-height: 20px;
	}

	:global(.daynight-mega-car) {
		align-items: center;
		background: transparent;
		border-radius: 8px;
		color: #1c1c1c;
		display: flex !important;
		flex-direction: column;
		min-width: 0;
		padding: 4px 8px 8px !important;
		text-align: center;
		text-decoration: none;
	}

	:global(.daynight-mega-car:hover) {
		background: #f7f7f7;
	}

	:global(.daynight-mega-car__image-wrap) {
		align-items: end;
		display: flex;
		height: 112px;
		justify-content: center;
		margin-bottom: 7px;
		width: 100%;
	}

	:global(.daynight-mega-car__image) {
		display: block;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
	}

	:global(.daynight-mega-car__title) {
		color: #1c1c1c;
		display: block;
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		margin-bottom: 2px;
		white-space: nowrap;
	}

	:global(.daynight-mega-car__meta) {
		color: #5c5e62;
		display: block;
		font-size: 13px;
		line-height: 18px;
		margin-bottom: 8px;
		white-space: nowrap;
	}

	:global(.daynight-mega-car__actions) {
		display: flex;
		gap: 14px;
		justify-content: center;
	}

	:global(.daynight-mega-car__actions span) {
		color: var(--bc-accent);
		font-size: 13px;
		line-height: 18px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	:global(.daynight-mega__footer) {
		align-items: center;
		background: transparent;
		border-top: 1px solid #eceff3;
		display: flex;
		flex: 0 0 auto;
		gap: 22px;
		justify-content: flex-start;
		margin-top: 24px;
		padding: 16px 0 0;
		width: 100%;
	}

	:global(.daynight-mega__footer-button) {
		white-space: nowrap;
	}

	:global(.daynight-mega__footer-copy) {
		border-left: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 22px;
	}

	:global(.daynight-mega__footer-copy strong) {
		color: #1c1c1c;
		font-size: 15px;
		line-height: 22px;
	}

	:global(.daynight-mega__footer-copy span) {
		color: #667085;
		font-size: 13px;
		line-height: 20px;
	}

	@media (max-width: 1199.98px) {
		:global(#main-nav-mobile > ul > li > a) {
			font-family: var(--bc-font-body);
			font-size: 16px;
			font-weight: 500;
			letter-spacing: 0;
			line-height: 24px;
		}

		:global(#main-nav-mobile .sub-menu-item-listing .h5) {
			font-size: 15px;
			font-weight: 500;
			letter-spacing: 0;
			line-height: 22px;
		}

		:global(#main-nav-mobile .sub-menu-item-inner a) {
			font-size: 14px;
			font-weight: 400;
			letter-spacing: 0;
			line-height: 20px;
		}
	}

	@media (min-width: 768px) {
		/* Keep every desktop utility in one interaction family. The legacy theme
		   only applied its accent hover to Compare and Wishlist. */
		:global(.header-wrapper-style-4 .header .daynight-desktop-action) {
			display: inline-flex;
			width: 44px;
			height: 44px;
			min-height: 44px;
			flex: 0 0 44px;
			align-items: center;
			justify-content: center;
			border: 1px solid transparent !important;
			border-radius: 8px !important;
			background: transparent !important;
			color: rgb(255 255 255 / 0.82) !important;
			transition:
				background-color 0.14s ease,
				border-color 0.14s ease,
				color 0.14s ease,
				transform 0.14s ease;
		}

		:global(
			.header-wrapper-style-4 .header .daynight-desktop-action:is(:hover, :focus-visible, :active)
		) {
			border-color: var(--bc-hover-accent) !important;
			background: var(--bc-hover-accent) !important;
			background-color: var(--bc-hover-accent) !important;
			color: var(--bc-hover-accent-ink) !important;
			opacity: 1 !important;
		}

		:global(
			.header-wrapper-style-4
				.header
				#searchToggle.daynight-desktop-action:is(:hover, :focus-visible, :active)
		) {
			border: 1px solid var(--bc-hover-accent) !important;
			background: var(--bc-hover-accent) !important;
			background-color: var(--bc-hover-accent) !important;
		}

		:global(.header-wrapper-style-4 .header #searchToggle.daynight-desktop-action) {
			border: 1px solid transparent !important;
		}

		:global(.header-wrapper-style-4 .header .daynight-desktop-action:active) {
			transform: translateY(1px);
		}

		:global(.header-wrapper-style-4 .header .daynight-desktop-action:focus-visible) {
			outline: 2px solid rgb(255 255 255 / 0.9);
			outline-offset: 2px;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children > .sub-menu),
		:global(
			.header-wrapper-style-4
				#main-nav
				.menu
				> li.menu-item--static
				.sub-menu.daynight-mega--vehicles
		) {
			display: none !important;
			visibility: hidden !important;
			opacity: 0 !important;
			pointer-events: none !important;
		}
	}

	@media (max-width: 767.98px) {
		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles) {
			padding: 0 20px 16px;
		}

		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__content) {
			display: block;
			padding: 0;
		}

		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__vehicle-panel) {
			width: 100%;
		}

		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__vehicles) {
			display: grid;
			gap: 10px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			margin-bottom: 16px;
		}

		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__links) {
			border-left: 0;
			display: grid;
			gap: 14px;
			grid-template-columns: 1fr;
			padding-left: 0;
			width: 100% !important;
		}

		:global(#main-nav-mobile .sub-menu.daynight-mega--vehicles .sub-menu-item-inner a) {
			color: #cfd2d8;
			font-size: 14px;
			line-height: 20px;
			padding-left: 40px;
		}

		:global(#main-nav-mobile .daynight-mega-car) {
			padding: 8px 0 !important;
		}

		:global(#main-nav-mobile .daynight-mega-car__image-wrap) {
			height: 62px;
			margin-bottom: 6px;
		}

		:global(#main-nav-mobile .daynight-mega-car__title) {
			color: #fff;
			font-size: 14px;
			line-height: 20px;
			white-space: normal;
		}

		:global(#main-nav-mobile .daynight-mega-car__meta) {
			display: none;
		}

		:global(#main-nav-mobile .daynight-mega-car__actions) {
			gap: 10px;
		}

		:global(#main-nav-mobile .daynight-mega__footer) {
			align-items: stretch;
			background: transparent;
			border-top: 1px solid rgba(255, 255, 255, 0.12);
			flex-direction: column;
			gap: 10px;
			padding: 14px 0 0;
		}

		:global(#main-nav-mobile .daynight-mega__footer-button) {
			height: 42px;
			width: 100%;
		}

		:global(#main-nav-mobile .daynight-mega__footer-copy) {
			border-left: 0;
			padding-left: 0;
			text-align: center;
		}

		:global(#main-nav-mobile .daynight-mega__footer-copy strong) {
			color: #fff;
			font-size: 13px;
			line-height: 18px;
		}

		:global(#main-nav-mobile .daynight-mega__footer-copy span) {
			color: #cfd2d8;
			font-size: 12px;
			line-height: 17px;
		}
	}

	/* Mobile call/map are icon-only buttons; the text stays as screen-reader-only
	   so the controls remain accessible without showing a visible label. */
	.daynight-mobile-action__label {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		border: 0;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	@media (max-width: 767px) {
		:global(.header-wrapper-style-4) {
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(.header-wrapper-style-4 .header-top-bar),
		:global(.header-wrapper-style-4 .header-button),
		:global(.header-wrapper-style-4 .wrapper-header-button),
		:global(.header-wrapper-style-4 #main-nav),
		:global(.header-wrapper-style-4 .header-search-wrapper),
		:global(.header-wrapper-style-4 .header-action-btn.header-action-icon),
		:global(.header-wrapper-style-4 .mobile-button) {
			display: none !important;
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			background: #090a0b !important;
			border-bottom: 0;
			box-shadow: none;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(.header-wrapper-style-4 .header-container-fluid) {
			height: 56px !important;
			min-height: 56px !important;
			padding: 0 12px 0 15px !important;
		}

		:global(.header-wrapper-style-4 .header-inner) {
			height: 56px;
			min-height: 56px;
			padding-top: 0 !important;
			padding-bottom: 0 !important;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex !important;
			align-items: center;
			flex: 0 1 auto;
			width: auto;
			min-width: 0;
		}

		:global(.header-wrapper-style-4 .logo-mobile) {
			display: none !important;
			visibility: hidden !important;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block !important;
			visibility: visible !important;
			width: 168px !important;
			max-width: 168px;
			height: auto;
			max-height: 48px;
			filter: none;
		}

		:global(.header-wrapper-style-4 .main-nav .logo-mobile) {
			display: none !important;
		}

		:global(.header-wrapper-style-4 .header .header-right-style-2.header-right) {
			width: auto !important;
			margin-left: auto !important;
			gap: 0 !important;
			justify-content: flex-end !important;
		}

		/* Anchored to the right edge so the icon discs stay perfectly round
		   without squeezing the logo on narrow mobile screens. */
		:global(.header-wrapper-style-4 .header-actions) {
			position: absolute;
			top: 6px;
			right: 12px;
			display: flex;
			align-items: center;
			gap: 8px;
			margin-left: 0 !important;
			margin-right: 0 !important;
		}

		.daynight-mobile-call,
		.daynight-mobile-map {
			position: relative;
			display: inline-flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			gap: 0;
			border: 0;
			border-radius: 999px;
			background: transparent;
			box-shadow: none;
			color: #ffffff;
			cursor: pointer;
			isolation: isolate;
			line-height: 1;
			padding: 0;
			text-decoration: none;
			white-space: nowrap;
		}

		.daynight-mobile-call::before,
		.daynight-mobile-map::before {
			position: absolute;
			z-index: -1;
			width: 40px;
			height: 40px;
			border: 1px solid rgba(255, 255, 255, 0.22);
			border-radius: 999px;
			background: #17191b;
			content: '';
		}

		.daynight-mobile-call:focus-visible,
		.daynight-mobile-map:focus-visible {
			outline: 2px solid #ffffff;
			outline-offset: 2px;
		}

		.daynight-mobile-call :global(svg),
		.daynight-mobile-map :global(svg) {
			width: 18px;
			height: 18px;
			flex: 0 0 18px;
			color: currentColor;
			fill: none;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 6px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			filter: none;
		}
	}
</style>
