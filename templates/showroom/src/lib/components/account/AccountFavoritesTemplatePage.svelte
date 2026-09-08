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

<div class="eliqauto-favorites-desktop-route">
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeFavoritesHtml}
		afterHtml={afterFavoritesHtml}
	>
		<AccountFavoritesGrid {cards} />
	</AuxeroDashboardSlotShell>
</div>

<div class="eliqauto-favorites-mobile-route">
	<AccountFavoritesMobilePage {cards} />
</div>

<style>
	.eliqauto-favorites-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-favorites-html) {
			overflow: auto;
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		:global(body.auxero-template-my-favorites-html #wrapper) {
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		.eliqauto-favorites-desktop-route {
			display: none;
		}

		.eliqauto-favorites-mobile-route {
			display: block;
		}
	}
</style>
