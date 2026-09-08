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
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner) {
			padding: 18px 14px 92px;
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px;
			font-size: 30px;
			font-weight: 700;
			line-height: 36px;
		}

		:global(body.auxero-template-my-listings-html .dashboard-toggle-btn) {
			min-height: 46px;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-control);
			box-shadow: none;
			color: #1c1c1c;
			padding: 0 18px;
			font-size: 16px;
			line-height: 20px;
		}

		:global(body.auxero-template-my-listings-html .dashboard-toggle-btn:hover) {
			background: var(--bc-control-hover);
		}

		:global(body.auxero-template-my-listings-html .dashboard-box) {
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 14px;
		}

		/* The listings "cart" table is a 900px desktop grid that forces horizontal
		   scrolling on phones. Restack each row into a self-contained card with
		   labelled meta rows so it reads as a real mobile layout. */
		:global(body.auxero-template-my-listings-html .eliqauto-account-listings) {
			overflow: visible;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-header) {
			display: none;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-items) {
			display: grid;
			gap: 10px;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item) {
			display: flex;
			width: 100%;
			min-width: 0;
			flex-direction: column;
			align-items: stretch;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__product) {
			width: auto;
			min-width: 0;
			padding-bottom: 10px;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__price),
		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__year),
		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__total),
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item > div:not([class])
		) {
			display: flex;
			width: auto;
			min-height: 40px;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			border-top: 1px solid var(--bc-border);
			color: #111111;
			font-size: 14px;
			font-weight: 600;
		}

		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__price
		)::before {
			content: 'Контакт';
		}

		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__year
		)::before {
			content: 'Очаквана цена';
		}

		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__total
		)::before {
			content: 'Пробег';
		}

		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item > div:not([class])
		)::before {
			content: 'Статус';
		}

		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__price
		)::before,
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__year
		)::before,
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__total
		)::before,
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item > div:not([class])
		)::before {
			flex: 0 0 auto;
			color: #6b7280;
			font-size: var(--bc-text-micro);
			font-weight: 500;
			text-transform: uppercase;
		}

		:global(body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__action) {
			justify-content: flex-start;
			gap: 8px;
			border-top: 1px solid var(--bc-border);
			padding-top: 10px;
			margin-top: 10px;
		}

		/* Right-align the meta values so each row reads as label … value. */
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__price > span
		),
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__year > span
		),
		:global(
			body.auxero-template-my-listings-html .eliqauto-account-listings .cart-item__total > span
		),
		:global(
			body.auxero-template-my-listings-html
				.eliqauto-account-listings
				.cart-item
				> div:not([class])
				> span
		) {
			margin-left: auto;
			text-align: right;
		}
	}
</style>
