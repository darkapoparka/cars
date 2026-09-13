<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CircleHelp, ChevronRight, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import MobileVehicleCard from '$lib/components/common/MobileVehicleCard.svelte';
	let infoOpen = $state(false);
	let {
		serviceVehicles = [],
		inventoryTitle = 'Налични автомобили',
		browseControls,
		content,
		modes,
		showTitle = true,
		title,
		intro,
		meta,
		response,
		stepsTitle = 'Как работи',
		steps,
		entry,
		alternative
	}: {
		serviceVehicles?: HomeFiveVehicleCardData[];
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

<main class="mobile-service-entry">
	<section class="mobile-service-entry__start" aria-label={title}>
		{#if showTitle}
			<header>
				<h1>{title}</h1>
			</header>
		{/if}
		{#if modes}<div class="mobile-service-entry__modes">{@render modes()}</div>{/if}
		<div class="mobile-service-entry__field">{@render entry()}</div>
		<Drawer.Root bind:open={infoOpen} direction="bottom" fixed>
			<div class="mobile-service-entry__meta">
				<Drawer.Trigger class="mobile-service-entry__help">
					<CircleHelp size={18} aria-hidden="true" />
					<span>{stepsTitle}</span>
				</Drawer.Trigger>
			</div>
			<Drawer.Overlay class="mobile-service-info-backdrop" />
			<Drawer.Content class="mobile-service-info-sheet">
				<Drawer.Handle class="mobile-service-info-handle" />
				<div class="mobile-service-info-header">
					<Drawer.Title class="mobile-service-info-title">{stepsTitle}</Drawer.Title>
					<Drawer.Close class="mobile-service-info-close" aria-label="Затвори информацията">
						<X size={22} aria-hidden="true" />
					</Drawer.Close>
				</div>
				<Drawer.Description class="mobile-service-info-description"
					>{response}. {intro} {meta}</Drawer.Description
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
			</Drawer.Content>
		</Drawer.Root>
	</section>
	<section class="mobile-service-entry__browse" aria-label="Още възможности">
		{@render browseControls?.()}
		{@render content?.()}
		{#if alternative}<div class="mobile-service-entry__alternative">
				{@render alternative()}
			</div>{/if}
		{#if serviceVehicles.length}
			<div class="mobile-service-entry__inventory-heading">
				<h2>{inventoryTitle}</h2>
				<a href={resolve('/inventory')}>Всички <ChevronRight size={16} aria-hidden="true" /></a>
			</div>
		{/if}
		<div class="mobile-service-entry__vehicles">
			{#each serviceVehicles as card (card.slug)}
				<MobileVehicleCard {card} />
			{/each}
		</div>
	</section>
</main>

<style>
	.mobile-service-entry {
		display: flex;
		flex-direction: column;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		min-height: calc(100dvh - 126px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
	}
	.mobile-service-entry__start {
		padding: 10px var(--bc-space-4) 32px;
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
		margin-top: 12px;
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
	:global(.mobile-service-entry__help) {
		display: flex;
		width: auto;
		min-height: 36px;
		align-items: center;
		gap: var(--bc-space-2);
		margin: 0;
		padding: 0 14px;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: var(--bc-radius-pill);
		background: rgb(255 255 255 / 0.08);
		color: var(--bc-white);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		cursor: pointer;
		line-height: var(--bc-leading-control);
	}
	.mobile-service-entry__browse {
		position: relative;
		z-index: 2;
		flex: 1;
		margin-top: -20px;
		border-radius: 24px 24px 0 0;
		padding: 26px var(--bc-mobile-gutter) var(--bc-space-6);
		background: var(--bc-bg-strong);
		box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.14);
	}
	.mobile-service-entry__browse::before {
		position: absolute;
		top: 9px;
		left: 50%;
		width: 38px;
		height: 4px;
		border-radius: var(--bc-radius-pill);
		background: #c3cad2;
		content: '';
		transform: translateX(-50%);
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
	:global(.mobile-service-entry__help:focus-visible),
	:global(.mobile-service-info-close:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	:global(.mobile-service-info-backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		background: rgb(0 0 0 / 0.5);
	}
	:global(.mobile-service-info-sheet) {
		position: fixed;
		inset: auto 0 0;
		z-index: 1201;
		max-height: calc(100dvh - 24px - env(safe-area-inset-top));
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-surface);
		color: var(--bc-ink);
		padding: var(--bc-space-3) var(--bc-space-5) max(var(--bc-space-7), env(safe-area-inset-bottom));
		box-shadow: none;
		outline: none;
	}
	:global(.mobile-service-info-handle) {
		width: 40px;
		height: 4px;
		margin: 0 auto var(--bc-space-3);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border-strong);
	}
	.mobile-service-info-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
	}
	:global(.mobile-service-info-title) {
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	:global(.mobile-service-info-close) {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		cursor: pointer;
	}
	:global(.mobile-service-info-description) {
		margin: var(--bc-space-1) 0 var(--bc-space-6);
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
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
