<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import CarFront from '@lucide/svelte/icons/car-front';
	import FileText from '@lucide/svelte/icons/file-text';
	import Gauge from '@lucide/svelte/icons/gauge';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Save from '@lucide/svelte/icons/save';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminSelect from '$lib/components/admin/AdminSelect.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { AdminVehicleRow } from '$lib/types/admin-forms';

	type FieldName =
		| 'slug'
		| 'title'
		| 'shortTitle'
		| 'brand'
		| 'model'
		| 'year'
		| 'status'
		| 'condition'
		| 'price'
		| 'priceEur'
		| 'priceBgn'
		| 'monthly'
		| 'mileageValue'
		| 'mileageText'
		| 'fuel'
		| 'transmission'
		| 'body'
		| 'doors'
		| 'engine'
		| 'power'
		| 'drive'
		| 'color'
		| 'image'
		| 'lot'
		| 'sourceUrl'
		| 'conditionLine'
		| 'description'
		| 'features'
		| 'highlights'
		| 'badges';

	type VehicleFormValues = Partial<Record<FieldName, string>>;

	type VehicleFormState = {
		error?: string;
		success?: string;
		values?: VehicleFormValues;
		errors?: Partial<Record<FieldName, string[]>>;
	};

	type Props = {
		action?: string;
		vehicle?: AdminVehicleRow | null;
		form?: VehicleFormState | null;
		formId?: string;
		submitLabel?: string;
		cancelHref?: '/admin/listings';
	};

	let {
		action = undefined,
		vehicle = null,
		form = null,
		formId = 'vehicle-listing-form',
		submitLabel = 'Save listing',
		cancelHref = '/admin/listings'
	}: Props = $props();

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'sold', label: 'Sold' },
		{ value: 'archived', label: 'Archived' }
	];

	const conditionOptions = [
		{ value: 'used', label: 'Used' },
		{ value: 'new', label: 'New' }
	];

	function listValue(value: string[] | null | undefined) {
		return value?.join(', ') ?? '';
	}

	function textValue(value: string | null | undefined) {
		return value ?? '';
	}

	function valuesFromVehicle(vehicle: AdminVehicleRow | null): VehicleFormValues {
		if (!vehicle) {
			return {
				status: 'draft',
				condition: 'used',
				year: String(new Date().getFullYear()),
				price: '0',
				mileageValue: '0'
			};
		}

		return {
			slug: vehicle.slug,
			title: vehicle.title,
			shortTitle: textValue(vehicle.short_title),
			brand: vehicle.brand,
			model: vehicle.model,
			year: String(vehicle.year),
			status: vehicle.status,
			condition: vehicle.condition,
			price: String(vehicle.price),
			priceEur: textValue(vehicle.price_eur),
			priceBgn: textValue(vehicle.price_bgn),
			monthly: textValue(vehicle.monthly),
			mileageValue: String(vehicle.mileage_value),
			mileageText: textValue(vehicle.mileage_text),
			fuel: vehicle.fuel,
			transmission: vehicle.transmission,
			body: vehicle.body,
			doors: vehicle.doors === null ? '' : String(vehicle.doors),
			engine: textValue(vehicle.engine),
			power: textValue(vehicle.power),
			drive: textValue(vehicle.drive),
			color: textValue(vehicle.color),
			image: textValue(vehicle.image),
			lot: textValue(vehicle.lot),
			sourceUrl: textValue(vehicle.source_url),
			conditionLine: textValue(vehicle.condition_line),
			description: textValue(vehicle.description),
			features: listValue(vehicle.features),
			highlights: listValue(vehicle.highlights),
			badges: listValue(vehicle.badges)
		};
	}

	const values = $derived(form?.values ?? valuesFromVehicle(vehicle));

	function field(name: FieldName) {
		return values[name] ?? '';
	}

	function fieldError(name: FieldName) {
		return form?.errors?.[name]?.[0] ?? '';
	}
</script>

<form
	id={formId}
	class="mx-auto grid w-full max-w-7xl gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
	method="POST"
	{action}
