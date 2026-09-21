<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { routeParts } from '$lib/locale/core';
	import { page } from '$app/state';
	import Heart from '@lucide/svelte/icons/heart';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Search from '@lucide/svelte/icons/search';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { site, siteNavigation } from '$lib/config/site';
	import { linkHref } from '$lib/utils/links';
	import NavigationMenu from './NavigationMenu.svelte';
	import MobileAppbar from './MobileAppbar.svelte';
	import VehicleSearchDialog from '$lib/components/inventory/VehicleSearchDialog.svelte';
	let { mobile = true }: { mobile?: boolean } = $props();
	let searchOpen = $state(false);
	const garage = getGarageContext();
	const countId = $props.id();
	const english = $derived(page.data.locale === 'en');
	const labels: Record<string, string> = {
		'/': 'Home',
		'/inventory': 'Cars',
		'/services': 'Services',
		'/about': 'About',
		'/contact': 'Contact'
	};
	const groups = $derived<Record<string, { label: string; href: string }[]>>({
		'/inventory': [
			{ href: '/inventory', label: english ? 'All cars' : 'Всички автомобили' },
			{ href: '/compare', label: english ? 'Compare' : 'Сравни автомобили' },
			{ href: '/account/favorites', label: english ? 'Saved cars' : 'Любими автомобили' }
		],
		'/services': [
			{ href: '/import', label: english ? 'Import a car' : 'Внос на автомобил' },
			{ href: '/sell-your-car', label: english ? 'Sell your car' : 'Продай автомобил' },
			{ href: '/financing', label: english ? 'Financing' : 'Финансиране' },
			{ href: '/calculator', label: english ? 'Import calculator' : 'Калкулатор за внос' }
		],
		'/about': [
			{ href: '/about', label: english ? 'About us' : 'За нас' },
			{ href: '/blog', label: english ? 'Guides' : 'Полезно' },
			{ href: '/reviews', label: english ? 'Reviews' : 'Отзиви' },
			{ href: '/faqs', label: english ? 'Questions' : 'Въпроси' }
		]
	});
	const localizedHref = (href: string) =>
		english ? href + (href.includes('?') ? '&' : '?') + 'lang=en' : href;
</script>

