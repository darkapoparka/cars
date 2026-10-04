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
		gap: var(--bc-space-2);
		border-bottom: 1px solid var(--bc-border);
	}
	a {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-3);
		flex: 1;
		min-width: 0;
		min-height: 64px;
		padding: var(--bc-space-2) var(--bc-space-3) var(--bc-space-4);
		border-radius: var(--bc-desktop-control-radius) var(--bc-desktop-control-radius) 0 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-control);
		text-decoration: none;
	}
	a:hover {
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
	}
	a[aria-current='page'] {
		color: var(--bc-ink);
	}
	a[aria-current='page']::after {
		content: '';
		position: absolute;
		inset: auto var(--bc-space-3) -1px;
		height: 2px;
		background: var(--bc-ink);
	}
	picture,
	img {
		display: block;
		width: 64px;
		height: 48px;
		flex: none;
		object-fit: contain;
	}
	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	@media (max-width: 1023px) {
		a {
			gap: var(--bc-space-2);
			padding-inline: var(--bc-space-2);
			font-size: var(--bc-text-label);
		}
		picture,
		img {
			width: 48px;
			height: 40px;
		}
	}
</style>
