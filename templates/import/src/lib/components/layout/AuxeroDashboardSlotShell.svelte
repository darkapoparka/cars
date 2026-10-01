<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { routeParts } from '$lib/locale/core';
	import { linkHref } from '$lib/utils/links';
	import MobilePageHero from '$lib/components/common/MobilePageHero.svelte';
	import MobileBottomNav from './MobileBottomNav.svelte';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from './AuxeroPageShell.svelte';
	import '$lib/components/account/dashlite-dashboard.css';

	type Props = {
		afterHtml: string;
		beforeHtml: string;
		children: Snippet;
		pageDocument: AuxeroPageDocument;
		preserveDetailsPrefix?: boolean;
		title?: string;
	};

	let {
		afterHtml,
		beforeHtml,
		children,
		pageDocument,
		preserveDetailsPrefix = true,
		title
	}: Props = $props();

	const accountPath = $derived(routeParts(page.url.pathname).path);
	const mobileAccount = $derived(
		accountPath.startsWith('/account') && accountPath !== '/account/messages'
	);
	const english = $derived(page.data.locale === 'en');
	const accountTitle = $derived.by(() => {
		if (accountPath === '/account/profile') return english ? 'Your profile' : 'Твоят профил';
		if (accountPath === '/account/password') return english ? 'Password' : 'Парола';
		if (accountPath === '/account/compare') return english ? 'Compare cars' : 'Сравни автомобили';
		if (accountPath === '/account/listings/new')
			return english ? 'Submit a car' : 'Подай автомобил';
		if (accountPath.startsWith('/account/listings/edit/'))
			return english ? 'Edit your car' : 'Редактирай автомобила';
		if (accountPath === '/account/listings') return english ? 'Your cars' : 'Твоите автомобили';
		if (accountPath.startsWith('/account/vehicles/'))
			return english ? 'Your car' : 'Твоят автомобил';
		return english ? 'Your account' : 'Твоят профил';
	});
	const accountLinks = $derived([
		{ href: '/account', label: english ? 'Overview' : 'Табло' },
		{ href: '/account/profile', label: english ? 'Profile' : 'Профил' },
		{ href: '/account/listings', label: english ? 'Cars' : 'Обяви' },
		{ href: '/account/messages', label: english ? 'Messages' : 'Съобщения' }
	]);
	const containerOpenTag = '<div class="dashboard-container">';
	const contentOpenTag = '<div class="dashboard-content">';
	const innerOpenTag = '<div class="dashboard-content--inner">';
	const detailsOpenTag = '<div class="dashboard-content--details">';

	let dashboardShell = $derived.by(() => {
		const containerStart = beforeHtml.lastIndexOf(containerOpenTag);

		if (containerStart < 0) return undefined;

		const contentStart = beforeHtml.indexOf(contentOpenTag, containerStart);

		if (contentStart < 0) return undefined;

		const innerStart = beforeHtml.indexOf(innerOpenTag, contentStart);
		const headerStart = contentStart + contentOpenTag.length;
		const headerEnd = innerStart < 0 ? beforeHtml.length : innerStart;
		const detailsStart = innerStart < 0 ? -1 : beforeHtml.indexOf(detailsOpenTag, innerStart);
		const innerPrefixStart = innerStart < 0 ? -1 : innerStart + innerOpenTag.length;
		const innerPrefixEnd = detailsStart < 0 ? beforeHtml.length : detailsStart;
		const detailsPrefixStart = detailsStart < 0 ? -1 : detailsStart + detailsOpenTag.length;
		const innerPrefixHtml =
			innerPrefixStart < 0 ? '' : beforeHtml.slice(innerPrefixStart, innerPrefixEnd);

		return {
			afterHtml: afterHtml.replace(/^(?:\s*<\/div>){1,4}/, ''),
			beforeHtml: beforeHtml.slice(0, containerStart),
			detailsPrefixHtml:
				preserveDetailsPrefix && detailsPrefixStart >= 0
					? beforeHtml.slice(detailsPrefixStart)
					: '',
			headerHtml: beforeHtml.slice(headerStart, headerEnd),
			hasInnerPrefix: innerPrefixHtml.trim().length > 0,
			innerPrefixHtml,
			sidebarHtml: beforeHtml.slice(containerStart + containerOpenTag.length, contentStart)
		};
	});
</script>