>
	<div class="grid gap-4">
		{#if form?.error}
			<AdminMessage tone="error">{form.error}</AdminMessage>
		{/if}

		{#if form?.success}
			<AdminMessage tone="success">{form.success}</AdminMessage>
		{/if}

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Publishing</Card.Title>
					<Card.Description>Status, lot tracking, and public URL controls</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div class="grid gap-2">
					<Label for="status">Status</Label>
					<AdminSelect
						id="status"
						name="status"
						value={field('status')}
						options={statusOptions}
						size="default"
						ariaLabel="Listing status"
						class="w-full [&_select]:w-full"
					/>
					{#if fieldError('status')}<p class="text-destructive text-xs">
							{fieldError('status')}
						</p>{/if}
				</div>

				<div class="grid gap-2">
					<Label for="condition">Condition</Label>
					<AdminSelect
						id="condition"
						name="condition"
						value={field('condition')}
						options={conditionOptions}
						size="default"
						ariaLabel="Vehicle condition"
						class="w-full [&_select]:w-full"
					/>
					{#if fieldError('condition')}
						<p class="text-destructive text-xs">{fieldError('condition')}</p>
					{/if}
				</div>

				<div class="grid gap-2">
					<Label for="lot">Lot</Label>
					<Input id="lot" name="lot" value={field('lot')} autocomplete="off" />
				</div>

				<div class="grid gap-2">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={field('slug')} autocomplete="off" />
					{#if fieldError('slug')}<p class="text-destructive text-xs">{fieldError('slug')}</p>{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Vehicle identity</Card.Title>
					<Card.Description
						>Core inventory fields shown across cards and detail pages</Card.Description
					>
				</div>
				<Card.Action><CarFront class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2">
				<div class="grid gap-2">
					<Label for="brand">Make</Label>
					<Input
						id="brand"
						name="brand"
						value={field('brand')}
						autocomplete="off"
						aria-invalid={Boolean(fieldError('brand'))}
					/>
					{#if fieldError('brand')}<p class="text-destructive text-xs">
							{fieldError('brand')}
						</p>{/if}
				</div>

				<div class="grid gap-2">
					<Label for="model">Model</Label>
					<Input
						id="model"
						name="model"
						value={field('model')}
						autocomplete="off"
						aria-invalid={Boolean(fieldError('model'))}
					/>
					{#if fieldError('model')}<p class="text-destructive text-xs">
							{fieldError('model')}
						</p>{/if}
				</div>

				<div class="grid gap-2">
					<Label for="shortTitle">Short title</Label>
					<Input id="shortTitle" name="shortTitle" value={field('shortTitle')} autocomplete="off" />
				</div>

				<div class="grid gap-2">
					<Label for="title">Full listing title</Label>
					<Input id="title" name="title" value={field('title')} autocomplete="off" />
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Pricing and specification</Card.Title>
					<Card.Description>Commercial labels and searchable vehicle metadata</Card.Description>
				</div>
				<Card.Action><Gauge class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div class="grid gap-2">
					<Label for="year">Year</Label>
					<Input
						id="year"
						name="year"
						value={field('year')}
						inputmode="numeric"
						autocomplete="off"
						aria-invalid={Boolean(fieldError('year'))}
					/>
					{#if fieldError('year')}<p class="text-destructive text-xs">{fieldError('year')}</p>{/if}
				</div>

				<div class="grid gap-2">
					<Label for="mileageValue">Mileage</Label>
					<Input
						id="mileageValue"
						name="mileageValue"
						value={field('mileageValue')}
						inputmode="numeric"
						autocomplete="off"
						aria-invalid={Boolean(fieldError('mileageValue'))}
					/>
					{#if fieldError('mileageValue')}
						<p class="text-destructive text-xs">{fieldError('mileageValue')}</p>
					{/if}
				</div>

				<div class="grid gap-2">
					<Label for="mileageText">Mileage label</Label>
					<Input
						id="mileageText"
						name="mileageText"
						value={field('mileageText')}
						autocomplete="off"
					/>
				</div>

				<div class="grid gap-2">
					<Label for="price">Price</Label>
					<Input
						id="price"
						name="price"
						value={field('price')}
						inputmode="numeric"
						autocomplete="off"
						aria-invalid={Boolean(fieldError('price'))}
					/>
					{#if fieldError('price')}<p class="text-destructive text-xs">
							{fieldError('price')}
						</p>{/if}
				</div>

				<div class="grid gap-2">
					<Label for="priceEur">EUR label</Label>
					<Input id="priceEur" name="priceEur" value={field('priceEur')} autocomplete="off" />
				</div>

				<div class="grid gap-2">
					<Label for="priceBgn">BGN label</Label>
					<Input id="priceBgn" name="priceBgn" value={field('priceBgn')} autocomplete="off" />
				</div>

				<div class="grid gap-2 md:col-span-2">
					<Label for="monthly">Monthly label</Label>
					<Input id="monthly" name="monthly" value={field('monthly')} autocomplete="off" />
				</div>

				<div class="grid gap-2">
					<Label for="fuel">Fuel</Label>
					<Input id="fuel" name="fuel" value={field('fuel')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="transmission">Transmission</Label>
					<Input
						id="transmission"
						name="transmission"
						value={field('transmission')}
						autocomplete="off"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="body">Body</Label>
					<Input id="body" name="body" value={field('body')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="doors">Doors</Label>
					<Input
						id="doors"
						name="doors"
						value={field('doors')}
						inputmode="numeric"
						autocomplete="off"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="engine">Engine</Label>
					<Input id="engine" name="engine" value={field('engine')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="power">Power</Label>
					<Input id="power" name="power" value={field('power')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="drive">Drive</Label>
					<Input id="drive" name="drive" value={field('drive')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="color">Color</Label>
					<Input id="color" name="color" value={field('color')} autocomplete="off" />
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Public copy</Card.Title>
					<Card.Description>Marketing text, badges, highlights, and feature lists</Card.Description>
				</div>
				<Card.Action><FileText class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="conditionLine">Condition line</Label>
					<Input
						id="conditionLine"
						name="conditionLine"
						value={field('conditionLine')}
						autocomplete="off"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						class="min-h-36"
						value={field('description')}
						aria-invalid={Boolean(fieldError('description'))}
					/>
					{#if fieldError('description')}
						<p class="text-destructive text-xs">{fieldError('description')}</p>
					{/if}
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					<div class="grid gap-2">
						<Label for="badges">Badges</Label>
						<Textarea id="badges" name="badges" value={field('badges')} />
					</div>
					<div class="grid gap-2">
						<Label for="highlights">Highlights</Label>
						<Textarea id="highlights" name="highlights" value={field('highlights')} />
					</div>
					<div class="grid gap-2">
						<Label for="features">Features</Label>
						<Textarea id="features" name="features" value={field('features')} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<aside class="grid gap-4 xl:sticky xl:top-20 xl:self-start">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Save changes</Card.Title>
					<Card.Description>Review the listing data, then commit the CMS record.</Card.Description>
				</div>
			</Card.Header>
			<Card.Footer class="flex flex-wrap gap-2">
				<Button type="submit" class="min-w-40 flex-1">
					<Save data-icon="inline-start" aria-hidden="true" />
					{submitLabel}
				</Button>
				<Button href={resolve(cancelHref)} variant="outline" class="min-w-28 flex-1">Cancel</Button>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Listing preview</Card.Title>
					<Card.Description>Thumbnail and commercial metadata</Card.Description>
				</div>
				<Card.Action><ImageIcon class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="bg-muted overflow-hidden rounded-lg border">
					{#if field('image')}
						<img class="aspect-[4/3] w-full object-cover" src={field('image')} alt="" />
					{:else}
						<div
							class="text-muted-foreground grid aspect-[4/3] place-items-center px-6 text-center text-sm"
						>
							Add a cover image URL to preview the listing thumbnail.
						</div>
					{/if}
				</div>

				<div class="grid gap-3">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="truncate font-semibold">{field('shortTitle') || 'Untitled listing'}</p>
							<p class="text-muted-foreground truncate text-xs">
								{field('brand') || 'Make'} / {field('year') || 'Year'}
							</p>
						</div>
						<Badge variant="outline" class="capitalize">{field('status') || 'draft'}</Badge>
					</div>
					<div class="grid grid-cols-2 gap-2 text-sm">
						<div class="bg-background rounded-lg border p-3">
							<p class="text-muted-foreground text-xs">Price</p>
							<p class="truncate font-medium">
								{field('priceEur') || field('price') || 'No price'}
							</p>
						</div>
						<div class="bg-background rounded-lg border p-3">
							<p class="text-muted-foreground text-xs">Mileage</p>
							<p class="truncate font-medium">
								{field('mileageText') || field('mileageValue') || 'Not set'}
							</p>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Media and source</Card.Title>
					<Card.Description>URLs used by the public listing</Card.Description>
				</div>
				<Card.Action><LinkIcon class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="image">Cover image URL</Label>
					<Input id="image" name="image" value={field('image')} autocomplete="off" />
				</div>
				<div class="grid gap-2">
					<Label for="sourceUrl">Source listing URL</Label>
					<Input id="sourceUrl" name="sourceUrl" value={field('sourceUrl')} autocomplete="off" />
				</div>
			</Card.Content>
		</Card.Root>
	</aside>
</form>
