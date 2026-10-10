<script lang="ts">
	import AccountProfileTemplatePage from '$lib/components/account/AccountProfileTemplatePage.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let statusMessage = $derived(
		form?.profileSaved
			? `Profile saved locally for ${data.profile.firstName} ${data.profile.lastName}`
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