{#if mobile}<div class="site-mobile-only"><MobileAppbar surface="dark" /></div>{/if}
<header class="site-header site-desktop-only">
	<div class="site-container site-header__inner">
		<a class="site-header__logo" href={linkHref(localizedHref('/'))} aria-label={site.identity.name}
			><img
				src={assetHref(site.identity.logoOnDark)}
				alt={site.identity.name}
				width="1744"
				height="512"
			/></a
		>
		<nav class="site-header__nav" aria-label={english ? 'Main navigation' : 'Основна навигация'}>
			{#each siteNavigation as item (item.href)}<NavigationMenu
					label={english ? labels[item.href] : item.label}
					href={localizedHref(item.href)}
					links={(groups[item.href] ?? []).map((link) => ({
						...link,
						href: localizedHref(link.href)
					}))}
					active={item.matchPrefixes.some(
						(prefix) =>
							routeParts(page.url.pathname).path === prefix ||
							(prefix !== '/' && routeParts(page.url.pathname).path.startsWith(prefix + '/'))
					)}
				/>{/each}
		</nav>
		<div class="site-header__actions">
			<a
				class="site-header__icon"
				href={linkHref(site.contact.phoneHref)}
				aria-label={english ? 'Call' : 'Обади се'}
				title={(english ? 'Call ' : 'Обади се: ') + site.contact.phoneHref.replace('tel:', '')}
				><PhoneCall size={22} strokeWidth={1.7} aria-hidden="true" /></a
			>
			<LocaleTrigger compact />
			<a
				class="site-header__icon site-header__account"
				href={linkHref('/account')}
				aria-label={english ? 'Account' : 'Профил'}
				title={english ? 'Account' : 'Профил'}
				><UserRound size={22} strokeWidth={1.7} aria-hidden="true" /></a
			>
			<button
				class="site-header__icon"
				type="button"
				onclick={() => (searchOpen = true)}
				aria-label={english ? 'Search cars' : 'Търси автомобили'}
				title={english ? 'Search cars' : 'Търси автомобили'}
				aria-haspopup="dialog"
				aria-expanded={searchOpen}><Search size={22} strokeWidth={1.7} aria-hidden="true" /></button
			>
			<a
				class="site-header__icon"
				href={linkHref(localizedHref('/compare'))}
				aria-label={english ? 'Compare' : 'Сравни'}
				aria-describedby={countId + '-compare'}
				title={(english ? 'Compare' : 'Сравни') + ' (' + garage.compare.length + ')'}
				><ArrowLeftRight size={22} strokeWidth={1.7} aria-hidden="true" />
				{#if garage.compare.length}<span class="site-header__badge" aria-hidden="true"
						>{garage.compare.length}</span
					>{/if}
				<span class="sr-only" id={countId + '-compare'}
					>{english ? 'Cars selected: ' : 'Избрани автомобили: '}{garage.compare.length}</span
				></a
			>
			<a
				class="site-header__icon"
				href={linkHref(localizedHref('/account/favorites'))}
				aria-label={english ? 'Saved cars' : 'Любими'}
				aria-describedby={countId + '-favorites'}
				title={(english ? 'Saved cars' : 'Любими') + ' (' + garage.favorites.length + ')'}
				><Heart size={22} strokeWidth={1.7} aria-hidden="true" />
				{#if garage.favorites.length}<span class="site-header__badge" aria-hidden="true"
						>{garage.favorites.length > 99 ? '99+' : garage.favorites.length}</span
					>{/if}
				<span class="sr-only" id={countId + '-favorites'}
					>{english ? 'Saved cars: ' : 'Запазени автомобили: '}{garage.favorites.length}</span
				></a
			>
		</div>
	</div>
</header>
<VehicleSearchDialog bind:open={searchOpen} {english} />

<style>
	.site-header {
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
	}
	.site-header__inner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		min-height: var(--bc-desktop-header-height);
		gap: var(--bc-space-6);
	}
	.site-header__actions {
		justify-self: end;
	}
	.site-header__logo {
		justify-self: start;
		flex: 0 1 200px;
		min-width: 100px;
		display: flex;
		align-items: center;
	}
	.site-header__logo img {
		width: 200px;
		height: auto;
		max-height: 64px;
		object-fit: contain;
	}
	.site-header__nav,
	.site-header__actions {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
	}
	.site-header__nav {
		justify-self: center;
		gap: var(--bc-space-3);
	}
	:global(.site-header__icon) {
		position: relative;
		display: grid;
		place-items: center;
		width: var(--bc-control-height-secondary);
		height: var(--bc-control-height-standard);
		background: transparent;
		border: 0;
		padding: 0;
		border-radius: var(--bc-radius-md);
		color: var(--bc-dark-muted);
		text-decoration: none;
	}
	:global(.site-header__icon:hover) {
		background: var(--bc-dark-hover);
		color: var(--bc-white);
	}
	:global(.site-language) {
		display: grid;
		z-index: var(--bc-z-popover);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-2);
		box-shadow: var(--bc-shadow-panel);
	}
	:global(.site-language a) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
		padding: var(--bc-space-2) var(--bc-space-4);
		text-decoration: none;
		color: var(--bc-ink);
	}
	:global(.site-language a:hover),
	:global(.site-language a[aria-current='true']) {
		background: var(--bc-surface);
	}
	.site-header__badge {
		position: absolute;
		top: 1px;
		right: -3px;
		display: grid;
		place-items: center;
		min-width: 19px;
		height: 19px;
		padding-inline: 4px;
		border: 2px solid var(--bc-mobile-dark);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		color: var(--bc-white);
		font-size: 11px;
		font-weight: var(--bc-weight-emphasis);
		line-height: 1;
		pointer-events: none;
	}
	@media (min-width: 768px) and (max-width: 1279px) {
		.site-header__inner {
			grid-template-columns: minmax(0, 1fr) auto;
			gap: var(--bc-space-2) var(--bc-space-4);
			padding-block: var(--bc-space-3);
		}
		.site-header__nav {
			grid-column: 1 / -1;
			grid-row: 2;
			width: 100%;
			justify-content: center;
		}
	}
</style>