<div class:account-mobile-shell={mobileAccount}>
	{#if mobileAccount}<MobilePageHero title={accountTitle}>
			{#snippet actions()}<nav
					class="account-mobile-links"
					aria-label={english ? 'Account pages' : 'Страници на профила'}
				>
					{#each accountLinks as item (item.href)}<a
							href={linkHref(item.href + (english ? '?lang=en' : ''))}
							aria-current={accountPath === item.href ? 'page' : undefined}>{item.label}</a
						>{/each}
				</nav>{/snippet}
		</MobilePageHero>{/if}
	{#if dashboardShell}
		<AuxeroPageShell
			{pageDocument}
			beforeHtml={dashboardShell.beforeHtml}
			afterHtml={dashboardShell.afterHtml}
		>
			<div class="dashboard-container">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html dashboardShell.sidebarHtml}
				<div class="dashboard-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html dashboardShell.headerHtml}
					<div class="dashboard-content--inner">
						{#if dashboardShell.hasInnerPrefix}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html dashboardShell.innerPrefixHtml}
						{:else if title}
							<p class="h3 mb-30">{title}</p>
						{/if}
						<div class="dashboard-content--details" data-daynight-dashboard>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html dashboardShell.detailsPrefixHtml}
							{@render children()}
						</div>
					</div>
				</div>
			</div>
		</AuxeroPageShell>
	{:else}
		<AuxeroPageShell {pageDocument} {beforeHtml} {afterHtml}>
			{@render children()}
		</AuxeroPageShell>
	{/if}

	{#if mobileAccount}<MobileBottomNav pathname={accountPath} />{/if}
</div>

<style>
	.account-mobile-links {
		display: flex;
		gap: var(--bc-space-4);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.account-mobile-links a {
		flex: none;
		display: flex;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		padding-inline: var(--bc-space-1);
		color: var(--bc-dark-muted);
		border-bottom: 2px solid transparent;
		text-decoration: none;
		font: var(--bc-weight-control) var(--bc-text-mode-tab)/1.2 var(--bc-font-body);
	}
	.account-mobile-links a[aria-current='page'] {
		color: var(--bc-white);
		border-bottom-color: var(--bc-white);
	}
	@media (max-width: 767.98px) {
		.account-mobile-shell {
			--bc-bg: var(--bc-bg-strong);
			background: var(--bc-bg-strong);
			min-height: calc(100dvh - var(--bc-mobile-nav-height));
			padding-bottom: var(--bc-mobile-nav-height);
		}
		:global(body.dashboard:has(.account-mobile-shell)) {
			height: auto !important;
			overflow: auto !important;
		}
		.account-mobile-shell :global(.dashboard-sidebar),
		.account-mobile-shell :global(.dashboard-content > .header),
		.account-mobile-shell :global(.dashboard-content--inner > .h3),
		.account-mobile-shell :global(.dashboard-content--details > .h3),
		.account-mobile-shell :global(.dashboard-menu-toggle-input),
		.account-mobile-shell :global(.dashboard-menu-backdrop),
		.account-mobile-shell :global(.dashboard-toggle-btn) {
			display: none !important;
		}
		.account-mobile-shell :global(.dashboard-container),
		.account-mobile-shell :global(.dashboard-content) {
			height: auto !important;
			min-height: 0 !important;
			max-height: none !important;
			min-width: 0 !important;
			width: 100% !important;
			margin: 0 !important;
			overflow: visible !important;
			background: var(--bc-bg-strong) !important;
		}
		.account-mobile-shell :global(.dashboard-content--inner) {
			height: auto !important;
			max-height: none !important;
			padding: var(--bc-space-4) var(--bc-mobile-gutter) var(--bc-space-6) !important;
			overflow: visible !important;
		}
		.account-mobile-shell :global(.dashboard-content--details) {
			min-width: 0;
		}
		.account-mobile-shell :global(.dashboard-box) {
			border-radius: var(--bc-radius-panel) !important;
			background: var(--bc-white) !important;
		}
		.account-mobile-shell :global(.dashboard-content--details > .grid:first-of-type) {
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
		}
		.account-mobile-shell :global(.dashboard-cart) {
			min-width: 0;
			gap: var(--bc-space-2);
		}
		.account-mobile-shell :global(.dashboard-cart .icon) {
			width: 36px !important;
			min-width: 36px !important;
			height: 36px !important;
			flex-basis: 36px !important;
			padding: var(--bc-space-2) !important;
		}
		.account-mobile-shell :global(.dashboard-cart > div:first-child) {
			min-width: 0;
		}
	}
</style>
