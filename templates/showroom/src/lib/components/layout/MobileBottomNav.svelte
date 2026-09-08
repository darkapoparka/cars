<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount, tick } from 'svelte';
	import {
		ArrowRight,
		Calculator,
		CarFront,
		GitCompare,
		Info,
		MessageCircle,
		PhoneCall,
		UserRound,
		X
	} from '@lucide/svelte';
	import CarFilled from '@tabler/icons-svelte/icons/car-filled';
	import HeartFilled from '@tabler/icons-svelte/icons/heart-filled';
	import HomeFilled from '@tabler/icons-svelte/icons/home-filled';
	import Menu2 from '@tabler/icons-svelte/icons/menu-2';
	import TagFilled from '@tabler/icons-svelte/icons/tag-filled';
	import WorldDownload from '@tabler/icons-svelte/icons/world-download';

	let { pathname = '/' }: { pathname?: string } = $props();

	const mainItems = [
		{
			href: '/',
			label: 'Начало',
			icon: HomeFilled,
			exact: true
		},
		{
			href: '/inventory',
			label: 'Коли',
			icon: CarFilled,
			exact: false,
			tone: 'commerce'
		},
		{
			href: '/sell-your-car',
			label: 'Продай',
			icon: TagFilled,
			exact: false,
			tone: 'commerce'
		},
		{
			href: '/import',
			label: 'Внос',
			icon: WorldDownload,
			exact: false,
			tone: 'commerce'
		}
	] as const;

	const menuSections = [
		{
			title: 'Автомобили',
			links: [
				{ href: '/inventory', label: 'Всички коли', icon: CarFront },
				{ href: '/account/favorites', label: 'Любими', icon: HeartFilled },
				{ href: '/compare', label: 'Сравни автомобили', icon: GitCompare },
				{ href: '/calculator', label: 'Калкулатор за внос', icon: Calculator }
			]
		},
		{
			title: 'Eliq Auto',
			links: [
				{ href: '/about', label: 'За нас', icon: Info },
				{ href: '/contact', label: 'Контакти', icon: MessageCircle },
				{ href: '/account', label: 'Вход / профил', icon: UserRound }
			]
		}
	] as const;

	const isActive = (href: string, exact = false) =>
		exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
	let menuOpen = $state(false);
	let navigationReady = $state(false);
	let menuTriggerEl = $state<HTMLButtonElement>();
	let menuCloseEl = $state<HTMLButtonElement>();

	const activateModalDialog = (node: HTMLDialogElement) => {
		if (!node.open) node.showModal();

		return {
			destroy() {
				if (node.open) node.close();
			}
		};
	};

	const openMenu = async () => {
		menuOpen = true;
		await tick();
		menuCloseEl?.focus();
	};

	const closeMenu = async () => {
		menuOpen = false;
		await tick();
		menuTriggerEl?.focus();
	};

	const handleMenuCancel = (event: Event) => {
		event.preventDefault();
		void closeMenu();
	};

	onMount(() => {
		navigationReady = true;
	});

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
		menuOpen = false;
		await goto(resolve(href as '/'));
	};

	const itemClass = (item: (typeof mainItems)[number]) =>
		[
			'mobile-bottom-nav__item',
			'tone' in item && item.tone === 'commerce' && 'mobile-bottom-nav__item--commerce',
			isActive(item.href, item.exact) && 'active'
		]
			.filter(Boolean)
			.join(' ');
</script>

<nav
	class="mobile-bottom-nav"
	class:mobile-bottom-nav--menu-open={menuOpen}
	aria-label="Мобилна навигация"
	data-eliqauto-sveltekit-nav-ready={navigationReady ? 'true' : undefined}
