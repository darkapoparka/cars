<script lang="ts">
	import './dashlite-dashboard.css';
	import { resolve } from '$app/paths';
	import {
		Bell,
		Car,
		CircleUserRound,
		GitCompare,
		Heart,
		LayoutDashboard,
		LockKeyhole,
		LogOut,
		MessageSquare,
		Plus,
		Search,
		ShieldCheck,
		Star,
		Users
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { AuxeroDashboardPageData } from '$lib/auxero/dashboard';

	type DashboardNavHref =
		| '/account'
		| '/account/compare'
		| '/account/favorites'
		| '/account/listings'
		| '/account/listings/new'
		| '/account/messages'
		| '/account/password'
		| '/account/password?role=admin'
		| '/account/profile'
		| '/account/profile?role=admin'
		| '/admin'
		| '/admin/agents'
		| '/admin/inquiries'
		| '/admin/inventory'
		| '/admin/inventory/new'
		| '/admin/messages'
		| '/admin/users';
	type DashboardIcon = typeof LayoutDashboard;
	type DashboardNavItem = {
		href: DashboardNavHref;
		icon: DashboardIcon;
		id: string;
		label: string;
	};
	type DashboardNavGroup = {
		items: DashboardNavItem[];
		label: string;
	};

	let {
		active = 'dashboard',
		children,
		dashboard
	}: {
		active?: string;
		children: Snippet;
		dashboard: AuxeroDashboardPageData;
	} = $props();

	const initialsFor = (name: string) =>
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('') || 'BC';

	const adminNavigation: DashboardNavGroup[] = [
		{
			label: 'Overview',
			items: [{ href: '/admin', icon: LayoutDashboard, id: 'dashboard', label: 'Dashboard' }]
		},
		{
			label: 'Management',
			items: [
				{ href: '/admin/inventory', icon: Car, id: 'listings', label: 'Inventory' },
				{ href: '/admin/inventory/new', icon: Plus, id: 'add', label: 'Add Listing' },
				{ href: '/admin/inquiries', icon: Star, id: 'inquiries', label: 'Inquiries' },
				{ href: '/admin/messages', icon: MessageSquare, id: 'messages', label: 'Messages' },
				{ href: '/admin/agents', icon: CircleUserRound, id: 'agents', label: 'Agents' },
				{ href: '/admin/users', icon: Users, id: 'users', label: 'Users' }
			]
		},
		{
			label: 'Account',
			items: [
				{
					href: '/account/profile?role=admin',
					icon: CircleUserRound,
					id: 'profile',
					label: 'Profile'
				},
				{
					href: '/account/password?role=admin',
					icon: LockKeyhole,
					id: 'password',
					label: 'Password'
				}
			]
		}
	];

	const accountNavigation: DashboardNavGroup[] = [
		{
			label: 'Overview',
			items: [{ href: '/account', icon: LayoutDashboard, id: 'dashboard', label: 'Dashboard' }]
		},
		{
			label: 'Garage',
			items: [
				{ href: '/account/listings', icon: Car, id: 'listings', label: 'My Listings' },
				{ href: '/account/listings/new', icon: Plus, id: 'add', label: 'Submit Vehicle' },
				{ href: '/account/favorites', icon: Heart, id: 'favorites', label: 'My Favorites' },
				{ href: '/account/compare', icon: GitCompare, id: 'compare', label: 'My Compare' },
				{ href: '/account/messages', icon: MessageSquare, id: 'messages', label: 'Messages' }
			]
		},
		{
			label: 'Account',
			items: [
				{ href: '/account/profile', icon: CircleUserRound, id: 'profile', label: 'My Profile' },
				{ href: '/account/password', icon: LockKeyhole, id: 'password', label: 'Password' }
			]
		}
	];

	const navigationGroups = $derived(dashboard.isAdmin ? adminNavigation : accountNavigation);
	const flatNavigation = $derived(navigationGroups.flatMap((group) => group.items));
	const topAction = $derived(
		dashboard.isAdmin
			? ({ href: '/admin/inventory/new', icon: Plus, label: 'Add Listing' } as const)
			: ({ href: '/account/listings/new', icon: Plus, label: 'Submit Vehicle' } as const)
	);
	const PrimaryActionIcon = $derived(topAction.icon);
	const dashboardHome = $derived(dashboard.isAdmin ? '/admin' : '/account');
	const workspaceLabel = $derived(dashboard.isAdmin ? 'Admin workspace' : 'Client workspace');
	const avatarInitials = $derived(initialsFor(dashboard.sessionName));
	const mobileNavLabel = (item: DashboardNavItem) => {
		if (item.id === 'add') return dashboard.isAdmin ? 'Add' : 'Submit';
		if (item.id === 'listings') return dashboard.isAdmin ? 'Inventory' : 'Listings';
		if (item.id === 'favorites') return 'Favorites';
		if (item.id === 'compare') return 'Compare';

		return item.label;
	};
</script>

<svelte:head>
	<title>{dashboard.title} - Eliqauto</title>
</svelte:head>

<div class="dash-shell" data-eliqauto-dashboard>
	<aside class="dash-sidebar" aria-label="Dashboard navigation">
		<a href={resolve(dashboardHome)} class="dash-sidebar__brand">
			<span class="dash-brand-mark" aria-hidden="true">B</span>
			<span class="dash-brand-text">
				<span>Eliq</span><span>Auto</span>
			</span>
		</a>

		<div class="dash-sidebar__workspace">
			<p class="dash-kicker">{workspaceLabel}</p>
			<p class="m-0 truncate text-sm font-black text-[var(--dash-heading)]">
				{dashboard.sessionName}
			</p>
			<p class="m-0 truncate text-xs font-bold text-[var(--dash-muted)]">
				{dashboard.sessionEmail}
			</p>
		</div>

		<nav class="min-h-0 flex-1 overflow-y-auto pb-4">
			{#each navigationGroups as group (group.label)}
				<div class="dash-sidebar__group">
					<p class="dash-sidebar__label">{group.label}</p>
					<div class="dash-nav">
						{#each group.items as item (item.href)}
							{@const Icon = item.icon}
							<a
								href={resolve(item.href as '/')}
								class="dash-nav__item"
								data-eliqauto-menu-item={item.id}
								aria-current={item.id === active ? 'page' : undefined}
							>
								<Icon size={18} strokeWidth={2.1} aria-hidden="true" />
								<span>{item.label}</span>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</nav>

		<div class="border-t border-[var(--dash-border)] p-4">
			<a href={resolve('/')} class="dash-nav__item">
				<LogOut size={18} strokeWidth={2.1} aria-hidden="true" />
				<span>Logout</span>
			</a>
		</div>
	</aside>

	<div class="dash-main">
		<header class="dash-topbar">
			<div class="dash-topbar__inner">
				<a href={resolve(dashboardHome)} class="mr-auto block lg:hidden">
					<span class="inline-flex items-center gap-2">
						<span class="dash-brand-mark" aria-hidden="true">B</span>
						<span class="dash-brand-text text-sm">
							<span>Eliq</span><span>Auto</span>
						</span>
					</span>
				</a>

				<div class="dash-search">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
					<span>Search inventory, leads, messages</span>
				</div>

				<button
					type="button"
					class="dash-icon-button hidden md:inline-flex"
					aria-label="Notifications"
				>
					<Bell size={18} strokeWidth={2.1} aria-hidden="true" />
				</button>

				<div class="dash-user-button">
					<div class="dash-avatar">{avatarInitials}</div>
					<div class="min-w-0">
						<p class="m-0 truncate text-sm font-black">{dashboard.sessionName}</p>
						<p class="m-0 text-xs font-bold text-[var(--dash-muted)]">{dashboard.roleLabel}</p>
					</div>
				</div>

				<a href={resolve(topAction.href)} class="dash-primary-button" data-dashboard-primary-action>
					<PrimaryActionIcon size={17} strokeWidth={2.2} aria-hidden="true" />
					<span class="hidden sm:inline">{topAction.label}</span>
				</a>
			</div>

			<nav class="dash-mobile-nav dash-scrollbar-hide" aria-label="Dashboard shortcuts">
				{#each flatNavigation.slice(0, 7) as item (item.href)}
					{@const Icon = item.icon}
					<a
						href={resolve(item.href as '/')}
						class="dash-nav__item"
						data-eliqauto-menu-item={item.id}
						aria-current={item.id === active ? 'page' : undefined}
					>
						<Icon size={16} strokeWidth={2.1} aria-hidden="true" />
						{mobileNavLabel(item)}
					</a>
				{/each}
			</nav>
		</header>

		<main class="dash-content">
			<header class="dash-page-head">
				<div>
					<p class="dash-kicker">{workspaceLabel}</p>
					<h1 class="dash-title">{dashboard.title}</h1>
					<p class="dash-subtitle">{dashboard.subtitle}</p>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					<span class="dash-role-pill">
						<ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
						{dashboard.roleLabel}
					</span>
				</div>
			</header>

			{@render children()}
		</main>
	</div>
</div>
