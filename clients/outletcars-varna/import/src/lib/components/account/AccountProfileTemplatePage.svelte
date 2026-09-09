<script lang="ts">
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountProfileForm from './AccountProfileForm.svelte';

	let {
		afterProfileHtml,
		beforeProfileHtml,
		pageDocument,
		profile,
		profileHtml,
		statusMessage
	}: {
		afterProfileHtml: string;
		beforeProfileHtml: string;
		pageDocument: AuxeroPageDocument;
		profile: AuxeroAccountProfileFormData;
		profileHtml?: string;
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

	let profileHtmlWithStatus = $derived(
		profileHtml ? withFormStatus(profileHtml, statusMessage) : ''
	);
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeProfileHtml}
	afterHtml={afterProfileHtml}
>
	{#if profileHtmlWithStatus}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html profileHtmlWithStatus}
	{:else}
		<AccountProfileForm {profile} />
	{/if}
</AuxeroDashboardSlotShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-profile-html),
		:global(body.auxero-template-my-profile-html #wrapper),
		:global(body.auxero-template-my-profile-html .dashboard-container),
		:global(body.auxero-template-my-profile-html .dashboard-content) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-content--inner) {
			padding: 18px 14px 92px !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px !important;
			font-size: 30px !important;
			font-weight: 700 !important;
			line-height: 36px !important;
		}

		:global(body.auxero-template-my-profile-html .upload-btn) {
			min-height: var(--bc-control-height-compact) !important;
			border-radius: var(--bc-radius-md) !important;
			padding: 0 14px !important;
		}
	}
</style>
