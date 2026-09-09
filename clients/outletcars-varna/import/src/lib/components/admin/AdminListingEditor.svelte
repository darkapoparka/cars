<script lang="ts">
	import { resolve } from '$app/paths';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import FileText from '@lucide/svelte/icons/file-text';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import Info from '@lucide/svelte/icons/info';
	import Save from '@lucide/svelte/icons/save';
	import { formatDate, formatStatus, statusVariant } from '$lib/components/admin/format';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { AdminInventoryRow } from '$lib/server/admin-cms';

	type ListingFormValues = {
		bodyType: string;
		brand: string;
		color: string;
		description: string;
		doors: string | number;
		engine: string;
		featureText: string;
		fuel: string;
		location: string;
		mileage: string | number;
		model: string;
		price: string | number;
		priceLabel: string;
		routePath: string;
		seats: string | number;
		slug: string;
		sourceUrl: string;
		status: string;
		stockNumber: string;
		title: string;
		transmission: string;
		vin: string;
		year: string | number;
	};

	type ListingFormState = {
		error?: string;
		title?: string;
		values?: Partial<ListingFormValues>;
	};

	type Props = {
		cancelHref?: string;
		form?: ListingFormState | null;
		listing?: AdminInventoryRow | null;
		mode?: 'create' | 'edit';
		notice?: string;
		submitLabel?: string;
	};

	let {
		cancelHref = '/admin/inventory',
		form = null,
		listing = null,
		mode = 'edit',
		notice = '',
		submitLabel = mode === 'create' ? 'Create listing' : 'Save changes'
	}: Props = $props();

	let activeTab = $state('details');

	const statusOptions = [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Intake', value: 'intake' },
		{ label: 'Media ready', value: 'media_ready' },
		{ label: 'Published', value: 'published' },
		{ label: 'Reserved', value: 'reserved' },
		{ label: 'Sold', value: 'sold' },
		{ label: 'Archived', value: 'archived' }
	];
	const featureOptions = [
		'Apple CarPlay',
		'Adaptive cruise',
		'Blind spot assist',
		'Heated seats',
		'Panoramic roof',
		'360 camera',
		'Head-up display',
		'Service history'
	];

	const initialValues = (): ListingFormValues => {
		const formValues =
			form?.values ??
			(form?.title ? ({ title: form.title } satisfies Partial<ListingFormValues>) : {});

		return {
			bodyType: formValues.bodyType ?? listing?.bodyType ?? '',
			brand: formValues.brand ?? listing?.brand ?? '',
			color: formValues.color ?? listing?.color ?? '',
			description: formValues.description ?? listing?.description ?? '',
			doors: formValues.doors ?? listing?.doors ?? '',
			engine: formValues.engine ?? listing?.engine ?? '',
			featureText: formValues.featureText ?? listing?.features?.join('\n') ?? '',
			fuel: formValues.fuel ?? listing?.fuel ?? '',
			location: formValues.location ?? listing?.location ?? '',
			mileage: formValues.mileage ?? listing?.mileageValue ?? '',
			model: formValues.model ?? listing?.model ?? '',
			price: formValues.price ?? listing?.price ?? '',
			priceLabel: formValues.priceLabel ?? listing?.priceLabel ?? '',
			routePath: formValues.routePath ?? listing?.routePath ?? '',
			seats: formValues.seats ?? listing?.seats ?? '',
			slug: formValues.slug ?? listing?.slug ?? '',
			sourceUrl: formValues.sourceUrl ?? listing?.sourceUrl ?? '',
			status: formValues.status ?? listing?.status ?? 'draft',
			stockNumber: formValues.stockNumber ?? listing?.stockNumber ?? '',
			title: formValues.title ?? listing?.title ?? '',
			transmission: formValues.transmission ?? listing?.transmission ?? '',
			vin: formValues.vin ?? listing?.vin ?? '',
			year: formValues.year ?? listing?.year ?? ''
		};
	};
	let values = $state<ListingFormValues>(initialValues());
	const checkedFeatures = $derived(
		new Set(values.featureText.split(/\r?\n|,/).map((item) => item.trim()))
	);
	const sourceLabel = $derived(listing?.source?.replace('-', ' ') ?? 'admin listing');
	const sourceValue = $derived(listing?.source ?? 'admin-listing');
	const previewHref = $derived(
		values.status === 'published' && values.routePath?.startsWith('/') ? values.routePath : ''
	);
	const completeness = $derived(listing?.completeness);
	const currentGalleryImages = $derived(listing?.galleryImages ?? []);
	const currentDocuments = $derived(listing?.documents ?? []);
</script>

