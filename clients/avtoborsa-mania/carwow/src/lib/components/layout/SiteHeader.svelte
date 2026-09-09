<script lang="ts">
	import { GitCompare, Heart, Menu, Plus, Search, User, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { publicNavItems, daynightSite } from '$lib/data/daynight-site';
	import { cn } from '$lib/utils.js';
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

	const navItems = publicNavItems;

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		searchOpen = false;
		const nextQuery = searchQuery.trim();
		void goto(resolve(nextQuery ? `/inventory?q=${encodeURIComponent(nextQuery)}` : '/inventory'));
	}
</script>

<header class={cn('site-header', variant === 'home' && 'site-header--home')}>
	<div class="site-header__inner">
		<a class="site-header__logo" href={resolve('/')} aria-label="Мания home">
			<img
				src={variant === 'home' ? daynightSite.logoLight : daynightSite.logoDark}
				alt={daynightSite.name}
			/>
		</a>

		<nav class={cn('site-nav', menuOpen && 'site-nav--open')} aria-label="Primary navigation">
			{#each navItems as item (item.href)}
				<a
					class={cn(
						'site-nav__link',
						(pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) &&
							'site-nav__link--active'
					)}
					href={resolve(item.href)}
					onclick={() => (menuOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<a
				class="header-pill header-pill--outline"
				href={resolve('/admin/login')}
				aria-label="Екип вход"
			>
				<User size={20} />
				<span>Екип вход</span>
			</a>
			<a class="header-pill header-pill--solid" href={resolve('/sell-your-car/request')}>
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
				href={resolve('/favorites')}
				aria-label="Запазени автомобили"
			>
				<Heart size={23} />
				<span>{garage.favorites.length}</span>
			</a>
			<button
				class="icon-button site-header__menu"
				type="button"
				aria-label="Меню"
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
	<div class="search-modal" role="dialog" aria-modal="true" aria-label="Търсене">
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
			<p class="eyebrow">Какъв автомобил търсите?</p>
			<form class="search-modal__form" onsubmit={submitSearch}>
				<input
					bind:value={searchQuery}
					placeholder="Марка, модел, година, гориво..."
					aria-label="Търсене в наличността"
				/>
				<button class="btn btn-primary" type="submit">
					<Search size={20} />
					Търси
				</button>
			</form>
		</div>
	</div>
{/if}
