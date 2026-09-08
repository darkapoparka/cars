<script lang="ts">
	import '$lib/styles/desktop-discovery.css';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import Heart from '@lucide/svelte/icons/heart';
	import { getOptionalGarageContext } from '$lib/state/garage.svelte';

	let { slug, title }: { slug: string; title: string } = $props();
	const garage = getOptionalGarageContext();
	const compared = $derived(garage.isCompared(slug));
	const favorite = $derived(garage.isFavorite(slug));
</script>

<div class="desktop-vehicle-actions" role="group" aria-label={`Действия за ${title}`}>
	<button
		type="button"
		aria-pressed={compared}
		aria-label={compared ? `Премахни ${title} от сравнение` : `Добави ${title} за сравнение`}
		title={compared ? 'Премахни от сравнение' : 'Добави за сравнение'}
		onclick={() => garage.toggleCompare(slug)}
		><ArrowLeftRight size={18} strokeWidth={2} aria-hidden="true" /></button
	>
	<button
		type="button"
		aria-pressed={favorite}
		aria-label={favorite ? `Премахни ${title} от любими` : `Добави ${title} в любими`}
		title={favorite ? 'Премахни от любими' : 'Добави в любими'}
		onclick={() => garage.toggleFavorite(slug)}
		><Heart
			size={18}
			strokeWidth={2}
			fill={favorite ? 'currentColor' : 'none'}
			aria-hidden="true"
		/></button
	>
</div>

<style>
	.desktop-vehicle-actions {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		flex: none;
		pointer-events: auto;
	}
	.desktop-vehicle-actions button {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 1px solid #d7dee7;
		border-radius: 50%;
		background: #fff;
		color: #171b1e;
		cursor: pointer;
	}
	.desktop-vehicle-actions button:hover {
		border-color: var(--sa-red);
		color: var(--sa-red);
	}
	.desktop-vehicle-actions button[aria-pressed='true'] {
		background: var(--sa-red);
		border-color: var(--sa-red);
		color: #fff;
	}
	.desktop-vehicle-actions button[aria-pressed='true']:hover {
		background: var(--sa-red-strong);
		border-color: var(--sa-red-strong);
	}
	.desktop-vehicle-actions button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
	/* Legacy template rules color SVG descendants independently of the button. */
	.desktop-vehicle-actions button :global(svg),
	.desktop-vehicle-actions button :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	@media (pointer: coarse) {
		.desktop-vehicle-actions button {
			width: 44px;
			height: 44px;
		}
	}
</style>