<section class="grid gap-4 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<div class="min-w-0">
				<Card.Title class="text-base leading-snug">
					{mode === 'create' ? 'Create vehicle listing' : listing?.title}
				</Card.Title>
				<Card.Description>
					{mode === 'create'
						? 'Create a durable local OUTLETCARS.BG — Варна CMS record.'
						: 'Edit the full local CMS listing record.'}
				</Card.Description>
			</div>
			<Card.Action>
				<div class="flex flex-wrap justify-end gap-2">
					<Badge variant={statusVariant(values.status)} class="capitalize">
						{formatStatus(values.status)}
					</Badge>
					{#if previewHref}
						<Button href={previewHref} variant="outline" size="sm">
							<ExternalLink data-icon="inline-start" aria-hidden="true" />
							Preview
						</Button>
					{/if}
				</div>
			</Card.Action>
		</Card.Header>
	</Card.Root>

	<form
		method="POST"
		enctype="multipart/form-data"
		class="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
		data-daynight-admin-listing-editor
		data-daynight-admin-listing-mode={mode}
	>
		<input type="hidden" name="source" value={sourceValue} />

		<Card.Root class="min-w-0">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Listing workspace</Card.Title>
					<Card.Description
						>Complete specs, pricing, media, features, and publishing.</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)} class="gap-0">
					<ScrollArea.Root class="border-b">
						<Tabs.List variant="line" class="min-w-max rounded-none border-0 px-4">
							<Tabs.Trigger value="details">Details</Tabs.Trigger>
							<Tabs.Trigger value="specs">Specs</Tabs.Trigger>
							<Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
							<Tabs.Trigger value="media">Media</Tabs.Trigger>
							<Tabs.Trigger value="features">Features</Tabs.Trigger>
							<Tabs.Trigger value="publishing">Publishing</Tabs.Trigger>
						</Tabs.List>
					</ScrollArea.Root>

					<div class="grid gap-5 p-4 md:p-5">
						{#if form?.error}
							<Alert variant="destructive">
								<Info aria-hidden="true" />
								<AlertTitle>Listing could not be saved</AlertTitle>
								<AlertDescription>{form.error}</AlertDescription>
							</Alert>
						{:else if notice}
							<Alert>
								<Info aria-hidden="true" />
								<AlertTitle>{notice}</AlertTitle>
								<AlertDescription>The durable local CMS record is up to date.</AlertDescription>
							</Alert>
						{/if}

						<Tabs.Content value="details" class="mt-0 grid gap-4">
							<div class="grid gap-4 md:grid-cols-2">
								<div class="grid gap-2 md:col-span-2">
									<Label for="title">Title</Label>
									<Input id="title" name="title" bind:value={values.title} required />
								</div>
								<div class="grid gap-2">
									<Label for="brand">Brand</Label>
									<Input id="brand" name="brand" bind:value={values.brand} />
								</div>
								<div class="grid gap-2">
									<Label for="model">Model</Label>
									<Input id="model" name="model" bind:value={values.model} />
								</div>
								<div class="grid gap-2">
									<Label for="year">Year</Label>
									<Input
										id="year"
										name="year"
										type="number"
										min="1900"
										max="2100"
										bind:value={values.year}
									/>
								</div>
								<div class="grid gap-2">
									<Label for="location">Location</Label>
									<Input id="location" name="location" bind:value={values.location} />
								</div>
								<div class="grid gap-2 md:col-span-2">
									<Label for="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										class="min-h-36"
										bind:value={values.description}
									/>
								</div>
							</div>
						</Tabs.Content>

						<Tabs.Content value="specs" class="mt-0 grid gap-4 md:grid-cols-2">
							<div class="grid gap-2">
								<Label for="bodyType">Body type</Label>
								<Input id="bodyType" name="bodyType" bind:value={values.bodyType} />
							</div>
							<div class="grid gap-2">
								<Label for="fuel">Fuel</Label>
								<Input id="fuel" name="fuel" bind:value={values.fuel} />
							</div>
							<div class="grid gap-2">
								<Label for="transmission">Transmission</Label>
								<Input id="transmission" name="transmission" bind:value={values.transmission} />
							</div>
							<div class="grid gap-2">
								<Label for="engine">Engine</Label>
								<Input id="engine" name="engine" bind:value={values.engine} />
							</div>
							<div class="grid gap-2">
								<Label for="mileage">Mileage</Label>
								<Input
									id="mileage"
									name="mileage"
									type="number"
									min="0"
									bind:value={values.mileage}
								/>
							</div>
							<div class="grid gap-2">
								<Label for="color">Color</Label>
								<Input id="color" name="color" bind:value={values.color} />
							</div>
							<div class="grid gap-2">
								<Label for="doors">Doors</Label>
								<Input id="doors" name="doors" type="number" min="0" bind:value={values.doors} />
							</div>
							<div class="grid gap-2">
								<Label for="seats">Seats</Label>
								<Input id="seats" name="seats" type="number" min="0" bind:value={values.seats} />
							</div>
						</Tabs.Content>

						<Tabs.Content value="pricing" class="mt-0 grid gap-4 md:grid-cols-2">
							<div class="grid gap-2">
								<Label for="price">Numeric price</Label>
								<Input id="price" name="price" type="number" min="0" bind:value={values.price} />
							</div>
							<div class="grid gap-2">
								<Label for="priceLabel">Display price</Label>
								<Input id="priceLabel" name="priceLabel" bind:value={values.priceLabel} />
							</div>
							<div class="grid gap-2">
								<Label for="sourceUrl">Source URL</Label>
								<Input id="sourceUrl" name="sourceUrl" type="url" bind:value={values.sourceUrl} />
							</div>
						</Tabs.Content>

						<Tabs.Content value="media" class="mt-0 grid gap-4">
							{#if listing?.previewImage}
								<div class="grid gap-2">
									<Label>Current preview</Label>
									<div class="border-border overflow-hidden rounded-lg border">
										<img
											src={listing.previewImage}
											alt={`${listing.title} preview`}
											class="aspect-[16/9] w-full object-cover"
										/>
									</div>
								</div>
							{/if}
							{#if currentGalleryImages.length}
								<div class="grid gap-3">
									<Label>Gallery on record</Label>
									<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
										{#each currentGalleryImages as image (image)}
											<div class="border-border overflow-hidden rounded-lg border">
												<img
													src={image}
													alt={`${listing?.title ?? 'Vehicle'} gallery`}
													class="aspect-[4/3] w-full object-cover"
												/>
												<div class="grid gap-2 p-3 text-xs">
													<label class="flex items-center gap-2">
														<input
															type="radio"
															name="selectedPreviewImage"
															value={image}
															checked={listing?.previewImage === image}
															class="accent-primary size-4"
														/>
														<span>Use as preview</span>
													</label>
													{#if sourceValue === 'admin-listing'}
														<label class="text-muted-foreground flex items-center gap-2">
															<input
																type="checkbox"
																name="removeGalleryImages"
																value={image}
																class="accent-primary size-4"
															/>
															<span>Remove from record</span>
														</label>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}
							<div class="grid gap-2">
								<Label for="previewImage">Preview image</Label>
								<Input
									id="previewImage"
									name="previewImage"
									type="file"
									accept="image/png,image/jpeg,image/webp"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="galleryImages">Gallery images</Label>
								<Input
									id="galleryImages"
									name="galleryImages"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									multiple
								/>
							</div>
							{#if currentDocuments.length}
								<div class="grid gap-3 rounded-lg border p-3 text-sm">
									<div class="flex items-center gap-2 font-medium">
										<FileText class="size-4" aria-hidden="true" />
										Documents on record
									</div>
									<div class="grid gap-2">
										{#each currentDocuments as document (document.id)}
											<div
												class="flex flex-wrap items-center justify-between gap-3 rounded-md border p-2"
											>
												<a href={resolve(document.url as '/')} class="min-w-0 truncate font-medium">
													{document.originalName}
												</a>
												{#if sourceValue === 'admin-listing'}
													<label class="text-muted-foreground flex items-center gap-2 text-xs">
														<input
															type="checkbox"
															name="removeDocumentIds"
															value={document.id}
															class="accent-primary size-4"
														/>
														<span>Remove</span>
													</label>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}
							<div class="grid gap-2">
								<Label for="documents">Documents</Label>
								<Input
									id="documents"
									name="documents"
									type="file"
									accept=".pdf,.doc,.docx,application/pdf"
									multiple
								/>
							</div>
							<div class="grid gap-2 rounded-lg border p-3 text-sm">
								<div class="flex items-center gap-2 font-medium">
									<ImagePlus class="size-4" aria-hidden="true" />
									Media on record
								</div>
								<p class="text-muted-foreground">
									{listing?.galleryImages.length ?? 0} gallery images and {listing?.documents
										.length ?? 0} documents.
								</p>
							</div>
						</Tabs.Content>

						<Tabs.Content value="features" class="mt-0 grid gap-4">
							<div class="grid gap-3 sm:grid-cols-2">
								{#each featureOptions as feature (feature)}
									<label
										class="border-border flex items-center gap-2 rounded-lg border p-3 text-sm"
									>
										<input
											type="checkbox"
											name="features"
											value={feature}
											checked={checkedFeatures.has(feature)}
											class="accent-primary size-4"
										/>
										<span>{feature}</span>
									</label>
								{/each}
							</div>
							<div class="grid gap-2">
								<Label for="featureText">Additional features</Label>
								<Textarea
									id="featureText"
									name="featureText"
									class="min-h-32"
									bind:value={values.featureText}
								/>
							</div>
						</Tabs.Content>

						<Tabs.Content value="publishing" class="mt-0 grid gap-4 md:grid-cols-2">
							{#if completeness}
								<div class="grid gap-3 rounded-lg border p-3 md:col-span-2">
									<div class="flex flex-wrap items-center justify-between gap-3">
										<div>
											<p class="text-sm font-medium">Publishing readiness</p>
											<p class="text-muted-foreground text-xs">
												{completeness.score}% complete - {formatStatus(completeness.level)}
											</p>
										</div>
										<Badge variant={completeness.missing.length ? 'outline' : 'default'}>
											{completeness.missing.length ? 'Needs work' : 'Ready'}
										</Badge>
									</div>
									<div class="bg-muted h-2 overflow-hidden rounded-full">
										<div
											class="bg-primary h-full rounded-full"
											style={`width: ${completeness.score}%`}
										></div>
									</div>
									{#if completeness.missing.length}
										<div class="flex flex-wrap gap-2">
											{#each completeness.missing as item (item)}
												<Badge variant="outline">{item}</Badge>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
							<div class="grid gap-2">
								<Label for="status">Status</Label>
								<select
									id="status"
									name="status"
									bind:value={values.status}
									class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									{#each statusOptions as option (option.value)}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="slug">Slug</Label>
								<Input id="slug" name="slug" bind:value={values.slug} />
							</div>
							<div class="grid gap-2">
								<Label for="stockNumber">Stock number</Label>
								<Input id="stockNumber" name="stockNumber" bind:value={values.stockNumber} />
							</div>
							<div class="grid gap-2">
								<Label for="vin">VIN</Label>
								<Input id="vin" name="vin" bind:value={values.vin} />
							</div>
							<div class="grid gap-2 md:col-span-2">
								<Label for="routePath">Public route</Label>
								<Input id="routePath" name="routePath" bind:value={values.routePath} />
							</div>
						</Tabs.Content>
					</div>
				</Tabs.Root>
			</Card.Content>
			<Card.Footer class="flex flex-wrap justify-between gap-2 border-t">
				<Button href={cancelHref} variant="outline">Cancel</Button>
				<Button type="submit">
					<Save data-icon="inline-start" aria-hidden="true" />
					{submitLabel}
				</Button>
			</Card.Footer>
		</Card.Root>

		<div class="grid gap-4">
			{#if completeness}
				<Card.Root>
					<Card.Header>
						<Card.Title>Listing quality</Card.Title>
						<Card.Description>Shared CMS publishing audit</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-3 text-sm">
						<div class="flex items-center justify-between gap-3">
							<span class="text-muted-foreground">Completeness</span>
							<span class="font-medium">{completeness.score}%</span>
						</div>
						<div class="bg-muted h-2 overflow-hidden rounded-full">
							<div
								class="bg-primary h-full rounded-full"
								style={`width: ${completeness.score}%`}
							></div>
						</div>
						{#if completeness.missing.length}
							<div class="grid gap-2">
								<span class="text-muted-foreground">Missing before publish</span>
								<div class="flex flex-wrap gap-2">
									{#each completeness.missing as item (item)}
										<Badge variant="outline">{item}</Badge>
									{/each}
								</div>
							</div>
						{:else}
							<Badge class="w-fit">Ready to publish</Badge>
						{/if}
					</Card.Content>
				</Card.Root>
			{/if}
			<Card.Root>
				<Card.Header>
					<Card.Title>Record summary</Card.Title>
					<Card.Description>Local CMS persistence</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-3 text-sm">
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground">Source</span>
						<Badge variant="outline" class="capitalize">{sourceLabel}</Badge>
					</div>
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground">Updated</span>
						<span>{listing ? formatDate(listing.updatedAt) : 'Not saved'}</span>
					</div>
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground">Images</span>
						<span>{listing?.mediaCount ?? 0}</span>
					</div>
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground">Documents</span>
						<span>{listing?.documentCount ?? 0}</span>
					</div>
					<Separator />
					<div class="text-muted-foreground flex items-start gap-2">
						<FileText class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
						<p>
							Uploaded files are stored under <span class="font-mono">static/uploads/cms</span>.
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</form>
</section>
