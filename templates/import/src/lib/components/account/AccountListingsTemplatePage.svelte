<script lang="ts">
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
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeListingsHtml}
	afterHtml={afterListingsHtml}
>
	{#if listingsHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html listingsHtml}
	{:else}
		<AccountListingsTable {listings} />
	{/if}
</AuxeroDashboardSlotShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-listings-html),
		:global(body.auxero-template-my-listings-html #wrapper),
		:global(body.auxero-template-my-listings-html .dashboard-container),
		:global(body.auxero-template-my-listings-html .dashboard-content) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner) {
			padding: 18px 14px 92px !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px !important;
			font-size: 30px !important;
			font-weight: 700 !important;
			line-height: 36px !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-box) {
			border: 1px solid var(--bc-border) !important;
			border-radius: var(--bc-radius-panel) !important;
			background: var(--bc-white) !important;
			padding: 14px !important;
		}

		/* The listings "cart" table is a 900px desktop grid that forces horizontal
		   scrolling on phones. Restack each row into a self-contained card with
		   labelled meta rows so it reads as a real mobile layout. */
		:global(body.auxero-template-my-listings-html .daynight-account-listings) {
			overflow: visible !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-header) {
			display: none !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-items) {
			display: grid !important;
			gap: 10px !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item) {
			display: flex !important;
			width: 100% !important;
			min-width: 0 !important;
			flex-direction: column !important;
			align-items: stretch !important;
			border: 1px solid var(--bc-border) !important;
			border-radius: var(--bc-radius-card) !important;
			background: var(--bc-white) !important;
			padding: 12px !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__product) {
			width: auto !important;
			min-width: 0 !important;
			padding-bottom: 10px !important;
		}
		:global(body.auxero-template-my-listings-html .cart-item__product .info),
		:global(body.auxero-template-my-listings-html .cart-item__name) {
			min-width: 0 !important;
			max-width: 100%;
		}
		:global(body.auxero-template-my-listings-html .cart-item__product p),
		:global(body.auxero-template-my-listings-html .cart-item__product a) {
			white-space: normal !important;
			overflow-wrap: anywhere;
			min-width: 0;
		}
		:global(body.auxero-template-my-listings-html .cart-item > div > span) {
			min-width: 0;
			overflow-wrap: anywhere;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__price),
		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__year),
		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__total),
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item > div:not([class])
		) {
			display: flex !important;
			width: auto !important;
			min-height: 40px !important;
			align-items: center !important;
			justify-content: space-between !important;
			gap: 12px !important;
			border-top: 1px solid var(--bc-border) !important;
			color: #111111 !important;
			font-size: 14px !important;
			font-weight: 600 !important;
		}

		:global(
			body.auxero-template-my-listings-html
				.daynight-account-listings
				.cart-item
				> [data-label]::before
		) {
			content: attr(data-label);
			flex: 0 0 auto !important;
			max-width: 48%;
			color: var(--bc-muted) !important;
			font-size: var(--bc-text-meta) !important;
			font-weight: var(--bc-weight-body) !important;
			text-transform: none !important;
		}
		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__action) {
			justify-content: flex-start !important;
			gap: 8px !important;
			border-top: 1px solid var(--bc-border) !important;
			padding-top: 10px !important;
			margin-top: 10px !important;
		}
		:global(body.auxero-template-my-listings-html .cart-item__action .action) {
			min-width: var(--bc-control-height-standard);
			min-height: var(--bc-control-height-standard);
		}

		/* Right-align the meta values so each row reads as label … value. */
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__price > span
		),
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__year > span
		),
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__total > span
		),
		:global(
			body.auxero-template-my-listings-html
				.daynight-account-listings
				.cart-item
				> div:not([class])
				> span
		) {
			margin-left: auto !important;
			text-align: right !important;
		}
	}
</style>
