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
	import { publicNavItems, daynightSite } from '$lib/data/daynight-site';
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

		return () => {
			clearTimeout(keyboardTimer);
			window.visualViewport?.removeEventListener('resize', syncKeyboardVisibility);
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
	class={keyboardOpen ? 'mobile-bottom-dock is-keyboard-open' : 'mobile-bottom-dock'}
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
			<h2 id="mobile-menu-title" class="mobile-menu-sheet__title">{i18n.t('copy.122f71765026')}</h2>
			<button
				type="button"
				aria-label={i18n.t('copy.1ef1a425356f')}
				data-mobile-drawer-initial-focus
				onclick={() => (menuOpen = false)}
			>
				<X size={20} strokeWidth={2.2} />
			</button>
		</div>

		<div class="mobile-menu-sheet__quick" role="group" aria-label={i18n.t('copy.2cd6b212c3e5')}>
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--call"
				href={i18n.href(phoneHref)}
				aria-label={i18n.t('pattern.ab13c281dac3', { v0: daynightSite.phoneLabel })}
			>
				<span class="mobile-menu-sheet__row-icon" aria-hidden="true">
					<PhoneCall size={20} strokeWidth={2.2} />
				</span>
				<span>
					<strong>{i18n.t('copy.d40e5119596a')}</strong>
				</span>
			</a>
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--map"
				href={i18n.href(mapHref)}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={i18n.t('copy.d0f804364b2c')}
			>
				<span class="mobile-menu-sheet__row-icon" aria-hidden="true">
					<MapPin size={20} strokeWidth={2.2} />
				</span>
				<span>
					<strong>{i18n.t('copy.2751c9100018')}</strong>
				</span>
			</a>
		</div>

		<LocaleTrigger
			fullLabel
			beforeOpen={() => {
				menuOpen = false;
				return menuButton;
			}}
		/>
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
					<span
						>{i18n.text(item.label)}{item.href === '/compare' && compareCount
							? ` (${compareCount})`
							: ''}</span
					>
				</a>
			{/each}
		</nav>
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
		padding: 4px 8px calc(4px + env(safe-area-inset-bottom));
		transform: translateY(0);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s;
	}
	.mobile-bottom-dock.is-keyboard-open {
		visibility: hidden;
		transform: translateY(105%);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s 0.22s;
	}
	.mobile-bottom-dock__item {
		display: grid;
		min-width: 0;
		min-height: 56px;
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
		height: 30px;
		place-items: center;
		transition: color 150ms ease-out;
	}
	.mobile-bottom-dock__icon :global(svg) {
		width: 26px;
		height: 26px;
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
		grid-template-rows: auto auto minmax(0, 1fr);
		gap: 12px;
		color: var(--sa-ink);
	}
	:global(.mobile-drawer:has(#mobile-menu-sheet)) {
		display: flex;
		flex-direction: column;
		max-height: calc(var(--sa-vvh, 100dvh) - env(safe-area-inset-top) - var(--sa-mobile-gap-sm));
		overflow: hidden;
		overscroll-behavior: contain;
	}
	.mobile-menu-sheet__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.mobile-menu-sheet__title {
		margin: 0;
		font-size: var(--sa-text-card-title);
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
		background: var(--sa-fill);
		color: var(--sa-ink);
		cursor: pointer;
	}
	.mobile-menu-sheet__quick {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.mobile-menu-sheet__quick-action,
	.mobile-menu-sheet__nav > a {
		display: flex;
		min-height: 52px;
		min-width: 0;
		align-items: center;
		gap: 10px;
		border-radius: 12px;
		padding: 12px;
		background: var(--sa-fill);
		color: var(--sa-ink) !important;
		text-decoration: none;
	}
	.mobile-menu-sheet__quick-action .mobile-menu-sheet__row-icon {
		color: inherit;
	}
	.mobile-menu-sheet__quick-action--call {
		background: var(--sa-red);
		color: #fff !important;
	}
	.mobile-menu-sheet__quick-action--map {
		background: var(--sa-ink);
		color: #fff !important;
	}
	.mobile-menu-sheet__quick strong {
		color: inherit;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-heading);
		line-height: 1.3;
	}
	.mobile-menu-sheet__nav {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.mobile-menu-sheet__nav > a > span:last-child {
		font-size: var(--sa-text-caption);
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
	.mobile-menu-sheet__nav > a.is-current {
		background: #fce8ed;
		color: var(--sa-red) !important;
		border-radius: 12px;
	}
	.mobile-menu-sheet__nav > a.is-current .mobile-menu-sheet__row-icon {
		color: inherit;
	}
	.mobile-menu-sheet a:focus-visible,
	.mobile-menu-sheet button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: -2px;
	}
	.mobile-menu-sheet :global(svg),
	.mobile-menu-sheet :global(svg *) {
		stroke: currentColor;
	}
	@media (hover: hover) {
		.mobile-menu-sheet__nav > a:hover:not(.is-current) {
			background: #e6eaef;
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
