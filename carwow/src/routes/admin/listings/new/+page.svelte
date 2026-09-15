<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import VehicleForm from '$lib/components/admin/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Admin - Add Listing</title>
</svelte:head>

<AdminShell title="Add listing" activePath="/admin/listings">
	<section class="px-4 lg:px-6">
		<VehicleForm {form} submitLabel="Create listing" />
	</section>
</AdminShell>
