<script lang="ts">
	import {
		CarFront as NavCarIcon,
		CirclePlus as NavSellIcon,
		Globe2 as NavImportIcon,
		Heart as NavSavedIcon,
		House as NavHomeIcon,
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
	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const mapHref = daynightSite.mapUrl;
	const currentPath = $derived(appPage.url.pathname);
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
		'/': NavHomeIcon,
		'/inventory': NavCarIcon,
		'/sell-your-car': NavSellIcon,
		'/favorites': NavSavedIcon,
		'/compare': NavCompareIcon,
		'/services': Wrench,
		'/about': NavInfoIcon,
		'/blog': Newspaper
	} as const;
	type MenuHref = keyof typeof menuIconMap;

	const menuItems = (
		[
			...publicNavItems.slice(0, 3),
			{ href: '/favorites', label: 'Запазени' },
			{ href: '/compare', label: 'Сравнение' },
			...publicNavItems.slice(3).filter((item) => item.href !== '/contact')
		] as Array<{ href: MenuHref; label: string }>
	).map((item) => ({
		...item,
		icon: menuIconMap[item.href as keyof typeof menuIconMap] ?? NavMenuIcon
	}));

	function isNavActive(href: MenuHref) {
		const path = resolve(href);
		return currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`));
	}

	function openMap(event: MouseEvent) {
		event.preventDefault();
		window.open(mapHref, '_blank', 'noopener,noreferrer');
	}

	async function openMenu() {
		menuOpen = true;
		await tick();
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
	class={keyboardOpen ? 'mobile-bottom-dock is-keyboard-open' : 'mobile-bottom-dock'}
	aria-label="Основни действия"
>
	<a
		class={isHome ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={homeHref}
		aria-current={isHome ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<NavHomeIcon size={23} strokeWidth={2.2} absoluteStrokeWidth />
		</span>
		<span class="mobile-bottom-dock__label">Начало</span>
	</a>
	<a
		class={isInventory ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={inventoryHref}
		aria-current={isInventory ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<NavCarIcon size={23} strokeWidth={2.2} absoluteStrokeWidth />
		</span>
		<span class="mobile-bottom-dock__label">Коли</span>
	</a>
	<a
		class={isSell ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={sellHref}
		aria-current={isSell ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<NavSellIcon size={23} strokeWidth={2.2} absoluteStrokeWidth />
		</span>
		<span class="mobile-bottom-dock__label">Продай</span>
	</a>
	<a
		class={isImport ? 'mobile-bottom-dock__item is-active' : 'mobile-bottom-dock__item'}
		href={importHref}
		aria-current={isImport ? 'page' : undefined}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<NavImportIcon size={23} strokeWidth={2.2} absoluteStrokeWidth />
		</span>
		<span class="mobile-bottom-dock__label">Внос</span>
	</a>
	<button
		class={menuOpen || isMenuSection
			? 'mobile-bottom-dock__item is-active'
			: 'mobile-bottom-dock__item'}
		type="button"
		aria-label="Меню"
		aria-controls="mobile-menu-sheet"
		aria-expanded={menuOpen}
		onclick={openMenu}
	>
		<span class="mobile-bottom-dock__icon" aria-hidden="true">
			<NavMenuIcon size={23} strokeWidth={2.2} absoluteStrokeWidth />
		</span>
		<span class="mobile-bottom-dock__label">Меню</span>
	</button>
</nav>

<MobileDrawer bind:open={menuOpen} labelledBy="mobile-menu-title">
	<section id="mobile-menu-sheet" class="mobile-menu-sheet" aria-label="Меню">
		<h2 id="mobile-menu-title" class="mobile-menu-sheet__title">Меню</h2>
		<div class="mobile-menu-sheet__head">
			<div class="mobile-menu-sheet__brand">
				<img
					class="mobile-menu-sheet__logo"
					src={resolve('/assets/dealer/brand/logo.jpg')}
					alt={daynightSite.shortName}
				/>
			</div>
			<button
				type="button"
				aria-label="Затвори"
				data-mobile-drawer-initial-focus
				onclick={() => (menuOpen = false)}
			>
				<X size={20} strokeWidth={2.2} />
			</button>
		</div>

		<div class="mobile-menu-sheet__quick" aria-label="Бързи действия">
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--call"
				href={phoneHref}
				aria-label={`Обади се на ${daynightSite.phoneLabel}`}
			>
				<PhoneCall size={20} strokeWidth={2.2} />
				<span>
					<strong>Обади се</strong>
				</span>
			</a>
			<a
				class="mobile-menu-sheet__quick-action mobile-menu-sheet__quick-action--map"
				href={resolve('/contact')}
				onclick={openMap}
				aria-label="Отвори карта"
			>
				<MapPin size={20} strokeWidth={2.2} />
				<span>
					<strong>Карта</strong>
				</span>
			</a>
		</div>

		<nav class="mobile-menu-sheet__nav" aria-label="Навигация">
			{#each menuItems as item (item.href)}
				{@const RowIcon = item.icon}
				<a
					class={isNavActive(item.href) ? 'is-current' : ''}
					href={resolve(item.href)}
					onclick={() => (menuOpen = false)}
				>
					<span class="mobile-menu-sheet__row-icon">
						<RowIcon size={20} strokeWidth={2.2} />
					</span>
					<span
						>{item.label}{item.href === '/compare' && compareCount
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
		right: 0;
		bottom: 0;
		left: 0;
		display: none;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		align-items: stretch;
		gap: 0;
		border: 0;
		border-top: 1px solid rgba(215, 224, 234, 0.95);
		border-radius: 0;
		background: rgba(255, 255, 255, 0.985);
		padding: 4px 8px calc(4px + env(safe-area-inset-bottom));
		box-shadow: none;
		backdrop-filter: saturate(1.08) blur(14px);
		-webkit-backdrop-filter: saturate(1.08) blur(14px);
		transform: translateY(0);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s 0s;
	}

	.mobile-bottom-dock.is-keyboard-open {
		visibility: hidden;
		transform: translateY(105%);
		transition:
			transform 0.22s var(--sa-ease),
			visibility 0s 0.22s;
	}

	.mobile-bottom-dock__item {
		position: relative;
		display: grid;
		isolation: isolate;
		min-width: 0;
		min-height: 56px;
		place-items: center;
		align-content: center;
		gap: 2px;
		border: 0;
		border-radius: 11px;
		background: transparent;
		color: #111827 !important;
		font: var(--sa-weight-semibold) var(--sa-text-xs) / 1.22 var(--sa-font);
		letter-spacing: 0;
		padding: 2px 1px 2px;
		text-align: center;
		cursor: pointer;
		transition:
			background 0.18s var(--sa-ease),
			color 0.18s var(--sa-ease),
			transform 0.18s var(--sa-ease);
		-webkit-tap-highlight-color: transparent;
	}

	.mobile-bottom-dock__item:active {
		background: rgba(15, 23, 42, 0.045);
		transform: none;
	}

	.mobile-bottom-dock__icon {
		position: relative;
		z-index: 1;
		display: grid;
		width: 23px;
		height: 23px;
		place-items: center;
		color: inherit;
	}

	.mobile-bottom-dock__icon :global(svg) {
		display: block;
		width: 23px;
		height: 23px;
		color: currentColor !important;
	}

	.mobile-bottom-dock__icon :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
		stroke-width: 2.15px !important;
		fill: none !important;
	}

	.mobile-bottom-dock__label {
		position: relative;
		z-index: 1;
		display: block;
		max-width: 100%;
		min-height: 1rem;
		overflow: visible;
		color: #526071 !important;
		-webkit-text-fill-color: #526071;
		font: inherit;
		line-height: 1.22;
		text-overflow: clip;
		white-space: nowrap;
	}

	.mobile-bottom-dock__item.is-active {
		background: transparent;
		color: var(--sa-red) !important;
	}

	.mobile-bottom-dock__item.is-active::before {
		display: none;
	}

	.mobile-bottom-dock__item.is-active .mobile-bottom-dock__icon {
		color: var(--sa-red) !important;
	}

	.mobile-bottom-dock__item.is-active .mobile-bottom-dock__label {
		color: #111315 !important;
		-webkit-text-fill-color: #111315 !important;
		font-weight: var(--sa-weight-strong);
	}

	.mobile-bottom-dock__item.is-active :global(svg),
	.mobile-bottom-dock__item.is-active :global(svg *) {
		color: var(--sa-red) !important;
		stroke: var(--sa-red) !important;
		fill: none !important;
	}

	.mobile-bottom-dock :global(svg) {
		color: currentColor !important;
	}

	.mobile-menu-sheet {
		display: grid;
		gap: 9px;
		color: #111315;
	}

	.mobile-menu-sheet__title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	:global(.mobile-drawer:has(#mobile-menu-sheet)) {
		max-height: none;
		overflow: hidden;
		overscroll-behavior: none;
	}

	.mobile-menu-sheet__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		overflow: hidden;
		border-radius: 14px;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 38%), var(--sa-blue);
		padding: 11px 13px 11px 15px;
	}

	.mobile-menu-sheet__brand {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 12px;
	}

	.mobile-menu-sheet__logo {
		display: block;
		flex: 0 1 auto;
		width: min(168px, 56vw);
		height: auto;
		min-width: 0;
	}

	.mobile-menu-sheet__head button {
		flex: 0 0 auto;
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.14);
		color: #fff !important;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.mobile-menu-sheet__quick {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mobile-menu-sheet__quick-action {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr);
		min-width: 0;
		min-height: 50px;
		align-items: center;
		gap: 10px;
		overflow: hidden;
		border: 1px solid transparent;
		border-radius: 13px;
		background: var(--sa-fill);
		padding: 0 11px 0 9px;
		color: #fff !important;
		box-shadow: none;
		-webkit-tap-highlight-color: transparent;
	}

	.mobile-menu-sheet__quick-action--call {
		border-color: var(--sa-red);
		background: var(--sa-red);
	}

	.mobile-menu-sheet__quick-action--map {
		border-color: var(--sa-blue);
		background: var(--sa-blue);
	}

	.mobile-menu-sheet__quick :global(svg) {
		justify-self: center;
	}

	.mobile-menu-sheet__quick-action > :global(svg) {
		box-sizing: border-box;
		width: 20px !important;
		height: 20px !important;
		border-radius: 0;
		background: transparent;
		padding: 0;
		color: currentColor !important;
	}

	.mobile-menu-sheet__quick span {
		display: grid;
		min-width: 0;
		gap: 0;
	}

	.mobile-menu-sheet__quick strong {
		overflow: hidden;
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-menu-sheet__nav {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mobile-menu-sheet__nav > a {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr);
		min-height: 50px;
		align-items: center;
		gap: 10px;
		border: 1px solid #dfe7ef;
		border-radius: 13px;
		background: var(--sa-fill);
		padding: 0 11px 0 9px;
		color: #111315 !important;
		font-size: var(--sa-text-base);
		font-weight: 400;
		box-shadow: none;
	}

	.mobile-menu-sheet__row-icon {
		display: grid;
		width: 24px;
		height: 24px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 0;
		background: transparent;
		color: currentColor;
	}

	.mobile-menu-sheet__nav > a > span:last-child {
		overflow: hidden;
		/* explicit: the template's `* { font-size: 16px; font-weight: 400 }` reset
		   used to decide these values; don't let a purge pass change the look */
		font-size: var(--sa-text-base);
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-menu-sheet__nav > a.is-current {
		border-color: #ccd8e5;
		background: var(--sa-blue-soft);
		color: #111315 !important;
		box-shadow: none;
	}

	.mobile-menu-sheet__nav > a.is-current .mobile-menu-sheet__row-icon {
		background: transparent;
		color: currentColor;
	}

	.mobile-menu-sheet :global(svg),
	.mobile-menu-sheet :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
		fill: none !important;
	}

	.mobile-menu-sheet span,
	.mobile-menu-sheet strong {
		color: inherit !important;
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
</style>
