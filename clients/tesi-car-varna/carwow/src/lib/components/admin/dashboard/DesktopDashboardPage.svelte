<script lang="ts">
	import { resolve } from '$app/paths';
	import DesktopDashboardChangePassword from './DesktopDashboardChangePassword.svelte';
	import DesktopDashboardFavorites from './DesktopDashboardFavorites.svelte';
	import DesktopDashboardHomeOverview from './DesktopDashboardHomeOverview.svelte';
	import DesktopDashboardListings from './DesktopDashboardListings.svelte';
	import DesktopDashboardMessages from './DesktopDashboardMessages.svelte';
	import DesktopDashboardNewListing from './DesktopDashboardNewListing.svelte';
	import DesktopDashboardProfile from './DesktopDashboardProfile.svelte';
	import DesktopDashboardReviews from './DesktopDashboardReviews.svelte';
	import TrustedMutableTemplateHtml from '$lib/components/trusted-html/TrustedMutableTemplateHtml.svelte';
	import TrustedTemplateHtml from '$lib/components/trusted-html/TrustedTemplateHtml.svelte';
	import { daynightAccount } from '$lib/data/daynight-account';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { RawTemplatePageData } from '$lib/types/template-page';

	let { page }: { page: RawTemplatePageData } = $props();

	type DashboardMenuItem = {
		id: string;
		href: `/${string}`;
		icon: `/${string}`;
		label: string;
		active?: boolean;
		count?: string;
	};

	const dashboardTitleByRoute: Record<string, string> = {
		dashboard: daynightAccount.title,
		'dashboard/profile': daynightAccount.profileTitle,
		'dashboard/listings': daynightAccount.listingsTitle,
		'dashboard/listings/new': daynightAccount.newListingCta,
		'dashboard/messages': daynightAccount.messagesTitle,
		'dashboard/favorites': daynightAccount.favoritesTitle,
		'dashboard/reviews': daynightAccount.reviewsTitle,
		'dashboard/change-password': daynightAccount.passwordTitle
	};

	const dashboardTitle = $derived(dashboardTitleByRoute[page.routePath] ?? daynightAccount.title);
	const activeMenuId = $derived.by(() => {
		switch (page.routePath) {
			case 'dashboard/listings':
				return 'listings';
			case 'dashboard/listings/new':
				return 'sell-request';
			case 'dashboard/favorites':
				return 'favorites';
			case 'dashboard/reviews':
				return 'reviews';
			case 'dashboard/messages':
				return 'messages';
			case 'dashboard/profile':
				return 'profile-data';
			case 'dashboard/change-password':
				return 'security';
			default:
				return 'profile';
		}
	});
	const messagesMenuLabel = $derived(
		page.routePath === 'dashboard/messages' ? daynightAccount.messagesTitle : 'Съобщения'
	);
	const newListingMenuLabel = $derived(
		['dashboard', 'dashboard/listings', 'dashboard/listings/new'].includes(page.routePath)
			? daynightAccount.newListingCta
			: 'Автомобили'
	);
	const dashboardMenuItems = $derived.by((): DashboardMenuItem[] => [
		{
			id: 'profile',
			href: '/dashboard',
			icon: '/assets/images/dashboard/Dashboard.svg',
			label: daynightAccount.title,
			active: activeMenuId === 'profile'
		},
		{
			id: 'listings',
			href: '/dashboard/listings',
			icon: '/assets/images/dashboard/MyListing.svg',
			label: daynightAccount.listingsTitle,
			active: activeMenuId === 'listings'
		},
		{
			id: 'sell-request',
			href: '/sell-your-car/request',
			icon: '/assets/images/dashboard/AddListing.svg',
			label: newListingMenuLabel,
			active: activeMenuId === 'sell-request'
		},
		{
			id: 'favorites',
			href: '/dashboard/favorites',
			icon: '/assets/images/dashboard/MyFavorites.svg',
			label: daynightAccount.favoritesTitle,
			active: activeMenuId === 'favorites'
		},
		{
			id: 'reviews',
			href: '/dashboard/reviews',
			icon: '/assets/images/dashboard/MyReviews.svg',
			label: daynightAccount.reviewsTitle,
			active: activeMenuId === 'reviews'
		},
		{
			id: 'messages',
			href: '/dashboard/messages',
			icon: '/assets/images/dashboard/Messages.svg',
			label: messagesMenuLabel,
			active: activeMenuId === 'messages',
			count: '2'
		},
		{
			id: 'profile-data',
			href: '/dashboard/profile',
			icon: '/assets/images/dashboard/MyProfile.svg',
			label: daynightAccount.profileTitle,
			active: activeMenuId === 'profile-data'
		},
		{
			id: 'security',
			href: '/dashboard/change-password',
			icon: '/assets/images/dashboard/ChangePassword.svg',
			label: daynightAccount.passwordTitle,
			active: activeMenuId === 'security'
		},
		{
			id: 'logout',
			href: '/',
			icon: '/assets/images/dashboard/Logout.svg',
			label: 'Изход'
		}
	]);
