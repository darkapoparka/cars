<script lang="ts">
	import AccountPasswordTemplatePage from '$lib/components/account/AccountPasswordTemplatePage.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let statusMessage = $derived(
		form?.passwordUnavailable
			? data.locale === 'en'
				? 'Demo only. Passwords are not changed or stored.'
				: 'Само демо. Паролите не се променят и не се съхраняват.'
			: ''
	);
</script>

<AccountPasswordTemplatePage
	afterPasswordHtml={data.afterPasswordHtml}
	beforePasswordHtml={data.beforePasswordHtml}
	pageDocument={data.pageDocument}
	password={data.password}
	passwordHtml={data.passwordHtml}
	{statusMessage}
/>
