<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Eliqauto Admin - Settings</title>
</svelte:head>

<AdminShell title="Settings" activePath="/admin/settings">
	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
		{#each data.cms.settings as setting (setting.title)}
			<Card.Root>
				<Card.Header>
					<Card.Action>
						<Badge variant="outline">{setting.status}</Badge>
					</Card.Action>
					<Card.Title>{setting.title}</Card.Title>
					<Card.Description>{setting.description}</Card.Description>
				</Card.Header>
			</Card.Root>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
		<Card.Root>
			<Card.Header class="border-b">
				<Card.Title>Staff session</Card.Title>
				<Card.Description>Current authenticated workspace identity.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3 p-4 text-sm">
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Name</span>
					<span class="font-medium">{data.session.name}</span>
				</div>
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Email</span>
					<span class="font-medium">{data.session.email}</span>
				</div>
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Role</span>
					<span class="font-medium capitalize">{data.session.role}</span>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<Card.Title>CMS scope</Card.Title>
				<Card.Description>Route coverage for the current shadcn admin workspace.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3 p-4 text-sm">
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Inventory records</span>
					<span class="font-medium">{data.cms.inventory.length}</span>
				</div>
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Lead records</span>
					<span class="font-medium">{data.cms.inquiries.length}</span>
				</div>
				<div class="flex justify-between gap-4">
					<span class="text-muted-foreground">Managed users</span>
					<span class="font-medium">{data.cms.users.length}</span>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
