<script lang="ts">
	import { page } from '$app/state';
	import {
		inventoryDesktopControlsCopy,
		inventoryTypeArtwork
	} from '$lib/content/inventory-desktop-controls';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	import { parseInventoryQuery, serializeInventoryQuery } from '$lib/domain/inventory-query';
	import { assetHref, emptyImage } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	let { filter, english }: { filter: AuxeroInventoryFilter; english: boolean } = $props();
	const state = $derived(parseInventoryQuery(page.url.searchParams));
	const copy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	const options = $derived([
		{ value: '', label: copy.allTypes, image: undefined },
		...filter.options.map((option) => ({ ...option, image: inventoryTypeArtwork[option.value] }))
	]);
	function typeHref(value: string) {
		const params = serializeInventoryQuery(
			{ ...state, filters: { ...state.filters, bodyType: value || undefined } },
			page.url.searchParams
		);
		return linkHref('/inventory?' + params.toString());
	}
</script>

<nav class="inventory-types" aria-label={copy.typeNavigation}>
	{#each options as option (option.value)}
		<a
			href={typeHref(option.value)}
			aria-current={(state.filters.bodyType ?? '') === option.value ? 'page' : undefined}
		>
			{#if option.image}
				<picture aria-hidden="true">
					<source media="(min-width: 768px)" srcset={assetHref(option.image)} />
					<img src={emptyImage} alt="" width="64" height="48" decoding="async" />
				</picture>
			{/if}
			<span>{option.label}</span>
		</a>
	{/each}
</nav>

<style>
	.inventory-types {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		min-width: 0;
	}
	a {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-1) var(--bc-space-4);
		border: 1px solid color-mix(in srgb, var(--bc-ink) 16%, transparent);
		border-radius: var(--bc-radius-pill);
		background: transparent;
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		font-weight: var(--bc-weight-control);
		text-decoration: none;
	}
	a:hover {
		border-color: color-mix(in srgb, var(--bc-ink) 30%, transparent);
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
	}
	a[aria-current='page'] {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}
	picture,
	img {
		display: block;
		width: 48px;
		height: 32px;
		flex: none;
		object-fit: contain;
	}
	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
