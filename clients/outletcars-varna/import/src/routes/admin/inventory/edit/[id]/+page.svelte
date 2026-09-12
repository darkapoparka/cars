<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import AdminListingEditor from '$lib/components/admin/AdminListingEditor.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data, form } = $props();
	const listing = $derived(data.listing);
</script>

<svelte:head>
	<title>OUTLETCARS.BG — Варна Admin - Edit Listing</title>
</svelte:head>

<AdminShell title={listing?.title ?? 'Listing not found'} activePath="/admin/inventory">
	{#if listing}
		<span class="sr-only">Edit Listing</span>
		{#key listing.id}
			<AdminListingEditor
				{listing}
				{form}
				notice={data.notice}
				submitLabel={listing.source === 'admin-listing' ? 'Save changes' : 'Save draft copy'}
			/>
		{/key}
	{:else}
		<section class="grid gap-4 px-4 lg:px-6">
			<Card.Root>
				<Card.Header>
					<div class="min-w-0">
						<Card.Title>Listing not found</Card.Title>
						<Card.Description>
							The requested admin listing ID is not in the current CMS inventory state.
						</Card.Description>
					</div>
				</Card.Header>
				<Card.Content class="grid gap-3 text-sm">
					<div class="text-muted-foreground">Requested ID</div>
					<code class="bg-muted text-foreground rounded-md px-3 py-2 break-all">
						{data.missingListingId}
					</code>
				</Card.Content>
				<Card.Footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button href="/admin/inventory" variant="outline">Back to inventory</Button>
					<Button href="/admin/inventory/new">Create listing</Button>
				</Card.Footer>
			</Card.Root>
		</section>
	{/if}
</AdminShell>
