<script lang="ts">
	import type { AuxeroAccountListingFormData } from '$lib/auxero/account-listing-form';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountListingForm from './AccountListingForm.svelte';

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
</script>

<AuxeroDashboardSlotShell {pageDocument} beforeHtml={beforeFormHtml} afterHtml={afterFormHtml}>
	{#if formHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html formHtml}
	{:else}
		<AccountListingForm {form} />
	{/if}
</AuxeroDashboardSlotShell>
