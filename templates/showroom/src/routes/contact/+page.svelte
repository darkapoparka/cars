<script lang="ts">
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import ContactCleanPage from '$lib/components/contact/ContactCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<AuxeroPublicShell
	copy={data.shellCopy}
	footer={data.shellFooter}
	header={data.shellHeader}
	modals={data.shellModals}
	pageDocument={data.pageDocument}
	runtimeHtml={data.shellRuntimeHtml}
	title="Контакти — Eliqauto"
>
	<ContactCleanPage form={data.form} info={data.info} />
</AuxeroPublicShell>
