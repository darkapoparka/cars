<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CircleHelp, ChevronRight, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import ServiceVehicleCard from './ServiceVehicleCard.svelte';
	let infoOpen = $state(false);
	let {
		serviceVehicles = [],
		inventoryTitle = 'Налични автомобили',
		browseControls,
		content,
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
		<header>
			<h1>{title}</h1>
		</header>
		<div class="mobile-service-entry__field">{@render entry()}</div>
		<Drawer.Root bind:open={infoOpen} direction="bottom" fixed>
			<div class="mobile-service-entry__meta">
				<strong>{response}</strong>
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
					>{intro} {meta}</Drawer.Description
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
				<ServiceVehicleCard {card} />
			{/each}
		</div>
	</section>
</main>

<style>
	.mobile-service-entry {
		background: var(--bc-bg-strong);
		color: #17191c;
		min-height: calc(100dvh - 126px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
	}
	.mobile-service-entry__start {
		padding: 16px 16px 8px;
		background: #090a0b;
	}
	header h1 {
		margin: 0 0 16px;
		color: #ffffff;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.15;
		text-wrap: balance;
	}
	.mobile-service-entry__field :global(.service-input) {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) 48px;
		gap: 0 10px;
		align-items: center;
		padding: 4px 4px 4px 18px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface-soft);
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
		height: 48px !important;
		border: 0 !important;
		background: transparent !important;
		padding: 0 !important;
		box-shadow: none !important;
		outline: none;
		color: #17191c;
		font-size: 16px;
		line-height: 22px;
	}
	.mobile-service-entry__field :global(input::placeholder) {
		color: #626973;
		opacity: 1;
	}
	.mobile-service-entry__field :global(svg) {
		color: #555b63;
	}
	.mobile-service-entry__field :global(button) {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--bc-accent);
		color: white;
		cursor: pointer;
	}
	.mobile-service-entry__field :global(button svg) {
		color: white;
	}
	.mobile-service-entry__field :global(.service-input:focus-within) {
		outline: 2px solid #ffffff;
		outline-offset: 4px;
	}
	.mobile-service-entry__meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px 12px;
		margin-top: 4px;
		color: #c4c7cb;
		font-size: 12px;
		line-height: 18px;
	}
	.mobile-service-entry__meta strong {
		color: #ffffff;
		font-weight: 600;
	}
	.mobile-service-entry__alternative {
		margin-bottom: 20px;
	}
	.mobile-service-entry__alternative :global(button) {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) 20px;
		align-items: center;
		gap: 12px;
		width: 100%;
		min-height: 48px;
		padding: 12px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: #ffffff;
		color: #17191c;
		cursor: pointer;
		text-align: left;
	}
	.mobile-service-entry__alternative :global(button:hover) {
		background: var(--bc-surface-soft);
	}
	.mobile-service-entry__alternative :global(button:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.mobile-service-entry__field :global(button:focus-visible) {
		outline: 2px solid #ffffff;
		outline-offset: 3px;
	}
	.mobile-service-entry__alternative :global(span) {
		display: grid;
		gap: 3px;
		font-size: 13px;
		line-height: 18px;
		color: #555b63;
	}
	.mobile-service-entry__alternative :global(strong) {
		color: #17191c;
		font-size: 15px;
		font-weight: 600;
	}
	:global(.mobile-service-entry__help) {
		display: flex;
		width: auto;
		min-height: 44px;
		align-items: center;
		gap: 6px;
		margin: 0;
		padding: 0 2px;
		border: 0;
		background: transparent;
		color: #ffffff;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}
	.mobile-service-entry__browse {
		padding: 16px 14px 24px;
	}
	.mobile-service-entry__inventory-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}
	.mobile-service-entry__inventory-heading h2 {
		margin: 0;
		color: #17191c;
		font-size: 22px;
		line-height: 28px;
		font-weight: 700;
	}
	.mobile-service-entry__inventory-heading a {
		display: flex;
		align-items: center;
		gap: 2px;
		min-height: 44px;
		color: #555b63;
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
	}
	.mobile-service-entry__vehicles {
		display: grid;
		gap: 10px;
	}
	@media (max-height: 620px) {
		.mobile-service-entry__start {
			padding-top: 8px;
		}
		header h1 {
			margin-bottom: 12px;
		}
		.mobile-service-entry__browse {
			padding-top: 8px;
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
		border-radius: 20px 20px 0 0;
		background: var(--bc-bg);
		color: #17191c;
		padding: 12px 20px max(28px, env(safe-area-inset-bottom));
		box-shadow: none;
		outline: none;
	}
	:global(.mobile-service-info-handle) {
		width: 40px;
		height: 4px;
		margin: 0 auto 12px;
		border-radius: 999px;
		background: var(--bc-border-strong);
	}
	.mobile-service-info-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	:global(.mobile-service-info-title) {
		margin: 0;
		color: #17191c;
		font-size: 23px;
		line-height: 28px;
		font-weight: 700;
	}
	:global(.mobile-service-info-close) {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface);
		color: #17191c;
		cursor: pointer;
	}
	:global(.mobile-service-info-description) {
		margin: 4px 0 24px;
		color: #555b63;
		font-size: 14px;
		line-height: 20px;
	}
	ol {
		display: grid;
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr);
		gap: 12px;
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
		font-size: 13px;
		font-weight: 700;
	}
	h3 {
		margin: 2px 0 4px;
		color: #17191c;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
	}
	li p {
		margin: 0;
		color: #555b63;
		font-size: 14px;
		line-height: 20px;
		max-width: 45ch;
	}
</style>
