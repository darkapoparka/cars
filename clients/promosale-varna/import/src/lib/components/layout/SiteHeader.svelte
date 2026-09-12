<script lang="ts">
	import { goto } from '$app/navigation';
	import { GitCompare, Heart, Menu, Plus, Search, User, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightAssets, isPrimaryNavActive, mainNavigation } from '$lib/data/daynight';
	import { cn } from '$lib/utils';
	import { getGarageContext } from '$lib/state/garage.svelte';

	interface Props {
		variant?: 'home' | 'light';
		pathname?: string;
	}

	let { variant = 'light', pathname = '/' }: Props = $props();
	const garage = getGarageContext();
	let menuOpen = $state(false);
	let searchOpen = $state(false);
	let searchQuery = $state('');

	const navItems = mainNavigation;

	async function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const query = searchQuery.trim();
		const target = query ? `/inventory?q=${encodeURIComponent(query)}` : '/inventory';
		searchOpen = false;
		await goto(resolve(target as `/inventory${string}`));
	}
</script>

<header class={cn('site-header', variant === 'home' && 'site-header--home')}>
	<div class="site-header__inner">
		<a class="site-header__logo" href={resolve('/')} aria-label="Promosale Varna начало">
			<img
				src={variant === 'home' ? daynightAssets.logoDark : daynightAssets.logoLight}
				alt="Promosale Varna"
			/>
		</a>

		<nav class={cn('site-nav', menuOpen && 'site-nav--open')} aria-label="Основна навигация">
			{#each navItems as item (item.href)}
				<a
					class={cn(
						'site-nav__link',
						isPrimaryNavActive(pathname, item) && 'site-nav__link--active'
					)}
					href={resolve(item.href)}
					onclick={() => (menuOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<a class="header-pill header-pill--outline" href={resolve('/account')} aria-label="Вход">
				<User size={20} />
				<span>Вход</span>
			</a>
			<a class="header-pill header-pill--solid" href={resolve('/sell-your-car')}>
				<Plus size={20} />
				<span>Продай автомобил</span>
			</a>
			<button
				class="icon-button"
				type="button"
				aria-label="Търсене"
				onclick={() => (searchOpen = true)}
			>
				<Search size={23} />
			</button>
			<a class="icon-button icon-button--badge" href={resolve('/compare')} aria-label="Сравни">
				<GitCompare size={23} />
				<span>{garage.compare.length}</span>
			</a>
			<a
				class="icon-button icon-button--badge"
				href={resolve('/account/favorites')}
				aria-label="Любими"
			>
				<Heart size={23} />
				<span>{garage.favorites.length}</span>
			</a>
			<button
				class="icon-button site-header__menu"
				type="button"
				aria-label="Отвори навигация"
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>
	</div>
</header>

{#if searchOpen}
	<div class="search-modal" role="dialog" aria-modal="true" aria-label="Търсене в сайта">
		<button
			class="search-modal__backdrop"
			type="button"
			aria-label="Затвори търсенето"
			onclick={() => (searchOpen = false)}
		></button>
		<div class="search-modal__panel">
			<button
				class="search-modal__close"
				type="button"
				aria-label="Затвори търсенето"
				onclick={() => (searchOpen = false)}
			>
				<X size={24} />
			</button>
			<p class="eyebrow">Какво търсиш?</p>
			<form class="search-modal__form" onsubmit={submitSearch}>
				<input
					bind:value={searchQuery}
					placeholder="Търси марка, модел, VIN..."
					aria-label="Търси в наличните автомобили"
				/>
				<button class="btn btn-primary" type="submit">
					<Search size={20} />
					Търси
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.site-header,
	.search-modal {
		font-family: var(--bc-font-body);
		letter-spacing: 0;
	}

	.site-header *,
	.search-modal * {
		box-sizing: border-box;
	}

	.site-header a,
	.search-modal a {
		color: inherit;
		text-decoration: none;
	}

	.site-header button,
	.search-modal button,
	.search-modal input {
		font: inherit;
		letter-spacing: 0;
	}

	.site-header img {
		display: block;
		max-width: 100%;
	}

	.site-header {
		position: relative;
		z-index: 20;
		background: #ffffff;
		color: #1c1c1c;
		border-bottom: 1px solid #e8ece4;
	}

	.site-header--home {
		position: absolute;
		inset: 18px 0 auto;
		background: transparent;
		color: #ffffff;
		border-bottom: 0;
	}

	.site-header__inner {
		display: flex;
		width: min(calc(100% - 40px), 1840px);
		height: 92px;
		align-items: center;
		margin-inline: auto;
		gap: 28px;
	}

	.site-header--home .site-header__inner {
		width: min(calc(100% - 120px), 1320px);
		border-bottom: 1px solid rgb(255 255 255 / 0.2);
	}

	.site-header__logo img {
		width: 176px;
		height: auto;
	}

	.site-nav {
		display: flex;
		align-items: center;
		gap: 28px;
		margin-left: auto;
	}

	.site-nav__link {
		position: relative;
		color: inherit;
		font-size: 1rem;
		font-weight: 750;
		opacity: 0.86;
	}

	.site-nav__link--active,
	.site-nav__link:hover {
		opacity: 1;
	}

	.site-nav__link--active::after {
		position: absolute;
		right: 0;
		bottom: -14px;
		left: 0;
		height: 3px;
		border-radius: 99px;
		background: var(--bc-accent);
		content: '';
	}

	.site-header__actions {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: 18px;
	}

	.header-pill {
		display: inline-flex;
		height: 52px;
		align-items: center;
		gap: 10px;
		border-radius: 12px;
		padding: 0 20px;
		font-weight: 800;
		white-space: nowrap;
	}

	.header-pill--outline {
		border: 2px solid currentColor;
	}

	.site-header .header-pill--solid {
		background: #1c1c1c;
		color: #ffffff;
	}

	.site-header--home .header-pill--solid {
		background: #ffffff;
		color: #1c1c1c;
	}

	.icon-button {
		position: relative;
		display: inline-flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	.icon-button--badge span {
		position: absolute;
		top: 5px;
		right: 3px;
		display: grid;
		min-width: 18px;
		height: 18px;
		place-items: center;
		border-radius: 50%;
		background: var(--bc-accent);
		color: #ffffff;
		font-size: 0.68rem;
		font-weight: 800;
	}

	.site-header__menu {
		display: none;
	}

	.search-modal {
		position: fixed;
		inset: 0;
		z-index: 80;
		display: grid;
		place-items: center;
		padding: 24px;
	}

	.search-modal__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgb(0 0 0 / 0.68);
		cursor: pointer;
	}

	.search-modal__panel {
		position: relative;
		z-index: 1;
		width: min(720px, 100%);
		border-radius: 28px;
		background: #ffffff;
		padding: 42px;
		box-shadow: 0 24px 80px rgb(0 0 0 / 0.16);
	}

	.search-modal__close {
		position: absolute;
		top: 18px;
		right: 18px;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.search-modal__form {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px;
	}

	.search-modal__form input {
		width: 100%;
		border: 1px solid #e8ece4;
		border-radius: 14px;
		background: #ffffff;
		padding: 14px 16px;
		outline: none;
	}

	.search-modal__form .btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #ffffff;
		padding: 0 22px;
		font-weight: 800;
		cursor: pointer;
	}

	@media (max-width: 1180px) {
		.site-nav {
			position: fixed;
			top: 92px;
			right: 16px;
			left: 16px;
			display: none;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			border-radius: 20px;
			background: #ffffff;
			color: #1c1c1c;
			padding: 18px;
			box-shadow: 0 24px 80px rgb(0 0 0 / 0.16);
		}

		.site-nav--open {
			display: flex;
		}

		.site-header__menu {
			display: inline-flex;
		}

		.header-pill span {
			display: none;
		}

		.header-pill {
			width: 52px;
			justify-content: center;
			padding: 0;
		}
	}

	@media (max-width: 820px) {
		.site-header__inner {
			width: min(calc(100% - 24px), 1840px);
			height: 76px;
			gap: 12px;
		}

		.site-header--home .site-header__inner {
			width: min(calc(100% - 24px), 1840px);
		}

		.site-header__logo img {
			width: 140px;
		}

		.site-header__actions {
			gap: 2px;
			margin-left: auto;
		}

		.header-pill {
			display: none;
		}
	}

	@media (max-width: 520px) {
		.site-header--home {
			inset: 10px 0 auto;
		}

		.icon-button {
			width: 42px;
			height: 42px;
		}

		.search-modal__form {
			grid-template-columns: 1fr;
		}

		.search-modal__panel {
			padding: 34px 20px 22px;
		}
	}
</style>
