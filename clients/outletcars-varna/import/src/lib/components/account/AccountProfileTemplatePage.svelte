<script lang="ts">
	import { page } from '$app/state';
	import { routeParts } from '$lib/locale/core';
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountProfileForm from './AccountProfileForm.svelte';
	import MobileAccountProfileForm from './MobileAccountProfileForm.svelte';

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
	const accountProfile = $derived(routeParts(page.url.pathname).path === '/account/profile');
</script>

<div class="account-profile-page">
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeProfileHtml}
		afterHtml={afterProfileHtml}
	>
		<div class:account-profile-desktop={accountProfile}>
			{#if profileHtmlWithStatus}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html profileHtmlWithStatus}
			{:else}
				<AccountProfileForm {profile} />
			{/if}
		</div>
		{#if accountProfile}<div class="account-profile-mobile">
				<MobileAccountProfileForm {profile} english={page.data.locale === 'en'} />
			</div>{/if}
	</AuxeroDashboardSlotShell>
</div>

<style>
	.account-profile-mobile {
		display: none;
	}
	@media (max-width: 767.98px) {
		.account-profile-desktop {
			display: none;
		}
		.account-profile-mobile {
			display: block;
		}
		.account-profile-page :global(.account-mobile-shell .dashboard-content--inner) {
			padding: var(--bc-space-4) var(--bc-mobile-gutter) var(--bc-space-6) !important;
		}
	}
</style>
