<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeaderData,
		HomeFiveHeaderNavigationItem,
		HomeFiveHeaderSocial
	} from '$lib/auxero/home-five';
	import { Check, Copy, ExternalLink, MapPin, Phone, PhoneCall, UserRound } from '@lucide/svelte';
	import { tick } from 'svelte';

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
	const logoIntrinsicWidth = 1487;
	const logoIntrinsicHeight = 203;
	const routeNavMegaSuppressionClass = 'eliqauto-route-nav-click';
	let megaMenuSuppressionReadyToClear = false;
	let activeMegaIndex = $state<number | null>(null);
	let languageOpen = $state(false);
	let searchOpen = $state(false);
	let languageToggleEl = $state<HTMLButtonElement | null>(null);
	let searchToggleEl = $state<HTMLButtonElement | null>(null);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let locationToggleEl = $state<HTMLButtonElement | null>(null);
	let phoneToggleEl = $state<HTMLButtonElement | null>(null);
	type ContactPopover = 'location' | 'phone';
	let activeContactPopover = $state<ContactPopover | null>(null);
	let copiedContact = $state<ContactPopover | null>(null);
	let copyingContact = $state<ContactPopover | null>(null);
	let copyAnnouncement = $state('');
	let copyResetTimer: ReturnType<typeof setTimeout> | undefined;
	let skipNextMegaFocusOpen = false;
	const isEnglish = $derived(header?.language.current.toLowerCase().includes('english') ?? false);
	const contactUi = $derived(
		isEnglish
			? {
					call: 'Call now',
					copied: 'Copied',
					copyAddress: 'Copy address',
					copyFailed: 'Could not copy',
					copyPhone: 'Copy number',
					copying: 'Copying…',
					locationTitle: 'Showroom location',
					map: 'Open in Google Maps',
					phoneTitle: 'Sales phone'
				}
			: {
					call: 'Обади се',
					copied: 'Копирано',
					copyAddress: 'Копирай адреса',
					copyFailed: 'Неуспешно копиране',
					copyPhone: 'Копирай номера',
					copying: 'Копиране…',
					locationTitle: 'Локация на автокъщата',
					map: 'Отвори в Google Maps',
					phoneTitle: 'Телефон за продажби'
				}
	);

	const navItemClass = (item: HomeFiveHeaderNavigationItem, index: number) =>
		[
			'menu-item',
			item.megaMenu ? 'menu-item-has-children' : '',
			item.megaMenu?.variant === 'inventory' ? 'menu-item--static' : '',
			activeMegaIndex === index ? 'is-mega-open' : '',
			item.active ? 'current-menu-item menu-item-main' : ''
		]
			.filter(Boolean)
			.join(' ');

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const languageHref = (option: string) =>
		option.toLowerCase().includes('english') ? '?lang=en' : '?lang=bg';
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
	const openMegaMenu = (index: number) => {
		if (skipNextMegaFocusOpen) {
			skipNextMegaFocusOpen = false;
			return;
		}
		activeMegaIndex = index;
		activeContactPopover = null;
		document.documentElement.classList.remove(routeNavMegaSuppressionClass);
		megaMenuSuppressionReadyToClear = false;
	};
	const closeMegaMenu = (index: number) => {
		if (activeMegaIndex === index) activeMegaIndex = null;
	};
	const handleNavLinkClick = (event: MouseEvent, item: HomeFiveHeaderNavigationItem) => {
		if (item.megaMenu) activeMegaIndex = null;

		suppressMegaMenuDuringNavigation(event);
	};
	const handleMegaTriggerKeydown = (
		event: KeyboardEvent,
		item: HomeFiveHeaderNavigationItem,
		index: number
	) => {
		if (!item.megaMenu || ![' ', 'ArrowDown'].includes(event.key)) return;

		event.preventDefault();
		openMegaMenu(index);
		requestAnimationFrame(() => {
			const trigger = event.currentTarget;
			if (!(trigger instanceof HTMLElement)) return;
			trigger.closest('li')?.querySelector<HTMLElement>('.sub-menu a, .sub-menu button')?.focus();
		});
	};
	const toggleLanguage = () => {
		languageOpen = !languageOpen;
		searchOpen = false;
		activeContactPopover = null;
		activeMegaIndex = null;
	};
	const closeLanguage = () => {
		languageOpen = false;
	};
	const toggleHeaderSearch = async () => {
		searchOpen = !searchOpen;
		languageOpen = false;
		activeContactPopover = null;
		activeMegaIndex = null;
		if (searchOpen) {
			await tick();
			searchInputEl?.focus();
		}
	};
	const resetCopyFeedback = () => {
		copiedContact = null;
		copyingContact = null;
		copyAnnouncement = '';
		if (copyResetTimer) clearTimeout(copyResetTimer);
		copyResetTimer = undefined;
	};
	const closeContactPopover = () => {
		activeContactPopover = null;
		resetCopyFeedback();
	};
	const toggleContactPopover = (popover: ContactPopover) => {
		const nextPopover = activeContactPopover === popover ? null : popover;
		resetCopyFeedback();
		activeContactPopover = nextPopover;
		languageOpen = false;
		searchOpen = false;
		activeMegaIndex = null;
	};
	const legacyCopyContactValue = (value: string) => {
		const textarea = document.createElement('textarea');
		textarea.value = value;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.append(textarea);
		textarea.select();
		const copied = document.execCommand('copy');
		textarea.remove();
		return copied;
	};
	const copyContactValue = (popover: ContactPopover, value: string) => {
		let settled = false;
		copyingContact = popover;
		copyAnnouncement = contactUi.copying;
		const finishCopy = (copied: boolean) => {
			if (settled) return;
			settled = true;
			copyingContact = null;
			copiedContact = copied ? popover : null;
			copyAnnouncement = copied ? contactUi.copied : contactUi.copyFailed;
			if (copyResetTimer) clearTimeout(copyResetTimer);
			copyResetTimer = setTimeout(resetCopyFeedback, 1800);
		};

		if (!navigator.clipboard?.writeText) {
			finishCopy(legacyCopyContactValue(value));
			return;
		}

		const fallbackTimer = setTimeout(() => finishCopy(legacyCopyContactValue(value)), 400);
		navigator.clipboard.writeText(value).then(
			() => {
				clearTimeout(fallbackTimer);
				finishCopy(true);
			},
			() => {
				clearTimeout(fallbackTimer);
				finishCopy(legacyCopyContactValue(value));
			}
		);
	};
	const copyAddress = () => {
		if (header) copyContactValue('location', header.contact.addressDetail);
	};
	const copyPhone = () => {
		if (header) copyContactValue('phone', header.contact.phoneLabel);
	};
	const handleDocumentClick = (event: MouseEvent) => {
		if (!activeContactPopover) return;
		if (
			event
				.composedPath()
				.some((node) => node instanceof Element && node.classList.contains('eliqauto-top-contact'))
		) {
			return;
		}
		closeContactPopover();
	};
	const handleHeaderKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		const megaIndexToRestore = activeMegaIndex;
		const controlToRestore = searchOpen
			? searchToggleEl
			: languageOpen
				? languageToggleEl
				: activeContactPopover === 'location'
					? locationToggleEl
					: activeContactPopover === 'phone'
						? phoneToggleEl
						: null;
		if (activeMegaIndex !== null) {
			document.documentElement.classList.add(routeNavMegaSuppressionClass);
			megaMenuSuppressionReadyToClear = false;
			skipNextMegaFocusOpen = true;
		}
		activeMegaIndex = null;
		languageOpen = false;
		searchOpen = false;
		closeContactPopover();
		requestAnimationFrame(() => {
			if (megaIndexToRestore !== null) {
				document
					.querySelectorAll<HTMLElement>('#main-nav .menu > li > a')
					.item(megaIndexToRestore)
					.focus();
				skipNextMegaFocusOpen = false;
				return;
			}
			controlToRestore?.focus();
		});
	};
