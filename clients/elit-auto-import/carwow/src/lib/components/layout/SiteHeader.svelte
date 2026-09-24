<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
		void goto(
			i18n.href(resolve(nextQuery ? `/inventory?q=${encodeURIComponent(nextQuery)}` : '/inventory'))
		);
	}
</script>

<header class={cn('site-header', variant === 'home' && 'site-header--home')}>
	<div class="site-header__inner">
		<a
			class="site-header__logo"
			href={i18n.href(resolve('/'))}
			aria-label={`${daynightSite.shortName} home`}
		>
			<img
				src={i18n.asset(daynightSite.logoDark)}
				alt={daynightSite.name}
			/>
		</a>

		<nav
			class={cn('site-nav', menuOpen && 'site-nav--open')}
			aria-label={i18n.t('copy.e1bfe7eccc45')}
		>
			{#each navItems as item (item.href)}
				<a
					class={cn(
						'site-nav__link',
						(pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) &&
							'site-nav__link--active'
					)}
					href={i18n.href(resolve(item.href))}
					onclick={() => (menuOpen = false)}
				>
					{i18n.text(item.label)}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<a
				class="header-pill header-pill--outline"
				href={i18n.href(resolve('/admin/login'))}
				aria-label={i18n.t('copy.e995f23e0122')}
			>
				<User size={20} />
				<span>{i18n.t('copy.e995f23e0122')}</span>
			</a>
			<a class="header-pill header-pill--solid" href={i18n.href(resolve('/sell-your-car/request'))}>
				<Plus size={20} />
				<span>{i18n.t('copy.e72ca6df1e26')}</span>
			</a>
			<button
				class="icon-button"
				type="button"
				aria-label={i18n.t('copy.bfc95eff30e5')}
				onclick={() => (searchOpen = true)}
			>
				<Search size={23} />
			</button>
			<a
				class="icon-button icon-button--badge"
				href={i18n.href(resolve('/compare'))}
				aria-label={i18n.t('copy.52f6ad9e2fd8')}
			>
				<GitCompare size={23} />
				<span>{garage.compare.length}</span>
			</a>
			<a
				class="icon-button icon-button--badge"
				href={i18n.href(resolve('/favorites'))}
				aria-label={i18n.t('copy.2ff1cef08851')}
			>
				<Heart size={23} />
				<span>{garage.favorites.length}</span>
			</a>
			<button
				class="icon-button site-header__menu"
				type="button"
				aria-label={i18n.t('copy.122f71765026')}
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
	<div
		class="search-modal"
		role="dialog"
		aria-modal="true"
		aria-label={i18n.t('copy.bfc95eff30e5')}
	>
		<button
			class="search-modal__backdrop"
			type="button"
			aria-label={i18n.t('copy.e81fcb80c98b')}
			onclick={() => (searchOpen = false)}
		></button>
		<div class="search-modal__panel">
			<button
				class="search-modal__close"
				type="button"
				aria-label={i18n.t('copy.e81fcb80c98b')}
				onclick={() => (searchOpen = false)}
			>
				<X size={24} />
			</button>
			<p class="eyebrow">{i18n.t('copy.0b88620e4eaf')}</p>
			<form class="search-modal__form" onsubmit={submitSearch}>
				<input
					{@attach i18n.validation}
					bind:value={searchQuery}
					placeholder={i18n.t('copy.7c284d71211b')}
					aria-label={i18n.t('copy.0d36d8b6a16e')}
				/>
				<button class="btn btn-primary" type="submit">
					<Search size={20} />
					{i18n.t('copy.6517beda9674')}
				</button>
			</form>
		</div>
	</div>
{/if}