</script>

<div class="dashboard-container">
	<div class="dashboard-sidebar">
		<a href={resolve('/')} class="logo">
			<img
				class="logo"
				src={resolve(daynightSite.logoLight)}
				alt="logo"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
		</a>

		<ul class="dashboard-menu">
			{#each dashboardMenuItems as item (item.id)}
				<li>
					<a
						href={resolve(item.href)}
						class={item.active ? 'dashboard-menu-item active' : 'dashboard-menu-item'}
					>
						<img
							src={resolve(item.icon)}
							alt="dashboard"
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
						{item.label}

						{#if item.count}
							<span class="number">{item.count}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<p class="dashboard-bottom text-muted text-center text-sm" style="margin-top: auto;">
			©2026 <a class="text-sm text-white" href={resolve('/')} target="_blank">Теси Кар</a>. All
			Rights Reserved.
		</p>
	</div>
	<div class="dashboard-content">
		<header class="header daynight-dashboard-header bg-white" id="header_main">
			<div class="header-container-fluid relative">
				<div class="header-inner daynight-dashboard-header__inner" id="site-header-inner">
					<a
						class="daynight-dashboard-header__brand daynight-header-logo"
						href={resolve('/')}
						aria-label={daynightSite.name}
					>
						<img
							class="daynight-header-logo__image"
							src={resolve(daynightSite.logoDark)}
							alt={daynightSite.name}
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
					</a>
					<div class="daynight-dashboard-header__summary">
						<span>Клиентски профил</span>
						<strong>{dashboardTitle}</strong>
					</div>
					<div class="daynight-dashboard-header__actions">
						<a class="daynight-dashboard-header__ghost" href={resolve('/inventory')}
							>Налични автомобили</a
						>
						<a class="daynight-dashboard-header__user" href={resolve('/dashboard/profile')}>
							<img
								class="avatar"
								src={resolve('/assets/images/dashboard/dashbroard_avatar.png')}
								alt=""
								data-daynight-img="1"
								decoding="async"
								loading="eager"
							/>
							<span>Клиентски профил</span>
						</a>
						<a class="daynight-dashboard-header__cta" href={resolve('/dashboard/listings/new')}>
							<span aria-hidden="true">+</span>
							Нова заявка за продажба
						</a>
					</div>
				</div>
			</div>
			<div class="mobile-menu-overlay"></div>
		</header>

		{#if page.routePath === 'dashboard'}
			<DesktopDashboardHomeOverview />
		{:else if page.routePath === 'dashboard/listings'}
			<DesktopDashboardListings />
		{:else if page.routePath === 'dashboard/listings/new'}
			<DesktopDashboardNewListing />
		{:else if page.routePath === 'dashboard/favorites'}
			<DesktopDashboardFavorites />
		{:else if page.routePath === 'dashboard/messages'}
			<DesktopDashboardMessages />
		{:else if page.routePath === 'dashboard/reviews'}
			<DesktopDashboardReviews />
		{:else if page.routePath === 'dashboard/profile'}
			<DesktopDashboardProfile />
		{:else if page.routePath === 'dashboard/change-password'}
			<DesktopDashboardChangePassword />
		{:else if page.dashboardContentInnerHtml}
			<TrustedMutableTemplateHtml html={page.dashboardContentInnerHtml} />
		{:else}
			<TrustedTemplateHtml html={page.mainHtml} />
		{/if}
	</div>
</div>
