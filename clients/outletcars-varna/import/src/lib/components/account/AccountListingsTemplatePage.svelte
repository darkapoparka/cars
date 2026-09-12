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
			border-radius: 8px !important;
			background: var(--bc-surface) !important;
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
			border-radius: 8px !important;
			background: var(--bc-surface) !important;
			padding: 12px !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__product) {
			width: auto !important;
			min-width: 0 !important;
			padding-bottom: 10px !important;
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
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__price
		)::before {
			content: 'Контакт';
		}

		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__year
		)::before {
			content: 'Очаквана цена';
		}

		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__total
		)::before {
			content: 'Пробег';
		}

		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item > div:not([class])
		)::before {
			content: 'Статус';
		}

		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__price
		)::before,
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__year
		)::before,
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item__total
		)::before,
		:global(
			body.auxero-template-my-listings-html .daynight-account-listings .cart-item > div:not([class])
		)::before {
			flex: 0 0 auto !important;
			color: #6b7280 !important;
			font-size: 12px !important;
			font-weight: 500 !important;
			text-transform: uppercase !important;
		}

		:global(body.auxero-template-my-listings-html .daynight-account-listings .cart-item__action) {
			justify-content: flex-start !important;
			gap: 8px !important;
			border-top: 1px solid var(--bc-border) !important;
			padding-top: 10px !important;
			margin-top: 10px !important;
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