>
	<div class="mobile-bottom-nav__inner">
		{#each mainItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				class={itemClass(item)}
				href={resolve(item.href as '/')}
				aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
				onclick={(event) => handleNavigationClick(event, item.href)}
			>
				<span class="mobile-bottom-nav__icon" aria-hidden="true">
					<Icon size={26} color="currentColor" stroke={2.4} />
				</span>
				<span class="mobile-bottom-nav__label">{item.label}</span>
			</a>
		{/each}
		<button
			type="button"
			class="mobile-bottom-nav__menu-trigger"
			aria-label="Отвори меню"
			aria-haspopup="dialog"
			aria-controls="mobile-bottom-menu"
			aria-expanded={menuOpen}
			bind:this={menuTriggerEl}
			onclick={openMenu}
		>
			<span class="mobile-bottom-nav__icon mobile-bottom-nav__icon--menu" aria-hidden="true">
				<Menu2 size={27} color="currentColor" stroke={2.6} />
			</span>
			<span class="mobile-bottom-nav__label">Меню</span>
		</button>
	</div>
</nav>

{#if menuOpen}
	<dialog
		class="mobile-menu-sheet"
		id="mobile-bottom-menu"
		aria-labelledby="mobile-bottom-menu-title"
		use:activateModalDialog
		oncancel={handleMenuCancel}
	>
		<button
			type="button"
			class="mobile-menu-sheet__backdrop"
			aria-label="Затвори менюто"
			onclick={closeMenu}
		></button>
		<div class="mobile-menu-sheet__panel">
			<span class="mobile-menu-sheet__handle" aria-hidden="true"></span>

			<div class="mobile-menu-sheet__header">
				<strong id="mobile-bottom-menu-title">Меню</strong>
				<button
					type="button"
					class="mobile-menu-sheet__close"
					aria-label="Затвори менюто"
					bind:this={menuCloseEl}
					onclick={closeMenu}
				>
					<X size={22} strokeWidth={2.3} aria-hidden="true" />
				</button>
			</div>

			<a
				class="mobile-menu-sheet__sell"
				href={resolve('/sell-your-car')}
				onclick={(event) => handleNavigationClick(event, '/sell-your-car')}
			>
				<div class="mobile-menu-sheet__sell-copy">
					<strong>Продай автомобил</strong>
				</div>
				<span class="mobile-menu-sheet__sell-arrow" aria-hidden="true">
					<ArrowRight size={18} strokeWidth={2.35} />
				</span>
				<img
					class="mobile-menu-sheet__sell-consultant"
					src="/assets/eliqauto/home2/home2-action-consultant.webp"
					alt=""
					aria-hidden="true"
					loading="lazy"
				/>
			</a>

			<div class="mobile-menu-sheet__actions">
				<a href={resolve('/contact')} onclick={(event) => handleNavigationClick(event, '/contact')}>
					<PhoneCall size={18} strokeWidth={2.1} />
					Обади се
				</a>
				<a href={resolve('/contact')} onclick={(event) => handleNavigationClick(event, '/contact')}>
					<MessageCircle size={18} strokeWidth={2.1} />
					Пиши ни
				</a>
			</div>

			<div class="mobile-menu-sheet__sections">
				{#each menuSections as section (section.title)}
					<section>
						<h2>{section.title}</h2>
						<div class="mobile-menu-sheet__links">
							{#each section.links as link (link.href)}
								{@const Icon = link.icon}
								<a
									class:active={isActive(link.href)}
									href={resolve(link.href as '/')}
									aria-current={isActive(link.href) ? 'page' : undefined}
									onclick={(event) => handleNavigationClick(event, link.href)}
								>
									<span class="mobile-menu-sheet__link-icon" aria-hidden="true">
										<Icon size={19} strokeWidth={2} />
									</span>
									<span>{link.label}</span>
								</a>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</div>
	</dialog>
{/if}

<style>
	.mobile-bottom-nav,
	.mobile-menu-sheet {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body) {
			padding-bottom: calc(70px + env(safe-area-inset-bottom));
		}

		:global(.progress-wrap) {
			display: none;
		}

		:global(body:has(.mobile-menu-sheet[open])) {
			overflow: hidden;
		}

		.mobile-bottom-nav {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 999;
			display: block;
			padding: 5px 0 calc(5px + env(safe-area-inset-bottom));
			background: #ffffff;
			border-top: 1px solid rgba(28, 28, 28, 0.16);
			box-shadow: 0 -2px 12px rgba(28, 28, 28, 0.06);
		}

		.mobile-bottom-nav__inner {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 0;
			max-width: 480px;
			margin: 0 auto;
			padding: 0 4px;
		}

		.mobile-bottom-nav a,
		.mobile-bottom-nav__menu-trigger {
			position: relative;
			display: flex;
			min-width: 0;
			min-height: 56px;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 2px;
			border: 0;
			border-radius: 0;
			background: transparent;
			appearance: none;
			color: var(--bc-muted);
			font-size: var(--bc-text-caption);
			font-weight: 600;
			line-height: 16px;
			cursor: pointer;
			padding: 4px 0;
			text-align: center;
			text-decoration: none;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-bottom-nav__icon {
			display: flex;
			width: 38px;
			height: 30px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			color: inherit;
			line-height: 0;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-bottom-nav__label {
			color: inherit;
			font-size: 13px;
			font-weight: 600;
			line-height: 15px;
		}

		.mobile-bottom-nav a.mobile-bottom-nav__item--commerce {
			color: var(--bc-muted);
		}

		.mobile-bottom-nav a.mobile-bottom-nav__item--commerce .mobile-bottom-nav__label {
			font-weight: 600;
		}

		.mobile-bottom-nav a.active,
		.mobile-bottom-nav--menu-open .mobile-bottom-nav__menu-trigger {
			background: transparent;
			color: #111111;
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__icon,
		.mobile-bottom-nav--menu-open .mobile-bottom-nav__menu-trigger .mobile-bottom-nav__icon {
			background: transparent;
			color: var(--bc-accent);
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__label,
		.mobile-bottom-nav--menu-open .mobile-bottom-nav__menu-trigger .mobile-bottom-nav__label {
			font-weight: 700;
		}

		.mobile-bottom-nav a:focus-visible,
		.mobile-bottom-nav__menu-trigger:focus-visible {
			background: var(--bc-surface);
			color: var(--bc-ink);
			outline: 2px solid #1c1c1c;
			outline-offset: -2px;
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-bottom-nav a:hover,
			.mobile-bottom-nav__menu-trigger:hover {
				background: transparent;
				color: var(--bc-ink);
			}

			.mobile-bottom-nav a:hover .mobile-bottom-nav__icon,
			.mobile-bottom-nav__menu-trigger:hover .mobile-bottom-nav__icon {
				background: var(--bc-surface-soft);
			}

			.mobile-bottom-nav a.active:hover .mobile-bottom-nav__icon,
			.mobile-bottom-nav--menu-open
				.mobile-bottom-nav__menu-trigger:hover
				.mobile-bottom-nav__icon {
				background: transparent;
				color: var(--bc-accent-hover);
			}
		}

		.mobile-bottom-nav :global(svg) {
			flex: 0 0 auto;
			color: inherit;
		}

		.mobile-menu-sheet {
			--mobile-menu-backdrop-opacity: 1;
			--mobile-menu-panel-y: 0;

			position: fixed;
			inset: 0;
			z-index: 1000;
			display: block;
			width: 100vw;
			max-width: none;
			height: 100dvh;
			max-height: none;
			margin: 0;
			border: 0;
			background: transparent;
			padding: 0;
		}

		.mobile-menu-sheet::backdrop {
			background: transparent;
		}

		.mobile-menu-sheet__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(28, 28, 28, 0.36);
			appearance: none;
			cursor: pointer;
			opacity: var(--mobile-menu-backdrop-opacity);
			padding: 0;
			transition: opacity 180ms ease;
		}

		.mobile-menu-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			gap: 10px;
			width: 100%;
			max-height: min(94dvh, 780px);
			overflow-y: auto;
			margin: 0;
			padding: 10px 14px calc(24px + env(safe-area-inset-bottom));
			border: 0;
			border-top: 0;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			box-shadow: 0 -18px 42px rgba(28, 28, 28, 0.18);
			transform: translateY(var(--mobile-menu-panel-y));
			transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		.mobile-menu-sheet__handle {
			display: block;
			width: 42px;
			height: 5px;
			justify-self: center;
			border-radius: 999px;
			background: var(--bc-border);
		}

		.mobile-menu-sheet__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.mobile-menu-sheet__header strong {
			margin: 0;
			color: #1c1c1c;
			letter-spacing: 0;
		}

		.mobile-menu-sheet__header strong {
			display: block;
			font-size: 24px;
			font-weight: 700;
			line-height: 29px;
		}

		.mobile-menu-sheet__close {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: #f0f1f3;
			appearance: none;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
		}

		.mobile-menu-sheet__sell {
			position: relative;
			isolation: isolate;
			display: flex;
			min-height: 64px;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
			overflow: hidden;
			border-radius: 12px;
			background: #1c1c1c;
			padding: 12px 128px 12px 14px;
			color: #ffffff;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-menu-sheet__sell::after {
			position: absolute;
			inset: 0;
			z-index: -1;
			background: linear-gradient(90deg, rgba(28, 28, 28, 0) 54%, rgba(17, 17, 17, 0.42) 100%);
			content: '';
		}

		.mobile-menu-sheet__sell:focus-visible {
			background: #111111;
			color: #ffffff;
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-menu-sheet__sell:hover {
				background: #111111;
				color: #ffffff;
			}
		}

		.mobile-menu-sheet__sell-copy {
			position: relative;
			z-index: 1;
			min-width: 0;
		}

		.mobile-menu-sheet__sell strong {
			display: block;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.mobile-menu-sheet__sell strong {
			color: #ffffff;
			font-size: 18px;
			font-weight: 700;
			line-height: 22px;
		}

		.mobile-menu-sheet__sell-arrow {
			position: absolute;
			top: 50%;
			right: 12px;
			z-index: 2;
			display: flex;
			width: 30px;
			height: 30px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
			transform: translateY(-50%);
		}

		.mobile-menu-sheet__sell-arrow :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.mobile-menu-sheet__sell-consultant {
			position: absolute;
			right: 38px;
			bottom: -11px;
			z-index: 0;
			display: block;
			width: 76px;
			height: 76px;
			object-fit: contain;
			object-position: right bottom;
			opacity: 0.96;
			pointer-events: none;
			user-select: none;
		}

		.mobile-menu-sheet__actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.mobile-menu-sheet__actions a {
			display: flex;
			min-height: 44px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 1px solid var(--bc-border);
			border-radius: 12px;
			background: #ffffff;
			color: var(--bc-ink);
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.mobile-menu-sheet__actions a:first-child {
			border-color: #1c1c1c;
			background: #1c1c1c;
			color: #ffffff;
		}

		.mobile-menu-sheet__actions a:last-child {
			border-color: var(--bc-accent);
			background: var(--bc-accent);
			color: #ffffff;
		}

		.mobile-menu-sheet__actions a:focus-visible {
			outline: 2px solid var(--bc-ink);
			outline-offset: 2px;
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-menu-sheet__actions a:first-child:hover {
				background: #111111;
				border-color: #111111;
				color: #ffffff;
			}

			.mobile-menu-sheet__actions a:last-child:hover {
				background: var(--bc-accent-hover);
				border-color: var(--bc-accent-hover);
				color: #ffffff;
			}
		}

		.mobile-menu-sheet__sections {
			display: grid;
			gap: 12px;
		}

		.mobile-menu-sheet__sections section {
			display: grid;
			gap: 4px;
		}

		.mobile-menu-sheet__sections h2 {
			margin: 0;
			color: #626d7c;
			font-size: 13px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 18px;
			text-transform: uppercase;
		}

		.mobile-menu-sheet__links {
			display: grid;
			gap: 4px;
		}

		.mobile-menu-sheet__links a {
			display: flex;
			min-height: 44px;
			align-items: center;
			gap: 10px;
			border-radius: 12px;
			background: var(--bc-surface);
			padding: 4px 12px;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 600;
			line-height: 20px;
		}

		.mobile-menu-sheet__link-icon {
			display: flex;
			width: 24px;
			height: 24px;
			flex: 0 0 24px;
			align-items: center;
			justify-content: center;
			background: transparent;
			color: var(--bc-ink);
		}

		.mobile-menu-sheet__link-icon :global(svg),
		.mobile-menu-sheet__link-icon :global(svg *) {
			color: currentColor;
			stroke: currentColor;
		}

		.mobile-menu-sheet__links a.active {
			background: rgba(181, 18, 27, 0.1);
			color: var(--bc-accent);
			font-weight: 700;
		}

		.mobile-menu-sheet__links a.active .mobile-menu-sheet__link-icon {
			background: transparent;
			color: var(--bc-accent);
		}

		.mobile-menu-sheet__links a:focus-visible {
			background: var(--bc-surface);
			color: var(--bc-ink);
			outline: 2px solid var(--bc-ink);
			outline-offset: 1px;
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-menu-sheet__links a:hover {
				background: #e8eaed;
				color: var(--bc-ink);
			}

			.mobile-menu-sheet__links a:hover .mobile-menu-sheet__link-icon {
				background: transparent;
			}
		}
	}

	@media (max-width: 359px) {
		.mobile-menu-sheet__sell {
			padding: 10px 104px 10px 12px;
		}

		.mobile-menu-sheet__sell-arrow {
			right: 9px;
			width: 28px;
			height: 28px;
		}

		.mobile-menu-sheet__sell-consultant {
			right: 32px;
			bottom: -6px;
			width: 64px;
			height: 64px;
		}
	}
</style>