</script>

<svelte:window onkeydown={handleHeaderKeydown} />
<svelte:document onclick={handleDocumentClick} />

{#if header}
	<!-- Header -->
	<div class="header-wrapper-style-4">
		<header class="header header-style-4" id="header_main">
			<div class="header-top-bar bg-primary relative">
				<div class="topbar-container header-spacing md-w-full md-min-w-full max-w-1920">
					<div class="flex items-center gap-24">
						<div class="md-gap-8 md flex gap-24">
							<div
								class="eliqauto-top-contact"
								onfocusout={(event) => {
									if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
										closeContactPopover();
									}
								}}
							>
								<button
									type="button"
									class="eliqauto-top-contact-link effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
									bind:this={locationToggleEl}
									aria-expanded={activeContactPopover === 'location'}
									aria-controls="eliqauto-location-popover"
									aria-haspopup="dialog"
									onclick={() => toggleContactPopover('location')}
								>
									<span class="eliqauto-top-contact-icon" aria-hidden="true">
										<MapPin size={20} strokeWidth={2} aria-hidden="true" />
									</span>
									{header.contact.addressLabel}
								</button>

								{#if activeContactPopover === 'location'}
									<div
										class="eliqauto-contact-popover"
										id="eliqauto-location-popover"
										role="dialog"
										aria-labelledby="eliqauto-location-popover-title"
									>
										<strong id="eliqauto-location-popover-title">{contactUi.locationTitle}</strong>
										<span class="eliqauto-contact-popover__value"
											>{header.contact.addressDetail}</span
										>
										<div class="eliqauto-contact-popover__actions">
											<a
												class="eliqauto-contact-popover__action eliqauto-contact-popover__action--primary"
												{...hrefAttributes(header.contact.mapHref)}
												target="_blank"
												rel="noreferrer"
											>
												<ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
												<span>{contactUi.map}</span>
											</a>
											<button
												type="button"
												class="eliqauto-contact-popover__action"
												onclick={copyAddress}
											>
												{#if copiedContact === 'location'}
													<Check size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copied}</span>
												{:else if copyingContact === 'location'}
													<Copy size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copying}</span>
												{:else}
													<Copy size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copyAddress}</span>
												{/if}
											</button>
										</div>
									</div>
								{/if}
							</div>

							<div
								class="eliqauto-top-contact"
								onfocusout={(event) => {
									if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
										closeContactPopover();
									}
								}}
							>
								<button
									type="button"
									class="eliqauto-top-contact-link effect-svg-hover h7 md-text-0 flex items-center gap-8 text-white"
									bind:this={phoneToggleEl}
									aria-expanded={activeContactPopover === 'phone'}
									aria-controls="eliqauto-phone-popover"
									aria-haspopup="dialog"
									onclick={() => toggleContactPopover('phone')}
								>
									<span
										class="eliqauto-top-contact-icon eliqauto-top-contact-icon--accent"
										aria-hidden="true"
									>
										<Phone size={20} strokeWidth={2} aria-hidden="true" />
									</span>
									{header.contact.phoneLabel}
								</button>

								{#if activeContactPopover === 'phone'}
									<div
										class="eliqauto-contact-popover"
										id="eliqauto-phone-popover"
										role="dialog"
										aria-labelledby="eliqauto-phone-popover-title"
									>
										<strong id="eliqauto-phone-popover-title">{contactUi.phoneTitle}</strong>
										<span class="eliqauto-contact-popover__value">{header.contact.phoneLabel}</span>
										<div class="eliqauto-contact-popover__actions">
											<a
												class="eliqauto-contact-popover__action eliqauto-contact-popover__action--primary"
												{...hrefAttributes(header.contact.phoneHref)}
											>
												<PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
												<span>{contactUi.call}</span>
											</a>
											<button
												type="button"
												class="eliqauto-contact-popover__action"
												onclick={copyPhone}
											>
												{#if copiedContact === 'phone'}
													<Check size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copied}</span>
												{:else if copyingContact === 'phone'}
													<Copy size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copying}</span>
												{:else}
													<Copy size={16} strokeWidth={2} aria-hidden="true" />
													<span>{contactUi.copyPhone}</span>
												{/if}
											</button>
										</div>
									</div>
								{/if}
							</div>

							<span class="eliqauto-contact-live" aria-live="polite">{copyAnnouncement}</span>
						</div>

						<div class="divider-vertical lg-hidden h-24"></div>

						<div>
							<div
								class={['core-dropdown language-select', languageOpen && 'active']}
								id="language-select"
								onfocusout={(event) => {
									if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
										closeLanguage();
									}
								}}
							>
								<button
									class="core-dropdown__button text-white"
									type="button"
									bind:this={languageToggleEl}
									aria-expanded={languageOpen}
									aria-controls="coreDropdownMenu"
									onclick={toggleLanguage}
								>
									<span class="core-dropdown__label text-white">{header.language.current}</span>
									{@render chevronIcon('#fff')}
								</button>
								<div class="core-dropdown__menu" id="coreDropdownMenu">
									<ul class="core-dropdown__list">
										{#each header.language.options as option (option)}
											<li class="cursor-pointer text-sm">
												<a {...hrefAttributes(languageHref(option))} onclick={closeLanguage}
													>{option}</a
												>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div
						class="eliqauto-topbar-right header-top-bar--socical-wrapper flex items-center gap-24"
					>
						<a
							{...hrefAttributes(header.contact.emailHref)}
							class="effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
						>
							{@render mailIcon()}
							{header.contact.emailLabel}
						</a>

						<ul class="header-top-bar--socical pl-24">
							{#each header.socialLinks as link (link.label)}
								<li>
									<a
										{...hrefAttributes(link.href)}
										class="effect-svg-hover"
										aria-label={link.label}
									>
										{@render socialIcon(link)}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

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
						style={hideMobileLogo ? 'display: none; visibility: hidden;' : ''}
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
								{#each header.navigation as item, navIndex (item.href + '-' + navIndex)}
									<li
										class={navItemClass(item, navIndex)}
										onpointerenter={() => item.megaMenu && openMegaMenu(navIndex)}
										onpointerleave={() => item.megaMenu && closeMegaMenu(navIndex)}
										onfocusin={() => item.megaMenu && openMegaMenu(navIndex)}
										onfocusout={(event) => {
											if (
												item.megaMenu &&
												!event.currentTarget.contains(event.relatedTarget as Node | null)
											) {
												closeMegaMenu(navIndex);
											}
										}}
									>
										<a
											href={resolve(item.href as '/')}
											aria-haspopup={item.megaMenu ? 'true' : undefined}
											aria-expanded={item.megaMenu ? activeMegaIndex === navIndex : undefined}
											onclick={(event) => handleNavLinkClick(event, item)}
											onkeydown={(event) => handleMegaTriggerKeydown(event, item, navIndex)}
										>
											{item.label}
											{#if item.megaMenu}
												{@render chevronIcon('#1C1C1C')}
											{/if}
										</a>

										{#if item.megaMenu}
											{#if item.megaMenu.variant === 'inventory'}
												<div
													class="sub-menu sub-menu--full sub-menu--listing eliqauto-mega eliqauto-mega--vehicles"
												>
													<div class="eliqauto-mega__content">
														<div class="eliqauto-mega__vehicle-panel">
															<div class="sub-menu--listing-nav eliqauto-mega__vehicles">
																{#each item.megaMenu.vehicles as vehicle, vi (vehicle.href + '-' + vi)}
																	<a
																		class="eliqauto-mega-car"
																		href={resolve(vehicle.href as '/')}
																		onclick={suppressMegaMenuDuringNavigation}
																	>
																		<span class="eliqauto-mega-car__image-wrap">
																			<img
																				class="eliqauto-mega-car__image"
																				src={vehicle.image}
																				alt={vehicle.label}
																				width="280"
																				height="170"
																				loading="lazy"
																				decoding="async"
																			/>
																		</span>
																		<span class="eliqauto-mega-car__title" title={vehicle.label}>
																			{vehicle.label}
																		</span>
																		<span class="eliqauto-mega-car__meta">{vehicle.meta}</span>
																		<span class="eliqauto-mega-car__actions">
																			<span>{header.ui.megaView}</span>
																			<span>{header.ui.megaDetails}</span>
																		</span>
																	</a>
																{/each}
															</div>

															<div class="eliqauto-mega__footer">
																<a
																	href={resolve(item.megaMenu.footer.ctaHref as '/')}
																	class="btn btn-primary btn-medium font-weight-600 eliqauto-mega__footer-button"
																	onclick={suppressMegaMenuDuringNavigation}
																>
																	{item.megaMenu.footer.ctaLabel}
																</a>
																<div class="eliqauto-mega__footer-copy">
																	<strong>{item.megaMenu.footer.title}</strong>
																	<span>{item.megaMenu.footer.copy}</span>
																</div>
															</div>
														</div>

														<div class="sub-menu--listing-image eliqauto-mega__links">
															{#each item.megaMenu.sections as section (section.title)}
																<div class="sub-menu-item-listing">
																	<p class="h5 menu-item-inner-title mb-16">
																		{section.title}
																		{@render subMenuTitleChevronIcon()}
																	</p>
																	<ul class="sub-menu-item-inner flex flex-col gap-16">
																		{#each section.links as link, li (link.href + '-' + li)}
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
														{#each item.megaMenu.links as link, mli (link.href + '-' + mli)}
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

						{#if showAddListing}
							<div class="header-button mobile-hidden-header-button flex items-center gap-20">
								<!-- Add Listing Button -->
								<a
									href={resolve(addListingHref as '/')}
									class="btn btn-primary btn-large font-weight-600"
								>
									{@render plusCircleIcon('#fff')}
									{header.ui.addListing}
								</a>
								<!-- Add Listing Button -->
							</div>
						{/if}

						<div class="header-actions ml-20">
							{#if hasLocationSheet}
								<label
									for="eliqauto-mobile-location-toggle"
									class="eliqauto-mobile-map"
									aria-label={header.contact.addressLabel}
									aria-controls="eliqauto-mobile-location-panel"
									aria-haspopup="dialog"
									title={header.contact.addressLabel}
								>
									<MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
									<span class="eliqauto-mobile-action__label">Карта</span>
								</label>
							{:else}
								<a
									{...hrefAttributes(header.contact.addressHref)}
									class="eliqauto-mobile-map"
									aria-label={header.contact.addressLabel}
									title={header.contact.addressLabel}
								>
									<MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
									<span class="eliqauto-mobile-action__label">Карта</span>
								</a>
							{/if}
							<a
								{...hrefAttributes(header.contact.phoneHref)}
								class="eliqauto-mobile-call"
								aria-label={header.contact.phoneLabel}
								title={header.contact.phoneLabel}
							>
								<Phone size={20} strokeWidth={1.8} aria-hidden="true" />
								<span class="eliqauto-mobile-action__label">Обади се</span>
							</a>
							<div class="header-search-wrapper">
								<button
									type="button"
									class="header-action-btn relative"
									id="searchToggle"
									bind:this={searchToggleEl}
									aria-label={header.ui.searchPlaceholder}
									aria-expanded={searchOpen}
									aria-controls="searchForm"
									onclick={toggleHeaderSearch}
								>
									{@render searchIcon('#1C1C1C')}
								</button>
								<!-- Search Form -->
								<div class={['search-form', searchOpen && 'active']} id="searchForm">
									<form
										class="search-form__form"
										action="/inventory"
										method="get"
										data-eliqauto-search-form="inventory"
									>
										<input
											type="text"
											class="search-form__input"
											name="q"
											placeholder={header.ui.searchPlaceholder}
											autocomplete="off"
											id="searchInput"
											bind:this={searchInputEl}
										/>
									</form>
								</div>
								<!-- Search Form -->
							</div>

							<a
								href={resolve('/compare')}
								class="header-action-btn header-action-icon"
								aria-label={header.ui.compare}
								data-badge={header.actionBadges.compare}
							>
								{@render compareIcon('#1C1C1C')}
							</a>

							<a
								href={resolve('/account/favorites')}
								class="header-action-btn header-action-icon"
								aria-label={header.ui.wishlist}
								data-badge={header.actionBadges.wishlist}
							>
								{@render heartIcon('#1C1C1C')}
							</a>

							<a
								href={resolve('/account')}
								class="header-action-btn eliqauto-account-action open-modal"
								data-modal-id="#LoginModal"
								aria-label={header.ui.signIn}
								title={header.ui.signIn}
							>
								<UserRound size={24} strokeWidth={1.8} aria-hidden="true" />
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
						class="btn btn-primary-3 btn-large font-weight-600 open-modal eliqauto-sign-in"
						data-modal-id="#LoginModal"
					>
						<UserRound size={20} strokeWidth={1.8} aria-hidden="true" />
						<span class="eliqauto-sign-in__label">{header.ui.signIn}</span>
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
	<!-- Header -->
{/if}

{#snippet chevronIcon(stroke: string)}
	<svg
		class="chevron-down icon-chevron"
		width="12"
		height="8"
		viewBox="0 0 12 8"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.5 1.75L6 6.25L10.5 1.75"
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

{#snippet mailIcon()}
	<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M15.4688 0H0.46875C0.34443 0 0.225201 0.049386 0.137294 0.137294C0.049386 0.225201 0 0.34443 0 0.46875V11.0938C0 11.3838 0.115234 11.662 0.320352 11.8671C0.52547 12.0723 0.803669 12.1875 1.09375 12.1875H14.8438C15.1338 12.1875 15.412 12.0723 15.6171 11.8671C15.8223 11.662 15.9375 11.3838 15.9375 11.0938V0.46875C15.9375 0.34443 15.8881 0.225201 15.8002 0.137294C15.7123 0.049386 15.5931 0 15.4688 0ZM7.96875 6.70781L1.67344 0.9375H14.2641L7.96875 6.70781ZM5.91172 6.09375L0.9375 10.6531V1.53437L5.91172 6.09375ZM6.60547 6.72969L7.65625 7.68906C7.74266 7.76812 7.85554 7.81196 7.97266 7.81196C8.08978 7.81196 8.20265 7.76812 8.28906 7.68906L9.33594 6.72969L14.2641 11.25H1.67422L6.60547 6.72969ZM10.0258 6.09375L15 1.53437V10.6531L10.0258 6.09375Z"
			fill="white"
		/>
	</svg>
{/snippet}

{#snippet socialIcon(link: HomeFiveHeaderSocial)}
	{#if link.icon === 'x'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.89687 11.2129L3.75 16.8746"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.2484 3.125L11.1016 8.78672"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if link.icon === 'instagram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path
				d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path
				d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z"
				fill="white"
			/>
		</svg>
	{:else if link.icon === 'youtube'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.5 7.5C17.5 6.39543 16.6046 5.5 15.5 5.5H4.5C3.39543 5.5 2.5 6.39543 2.5 7.5V12.5C2.5 13.6046 3.39543 14.5 4.5 14.5H15.5C16.6046 14.5 17.5 13.6046 17.5 12.5V7.5Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path d="M8.75 7.75L12.5 10L8.75 12.25V7.75Z" fill="white" />
		</svg>
	{:else if link.icon === 'telegram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.25 10.5375L17.4539 2.50781"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.24382 16.4932C7.81923 17.405 9.67248 17.7127 11.458 17.359C13.2436 17.0053 14.8396 16.0143 15.9484 14.5708C17.0573 13.1273 17.6033 11.3298 17.4847 9.51341C17.3662 7.69704 16.5911 5.98577 15.304 4.69866C14.0169 3.41156 12.3056 2.63646 10.4892 2.51789C8.67284 2.39932 6.87533 2.94537 5.43182 4.05422C3.98831 5.16308 2.99733 6.75906 2.64363 8.54461C2.28993 10.3302 2.59766 12.1834 3.50944 13.7588L2.5321 16.6768C2.49538 16.7869 2.49005 16.9051 2.51671 17.0181C2.54337 17.131 2.60097 17.2344 2.68306 17.3165C2.76514 17.3985 2.86847 17.4561 2.98145 17.4828C3.09443 17.5095 3.2126 17.5041 3.32273 17.4674L6.24382 16.4932Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
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
	:global(.header-wrapper-style-4) {
		--eliqauto-header-topbar-height: 48px;
		--eliqauto-header-nav-height: 80px;
		--eliqauto-header-height: calc(
			var(--eliqauto-header-topbar-height) + var(--eliqauto-header-nav-height)
		);
		position: relative;
		z-index: 100;
		font-family: var(--bc-font-body);
		-webkit-font-smoothing: auto;
		-moz-osx-font-smoothing: auto;
		text-rendering: optimizeLegibility;
	}

	:global(.header-wrapper-style-4 svg) {
		shape-rendering: geometricPrecision;
	}

	:global(.header-wrapper-style-4 svg [stroke]) {
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}

	:global(.header-wrapper-style-4 .icon-chevron) {
		display: block;
		width: 12px;
		height: 8px;
		flex: 0 0 12px;
		margin-left: 5px;
		overflow: visible;
		transform: translateY(-1px);
	}

	:global(.header-wrapper-style-4 .icon-chevron [stroke]) {
		stroke-width: 1.5;
		vector-effect: none;
	}

	/* Own the header's structural layout here. The legacy template and Tailwind
	   both expose generic utility names (for example gap-24), so relying on either
	   utility scale made the public header change when route CSS was loaded. */
	:global(.header-wrapper-style-4 .header-top-bar) {
		display: flex;
		height: var(--eliqauto-header-topbar-height);
		align-items: center;
		background: #1c1c1c;
		padding-block: 0;
	}

	:global(.header-wrapper-style-4 .topbar-container),
	:global(.header-wrapper-style-4 .header-container-fluid) {
		width: 100%;
		max-width: 1920px;
		margin-right: auto;
		margin-left: auto;
		padding-right: 45px;
		padding-left: 45px;
	}

	:global(.header-wrapper-style-4 .topbar-container),
	:global(.header-wrapper-style-4 .header-inner),
	:global(.header-wrapper-style-4 .header-right),
	:global(.header-wrapper-style-4 .header-actions),
	:global(.header-wrapper-style-4 .header-top-bar--socical),
	:global(.header-wrapper-style-4 .header-top-bar--socical-wrapper) {
		display: flex;
		align-items: center;
	}

	:global(.header-wrapper-style-4 .topbar-container),
	:global(.header-wrapper-style-4 .header-inner) {
		justify-content: space-between;
	}

	:global(.header-wrapper-style-4 .gap-24) {
		gap: 20px;
	}

	:global(.header-wrapper-style-4 .gap-20) {
		gap: 20px;
	}

	:global(.header-wrapper-style-4 .gap-8) {
		gap: 8px;
	}

	:global(.header-wrapper-style-4 .header-top-bar--socical) {
		gap: 16px;
		border-left: 1px solid rgba(255, 255, 255, 0.12);
		padding-left: 24px;
	}

	:global(.header-wrapper-style-4 .header-top-bar--socical li),
	:global(.header-wrapper-style-4 .header-top-bar--socical li a) {
		width: 20px;
		height: 20px;
	}

	:global(.header-wrapper-style-4 #menu-primary-menu) {
		display: flex;
		align-items: center;
		gap: 26px;
	}

	:global(.header-wrapper-style-4 #menu-primary-menu > li) {
		margin: 0;
	}

	:global(.header-wrapper-style-4 .header-actions) {
		gap: 18px;
	}

	:global(.header-wrapper-style-4 .header-button .btn) {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 1px solid var(--bc-accent);
		border-radius: 12px;
		background: var(--bc-accent);
		color: var(--bc-white);
		padding: 0 22px;
	}

	:global(.header-wrapper-style-4 .header-button .eliqauto-sign-in) {
		display: inline-grid;
		grid-template-columns: 20px max-content;
		height: 48px;
		align-items: center;
		column-gap: 8px;
		padding-inline: 20px;
		font-size: 18px;
		font-weight: var(--bc-weight-semibold);
		letter-spacing: 0;
		line-height: 24px;
	}

	:global(.header-wrapper-style-4 .eliqauto-sign-in svg) {
		display: block;
		width: 20px;
		height: 20px;
		place-self: center;
	}

	:global(.header-wrapper-style-4 .eliqauto-sign-in svg [stroke]) {
		stroke-width: 1.8;
		vector-effect: none;
	}

	:global(.header-wrapper-style-4 .header-button .btn.eliqauto-sign-in .eliqauto-sign-in__label) {
		display: block;
		font-size: 18px;
		font-weight: var(--bc-weight-semibold);
		letter-spacing: 0;
		line-height: 24px;
	}

	:global(.header-wrapper-style-4 .header.header-style-4) {
		position: relative;
		overflow: visible;
		z-index: 100;
	}

	:global(.header-wrapper-style-4 .search-form) {
		z-index: 120;
	}

	/* WCAG 2.2 target size: the 20px topbar icons and mega-menu links get a
	   bigger hit box via padding pulled back with negative margins, so the
	   visual layout does not move. */
	.header-top-bar--socical a,
	.eliqauto-topbar-right > a,
	.eliqauto-top-contact-link {
		height: auto;
		min-height: var(--bc-touch);
		align-items: center;
		padding-block: 8px;
		margin-block: 0;
	}

	.header-top-bar--socical a {
		display: inline-flex;
	}

	.sub-menu-item-inner li a {
		display: inline-flex;
		height: auto;
		min-height: var(--bc-touch);
		align-items: center;
		padding-block: 10px;
		margin-block: 0;
	}

	.eliqauto-top-contact-link {
		appearance: none;
		border: 0;
		background: transparent;
		color: var(--bc-white);
		cursor: pointer;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: var(--bc-weight-regular);
		letter-spacing: 0;
		line-height: 24px;
		text-align: left;
		transition:
			color 180ms ease,
			opacity 180ms ease;
	}

	.eliqauto-top-contact {
		position: relative;
		display: flex;
		align-items: center;
	}

	.eliqauto-top-contact-icon {
		display: inline-flex;
		width: 20px;
		height: 20px;
		flex: 0 0 20px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: var(--bc-white);
		transition: opacity 180ms ease;
	}

	.eliqauto-top-contact-icon--accent {
		color: var(--bc-white);
	}

	.eliqauto-top-contact-icon :global(svg) {
		display: block;
		width: 20px;
		height: 20px;
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-top-contact-icon :global(svg *) {
		stroke: currentColor;
	}

	.eliqauto-top-contact-link:hover .eliqauto-top-contact-icon,
	.eliqauto-top-contact-link:focus-visible .eliqauto-top-contact-icon {
		opacity: 0.72;
	}

	.eliqauto-topbar-right {
		justify-content: flex-end;
	}

	.eliqauto-contact-popover {
		position: absolute;
		top: calc(100% + 9px);
		left: 0;
		z-index: 160;
		display: grid;
		width: 286px;
		gap: 5px;
		border: 1px solid var(--bc-popover-border);
		border-radius: 12px;
		background: var(--bc-popover-bg);
		box-shadow: var(--bc-popover-shadow);
		color: #18181b;
		padding: 14px;
	}

	.eliqauto-contact-popover strong {
		font-size: 16px;
		font-weight: var(--bc-weight-semibold);
		line-height: 20px;
	}

	.eliqauto-contact-popover__value {
		color: var(--bc-popover-muted);
		font-size: 14px;
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
	}

	.eliqauto-contact-popover__actions {
		display: grid;
		gap: 6px;
		margin-top: 7px;
	}

	.header-top-bar .eliqauto-contact-popover__action {
		display: flex;
		width: 100%;
		min-height: 38px;
		align-items: center;
		gap: 9px;
		border: 0;
		border-radius: 8px;
		background: var(--bc-popover-surface);
		color: #27272a;
		cursor: pointer;
		font-family: var(--bc-font-body);
		font-size: 14px;
		font-weight: var(--bc-weight-semibold);
		line-height: 20px;
		padding: 9px 11px;
		text-align: left;
		text-decoration: none;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	.header-top-bar .eliqauto-contact-popover__action:hover,
	.header-top-bar .eliqauto-contact-popover__action:focus-visible {
		background: var(--bc-popover-chip-hover);
		color: #18181b;
	}

	.header-top-bar .eliqauto-contact-popover__action--primary,
	.header-top-bar .eliqauto-contact-popover__action--primary:hover,
	.header-top-bar .eliqauto-contact-popover__action--primary:focus-visible {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.header-top-bar .eliqauto-contact-popover__action:focus-visible {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.eliqauto-contact-live {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		border: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.eliqauto-mobile-call,
	.eliqauto-mobile-map {
		display: none;
	}

	:global(#language-select:not(.active) #coreDropdownMenu) {
		opacity: 0;
		pointer-events: none;
		transform: translateY(-10px);
		transition: none;
		visibility: hidden;
	}

	:global(#language-select.active #coreDropdownMenu) {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
		visibility: visible;
	}

	:global(#language-select .core-dropdown__list a) {
		display: block;
		width: 100%;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		padding: 0;
		text-align: left;
	}

	@media (min-width: 768px) {
		:global(.header-wrapper-style-4 .header-top-bar) {
			font-family: var(--bc-font-body);
		}

		:global(.header-wrapper-style-4 .header-top-bar .eliqauto-top-contact-link),
		:global(.header-wrapper-style-4 .header-top-bar .eliqauto-topbar-right > a),
		:global(.header-wrapper-style-4 .header-top-bar .core-dropdown__button),
		:global(.header-wrapper-style-4 .header-top-bar .core-dropdown__label),
		:global(.header-wrapper-style-4 .header-top-bar .core-dropdown__list li) {
			font-family: var(--bc-font-body);
			font-size: 16px;
			font-weight: var(--bc-weight-regular);
			letter-spacing: 0;
			line-height: 24px;
		}

		:global(.header-wrapper-style-4 .header-top-bar .h7) {
			font-family: var(--bc-font-body);
			font-size: 16px;
			font-weight: var(--bc-weight-regular);
			line-height: 24px;
		}
	}

	:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon::after) {
		top: 2px;
		right: 2px;
		min-width: 18px;
		height: 18px;
		border: 2px solid #ffffff;
		background: var(--bc-accent);
		box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
		color: #1c1c1c;
		font-size: 11px;
		font-weight: 700;
	}

	@media (min-width: 768px) {
		:global(.header-wrapper-style-4) {
			height: var(--eliqauto-header-height);
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			height: var(--eliqauto-header-height);
			min-height: var(--eliqauto-header-height);
			border-bottom: 1px solid #e7e7e7;
			background: #ffffff;
		}

		:global(.header-wrapper-style-4 .header-top-bar) {
			height: var(--eliqauto-header-topbar-height);
			min-height: var(--eliqauto-header-topbar-height);
		}

		/* Sticky state: the theme only visibility-hides the top bar, so its utility row
		   kept inflating the fixed header. Collapse it and shrink to the nav row. */
		:global(.header-wrapper-style-4 .header.header-style-4.is-fixed) {
			height: var(--eliqauto-header-nav-height);
			min-height: var(--eliqauto-header-nav-height);
			background: #ffffff;
		}

		:global(.header-wrapper-style-4 .header.header-style-4.is-fixed .header-top-bar) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header-container-fluid),
		:global(.header-wrapper-style-4 .header-inner),
		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper),
		:global(.header-wrapper-style-4 #main-nav) {
			height: var(--eliqauto-header-nav-height);
			min-height: var(--eliqauto-header-nav-height);
		}

		:global(.header-wrapper-style-4 .header-container-fluid) {
			background: #ffffff;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a) {
			align-items: center;
			border: 0;
			box-sizing: border-box;
			display: inline-flex;
			position: relative;
			color: #171a1d;
			font-family: var(--bc-font-body);
			font-size: 18px;
			font-weight: var(--bc-weight-medium);
			height: var(--eliqauto-header-nav-height);
			letter-spacing: 0;
			line-height: 24px;
			padding-bottom: 0;
			padding-top: 0;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a:hover),
		:global(.header-wrapper-style-4 #main-nav .menu > li > a:focus-visible),
		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a) {
			color: #000000;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a) {
			color: var(--bc-accent);
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a .icon-chevron),
		:global(.header-wrapper-style-4 #main-nav .menu > li > a .icon-chevron path) {
			color: currentColor;
			stroke: currentColor;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a::before) {
			display: none;
			content: none;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a::after) {
			position: absolute;
			bottom: 17px;
			left: 50%;
			display: block;
			width: 28px;
			height: 2px;
			border-radius: 999px;
			background: currentColor;
			content: '';
			opacity: 0;
			transform: translateX(-50%);
			transition: opacity 0.16s ease;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li.current-menu-item > a::after) {
			opacity: 1;
		}

		:global(.header-wrapper-style-4 .header-actions .header-action-btn) {
			color: #171a1d;
		}

		:global(.header-wrapper-style-4 .header-actions .header-action-btn svg),
		:global(.header-wrapper-style-4 .header-actions .header-action-btn svg *) {
			color: currentColor;
			stroke: currentColor;
		}

		:global(.header-wrapper-style-4 .logo),
		:global(.header-wrapper-style-4 .logo a),
		:global(.header-wrapper-style-4 .logo img) {
			border: 0;
			box-sizing: border-box;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex;
			flex: 0 1 270px;
			width: min(270px, 27vw);
			max-width: 270px;
			align-items: center;
			min-width: 0;
		}

		:global(.header-wrapper-style-4 .logo a) {
			display: flex;
			width: 100%;
			height: var(--eliqauto-header-nav-height);
			align-items: center;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block;
			width: min(220px, 100%);
			max-width: 220px;
			height: auto;
			max-height: 36px;
			object-fit: contain;
			filter: none;
		}
	}

	@media (min-width: 1200px) {
		:global(.header-wrapper-style-4 .header-inner) {
			position: relative;
		}

		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper) {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 18px;
		}

		:global(.header-wrapper-style-4 #main-nav) {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			width: max-content;
			margin-right: auto;
			margin-left: auto;
			transform: none;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li) {
			display: flex;
			height: var(--eliqauto-header-nav-height);
			align-items: center;
		}

		:global(.header-wrapper-style-4 .header-actions) {
			margin-left: 18px;
		}
	}

	@media (min-width: 1440px) {
		:global(.header-wrapper-style-4 #main-nav .menu > li > a) {
			font-size: 18px;
		}

		:global(.header-wrapper-style-4 .header-button .btn) {
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-semibold);
			letter-spacing: 0;
			line-height: var(--bc-leading-header-cta, 1.15);
		}
	}

	:global(.header-wrapper-style-4 .header-actions) {
		flex: 0 0 auto;
	}

	:global(.header-wrapper-style-4 .header .header-action-btn) {
		border: 0;
		background: transparent;
		box-sizing: border-box;
		cursor: pointer;
		line-height: 1;
	}

	:global(.header-wrapper-style-4 .header-button .btn) {
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-semibold);
		letter-spacing: 0;
		line-height: var(--bc-leading-header-cta, 1.15);
	}

	@media (min-width: 1440px) {
		:global(.header-wrapper-style-4 .header-button .btn) {
			font-size: var(--bc-text-control);
		}
	}

	:global(.header-wrapper-style-4 .header-button .btn.eliqauto-sign-in) {
		font-size: 18px;
		line-height: 24px;
	}

	@media (min-width: 992px) {
		:global(.header-wrapper-style-4 .header-button .btn:hover),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible),
		:global(.header-wrapper-style-4 .header-button .btn:active) {
			border-color: var(--bc-hover-accent);
			background: var(--bc-hover-accent);
			background-color: var(--bc-hover-accent);
			color: var(--bc-hover-accent-ink);
			box-shadow: none;
			transform: none;
		}

		:global(.header-wrapper-style-4 .header-button .btn:hover svg),
		:global(.header-wrapper-style-4 .header-button .btn:hover svg *),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg *) {
			color: currentColor;
			stroke: currentColor;
		}
	}

	:global(.header-wrapper-style-4 .header #searchToggle),
	:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon),
	:global(.header-wrapper-style-4 .header .eliqauto-account-action) {
		display: inline-flex;
		flex: 0 0 var(--bc-touch);
		width: var(--bc-touch);
		height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	:global(.header-wrapper-style-4 .mobile-hidden-header-button) {
		flex: 0 0 auto;
	}

	/* The theme reveals its hamburger below 1200px but leaves the full desktop
	   navigation mounted, which causes the logo and menu to collide on tablets.
	   Switch that range to the compact navigation controls as one coherent mode. */
	@media (min-width: 768px) and (max-width: 1199.98px) {
		:global(.header-wrapper-style-4 .header-inner > .logo-mobile) {
			display: none;
		}

		:global(.header-wrapper-style-4 #main-nav),
		:global(.header-wrapper-style-4 .mobile-hidden-header-button) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper) {
			width: auto;
			margin-left: auto;
			justify-content: flex-end;
		}

		:global(.header-wrapper-style-4 .header-actions) {
			margin-left: 0;
		}
	}

	@media (min-width: 768px) and (max-width: 991.98px) {
		:global(.header-wrapper-style-4) {
			height: var(--eliqauto-header-nav-height);
		}

		:global(.header-wrapper-style-4 .header-top-bar) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			height: var(--eliqauto-header-nav-height);
			min-height: var(--eliqauto-header-nav-height);
		}
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children > .sub-menu) {
		left: 50%;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		top: 100%;
		transform: translate(-50%, 15px);
		visibility: hidden;
		z-index: 30;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children:hover > .sub-menu),
	:global(
		.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children.is-mega-open > .sub-menu
	) {
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, 0);
		visibility: visible;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li > .sub-menu.sub-menu--container a) {
		border-radius: 0;
		color: #45484d;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 22px;
		padding: 10px 20px;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li > .sub-menu.sub-menu--container) {
		border: 1px solid #e6e8eb;
		border-top: 0;
		border-radius: 0;
		background: #ffffff;
		box-shadow: 0 18px 32px -18px rgba(17, 24, 39, 0.28);
		padding: 8px 0;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li > .sub-menu.sub-menu--container a:hover),
	:global(
		.header-wrapper-style-4 #main-nav .menu > li > .sub-menu.sub-menu--container a:focus-visible
	) {
		background: var(--bc-surface);
		color: #111318;
	}

	:global(
		.header-wrapper-style-4 #main-nav .menu > li.menu-item--static .sub-menu.eliqauto-mega--vehicles
	) {
		align-items: stretch;
		background: #ffffff;
		border: 0;
		border-radius: 0;
		box-shadow: 0 22px 44px -22px rgba(17, 24, 39, 0.3);
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		gap: 0;
		left: 50vw;
		max-width: 1410px;
		opacity: 0;
		overflow: hidden;
		padding: 0;
		pointer-events: none;
		position: fixed;
		right: auto;
		top: var(--eliqauto-header-height);
		transform: translate(-50%, 15px);
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			visibility 180ms ease;
		visibility: hidden;
		width: min(1410px, calc(100vw - 60px));
		z-index: 30;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static:hover
			.sub-menu.eliqauto-mega--vehicles
	),
	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static.is-mega-open
			.sub-menu.eliqauto-mega--vehicles
	) {
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, 0);
		visibility: visible;
	}

	:global(
		html.eliqauto-route-nav-click
			.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.eliqauto-mega--vehicles
	) {
		opacity: 0;
		pointer-events: none;
		transition: none;
		visibility: hidden;
	}

	:global(
		.header-wrapper-style-4
			.header.is-fixed.is-custom
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.eliqauto-mega--vehicles
	) {
		top: var(--eliqauto-header-nav-height);
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.eliqauto-mega--vehicles
			.eliqauto-mega__content
	) {
		align-items: stretch;
		display: flex;
		gap: 40px;
		padding: 30px 42px 32px;
		width: 100%;
	}

	:global(.eliqauto-mega__vehicle-panel) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
		width: auto;
	}

	:global(.eliqauto-mega__vehicles) {
		display: grid;
		gap: 18px 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		width: 100%;
	}

	:global(.eliqauto-mega__links) {
		display: grid;
		flex: 0 0 420px;
		gap: 22px;
		grid-template-columns: repeat(2, minmax(176px, 1fr));
		padding-left: 0;
		width: 420px;
	}

	:global(.eliqauto-mega__links .sub-menu-item-listing) {
		min-width: 0;
	}

	:global(.eliqauto-mega__links .sub-menu-item-listing .h5) {
		color: #111111;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: var(--bc-weight-semibold);
		line-height: 22px;
		margin-bottom: 12px;
		white-space: nowrap;
	}

	:global(.eliqauto-mega__links .sub-menu-item-inner) {
		gap: 8px;
	}

	:global(.eliqauto-mega__links .sub-menu-item-inner a) {
		border-radius: 7px;
		color: #5c5e62;
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
		margin-left: -8px;
		min-height: var(--bc-touch);
		padding: 12px 8px;
		white-space: nowrap;
	}

	:global(.eliqauto-mega__links .sub-menu-item-inner a:hover),
	:global(.eliqauto-mega__links .sub-menu-item-inner a:focus-visible) {
		background: var(--bc-surface);
		color: #111318;
	}

	:global(.eliqauto-mega-car) {
		align-items: center;
		background: var(--bc-surface);
		border: 1px solid transparent;
		border-radius: 12px;
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: 8px 10px 12px;
		text-align: center;
		text-decoration: none;
	}

	:global(.eliqauto-mega-car:hover) {
		border-color: var(--bc-border);
		background: #ffffff;
	}

	:global(.eliqauto-mega-car__image-wrap) {
		align-items: end;
		background: transparent;
		display: flex;
		height: 112px;
		justify-content: center;
		margin: 0 0 7px;
		overflow: hidden;
		width: 100%;
	}

	:global(.eliqauto-mega-car__image) {
		background: transparent;
		display: block;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
		width: 100%;
	}

	:global(.eliqauto-mega-car__title) {
		color: #1c1c1c;
		display: block;
		font-size: 16px;
		font-weight: var(--bc-weight-semibold);
		line-height: var(--bc-leading-mega-car-title, 1.2);
		margin-bottom: 6px;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.eliqauto-mega-car__meta) {
		color: #5c5e62;
		display: block;
		font-size: 14px;
		font-weight: 500;
		line-height: var(--bc-leading-caption, 1.35);
		margin-bottom: 8px;
		white-space: nowrap;
	}

	:global(.eliqauto-mega-car__actions) {
		display: flex;
		gap: 14px;
		justify-content: center;
	}

	:global(.eliqauto-mega-car__actions span) {
		color: #4f5358;
		font-size: 14px;
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
		text-decoration: none;
	}

	:global(.eliqauto-mega__footer) {
		align-items: center;
		background: transparent;
		display: flex;
		flex: 0 0 auto;
		gap: 22px;
		justify-content: flex-start;
		margin-top: 20px;
		padding: 0;
		width: 100%;
	}

	:global(.eliqauto-mega__footer-button) {
		border-color: #171a1d;
		background: #171a1d;
		color: #ffffff;
		font-size: var(--bc-text-header-cta, 18px);
		font-weight: var(--bc-weight-semibold);
		line-height: var(--bc-leading-header-cta, 1.15);
		white-space: nowrap;
	}

	:global(.eliqauto-mega__footer-button:hover),
	:global(.eliqauto-mega__footer-button:focus-visible) {
		border-color: #000000;
		background: #000000;
		color: #ffffff;
	}

	:global(.eliqauto-mega__footer-copy) {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 0;
	}

	:global(.eliqauto-mega__footer-copy strong) {
		color: #111827;
		font-size: var(--bc-text-control, 17px);
		line-height: var(--bc-leading-control, 1.32);
	}

	:global(.eliqauto-mega__footer-copy span) {
		color: #667085;
		font-size: var(--bc-text-caption, 15px);
		line-height: var(--bc-leading-caption, 1.35);
	}

	@media (min-width: 1360px) {
		:global(.eliqauto-mega__links .sub-menu-item-listing .h5),
		:global(.eliqauto-mega__links .sub-menu-item-inner a) {
			white-space: nowrap;
		}
	}

	@media (max-width: 1279.98px) {
		:global(
			.header-wrapper-style-4
				#main-nav
				.menu
				> li.menu-item--static
				.sub-menu.eliqauto-mega--vehicles
				.eliqauto-mega__content
		) {
			gap: 24px;
			padding-left: 28px;
			padding-right: 28px;
		}

		:global(.eliqauto-mega__vehicles) {
			gap: 16px 18px;
		}

		:global(.eliqauto-mega__links) {
			flex-basis: 390px;
			padding-left: 28px;
			width: 390px;
		}

		:global(.eliqauto-mega__links .sub-menu-item-listing .h5) {
			font-size: 18px;
			line-height: 24px;
		}

		:global(.eliqauto-mega__links .sub-menu-item-inner a) {
			font-size: 16px;
			line-height: 24px;
			white-space: normal;
		}
	}

	@media (max-width: 767.98px) {
		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles) {
			padding: 0 20px 16px;
		}

		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles .eliqauto-mega__content) {
			display: block;
			padding: 0;
		}

		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles .eliqauto-mega__vehicle-panel) {
			width: 100%;
		}

		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles .eliqauto-mega__vehicles) {
			display: grid;
			gap: 10px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			margin-bottom: 16px;
		}

		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles .eliqauto-mega__links) {
			border-left: 0;
			display: grid;
			gap: 14px;
			grid-template-columns: 1fr;
			padding-left: 0;
			width: 100%;
		}

		:global(#main-nav-mobile .sub-menu.eliqauto-mega--vehicles .sub-menu-item-inner a) {
			color: #cfd2d8;
			font-size: var(--bc-text-control, 15px);
			line-height: var(--bc-leading-control, 1.25);
			padding-left: 40px;
		}

		:global(#main-nav-mobile .eliqauto-mega-car) {
			padding: 8px 0;
		}

		:global(#main-nav-mobile .eliqauto-mega-car__image-wrap) {
			height: 62px;
			margin-bottom: 6px;
		}

		:global(#main-nav-mobile .eliqauto-mega-car__title) {
			color: #fff;
			font-size: var(--bc-text-control, 15px);
			line-height: var(--bc-leading-control, 1.25);
			white-space: normal;
		}

		:global(#main-nav-mobile .eliqauto-mega-car__meta) {
			display: none;
		}

		:global(#main-nav-mobile .eliqauto-mega-car__actions) {
			gap: 10px;
		}

		:global(#main-nav-mobile .eliqauto-mega__footer) {
			align-items: stretch;
			background: transparent;
			flex-direction: column;
			gap: 10px;
			padding: 0;
		}

		:global(#main-nav-mobile .eliqauto-mega__footer-button) {
			height: 42px;
			width: 100%;
		}

		:global(#main-nav-mobile .eliqauto-mega__footer-copy) {
			border-left: 0;
			padding-left: 0;
			text-align: center;
		}

		:global(#main-nav-mobile .eliqauto-mega__footer-copy strong) {
			color: #fff;
			font-size: var(--bc-text-caption, 13px);
			line-height: var(--bc-leading-caption, 1.35);
		}

		:global(#main-nav-mobile .eliqauto-mega__footer-copy span) {
			color: #cfd2d8;
			font-size: var(--bc-text-micro, 12px);
			line-height: var(--bc-leading-micro, 1.25);
		}
	}

	/* Mobile call/map are icon-only buttons; the text stays as screen-reader-only
	   so the controls remain accessible without showing a visible label. */
	.eliqauto-mobile-action__label {
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
		:global(.header-wrapper-style-4 .header-top-bar),
		:global(.header-wrapper-style-4 .header-button),
		:global(.header-wrapper-style-4 .wrapper-header-button),
		:global(.header-wrapper-style-4 #main-nav),
		:global(.header-wrapper-style-4 .header-search-wrapper),
		:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon),
		:global(.header-wrapper-style-4 .header .eliqauto-account-action),
		:global(.header-wrapper-style-4 .mobile-button) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			background: #ffffff;
			border-bottom: 1px solid var(--bc-border);
			box-shadow: none;
			height: 64px;
			min-height: 64px;
		}

		:global(.header-wrapper-style-4 .header-container-fluid) {
			height: 64px;
			min-height: 64px;
			padding: 0 12px;
		}

		:global(.header-wrapper-style-4 .header-inner) {
			height: 64px;
			min-height: 64px;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex;
			align-items: center;
			flex: 0 1 auto;
			width: auto;
			min-width: 0;
		}

		:global(.header-wrapper-style-4 .logo-mobile) {
			display: none;
			visibility: hidden;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block;
			visibility: visible;
			width: 164px;
			max-width: 164px;
			height: auto;
			max-height: none;
			filter: none;
		}

		:global(.header-wrapper-style-4 .main-nav .logo-mobile) {
			display: none;
		}

		:global(.header-wrapper-style-4 .header .header-right-style-2.header-right) {
			width: auto;
			margin-left: auto;
			gap: 0;
			justify-content: flex-end;
		}

		/* Anchored to the right edge so the icon discs stay perfectly round
		   without squeezing the logo on narrow mobile screens. */
		:global(.header-wrapper-style-4 .header-actions) {
			position: absolute;
			top: 10px;
			right: 12px;
			display: flex;
			align-items: center;
			gap: 8px;
			margin-left: 0;
			margin-right: 0;
		}

		.eliqauto-mobile-call,
		.eliqauto-mobile-map {
			display: inline-flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			gap: 0;
			border: 1px solid var(--bc-hero-action-border);
			border-radius: 999px;
			background: var(--bc-hero-action-surface);
			box-shadow: none;
			color: var(--bc-accent-contrast);
			cursor: pointer;
			line-height: 1;
			padding: 0;
			text-decoration: none;
			white-space: nowrap;
		}

		.eliqauto-mobile-call:focus-visible,
		.eliqauto-mobile-map:focus-visible {
			outline: 2px solid var(--bc-accent-contrast);
			outline-offset: 2px;
		}

		.eliqauto-mobile-call :global(svg),
		.eliqauto-mobile-map :global(svg) {
			width: 22px;
			height: 22px;
			flex: 0 0 22px;
			color: currentColor;
			fill: none;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			filter: none;
		}
	}
</style>
