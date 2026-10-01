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

<div class="account-profile-page">
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
</div>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-profile-html),
		:global(body.auxero-template-my-profile-html #wrapper),
		:global(body.auxero-template-my-profile-html .dashboard-container),
		:global(body.auxero-template-my-profile-html .dashboard-content) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.account-profile-page :global(.account-mobile-shell .dashboard-content--inner) {
			padding: var(--bc-space-4) var(--bc-mobile-gutter) var(--bc-space-6) !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px !important;
			font-size: 30px !important;
			font-weight: 700 !important;
			line-height: 36px !important;
		}

		.account-profile-page :global(.daynight-profile-form > .dashboard-box) {
			margin-bottom: var(--bc-space-4) !important;
			border: 1px solid var(--bc-border) !important;
			border-radius: var(--bc-radius-panel) !important;
			background: var(--bc-white) !important;
			background-color: var(--bc-white) !important;
			padding: var(--bc-space-4) !important;
		}
		.account-profile-page :global(.daynight-profile-form .h4) {
			margin-bottom: var(--bc-space-4) !important;
			font-size: var(--bc-mobile-section-title) !important;
			line-height: var(--bc-mobile-section-title-leading) !important;
		}
		.account-profile-page :global(.daynight-profile-form .hightlight-text) {
			margin-bottom: var(--bc-space-3) !important;
			padding: var(--bc-space-3) !important;
			font-size: var(--bc-mobile-body) !important;
			line-height: var(--bc-mobile-body-leading) !important;
		}
		.account-profile-page :global(.daynight-profile-form > .dashboard-box:first-child > .flex) {
			margin-bottom: var(--bc-space-6) !important;
		}
		.account-profile-page :global(.daynight-profile-form > .dashboard-box:first-child > .flex > a) {
			min-height: var(--bc-control-height-compact) !important;
			height: auto !important;
			border-color: var(--bc-border) !important;
			border-radius: var(--bc-radius-pill) !important;
			background: var(--bc-surface) !important;
			color: var(--bc-ink) !important;
			padding: var(--bc-space-1) var(--bc-space-3) !important;
			font-size: var(--bc-mobile-label) !important;
			line-height: 1.25 !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-section > .flex) {
			flex-direction: row !important;
			align-items: center !important;
			gap: var(--bc-space-3) !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-preview--avatar) {
			width: 72px !important;
			min-width: 72px !important;
			height: 72px !important;
			flex: 0 0 72px !important;
			border-radius: var(--bc-radius-pill) !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-content) {
			min-width: 0;
		}
		.account-profile-page :global(.daynight-profile-form .upload-content > p:first-child) {
			display: none;
		}
		.account-profile-page :global(.daynight-profile-form .upload-content > p) {
			font-size: var(--bc-mobile-label) !important;
			line-height: 1.25 !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-preview--poster-wrapper) {
			display: grid !important;
			gap: var(--bc-space-3) !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-preview--poster) {
			width: 100% !important;
			height: auto !important;
			aspect-ratio: 16 / 6;
			border-radius: var(--bc-radius-card) !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-preview--poster img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.account-profile-page :global(.daynight-profile-form .upload-action) {
			max-width: 100%;
			flex-wrap: wrap !important;
			gap: var(--bc-space-2) !important;
			border: 0 !important;
			background: transparent !important;
			padding: 0 !important;
		}
		.account-profile-page :global(.daynight-profile-form .upload-btn) {
			min-height: var(--bc-control-height-standard) !important;
			height: auto !important;
			max-width: 100%;
			border: 1px solid var(--bc-border) !important;
			border-radius: var(--bc-radius-control) !important;
			padding: var(--bc-space-2) var(--bc-space-3) !important;
			font-size: var(--bc-mobile-label) !important;
			line-height: 1.25 !important;
			white-space: normal;
		}
		.account-profile-page :global(.daynight-profile-form .file-name) {
			flex-basis: 100%;
			overflow-wrap: anywhere;
			font-size: 14px !important;
			line-height: 20px !important;
		}
		.account-profile-page :global(.daynight-profile-form input:not([type='file'])),
		.account-profile-page :global(.daynight-profile-form select),
		.account-profile-page :global(.daynight-profile-form textarea) {
			min-width: 0;
			border-radius: var(--bc-radius-control) !important;
			background: var(--bc-control) !important;
			font-size: var(--bc-mobile-body) !important;
		}
		.account-profile-page :global(.daynight-profile-form > .flex > button[type='submit']) {
			width: 100% !important;
			max-width: 100%;
			min-width: 0 !important;
			min-height: var(--bc-control-height-primary);
			height: auto !important;
			border-radius: var(--bc-radius-control) !important;
			padding-block: var(--bc-space-2);
			font-size: var(--bc-text-control) !important;
			line-height: 1.25 !important;
			white-space: normal !important;
			overflow-wrap: anywhere;
		}
	}
</style>
