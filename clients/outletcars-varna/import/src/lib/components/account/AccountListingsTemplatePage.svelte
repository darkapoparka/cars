<script lang="ts">
	import { page } from '$app/state';
	import { routeParts } from '$lib/locale/core';
	import MobileAccountListings from './MobileAccountListings.svelte';
	import type { AuxeroAccountListingsData } from '$lib/auxero/account-listings';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountListingsTable from './AccountListingsTable.svelte';

	let {
		afterListingsHtml,
		beforeListingsHtml,
		listings,
		listingsHtml,
		pageDocument
	}: {
		afterListingsHtml: string;
		beforeListingsHtml: string;
		listings: AuxeroAccountListingsData;
		listingsHtml?: string;
		pageDocument: AuxeroPageDocument;
	} = $props();
	const customerListings = $derived(
		routeParts(page.url.pathname).path === '/account/listings' && listings.isSubmissions
	);
</script>

<div class:customer-listings-page={customerListings}>
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeListingsHtml}
		afterHtml={afterListingsHtml}
	>
		<div class:account-listings-desktop={customerListings}>
			{#if listingsHtml}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html listingsHtml}
			{:else}
				<AccountListingsTable {listings} />
			{/if}
		</div>
		{#if customerListings}
			<div class="account-listings-mobile"><MobileAccountListings {listings} /></div>
		{/if}
	</AuxeroDashboardSlotShell>
</div>

<style>
	.account-listings-mobile {
		display: none;
	}
	@media (max-width: 767.98px) {
		.account-listings-mobile {
			display: block;
		}
		.account-listings-desktop {
			display: none;
		}
		.customer-listings-page :global(.dashboard-box > .flex:has(.search-form-listing)) {
			display: none !important;
		}
		.customer-listings-page :global(.account-mobile-shell .dashboard-content--details),
		.customer-listings-page :global(.dashboard-box.bg-white) {
			border: 0 !important;
			padding: 0 !important;
			margin: 0 !important;
			background: transparent !important;
		}
	}
</style>
