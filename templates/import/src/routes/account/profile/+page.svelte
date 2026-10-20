<script lang="ts">
	import AccountProfileTemplatePage from '$lib/components/account/AccountProfileTemplatePage.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let statusMessage = $derived(
		form?.profileUnavailable
			? data.locale === 'en'
				? 'Demo only. Profile changes are not saved.'
				: 'Само демо. Промените в профила не се запазват.'
			: ''
	);
</script>

<AccountProfileTemplatePage
	afterProfileHtml={data.afterProfileHtml}
	beforeProfileHtml={data.beforeProfileHtml}
	pageDocument={data.pageDocument}
	profile={data.profile}
	profileHtml={data.profileHtml}
	{statusMessage}
/>
