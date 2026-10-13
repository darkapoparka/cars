<script lang="ts">
	import type { AuxeroAccountListingFormData } from '$lib/auxero/account-listing-form';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountListingForm from './AccountListingForm.svelte';
	import MobileAccountListingForm from './MobileAccountListingForm.svelte';
	import { page } from '$app/state';
	import { routeParts } from '$lib/locale/core';

	let {
		afterFormHtml,
		beforeFormHtml,
		form,
		formHtml,
		pageDocument
	}: {
		afterFormHtml: string;
		beforeFormHtml: string;
		form: AuxeroAccountListingFormData;
		formHtml?: string;
		pageDocument: AuxeroPageDocument;
	} = $props();
	const customerForm = $derived(
		routeParts(page.url.pathname).path.startsWith('/account/listings/')
	);
</script>

<div class:customer-listing-form-page={customerForm}>
	<AuxeroDashboardSlotShell {pageDocument} beforeHtml={beforeFormHtml} afterHtml={afterFormHtml}>
		<div class:account-listing-form-desktop={customerForm}>
			{#if formHtml}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html formHtml}
			{:else}
				<AccountListingForm {form} />
			{/if}
		</div>
		{#if customerForm}<div class="account-listing-form-mobile">
				{#key form.submission?.id ?? 'new'}<MobileAccountListingForm {form} />{/key}
			</div>{/if}
	</AuxeroDashboardSlotShell>
</div>

<style>
	.account-listing-form-mobile {
		display: none;
	}
	@media (max-width: 767.98px) {
		.account-listing-form-mobile {
			display: block;
		}
		.account-listing-form-desktop {
			display: none;
		}
		.customer-listing-form-page :global(.title-section:has([data-daynight-form-target])) {
			display: none !important;
		}
		.customer-listing-form-page :global(.account-mobile-shell .dashboard-content--details),
		.customer-listing-form-page :global(.dashboard-box.bg-white) {
			border: 0 !important;
			padding: 0 !important;
			margin: 0 !important;
			background: transparent !important;
		}
	}
</style>
