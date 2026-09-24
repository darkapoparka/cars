<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { Snippet } from 'svelte';
	import CircleHelp from '@lucide/svelte/icons/circle-question-mark';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import { linkHref as resolve } from '$lib/utils/links';
	import type { VehicleCardSummary } from '$lib/domain/vehicle-card';
	import MobileVehicleCard from '$lib/components/common/MobileVehicleCard.svelte';
	let infoOpen = $state(false);
	let {
		serviceVehicles = [],
		embedded = false,
		inventoryTitle = nt('ui248'),
		browseControls,
		content,
		modes,
		showTitle = true,
		title,
		intro,
		meta,
		response,
		stepsTitle = nt('ui249'),
		steps,
		entry,
		alternative
	}: {
		serviceVehicles?: VehicleCardSummary[];
		embedded?: boolean;
		inventoryTitle?: string;
		browseControls?: Snippet;
		content?: Snippet;
		modes?: Snippet;
		showTitle?: boolean;
		title: string;
		intro: string;
		meta: string;
		response: string;
		stepsTitle?: string;
		steps: readonly { title: string; text: string }[];
		entry: Snippet;
		alternative?: Snippet;
	} = $props();
</script>

<svelte:element this={embedded ? 'section' : 'main'} class="mobile-service-entry">
	<section class="mobile-service-entry__start" aria-label={title}>
		{#if showTitle}
			<header>
				<h1>{title}</h1>
			</header>
		{/if}
		{#if modes}<div class="mobile-service-entry__modes">{@render modes()}</div>{/if}
		<div class="mobile-service-entry__field">{@render entry()}</div>
		<div class="mobile-service-entry__meta">
			<button type="button" class="mobile-service-entry__help" onclick={() => (infoOpen = true)}>
				<CircleHelp size={18} aria-hidden="true" />
				<span>{stepsTitle}</span>
			</button>
		</div>
		<MobileSheet
			bind:open={infoOpen}
			title={stepsTitle}
			description={response + '. ' + intro + ' ' + meta}
			contentClass="mobile-service-info-sheet"
		>
			<ol>
				{#each steps as step, index (step.title)}
					<li>
						<span class="mobile-service-entry__number" aria-hidden="true">{index + 1}</span>
						<div>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</div>
					</li>
				{/each}
			</ol>
		</MobileSheet>
	</section>
	<section class="mobile-service-entry__browse" aria-label={nt('ui247')}>
		{@render browseControls?.()}
		{@render content?.()}
		{#if alternative}<div class="mobile-service-entry__alternative">
				{@render alternative()}
			</div>{/if}
		{#if serviceVehicles.length}
			<div class="mobile-service-entry__inventory-heading">
				<h2>{inventoryTitle}</h2>
				<a href={resolve('/inventory')}
					>{nt('ui114')} <ChevronRight size={16} aria-hidden="true" /></a
				>
			</div>
		{/if}
		<div class="mobile-service-entry__vehicles">
			{#each serviceVehicles as card (card.slug)}
				<MobileVehicleCard {card} />
			{/each}
		</div>
	</section>
</svelte:element>

<style>
	.mobile-service-entry {
		display: flex;
		flex-direction: column;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		min-height: calc(100dvh - 126px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
	}
	.mobile-service-entry__start {
		padding: 10px var(--bc-space-4) var(--bc-space-8);
		background: var(--bc-mobile-dark);
	}
	.mobile-service-entry__modes {
		margin: 0 0 var(--bc-mobile-entry-gap);
	}
	.mobile-service-entry__field {
		min-height: var(--bc-control-height-primary);
	}
	header h1 {
		margin: 0 0 var(--bc-space-4);
		color: var(--bc-white);
		font-size: var(--bc-mobile-page-title);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: var(--bc-mobile-page-title-leading);
		text-wrap: balance;
	}
	.mobile-service-entry__field :global(.service-input) {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) var(--bc-control-height-standard);
		height: var(--bc-control-height-primary);
		gap: 0 var(--bc-space-2);
		align-items: center;
		padding: var(--bc-mobile-entry-inset) var(--bc-mobile-entry-inset) var(--bc-mobile-entry-inset)
			var(--bc-space-4);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
	}
	.mobile-service-entry__field :global(label) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.mobile-service-entry__field :global(input) {
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-standard) !important;
		border: 0 !important;
		background: transparent !important;
		padding: 0 !important;
		box-shadow: none !important;
		outline: none;
		color: var(--bc-ink);
	}
	.mobile-service-entry__field :global(input),
	.mobile-service-entry__field :global(.service-input__text) {
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
		text-align: left;
	}
	.mobile-service-entry__field :global(.service-manual-entry) {
		width: 100%;
		cursor: pointer;
	}
	.mobile-service-entry__field :global(.service-input__text) {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--bc-muted);
	}
	.mobile-service-entry__field :global(input::placeholder) {
		font: inherit;
		letter-spacing: inherit;
		color: var(--bc-muted);
		opacity: 1;
	}
	.mobile-service-entry__field :global(svg) {
		color: var(--bc-copy);
	}
	.mobile-service-entry__field :global(.service-input > svg) {
		justify-self: center;
	}
	.mobile-service-entry__field :global(.service-input button),
	.mobile-service-entry__field :global(.service-input__go) {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		padding: 0;
		border: var(--bc-space-1) solid transparent;
		border-radius: 50%;
		background: var(--bc-accent);
		background-clip: padding-box;
		color: white;
		cursor: pointer;
	}
	.mobile-service-entry__field :global(.service-input button svg),
	.mobile-service-entry__field :global(.service-input__go svg) {
		width: 20px;
		height: 20px;
		color: white;
	}
	.mobile-service-entry__field :global(.service-input:focus-within) {
		outline: 2px solid var(--bc-white);
		outline-offset: 4px;
	}
	.mobile-service-entry__meta {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: var(--bc-mobile-entry-gap);
	}
	.mobile-service-entry__alternative {
		margin-bottom: var(--bc-space-5);
	}
	.mobile-service-entry__alternative :global(button) {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) 20px;
		align-items: center;
		gap: var(--bc-space-3);
		width: 100%;
		min-height: var(--bc-control-height-primary);
		padding: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-soft);
		color: var(--bc-ink);
		cursor: pointer;
		text-align: left;
	}
	.mobile-service-entry__alternative :global(button:hover) {
		background: var(--bc-surface-hover);
	}
	.mobile-service-entry__alternative :global(button:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.mobile-service-entry__field :global(button:focus-visible) {
		outline: 2px solid var(--bc-white);
		outline-offset: 3px;
	}
	.mobile-service-entry__alternative :global(span) {
		display: grid;
		gap: 3px;
		font-size: var(--bc-mobile-label);
		line-height: var(--bc-mobile-label-leading);
		color: var(--bc-copy);
	}
	.mobile-service-entry__alternative :global(strong) {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-body);
		font-weight: 600;
	}
	.mobile-service-entry__help {
		display: flex;
		width: auto;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-2);
		margin: 0;
		padding: 0 14px;
		border: 2px solid transparent;
		border-radius: var(--bc-radius-pill);
		background: rgb(255 255 255 / 0.08);
		background-clip: padding-box;
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
		color: var(--bc-white);
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-control);
		cursor: pointer;
		line-height: var(--bc-leading-cta);
	}
	.mobile-service-entry__browse {
		position: relative;
		z-index: 2;
		flex: 1;
		margin-top: -20px;
		border-radius: 24px 24px 0 0;
		padding: var(--bc-space-5) var(--bc-mobile-gutter) var(--bc-space-6);
		background: var(--bc-bg-strong);
		box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.14);
	}
	.mobile-service-entry__inventory-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-3);
	}
	.mobile-service-entry__inventory-heading h2 {
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.mobile-service-entry__inventory-heading a {
		display: flex;
		align-items: center;
		gap: 2px;
		min-height: var(--bc-control-height-standard);
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: 600;
		white-space: nowrap;
	}
	.mobile-service-entry__vehicles {
		display: grid;
		gap: var(--bc-space-3);
	}
	@media (max-height: 620px) {
		header h1 {
			margin-bottom: var(--bc-space-3);
		}
	}
	.mobile-service-entry__help:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	:global(.mobile-service-info-sheet.bc-mobile-sheet__content) {
		background: var(--bc-surface);
	}

	:global(.mobile-service-info-sheet .bc-mobile-sheet__body) {
		padding: var(--bc-space-2) 0 var(--bc-space-4);
	}
	ol {
		display: grid;
		gap: var(--bc-space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr);
		gap: var(--bc-space-3);
		align-items: start;
	}
	.mobile-service-entry__number {
		display: grid;
		place-items: center;
		height: 28px;
		border: 1px solid var(--bc-border);
		border-radius: 50%;
		background: var(--bc-surface-raised);
		color: var(--bc-accent);
		font-size: var(--bc-mobile-label);
		font-weight: 700;
	}
	h3 {
		margin: 2px 0 4px;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: 600;
		line-height: var(--bc-mobile-card-title-leading);
	}
	li p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		max-width: 45ch;
	}
</style>
