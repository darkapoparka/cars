<script lang="ts">
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountFavoritesGrid from './AccountFavoritesGrid.svelte';
	import AccountFavoritesMobilePage from './AccountFavoritesMobilePage.svelte';

	let {
		afterFavoritesHtml,
		beforeFavoritesHtml,
		cards,
		pageDocument
	}: {
		afterFavoritesHtml: string;
		beforeFavoritesHtml: string;
		cards: AuxeroFavoriteVehicleCard[];
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<div class="daynight-favorites-desktop-route">
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeFavoritesHtml}
		afterHtml={afterFavoritesHtml}
	>
		<AccountFavoritesGrid {cards} />
	</AuxeroDashboardSlotShell>
</div>

<div class="daynight-favorites-mobile-route">
	<AccountFavoritesMobilePage {cards} />
</div>

<style>
	.daynight-favorites-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-favorites-html) {
			overflow: auto !important;
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-my-favorites-html #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.daynight-favorites-desktop-route {
			display: none;
		}

		.daynight-favorites-mobile-route {
			display: block;
		}
	}
</style>
