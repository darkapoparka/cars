<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { linkHref as resolve } from '$lib/utils/links';
	import { onMount, tick } from 'svelte';
	import MobileNavIcon from '$lib/components/layout/MobileNavIcon.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import MobileNavigationMenu from '$lib/components/layout/MobileNavigationMenu.svelte';

	let { pathname = '/' }: { pathname?: string } = $props();

	const english = $derived(page.data.locale === 'en');
	const menuLabel = $derived(english ? 'Menu' : 'Меню');
	const localHref = (href: string) => href + (english ? '?lang=en' : '');
	const mainItems = $derived([
		{ href: '/', label: english ? 'Home' : 'Начало', icon: 'home', exact: true },
		{ href: '/inventory', label: english ? 'Cars' : 'Коли', icon: 'cars', exact: false },
		{
			href: '/sell-your-car',
			label: english ? 'Sell' : 'Продай',
			icon: 'sell',
			exact: false
		},
		{ href: '/import', label: english ? 'Import' : 'Внос', icon: 'import', exact: false }
	] as const);

	const isActive = (href: string, exact = false) =>
		exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
	let menuOpen = $state(false);
	let navigationReady = $state(false);
	let footerVisible = $state(false);
	let pendingNavigationHref = $state<string | null>(null);
	let menuButton: HTMLButtonElement | null = null;
	let pendingLocaleOpen: Promise<HTMLElement | undefined> | null = null;
	let resolvePendingLocaleOpen: ((opener: HTMLElement | undefined) => void) | null = null;

	onMount(() => {
		navigationReady = true;
	});
	$effect(() => {
		footerVisible = false;
		if (!navigationReady || pathname !== '/') return;
		let cancelled = false;
		let observer: IntersectionObserver | undefined;
		// The route also updates the footer marker. Observe after that DOM update,
		// including client navigation back to Home from another service page.
		void tick().then(() => {
			if (cancelled) return;
			const footer = document.querySelector('[data-home-footer]');
			if (!footer) return;
			observer = new IntersectionObserver(([entry]) => {
				if (!cancelled) footerVisible = entry?.isIntersecting ?? false;
			});
			observer.observe(footer);
		});
		return () => {
			cancelled = true;
			observer?.disconnect();
		};
	});

	const finishPendingNavigation = () => {
		const href = pendingNavigationHref;
		pendingNavigationHref = null;
		if (resolvePendingLocaleOpen) {
			resolvePendingLocaleOpen(menuButton ?? undefined);
			resolvePendingLocaleOpen = null;
			pendingLocaleOpen = null;
		}
		if (href) window.setTimeout(() => void goto(resolve(href as '/')), 0);
	};

	const beforeLocaleOpen = (): Promise<HTMLElement | undefined> => {
		if (!menuOpen) return Promise.resolve(menuButton ?? undefined);
		if (pendingLocaleOpen) return pendingLocaleOpen;
		pendingLocaleOpen = new Promise((resolve) => {
			resolvePendingLocaleOpen = resolve;
		});
		menuOpen = false;
		return pendingLocaleOpen;
	};

	const handleNavigationClick = async (event: MouseEvent, href: string) => {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const link = event.currentTarget as HTMLAnchorElement;
		if (link.target && link.target !== '_self') return;

		const nextUrl = new URL(link.href, window.location.href);
		if (
			nextUrl.pathname === window.location.pathname &&
			nextUrl.search === window.location.search
		) {
			event.preventDefault();
			menuOpen = false;
			return;
		}

		event.preventDefault();
		if (menuOpen) {
			pendingNavigationHref = href;
			menuOpen = false;
			return;
		}
		await goto(resolve(href as '/'));
	};

	const itemClass = (item: (typeof mainItems)[number]) =>
		['mobile-bottom-nav__item', isActive(item.href, item.exact) && 'active']
			.filter(Boolean)
			.join(' ');
</script>

<nav
	class="mobile-bottom-nav"
	data-footer-visible={footerVisible ? 'true' : undefined}
	aria-label={english ? 'Mobile navigation' : 'Мобилна навигация'}
	data-daynight-stylekit-nav-ready={navigationReady ? 'true' : undefined}
>
	<div class="mobile-bottom-nav__inner">
		{#each mainItems as item (item.href)}
			<a
				class={itemClass(item)}
				href={resolve(localHref(item.href) as '/')}
				aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
				onclick={(event) => handleNavigationClick(event, localHref(item.href))}
			>
				<span class="mobile-bottom-nav__icon" aria-hidden="true">
					<MobileNavIcon name={item.icon} />
				</span>
				<span class="mobile-bottom-nav__label">{item.label}</span>
			</a>
		{/each}
		<button
			bind:this={menuButton}
			type="button"
			class="mobile-bottom-nav__menu-trigger"
			class:active={menuOpen}
			aria-label={menuLabel}
			aria-haspopup="dialog"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = true)}
		>
			<span class="mobile-bottom-nav__icon" aria-hidden="true">
				<MobileNavIcon name="menu" />
			</span>
			<span class="mobile-bottom-nav__label">{menuLabel}</span>
		</button>
	</div>
