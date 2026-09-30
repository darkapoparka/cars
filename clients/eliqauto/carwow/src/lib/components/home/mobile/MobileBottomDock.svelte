<script lang="ts">
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { routeParts } from '$lib/locale/core';
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import MobileDockIcon from './MobileDockIcon.svelte';
	import {
		Heart as NavSavedIcon,
		Info as NavInfoIcon,
		MapPin,
		ChevronRight,
		Globe2,
		Menu as NavMenuIcon,
		Newspaper,
		PhoneCall,
		Wrench,
		X
	} from '@lucide/svelte/icons';
	import { GitCompare as NavCompareIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import MobileDrawer from '$lib/components/shared/mobile/MobileDrawer.svelte';
	import { publicNavItems, daynightSite, daynightDealerText } from '$lib/data/daynight-site';
	import { getOptionalGarageContext } from '$lib/state/garage.svelte';
	import { onMount, tick } from 'svelte';

	const homeHref = resolve('/');
	const inventoryHref = resolve('/inventory');
	const importHref = resolve('/contact?intent=import');
	const sellHref = resolve('/sell-your-car');
	const phoneHref = daynightSite.phoneHref;
	const mapHref = daynightSite.mapUrl;
	const currentPath = $derived(routeParts(appPage.url.pathname).path);
	const garage = getOptionalGarageContext();
	const compareCount = $derived(garage.compare.length);
	const localeSummaryId = $props.id();
	const mapSummaryId = `${localeSummaryId}-location`;
	const dealerText = $derived(daynightDealerText[i18n.locale]);
	const regionNames = $derived(new Intl.DisplayNames([i18n.locale], { type: 'region' }));
	const languageNames = $derived(new Intl.DisplayNames([i18n.locale], { type: 'language' }));
	const localeSummary = $derived(
		`${regionNames.of(i18n.state.country) ?? i18n.state.country} · ${languageNames.of(i18n.locale) ?? i18n.locale.toUpperCase()}`
	);
	const isHome = $derived(currentPath === '/');
	const isInventory = $derived(
		currentPath === '/inventory' || currentPath.startsWith('/inventory/')
	);
	const isImport = $derived(
		currentPath === '/contact' && appPage.url.searchParams.get('intent') === 'import'
	);
	const isSell = $derived(currentPath.startsWith('/sell-your-car'));
	const isMenuSection = $derived(
		currentPath.startsWith('/favorites') ||
			currentPath.startsWith('/services') ||
			currentPath.startsWith('/about') ||
			(currentPath.startsWith('/contact') && !isImport) ||
			currentPath.startsWith('/financing') ||
			currentPath.startsWith('/faq') ||
			currentPath.startsWith('/team') ||
			currentPath.startsWith('/reviews') ||
			currentPath.startsWith('/blog') ||
			currentPath.startsWith('/terms') ||
			currentPath.startsWith('/compare')
	);
	let menuOpen = $state(false);

	const menuIconMap = {
		'/favorites': NavSavedIcon,
		'/compare': NavCompareIcon,
		'/services': Wrench,
		'/about': NavInfoIcon,
		'/blog': Newspaper,
		'/contact': MapPin
	} as const;
	type MenuHref = keyof typeof menuIconMap;

	const menuItems = (
		[
			{ href: '/favorites', label: i18n.t('copy.655f65ef3f03') },
			{ href: '/compare', label: i18n.t('copy.c2a9007babf2') },
			...publicNavItems.slice(3)
		] as Array<{ href: MenuHref; label: string }>
	).map((item) => ({
		...item,
		icon: menuIconMap[item.href as keyof typeof menuIconMap] ?? NavMenuIcon
	}));

	function isNavActive(href: MenuHref) {
		if (href === '/contact' && isImport) return false;
		const path = routeParts(resolve(href)).path;
		return currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`));
	}

	let menuButton: HTMLButtonElement;
	async function openMenu(event: MouseEvent) {
		if (event.currentTarget instanceof HTMLElement)
			event.currentTarget.focus({ preventScroll: true });
		menuOpen = true;
		await tick();
		if (!menuOpen) return;
		document
			.querySelector<HTMLElement>('#mobile-menu-sheet [data-mobile-drawer-initial-focus]')
			?.focus({ preventScroll: true });
	}

	// Keep the dock available while a field merely has focus. Hide it only when
	// the software keyboard actually shrinks the visual viewport, then restore it
	// as soon as the keyboard closes (even if the field remains focused).
	let keyboardOpen = $state(false);
	let footerVisible = $state(false);
	let keyboardTimer: ReturnType<typeof setTimeout> | undefined;
	let viewportBaselineHeight = 0;
	let viewportBaselineWidth = 0;
	const KEYBOARD_MIN_SHRINK = 120;
	const NO_KEYBOARD_INPUTS = new Set([
		'button',
		'checkbox',
		'color',
		'file',
		'hidden',
		'image',
		'radio',
		'range',
		'reset',
		'submit'
	]);

	function summonsKeyboard(target: EventTarget | null): boolean {
		if (!(target instanceof HTMLElement)) return false;
		if (target instanceof HTMLInputElement) return !NO_KEYBOARD_INPUTS.has(target.type);
		return target instanceof HTMLTextAreaElement || target.isContentEditable;
	}

	function syncKeyboardVisibility() {
		const viewport = window.visualViewport;
		const currentHeight = viewport?.height ?? window.innerHeight;
		const currentWidth = viewport?.width ?? window.innerWidth;
		const widthChanged = Math.abs(currentWidth - viewportBaselineWidth) > 48;

		if (viewportBaselineHeight === 0 || viewportBaselineWidth === 0 || widthChanged) {
			viewportBaselineHeight = currentHeight;
			viewportBaselineWidth = currentWidth;
			keyboardOpen = false;
			return;
		}

		if (!summonsKeyboard(document.activeElement)) {
			keyboardOpen = false;
			viewportBaselineHeight = Math.max(viewportBaselineHeight, currentHeight);
			viewportBaselineWidth = currentWidth;
			return;
		}

		keyboardOpen = viewportBaselineHeight - currentHeight >= KEYBOARD_MIN_SHRINK;
	}

	function handleFocusIn(event: FocusEvent) {
		if (!summonsKeyboard(event.target)) return;
		clearTimeout(keyboardTimer);
		syncKeyboardVisibility();
	}

	function handleFocusOut() {
		clearTimeout(keyboardTimer);
		keyboardTimer = setTimeout(() => {
			syncKeyboardVisibility();
		}, 120);
	}

	onMount(() => {
		viewportBaselineHeight = window.visualViewport?.height ?? window.innerHeight;
		viewportBaselineWidth = window.visualViewport?.width ?? window.innerWidth;
		window.visualViewport?.addEventListener('resize', syncKeyboardVisibility);
		const footer = document.querySelector('.mh-footer');
		const footerObserver = footer
			? new IntersectionObserver(
					([entry]) => {
						footerVisible = entry.isIntersecting;
						footer.classList.toggle('mh-footer--dock-hidden', footerVisible);
					},
					{ rootMargin: '0px 0px -72px 0px' }
				)
			: null;
		if (footer && footerObserver) footerObserver.observe(footer);

		return () => {
			clearTimeout(keyboardTimer);
			window.visualViewport?.removeEventListener('resize', syncKeyboardVisibility);
			footerObserver?.disconnect();
			footer?.classList.remove('mh-footer--dock-hidden');
		};
	});
</script>

<svelte:window
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onresize={syncKeyboardVisibility}
/>

<nav
	data-daynight-site-chrome
	class={`mobile-bottom-dock${keyboardOpen ? ' is-keyboard-open' : ''}${footerVisible ? ' is-footer-visible' : ''}`}
	aria-label={i18n.t('copy.a690e455afe4')}
>
	<a
		class={isHome ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={i18n.href(homeHref)}
		aria-current={isHome ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<MobileDockIcon name="home" />
		</span>
		<span class="mobile-bottom-dock__label">{i18n.t('copy.4af5d2efadd7')}</span>
	</a>
	<a
		class={isInventory ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={i18n.href(inventoryHref)}
		aria-current={isInventory ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<MobileDockIcon name="car" />
		</span>
		<span class="mobile-bottom-dock__label">{i18n.t('copy.3d2762f992b1')}</span>
	</a>
	<a
		class={isSell ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={i18n.href(sellHref)}
		aria-current={isSell ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<MobileDockIcon name="sell" />
		</span>
		<span class="mobile-bottom-dock__label">{i18n.t('copy.6510e880c790')}</span>
	</a>
	<a
		class={isImport ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={i18n.href(importHref)}
		aria-current={isImport ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<MobileDockIcon name="import" />
		</span>
		<span class="mobile-bottom-dock__label">{i18n.t('copy.995bfafd0b63')}</span>
	</a>
	<button
		bind:this={menuButton}
		class={menuOpen || isMenuSection
			? 'mobile-bottom-dock__item is-active'
			: 'mobile-bottom-dock__item'}
		type="button"
		aria-label={i18n.t('copy.122f71765026')}
		aria-controls="mobile-menu-sheet"
		aria-expanded={menuOpen}
		onclick={openMenu}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<MobileDockIcon name="menu" />
		</span>
		<span class="mobile-bottom-dock__label">{i18n.t('copy.122f71765026')}</span>
	</button>
</nav>

<MobileDrawer bind:open={menuOpen} labelledBy="mobile-menu-title">
	<section
		id="mobile-menu-sheet"
		class="mobile-menu-sheet"
		aria-label={i18n.t('copy.122f71765026')}
		data-daynight-site-chrome
	>
		<div class="mobile-menu-sheet__head">
			<h2 id="mobile-menu-title" class="mobile-menu-sheet__title">
				{i18n.t('copy.122f71765026')}
			</h2>
			<button
				type="button"
				aria-label={i18n.t('copy.1ef1a425356f')}
				data-mobile-drawer-initial-focus
				onclick={() => (menuOpen = false)}
			>
				<X size={18} strokeWidth={2} />
			</button>
		</div>
		<div class="mobile-menu-sheet__brand">
			<img
				class="mobile-menu-sheet__banner"
				src={i18n.asset(resolve(daynightSite.menuBanner))}
				alt=""
				width="960"
				height="360"
				decoding="async"
			/>
			<div class="mobile-menu-sheet__brand-copy">
				<img src={i18n.asset(resolve(daynightSite.logoLight))} alt="" width="168" height="48" />
				<span id={mapSummaryId}>{dealerText.locationShort}</span>
			</div>
		</div>

		<div class="mobile-menu-sheet__quick" role="group" aria-label={i18n.t('copy.2cd6b212c3e5')}>
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--call"
				href={i18n.href(phoneHref)}
				aria-label={i18n.t('pattern.ab13c281dac3', { v0: daynightSite.phoneLabel })}
			>
				<span class="mobile-menu-sheet__quick-title">
					<PhoneCall size={20} strokeWidth={2} aria-hidden="true" />
					<strong>{i18n.t('copy.d40e5119596a')}</strong>
				</span>
			</a>
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--map"
				href={i18n.href(mapHref)}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={i18n.t('copy.d0f804364b2c')}
				aria-describedby={mapSummaryId}
				title={dealerText.address}
			>
				<span class="mobile-menu-sheet__quick-title">
					<MapPin size={20} strokeWidth={2} aria-hidden="true" />
					<strong>{i18n.t('copy.2751c9100018')}</strong>
				</span>
			</a>
		</div>
		<nav class="mobile-menu-sheet__nav" aria-label={i18n.t('copy.e638fc3afbee')}>
			{#each menuItems as item (item.href)}
				{@const RowIcon = item.icon}
				<a
					class={isNavActive(item.href) ? 'is-current' : ''}
					aria-current={isNavActive(item.href) ? 'page' : undefined}
					href={i18n.href(resolve(item.href))}
					onclick={() => (menuOpen = false)}
				>
					<span class="mobile-menu-sheet__row-icon" aria-hidden="true">
						<RowIcon size={20} strokeWidth={2.2} />
					</span>
					<span class="mobile-menu-sheet__label"
						>{i18n.text(item.label)}{item.href === '/compare' && compareCount
							? ` (${compareCount})`
							: ''}</span
					>
					<ChevronRight
						class="mobile-menu-sheet__chevron"
						size={16}
						strokeWidth={2}
						aria-hidden="true"
					/>
				</a>
			{/each}
		</nav>
		<div class="mobile-menu-sheet__locale">
			<LocaleTrigger
				fullLabel
				describedBy={localeSummaryId}
				beforeOpen={() => {
					menuOpen = false;
					return menuButton;
				}}
			>
				<Globe2 size={20} strokeWidth={2} aria-hidden="true" />
				<span id={localeSummaryId} class="mobile-menu-sheet__locale-copy">{localeSummary}</span>
				<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
			</LocaleTrigger>
		</div>
	</section>
</MobileDrawer>

<style>
	.mobile-bottom-dock {
		position: fixed;
		z-index: 65;
		inset: auto 0 0;
		display: none;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		border-top: 1px solid var(--sa-line);
		background: #fff;
		padding: 3px 8px calc(3px + env(safe-area-inset-bottom));
		transform: translateY(0);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s;
	}
	.mobile-bottom-dock:is(.is-keyboard-open, .is-footer-visible) {
		visibility: hidden;
		transform: translateY(105%);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s 0.22s;
	}
	.mobile-bottom-dock__item {
		display: grid;
		min-width: 0;
		min-height: var(--sa-mobile-dock-item-h);
		place-items: center;
		align-content: center;
		gap: 3px;
		border: 0;
		border-radius: 12px;
		background: transparent;
		padding: 0 1px;
		color: #526071 !important;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.mobile-bottom-dock__icon {
		display: grid;
		width: 44px;
		height: 24px;
		place-items: center;
		transition: color 150ms ease-out;
	}
	.mobile-bottom-dock__icon :global(svg) {
		width: 22px;
		height: 22px;
	}
	.mobile-bottom-dock__label {
		color: inherit;
		font: var(--sa-weight-regular) var(--sa-text-caption) / 1.2 var(--sa-font);
		white-space: nowrap;
	}
	.mobile-bottom-dock__item.is-active {
		color: var(--sa-ink) !important;
	}
	.mobile-bottom-dock__item.is-active .mobile-bottom-dock__label {
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-bottom-dock__item.is-active :global(svg),
	.mobile-bottom-dock__item.is-active :global(svg *) {
		color: var(--sa-ink) !important;
		stroke: var(--sa-ink) !important;
		stroke-width: 2;
	}
	.mobile-bottom-dock__item:focus-visible {
		outline: 2px solid var(--sa-ink);
		outline-offset: -2px;
	}
	.mobile-bottom-dock :global(svg),
	.mobile-bottom-dock :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	.mobile-menu-sheet {
		display: grid;
		flex: 1;
		min-height: 0;
		grid-template-rows: auto auto auto minmax(0, 1fr) auto;
		gap: 8px;
		color: var(--sa-ink);
	}
	:global(.mobile-drawer:has(#mobile-menu-sheet)) {
		display: flex;
		flex-direction: column;
		max-width: 560px;
		max-height: calc(var(--sa-vvh, 100dvh) - env(safe-area-inset-top) - var(--sa-mobile-gap-sm));
		margin-inline: auto;
		overflow: hidden;
		overscroll-behavior: contain;
	}
	.mobile-menu-sheet__head {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: space-between;
	}
	.mobile-menu-sheet__brand {
		position: relative;
		isolation: isolate;
		display: flex;
		min-height: 124px;
		align-items: center;
		overflow: hidden;
		border-radius: 12px;
		background: #14171b;
	}
	.mobile-menu-sheet__banner {
		position: absolute;
		z-index: -2;
		inset: 0 0 0 auto;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: right center;
	}
	.mobile-menu-sheet__brand::before {
		position: absolute;
		z-index: -1;
		inset: 0;
		background: linear-gradient(90deg, rgba(20, 23, 27, 0.2), transparent 60%);
		content: '';
	}
	.mobile-menu-sheet__brand-copy {
		display: grid;
		width: 62%;
		min-width: 0;
		gap: 8px;
		padding: 16px;
	}
	.mobile-menu-sheet__brand-copy img {
		display: block;
		width: 168px;
		height: 44px;
		max-width: 100%;
		object-fit: contain;
		object-position: left center;
	}
	.mobile-menu-sheet__brand-copy span {
		color: #e5e7eb;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-regular);
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	.mobile-menu-sheet__title {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.2;
	}
	.mobile-menu-sheet__head button {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: #eff1f4;
		color: #687280;
		cursor: pointer;
	}
	.mobile-menu-sheet__quick {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.mobile-menu-sheet__quick-action,
	.mobile-menu-sheet__nav > a {
		min-width: 0;
		border: 1px solid var(--sa-line);
		border-radius: 12px;
		background: var(--sa-fill);
		color: var(--sa-ink) !important;
		text-decoration: none;
	}
	.mobile-menu-sheet__quick-action {
		display: flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		padding: 10px 12px;
	}
	.mobile-menu-sheet__quick-action--call {
		color: var(--sa-red-strong) !important;
	}
	.mobile-menu-sheet__quick-title {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.mobile-menu-sheet__quick-title :global(svg) {
		flex: 0 0 auto;
		color: inherit;
	}
	.mobile-menu-sheet__quick strong {
		color: inherit;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		line-height: 1.3;
	}
	.mobile-menu-sheet__nav {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: start;
		gap: 8px;
		min-height: 0;
		padding: 1px;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.mobile-menu-sheet__nav > a {
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
	}
	.mobile-menu-sheet__label {
		flex: 1;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-button-font-weight);
		line-height: 1.3;
	}
	.mobile-menu-sheet__row-icon {
		display: grid;
		width: 24px;
		flex: 0 0 24px;
		place-items: center;
		color: #526071;
	}
	.mobile-menu-sheet__nav :global(.mobile-menu-sheet__chevron) {
		flex: 0 0 auto;
		color: #687280;
	}
	.mobile-menu-sheet__locale {
		color: #526071;
	}
	.mobile-menu-sheet__locale :global(.cars-locale-trigger) {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) 16px;
		align-items: center;
		gap: 10px;
		min-width: 0;
		min-height: 48px;
		padding: 8px 12px;
		border: 1px solid var(--sa-line);
		border-radius: 12px;
		background: #fff;
		color: #526071;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
	}
	.mobile-menu-sheet__locale :global(.cars-locale-trigger:focus-visible) {
		outline-offset: -3px;
	}
	.mobile-menu-sheet__locale-copy {
		min-width: 0;
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-regular);
		line-height: 1.25;
		overflow-wrap: anywhere;
	}
	.mobile-menu-sheet__nav > a.is-current {
		background: #fce8ed;
		color: var(--sa-red-strong) !important;
		border-color: #f5ccd6;
	}
	.mobile-menu-sheet__nav > a.is-current .mobile-menu-sheet__row-icon {
		color: inherit;
	}
	.mobile-menu-sheet a:focus-visible,
	.mobile-menu-sheet button:focus-visible {
		outline: 2px solid var(--sa-ink);
		outline-offset: -2px;
	}
	.mobile-menu-sheet :global(svg),
	.mobile-menu-sheet :global(svg *) {
		stroke: currentColor;
	}
	@media (hover: hover) {
		.mobile-menu-sheet__head button:hover {
			background: #e2e6eb;
		}
		.mobile-menu-sheet__nav > a:hover:not(.is-current) {
			background: #e6eaef;
		}
	}
	@media (max-height: 500px) {
		.mobile-menu-sheet {
			gap: 6px;
		}
		.mobile-menu-sheet__brand {
			min-height: 64px;
		}
		.mobile-menu-sheet__banner {
			width: 58%;
			object-fit: contain;
			mask-image: linear-gradient(90deg, transparent, #000 35%);
		}
		.mobile-menu-sheet__brand-copy {
			gap: 2px;
			padding: 6px 12px;
		}
		.mobile-menu-sheet__brand-copy img {
			width: 112px;
			height: 30px;
		}
		.mobile-menu-sheet__quick-action {
			min-height: 44px;
			padding: 8px 12px;
		}
		.mobile-menu-sheet__locale :global(.cars-locale-trigger) {
			min-height: 44px;
		}
	}
	@media (max-width: 991px) {
		.mobile-bottom-dock {
			display: grid;
		}
		:global(.scroll-top),
		:global(.progress-wrap) {
			display: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mobile-bottom-dock,
		.mobile-bottom-dock__icon {
			transition: none;
		}
	}
</style>
