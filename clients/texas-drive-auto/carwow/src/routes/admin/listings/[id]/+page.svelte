<script lang="ts">
	import { resolve } from '$app/paths';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import VehicleForm from '$lib/components/admin/VehicleForm.svelte';
	import {
		formatDate,
		formatPrice,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const vehicleFormId = 'vehicle-listing-form';

	function confirmDelete(event: SubmitEvent) {
		if (!confirm(`Delete ${data.vehicle.short_title}? This removes the listing from the CMS.`)) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Admin - {data.vehicle.short_title}</title>
</svelte:head>

<AdminShell title={data.vehicle.short_title} activePath="/admin/listings">
	<section class="grid gap-4 px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<div class="flex min-w-0 flex-col gap-1">
					<Card.Title>{data.vehicle.title}</Card.Title>
					<div class="flex min-w-0 flex-wrap items-center gap-2">
						<Card.Description class="min-w-0 truncate">
							{data.vehicle.lot || 'No lot'} / Updated {formatDate(data.vehicle.updated_at)}
						</Card.Description>
						<Badge variant={statusVariant(data.vehicle.status)} class="capitalize">
							{formatStatus(data.vehicle.status)}
						</Badge>
					</div>
				</div>
				<Card.Action>
					<div class="flex flex-wrap items-center justify-end gap-2">
						<Button href={resolve(`/inventory/${data.vehicle.slug}`)} variant="outline" size="sm">
							<ExternalLink data-icon="inline-start" aria-hidden="true" />
							Preview
						</Button>
					</div>
				</Card.Action>
			</Card.Header>
			<Card.Footer class="text-muted-foreground flex-wrap gap-3 text-sm">
				<span>{data.vehicle.year}</span>
				<span>{data.vehicle.fuel || 'Fuel not set'}</span>
				<span>{data.vehicle.mileage_text || `${data.vehicle.mileage_value} mi`}</span>
				<span>{formatPrice(data.vehicle)}</span>
			</Card.Footer>
		</Card.Root>

		{#if data.notice}
			<AdminMessage tone="notice">{data.notice}</AdminMessage>
		{/if}

		<VehicleForm
			action="?/save"
			vehicle={data.vehicle}
			{form}
			formId={vehicleFormId}
			submitLabel="Save changes"
		/>

		<Card.Root>
			<Card.Header>
				<div>
					<Card.Title>Danger zone</Card.Title>
					<Card.Description
						>Permanent inventory removal for duplicates and bad imports</Card.Description
					>
				</div>
				<Card.Action>
					<form method="POST" action="?/remove" onsubmit={confirmDelete}>
						<Button type="submit" variant="destructive">
							<Trash2 data-icon="inline-start" aria-hidden="true" />
							Delete listing
						</Button>
					</form>
				</Card.Action>
			</Card.Header>
		</Card.Root>
	</section>
</AdminShell>