</nav>

<MobileSheet
	bind:open={menuOpen}
	title={menuLabel}
	contentClass="mobile-menu-sheet__panel"
	onclose={finishPendingNavigation}
>
	<MobileNavigationMenu {pathname} onnavigate={handleNavigationClick} {beforeLocaleOpen} />
</MobileSheet>

<style>
	/* Covered navigation must also leave the accessibility tree while a modal sheet is open. */
	:global(body:has(.bc-mobile-sheet__content[data-state='open'])) .mobile-bottom-nav {
		visibility: hidden;
	}
	.mobile-bottom-nav[data-footer-visible='true'] {
		visibility: hidden;
	}

	.mobile-bottom-nav {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body) {
			padding-bottom: calc(var(--bc-mobile-nav-height) + env(safe-area-inset-bottom));
		}
		:global(body:has(.mobile-bottom-nav[data-footer-visible='true'])) {
			padding-bottom: env(safe-area-inset-bottom);
		}

		.mobile-bottom-nav,
		.mobile-bottom-nav *,
		:global(.mobile-menu-sheet__panel),
		:global(.mobile-menu-sheet__panel *) {
			font-family: var(--bc-font-body);
		}

		:global(.progress-wrap) {
			display: none !important;
		}

		.mobile-bottom-nav {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 999;
			display: block;
			height: calc(var(--bc-mobile-nav-height) + env(safe-area-inset-bottom));
			border-top: 1px solid var(--bc-border);
			background: var(--bc-white);
			padding-bottom: env(safe-area-inset-bottom);
		}

		.mobile-bottom-nav__inner {
			display: grid;
			width: 100%;
			height: var(--bc-mobile-nav-height);
			max-width: var(--bc-mobile-content-max);
			grid-template-columns: repeat(5, minmax(0, 1fr));
			margin: 0 auto;
			padding: 0 var(--bc-space-1);
		}

		.mobile-bottom-nav a,
		.mobile-bottom-nav__menu-trigger {
			position: relative;
			display: flex;
			min-width: 0;
			height: 100%;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 3px;
			border: 0;
			border-radius: 0;
			background: transparent;
			appearance: none;
			color: var(--bc-copy);
			cursor: pointer;
			padding: 0;
			text-align: center;
			text-decoration: none;
			transition:
				background-color var(--bc-motion-hover),
				color var(--bc-motion-hover);
		}

		.mobile-bottom-nav__icon {
			display: grid;
			width: 44px;
			height: 30px;
			place-items: center;
			border-radius: 10px;
			color: inherit;
			line-height: 0;
		}

		.mobile-bottom-nav__label {
			color: inherit;
			font-size: 0.75rem;
			font-weight: var(--bc-weight-body);
			line-height: 1.3334;
		}

		.mobile-bottom-nav a.active,
		.mobile-bottom-nav__menu-trigger.active {
			color: var(--bc-accent);
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__icon,
		.mobile-bottom-nav__menu-trigger.active .mobile-bottom-nav__icon {
			background: color-mix(in srgb, var(--bc-accent) 9%, var(--bc-white));
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__label,
		.mobile-bottom-nav__menu-trigger.active .mobile-bottom-nav__label {
			font-weight: var(--bc-weight-heading);
		}

		.mobile-bottom-nav a:focus-visible,
		.mobile-bottom-nav__menu-trigger:focus-visible {
			background: var(--bc-surface);
			color: var(--bc-ink);
			outline-offset: -2px !important;
		}

		.mobile-bottom-nav :global(svg) {
			color: currentColor;
		}

		:global(.mobile-menu-sheet__panel.bc-mobile-sheet__content) {
			background: var(--bc-bg-strong);
		}

		:global(.mobile-menu-sheet__panel .bc-mobile-sheet__body) {
			display: grid;
			gap: var(--bc-space-3);
			padding-bottom: var(--bc-space-2);
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-bottom-nav a:hover,
			.mobile-bottom-nav__menu-trigger:hover {
				color: var(--bc-ink);
			}

			.mobile-bottom-nav a.active:hover,
			.mobile-bottom-nav__menu-trigger.active:hover {
				color: var(--bc-accent-hover);
			}
		}
	}
</style>
