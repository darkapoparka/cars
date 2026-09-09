<script lang="ts">
	import { resolve } from '$app/paths';
	import Ban from '@lucide/svelte/icons/ban';
	import Search from '@lucide/svelte/icons/search';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminRowCheckbox from '$lib/components/admin/AdminRowCheckbox.svelte';
	import AdminSelect from '$lib/components/admin/AdminSelect.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatDate, formatNumber } from '$lib/components/admin/format';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const bulkFormId = 'imports-bulk-form';
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'new', label: 'New' },
		{ value: 'sourcing', label: 'Sourcing' },
		{ value: 'quoted', label: 'Quoted' },
		{ value: 'deposit_pending', label: 'Deposit' },
		{ value: 'purchased', label: 'Purchased' },
		{ value: 'in_transit', label: 'Transit' },
		{ value: 'customs', label: 'Customs' },
		{ value: 'ready_for_delivery', label: 'Ready' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'cancelled', label: 'Cancelled' }
	] as const;
	const importStatusOptions = statusOptions.filter((option) => option.value !== 'all');

	const metrics = $derived([
		{
			label: 'All requests',
			value: data.importCounts.all,
			status: 'all',
			detail: 'Import records'
		},
		{ label: 'New', value: data.importCounts.new, status: 'new', detail: 'Needs qualification' },
		{
			label: 'Sourcing',
			value: data.importCounts.sourcing + data.importCounts.quoted,
			status: 'sourcing',
			detail: 'Supplier work'
		},
		{
			label: 'Transit',
			value: data.importCounts.in_transit + data.importCounts.customs,
			status: 'in_transit',
			detail: 'Logistics'
		},
		{
			label: 'Ready',
			value: data.importCounts.ready_for_delivery,
			status: 'ready_for_delivery',
			detail: 'Delivery prep'
		},
		{
			label: 'Closed',
			value: data.importCounts.delivered + data.importCounts.cancelled,
			status: 'delivered',
			detail: 'Delivered/cancelled'
		}
	]);

	function filterHref(status: string) {
		const params = new SvelteURLSearchParams();
		if (status !== 'all') params.set('status', status);
		if (data.filters.query) params.set('q', data.filters.query);
		const suffix = params.toString();
		return resolve(`/admin/imports${suffix ? `?${suffix}` : ''}`);
	}

	function formatRequestVehicle(request: PageProps['data']['imports'][number]) {
		const yearRange = [request.desired_year_min, request.desired_year_max]
			.filter(Boolean)
			.join('-');
		const vehicle = [request.desired_make, request.desired_model].filter(Boolean).join(' ');
		return [vehicle || 'Open brief', yearRange].filter(Boolean).join(' / ');
	}

	function formatBudget(request: PageProps['data']['imports'][number]) {
		const min = request.budget_min ? formatNumber(request.budget_min) : null;
		const max = request.budget_max ? formatNumber(request.budget_max) : null;

		if (min && max) return `${min} - ${max} EUR`;
		if (min) return `From ${min} EUR`;
		if (max) return `Up to ${max} EUR`;

		return 'No budget';
	}
</script>

<svelte:head>
	<title>Admin - Imports</title>
</svelte:head>

