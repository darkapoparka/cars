<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import AdminListingEditor from '$lib/components/admin/AdminListingEditor.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Car Market Yorkshire Admin - Add Listing</title>
</svelte:head>

<AdminShell title="Add listing" activePath="/admin/inventory/new">
	<AdminListingEditor {form} mode="create" />
</AdminShell>
