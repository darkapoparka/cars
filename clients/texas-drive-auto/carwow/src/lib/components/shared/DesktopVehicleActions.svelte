<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import '$lib/styles/desktop-discovery.css';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import Heart from '@lucide/svelte/icons/heart';
	import { getOptionalGarageContext } from '$lib/state/garage.svelte';

	let { slug, title }: { slug: string; title: string } = $props();
	const garage = getOptionalGarageContext();
	const compared = $derived(garage.isCompared(slug));
	const favorite = $derived(garage.isFavorite(slug));
</script>

<div
	class="desktop-vehicle-actions"
	role="group"
	aria-label={i18n.t('pattern.4a55f615987e', { v0: title })}
>
	<button
		type="button"
		aria-pressed={compared}
		aria-label={compared
			? i18n.t('pattern.934f8811d407', { v0: title })
			: i18n.t('pattern.eb6671a2dbc8', { v0: title })}
		title={compared ? i18n.t('copy.5b40a58e1ce4') : i18n.t('copy.040cc31a724d')}
		onclick={() => garage.toggleCompare(slug)}
		><ArrowLeftRight size={18} strokeWidth={2} aria-hidden="true" /></button
	>
	<button
		type="button"
		aria-pressed={favorite}
		aria-label={favorite
			? i18n.t('pattern.b232837ea72c', { v0: title })
			: i18n.t('pattern.43ac23a14f61', { v0: title })}
		title={favorite ? i18n.t('copy.26b1f78b8a15') : i18n.t('copy.95edb020a66d')}
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
		background: var(--discovery-light-hover);
		border-color: var(--discovery-light-hover);
		color: var(--discovery-action);
	}
	.desktop-vehicle-actions button[aria-pressed='true'] {
		background: var(--discovery-action);
		border-color: var(--discovery-action);
		color: #fff;
	}
	.desktop-vehicle-actions button[aria-pressed='true']:hover {
		background: var(--discovery-action-hover);
		border-color: var(--discovery-action-hover);
	}
	.desktop-vehicle-actions button:focus-visible {
		outline: 2px solid var(--discovery-action);
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
