<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { data } = $props();
	const statuses = ['draft', 'submitted', 'reviewing', 'published'];
	const activeImports = $derived(
		data.cms.imports.filter((submission) => submission.status !== 'published').length
	);
</script>

<svelte:head>
	<title>Day Night Auto Admin - Imports</title>
</svelte:head>

<AdminShell title="Imports" activePath="/admin/imports">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6" aria-label="Import summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Active requests</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(activeImports)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Total submissions</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.imports.length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Published stock created</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(
						data.cms.imports.filter((submission) => submission.status === 'published').length
					)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2">
		{#each data.cms.imports as submission (submission.id)}
			<Card.Root>
				<Card.Header class="border-b">
					<div class="min-w-0">
						<Card.Title class="truncate">{submission.title}</Card.Title>
						<Card.Description>
							{submission.vin} / {submission.mileage} / {submission.expectedPrice}
						</Card.Description>
					</div>
					<Card.Action>
						<Badge variant={statusVariant(submission.status)} class="capitalize">
							{formatStatus(submission.status)}
						</Badge>
					</Card.Action>
				</Card.Header>
				<Card.Content class="grid gap-4 p-4">
					<div class="grid gap-4 text-sm sm:grid-cols-2">
						<div>
							<p class="text-muted-foreground m-0 text-xs">Contact</p>
							<p class="m-0 font-medium">{submission.contactName}</p>
							<p class="text-muted-foreground m-0 text-xs">{submission.contactEmail}</p>
							<p class="text-muted-foreground m-0 text-xs">{submission.contactPhone}</p>
						</div>
						<div>
							<p class="text-muted-foreground m-0 text-xs">Created</p>
							<p class="m-0 font-medium">{formatDate(submission.createdAt)}</p>
							<p class="text-muted-foreground m-0 text-xs capitalize">
								{submission.source.replace('-', ' ')}
							</p>
						</div>
					</div>
					<form method="POST" class="grid gap-3">
						<input type="hidden" name="id" value={submission.id} />
						<div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem]">
							<div class="grid gap-2">
								<Label for={`import-title-${submission.id}`}>Review title</Label>
								<Input id={`import-title-${submission.id}`} name="title" value={submission.title} />
							</div>
							<div class="grid gap-2">
								<Label for={`import-status-${submission.id}`}>Status</Label>
								<select
									id={`import-status-${submission.id}`}
									name="status"
									class="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm capitalize outline-none focus-visible:ring-3"
								>
									{#each statuses as statusName (statusName)}
										<option value={statusName} selected={submission.status === statusName}>
											{formatStatus(statusName)}
										</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="grid gap-3 md:grid-cols-3">
							<div class="grid gap-2">
								<Label for={`import-vin-${submission.id}`}>VIN</Label>
								<Input id={`import-vin-${submission.id}`} name="vin" value={submission.vin} />
							</div>
							<div class="grid gap-2">
								<Label for={`import-mileage-${submission.id}`}>Mileage</Label>
								<Input
									id={`import-mileage-${submission.id}`}
									name="mileage"
									value={submission.mileage}
								/>
							</div>
							<div class="grid gap-2">
								<Label for={`import-price-${submission.id}`}>Expected price</Label>
								<Input
									id={`import-price-${submission.id}`}
									name="expectedPrice"
									value={submission.expectedPrice}
								/>
							</div>
						</div>
						<div class="grid gap-2">
							<Label for={`import-message-${submission.id}`}>Review note</Label>
							<Textarea
								id={`import-message-${submission.id}`}
								name="message"
								value={submission.message}
								class="min-h-20 resize-none"
							/>
						</div>
						<div class="pt-1">
							<Button type="submit" class="min-w-32">Save review</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		{/each}
	</section>
</AdminShell>
