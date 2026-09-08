<script lang="ts">
	import { resolve } from '$app/paths';
	import Copy from '@lucide/svelte/icons/copy';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Search from '@lucide/svelte/icons/search';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminRowCheckbox from '$lib/components/admin/AdminRowCheckbox.svelte';
	import AdminSelect from '$lib/components/admin/AdminSelect.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { cn } from '$lib/utils.js';
	import {
		formatDate,
		formatNumber,
		formatPrice,
		formatStatus,
		formatVehicleMeta
	} from '$lib/components/admin/format';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const bulkFormId = 'inventory-bulk-form';
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'published', label: 'Published' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'sold', label: 'Sold' },
		{ value: 'archived', label: 'Archived' }
	] as const;

	const metrics = $derived([
		{
			label: 'All listings',
			value: data.inventory.counts.all,
			status: 'all'
		},
		{
			label: 'Published',
			value: data.inventory.counts.published,
			status: 'published'
		},
		{
			label: 'Drafts',
			value: data.inventory.counts.draft,
			status: 'draft'
		},
		{ label: 'Sold', value: data.inventory.counts.sold, status: 'sold' },
		{
			label: 'Archived',
			value: data.inventory.counts.archived,
			status: 'archived'
		}
	]);

	type ListingsFilterPath = '/admin/listings' | `/admin/listings?${string}`;

	function filterPath(status: string): ListingsFilterPath {
		const params = new SvelteURLSearchParams();

		if (status !== 'all') params.set('status', status);
		if (data.inventory.filters.query) params.set('q', data.inventory.filters.query);

		const suffix = params.toString();
		return suffix ? `/admin/listings?${suffix}` : '/admin/listings';
	}

	function handleVehicleImageError(event: Event) {
		const image = event.currentTarget as HTMLImageElement | null;
		const fallbackSrc = resolve('/assets/images/card/card-1.jpg');

		if (!image || image.getAttribute('src') === fallbackSrc) return;

		image.src = fallbackSrc;
	}

	function confirmDelete(event: SubmitEvent, title: string) {
		if (!confirm(`Delete ${title}? This removes the listing from the CMS.`)) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Admin - Inventory</title>
</svelte:head>

<AdminShell
	title="Inventory"
	activePath="/admin/listings"
	primaryAction={{ label: 'Add listing', href: '/admin/listings/new' }}
>
	<section class="px-4 lg:px-6" aria-label="Inventory controls">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Vehicle inventory</Card.Title>
					<Card.Description>
						Publish, price, duplicate, and remove vehicle records from the public inventory.
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-3 p-3">
				{#if form?.error}<AdminMessage tone="error">{form.error}</AdminMessage>{/if}
				{#if data.notice}<AdminMessage tone="notice">{data.notice}</AdminMessage>{/if}

				<nav
					class="bg-muted/25 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border p-1"
					aria-label="Inventory status filters"
				>
					{#each metrics as metric (metric.label)}
						{@const isActiveStatus = data.inventory.filters.status === metric.status}
						<a
							href={resolve(filterPath(metric.status))}
							aria-current={isActiveStatus ? 'page' : undefined}
							class={cn(
								'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors',
								isActiveStatus
									? 'bg-background text-foreground ring-border shadow-sm ring-1'
									: 'text-muted-foreground hover:bg-background/75 hover:text-foreground'
							)}
						>
							<span>{metric.label}</span>
							<span
								class={cn(
									'bg-background/80 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums',
									isActiveStatus && 'bg-primary/10 text-primary'
								)}
							>
								{formatNumber(metric.value)}
							</span>
						</a>
					{/each}
				</nav>

				<div class="bg-muted/25 rounded-lg border p-3">
					<div class="grid gap-3 xl:grid-cols-[minmax(24rem,1fr)_auto] xl:items-center">
						<form
							class="flex w-full flex-col gap-2 sm:flex-row"
							method="GET"
							action={resolve('/admin/listings')}
						>
							<input type="hidden" name="status" value={data.inventory.filters.status} />
							<div class="relative flex-1">
								<Search
									class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
									aria-hidden="true"
								/>
								<Input
									class="pl-8"
									name="q"
									value={data.inventory.filters.query}
									placeholder="Search make, model, lot, fuel"
									autocomplete="off"
								/>
							</div>
							<Button type="submit" variant="outline">Search</Button>
						</form>

						<form
							id={bulkFormId}
							method="POST"
							action="?/bulkStatus"
							class="flex flex-col gap-2 sm:flex-row sm:items-center"
						>
							<p class="text-muted-foreground text-xs font-medium">Bulk status</p>
							<AdminSelect
								name="status"
								value="draft"
								options={statusOptions
									.filter((option) => option.value !== 'all')
									.map((option) => ({
										value: option.value,
										label: formatStatus(option.value)
									}))}
								ariaLabel="Bulk listing status"
							/>
							<Button type="submit" variant="outline" size="sm">Apply selected</Button>
						</form>
					</div>
				</div>
			</Card.Content>
			<Card.Content class="p-0">
				{#if data.inventory.vehicles.length}
					<div class="border-t">
						<Table.Root class="min-w-full table-fixed">
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-12"></Table.Head>
									<Table.Head>Vehicle</Table.Head>
									<Table.Head class="hidden w-28 xl:table-cell">Lot</Table.Head>
									<Table.Head class="hidden w-48 2xl:table-cell">Specs</Table.Head>
									<Table.Head class="w-56">Status</Table.Head>
									<Table.Head class="hidden w-36 text-right md:table-cell">Price</Table.Head>
									<Table.Head class="hidden w-40 text-right lg:table-cell">Updated</Table.Head>
									<Table.Head class="w-36 text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.inventory.vehicles as vehicle (vehicle.id)}
									<Table.Row>
										<Table.Cell>
											<AdminRowCheckbox
												form={bulkFormId}
												value={vehicle.id}
												ariaLabel={`Select ${vehicle.short_title}`}
											/>
										</Table.Cell>
										<Table.Cell class="min-w-0">
											<div class="flex min-w-0 items-center gap-3">
												<img
													class="ring-border size-12 rounded-md object-cover ring-1"
													src={vehicle.image || '/assets/images/card/card-1.jpg'}
													alt=""
													onerror={handleVehicleImageError}
												/>
												<span class="min-w-0 flex-1">
													<a
														class="block min-h-8 truncate leading-8 font-medium hover:underline"
														href={resolve(`/admin/listings/${vehicle.id}`)}
													>
														{vehicle.short_title}
													</a>
													<span class="text-muted-foreground block truncate text-xs">
														{formatVehicleMeta(vehicle)}
														{#if vehicle.lot}
															<span class="xl:hidden"> / {vehicle.lot}</span>
														{/if}
													</span>
													<span
														class="text-muted-foreground hidden truncate text-xs lg:block 2xl:hidden"
													>
														{vehicle.mileage_text || `${vehicle.mileage_value} км`} / {vehicle.fuel ||
															'Fuel not set'}
													</span>
													<span class="text-muted-foreground block truncate text-xs md:hidden">
														{formatPrice(vehicle)}
													</span>
												</span>
											</div>
										</Table.Cell>
										<Table.Cell class="hidden xl:table-cell">
											<span class="font-mono text-xs">{vehicle.lot || 'No lot'}</span>
										</Table.Cell>
										<Table.Cell class="hidden 2xl:table-cell">
											<span class="block truncate text-sm"
												>{vehicle.year} / {vehicle.fuel || 'Fuel not set'}</span
											>
											<span class="text-muted-foreground block truncate text-xs">
												{vehicle.mileage_text || `${vehicle.mileage_value} км`}
											</span>
										</Table.Cell>
										<Table.Cell>
											<form
												class="flex w-full max-w-52 items-center gap-2"
												method="POST"
												action="?/updateStatus"
											>
												<input type="hidden" name="id" value={vehicle.id} />
												<AdminSelect
													name="status"
													value={vehicle.status}
													options={statusOptions
														.filter((option) => option.value !== 'all')
														.map((option) => ({
															value: option.value,
															label: formatStatus(option.value)
														}))}
													controlClass="min-w-32"
													ariaLabel={`Status for ${vehicle.short_title}`}
												/>
												<Button type="submit" variant="outline" size="sm">Save</Button>
											</form>
										</Table.Cell>
										<Table.Cell class="hidden text-right font-medium md:table-cell">
											{formatPrice(vehicle)}
										</Table.Cell>
										<Table.Cell
											class="text-muted-foreground hidden text-right text-xs lg:table-cell"
										>
											{formatDate(vehicle.updated_at)}
										</Table.Cell>
										<Table.Cell>
											<div class="flex justify-end gap-2">
												<Button
													href={resolve(`/admin/listings/${vehicle.id}`)}
													variant="default"
													size="sm"
												>
													<Pencil data-icon="inline-start" aria-hidden="true" />
													Edit
												</Button>
												<DropdownMenu.Root>
													<DropdownMenu.Trigger>
														{#snippet child({ props })}
															<Button
																variant="outline"
																size="icon-sm"
																aria-label={`More actions for ${vehicle.short_title}`}
																{...props}
															>
																<MoreHorizontal aria-hidden="true" />
															</Button>
														{/snippet}
													</DropdownMenu.Trigger>
													<DropdownMenu.Content align="end" class="w-44">
														<DropdownMenu.Group>
															<DropdownMenu.Item>
																<a
																	class="flex w-full items-center gap-2"
																	href={resolve(`/inventory/${vehicle.slug}`)}
																>
																	<ExternalLink aria-hidden="true" />
																	Preview listing
																</a>
															</DropdownMenu.Item>
															<DropdownMenu.Item>
																<form class="w-full" method="POST" action="?/duplicate">
																	<input type="hidden" name="id" value={vehicle.id} />
																	<button
																		class="flex w-full items-center gap-2 text-left"
																		type="submit"
																	>
																		<Copy aria-hidden="true" />
																		Duplicate
																	</button>
																</form>
															</DropdownMenu.Item>
														</DropdownMenu.Group>
														<DropdownMenu.Separator />
														<DropdownMenu.Group>
															<DropdownMenu.Item variant="destructive">
																<form
																	class="w-full"
																	method="POST"
																	action="?/remove"
																	onsubmit={(event) => confirmDelete(event, vehicle.short_title)}
																>
																	<input type="hidden" name="id" value={vehicle.id} />
																	<button
																		class="flex w-full items-center gap-2 text-left"
																		type="submit"
																	>
																		<Trash2 aria-hidden="true" />
																		Delete
																	</button>
																</form>
															</DropdownMenu.Item>
														</DropdownMenu.Group>
													</DropdownMenu.Content>
												</DropdownMenu.Root>
											</div>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<div class="grid gap-3 p-6">
						<p class="text-sm font-medium">No listings match the current filters.</p>
						<p class="text-muted-foreground text-sm">
							Create a listing or clear the filters to see the full Аутолайф inventory
							workspace.
						</p>
						<div class="flex flex-wrap gap-2">
							<Button href={resolve('/admin/listings')} variant="outline">Clear filters</Button>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
