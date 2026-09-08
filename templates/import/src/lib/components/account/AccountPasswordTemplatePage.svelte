<script lang="ts">
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountPasswordForm from './AccountPasswordForm.svelte';

	let {
		afterPasswordHtml,
		beforePasswordHtml,
		pageDocument,
		password,
		passwordHtml,
		statusMessage
	}: {
		afterPasswordHtml: string;
		beforePasswordHtml: string;
		pageDocument: AuxeroPageDocument;
		password: AuxeroAccountPasswordFormData;
		passwordHtml?: string;
		statusMessage?: string;
	} = $props();

	const escapeHtml = (value: string) =>
		value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;');

	const withFormStatus = (html: string, message?: string) => {
		if (!message) return html;

		return html.replace(
			'</form>',
			`<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite">${escapeHtml(
				message
			)}</p></form>`
		);
	};

	let passwordHtmlWithStatus = $derived(
		passwordHtml ? withFormStatus(passwordHtml, statusMessage) : ''
	);
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforePasswordHtml}
	afterHtml={afterPasswordHtml}
>
	{#if passwordHtmlWithStatus}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html passwordHtmlWithStatus}
	{:else}
		<AccountPasswordForm {password} />
	{/if}
</AuxeroDashboardSlotShell>