<AdminShell title="Imports" activePath="/admin/imports">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 @5xl/main:grid-cols-6">
		{#each metrics as metric (metric.label)}
			<Card.Root size="sm">
				<Card.Header>
					<Card.Description>{metric.label}</Card.Description>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(metric.value)}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="text-muted-foreground text-sm">{metric.detail}</Card.Footer>
			</Card.Root>
		{/each}
	</section>

	<section class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Import pipeline</Card.Title>
					<Card.Description>
						Manage sourcing briefs, buyer budgets, route details, and import request states.
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				{#if form?.error}<AdminMessage tone="error">{form.error}</AdminMessage>{/if}
				{#if data.notice}<AdminMessage tone="notice">{data.notice}</AdminMessage>{/if}

				<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<form
						class="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
						method="GET"
						action={resolve('/admin/imports')}
					>
						<input type="hidden" name="status" value={data.filters.status} />
						<div class="relative flex-1">
							<Search
								class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
								aria-hidden="true"
							/>
							<Input
								class="pl-8"
								name="q"
								value={data.filters.query}
								placeholder="Search buyer, vehicle, country, notes"
								autocomplete="off"
							/>
						</div>
						<Button type="submit" variant="outline">Search</Button>
					</form>

					<div class="flex max-w-4xl flex-wrap justify-end gap-2">
						{#each statusOptions as option (option.value)}
							<Button
								href={filterHref(option.value)}
								variant={data.filters.status === option.value ? 'default' : 'outline'}
								size="sm"
							>
								{option.label}
							</Button>
						{/each}
					</div>
				</div>

				<form
					id={bulkFormId}
					method="POST"
					action="?/bulkStatus"
					class="bg-muted/30 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<p class="text-sm font-medium">Bulk import movement</p>
						<p class="text-muted-foreground text-xs">
							Move selected requests to the next pipeline state.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<AdminSelect
							name="status"
							value="sourcing"
							options={importStatusOptions}
							ariaLabel="Bulk status"
						/>
						<Button type="submit" variant="outline" size="sm">Apply to selected</Button>
					</div>
				</form>
			</Card.Content>
			<Card.Content class="p-0">
				{#if data.imports.length}
					<div class="overflow-x-auto">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-10"></Table.Head>
									<Table.Head>Customer</Table.Head>
									<Table.Head>Vehicle brief</Table.Head>
									<Table.Head>Status</Table.Head>
									<Table.Head class="hidden text-right lg:table-cell">Budget</Table.Head>
									<Table.Head class="hidden text-right xl:table-cell">Updated</Table.Head>
									<Table.Head class="text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.imports as request (request.id)}
									<Table.Row>
										<Table.Cell>
											<AdminRowCheckbox
												form={bulkFormId}
												value={request.id}
												ariaLabel={`Select ${request.customer_name}`}
											/>
										</Table.Cell>
										<Table.Cell>
											<div class="min-w-56">
												<p class="truncate font-medium">{request.customer_name}</p>
												<p class="text-muted-foreground truncate text-xs">{request.contact}</p>
												<p class="text-muted-foreground truncate text-xs">
													{request.origin_country} -> {request.destination_country}
												</p>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div class="min-w-72">
												<p class="truncate text-sm">{formatRequestVehicle(request)}</p>
												<p class="text-muted-foreground truncate text-xs">
													{[request.fuel, request.transmission].filter(Boolean).join(' / ') ||
														'No drivetrain preference'}
												</p>
												<p class="text-muted-foreground truncate text-xs">
													{request.notes || 'No notes supplied'}
												</p>
											</div>
										</Table.Cell>
										<Table.Cell>
											<form
												class="flex min-w-64 items-center gap-2"
												method="POST"
												action="?/updateStatus"
											>
												<input type="hidden" name="id" value={request.id} />
												<AdminSelect
													name="status"
													value={request.status}
													options={importStatusOptions}
													controlClass="min-w-44"
													ariaLabel={`Status for ${request.customer_name}`}
												/>
												<Button type="submit" variant="outline" size="sm">Save</Button>
											</form>
										</Table.Cell>
										<Table.Cell class="hidden text-right font-medium lg:table-cell">
											{formatBudget(request)}
										</Table.Cell>
										<Table.Cell
											class="text-muted-foreground hidden text-right text-xs xl:table-cell"
										>
											{formatDate(request.updated_at)}
										</Table.Cell>
										<Table.Cell>
											<div class="flex min-w-28 justify-end gap-2">
												<form method="POST" action="?/updateStatus">
													<input type="hidden" name="id" value={request.id} />
													<input type="hidden" name="status" value="cancelled" />
													<Button type="submit" variant="ghost" size="sm">
														<Ban data-icon="inline-start" aria-hidden="true" />
														Cancel
													</Button>
												</form>
											</div>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<AdminEmptyState
						title="No import requests match the current filters"
						description="Clear filters or wait for new import briefs to appear from the public intake."
						class="m-4"
					>
						<Button href={resolve('/admin/imports')} variant="outline">Clear filters</Button>
					</AdminEmptyState>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
