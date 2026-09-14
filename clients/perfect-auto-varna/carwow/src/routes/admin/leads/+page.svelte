<script lang="ts">
	import { resolve } from '$app/paths';
	import Archive from '@lucide/svelte/icons/archive';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
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

	const bulkFormId = 'leads-bulk-form';
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'new', label: 'New' },
		{ value: 'in_progress', label: 'In progress' },
		{ value: 'won', label: 'Won' },
		{ value: 'lost', label: 'Lost' },
		{ value: 'archived', label: 'Archived' }
	] as const;
	const leadStatusOptions = statusOptions.filter((option) => option.value !== 'all');

	const metrics = $derived([
		{ label: 'All leads', value: data.leadCounts.all, status: 'all', detail: 'Buyer records' },
		{ label: 'New', value: data.leadCounts.new, status: 'new', detail: 'Needs first reply' },
		{
			label: 'In progress',
			value: data.leadCounts.in_progress,
			status: 'in_progress',
			detail: 'Active follow-up'
		},
		{ label: 'Won', value: data.leadCounts.won, status: 'won', detail: 'Closed revenue' },
		{ label: 'Lost', value: data.leadCounts.lost, status: 'lost', detail: 'Closed lost' },
		{
			label: 'Archived',
			value: data.leadCounts.archived,
			status: 'archived',
			detail: 'Hidden inbox'
		}
	]);

	function filterHref(status: string) {
		const params = new SvelteURLSearchParams();
		if (status !== 'all') params.set('status', status);
		if (data.filters.query) params.set('q', data.filters.query);
		const suffix = params.toString();
		return resolve(`/admin/leads${suffix ? `?${suffix}` : ''}`);
	}

	function formatLeadValue(lead: PageProps['data']['leads'][number]) {
		return lead.value ? `${formatNumber(lead.value)} EUR` : 'No value';
	}

	function contactHref(kind: 'email' | 'phone', value: string | null) {
		if (!value) return '';
		return kind === 'email' ? `mailto:${value}` : `tel:${value.replace(/\s+/g, '')}`;
	}
</script>

<svelte:head>
	<title>Admin - Leads</title>
</svelte:head>

<AdminShell title="Leads" activePath="/admin/leads">
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
					<Card.Title>Lead inbox</Card.Title>
					<Card.Description>
						Search, triage, contact, and update buyer enquiries from one workspace.
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
						action={resolve('/admin/leads')}
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
								placeholder="Search customer, contact, source, message"
								autocomplete="off"
							/>
						</div>
						<Button type="submit" variant="outline">Search</Button>
					</form>

					<div class="flex flex-wrap gap-2">
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
						<p class="text-sm font-medium">Bulk lead status</p>
						<p class="text-muted-foreground text-xs">Select rows, choose a state, then apply.</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<AdminSelect
							name="status"
							value="in_progress"
							options={leadStatusOptions}
							ariaLabel="Bulk status"
						/>
						<Button type="submit" variant="outline" size="sm">Apply to selected</Button>
					</div>
				</form>
			</Card.Content>
			<Card.Content class="p-0">
				{#if data.leads.length}
					<div class="overflow-x-auto">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-10"></Table.Head>
									<Table.Head>Customer</Table.Head>
									<Table.Head>Message</Table.Head>
									<Table.Head>Status</Table.Head>
									<Table.Head class="hidden text-right md:table-cell">Value</Table.Head>
									<Table.Head class="hidden text-right lg:table-cell">Updated</Table.Head>
									<Table.Head class="text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.leads as lead (lead.id)}
									<Table.Row>
										<Table.Cell>
											<AdminRowCheckbox
												form={bulkFormId}
												value={lead.id}
												ariaLabel={`Select ${lead.customer_name}`}
											/>
										</Table.Cell>
										<Table.Cell>
											<div class="min-w-56">
												<p class="truncate font-medium">{lead.customer_name}</p>
												<p class="text-muted-foreground truncate text-xs">{lead.contact}</p>
												<div class="mt-2 flex flex-wrap gap-2">
													{#if lead.email}
														<Button
															href={contactHref('email', lead.email)}
															variant="outline"
															size="xs"
														>
															<Mail data-icon="inline-start" aria-hidden="true" />
															Email
														</Button>
													{/if}
													{#if lead.phone}
														<Button
															href={contactHref('phone', lead.phone)}
															variant="outline"
															size="xs"
														>
															<Phone data-icon="inline-start" aria-hidden="true" />
															Call
														</Button>
													{/if}
												</div>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div class="min-w-72">
												<p class="truncate text-sm">{lead.message || 'No message supplied'}</p>
												<p class="text-muted-foreground truncate text-xs">
													{lead.source} / {formatDate(lead.created_at)}
												</p>
											</div>
										</Table.Cell>
										<Table.Cell>
											<form
												class="flex min-w-56 items-center gap-2"
												method="POST"
												action="?/updateStatus"
											>
												<input type="hidden" name="id" value={lead.id} />
												<AdminSelect
													name="status"
													value={lead.status}
													options={leadStatusOptions}
													ariaLabel={`Status for ${lead.customer_name}`}
												/>
												<Button type="submit" variant="outline" size="sm">Save</Button>
											</form>
										</Table.Cell>
										<Table.Cell class="hidden text-right font-medium md:table-cell">
											{formatLeadValue(lead)}
										</Table.Cell>
										<Table.Cell
											class="text-muted-foreground hidden text-right text-xs lg:table-cell"
										>
											{formatDate(lead.updated_at)}
										</Table.Cell>
										<Table.Cell>
											<div class="flex min-w-28 justify-end gap-2">
												<form method="POST" action="?/updateStatus">
													<input type="hidden" name="id" value={lead.id} />
													<input type="hidden" name="status" value="archived" />
													<Button type="submit" variant="ghost" size="sm">
														<Archive data-icon="inline-start" aria-hidden="true" />
														Archive
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
						title="No leads match the current filters"
						description="Clear filters or wait for new website enquiries to appear in the CMS inbox."
						class="m-4"
					>
						<Button href={resolve('/admin/leads')} variant="outline">Clear filters</Button>
					</AdminEmptyState>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
