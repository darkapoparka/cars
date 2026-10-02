<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { daynightAssets } from '$lib/config/dealer';
	import { assetHref } from '$lib/utils/assets';
	let { steps }: { steps: readonly { title: string; text: string; mobileText?: string }[] } =
		$props();
	const desktop = new MediaQuery('(min-width: 768px)', false);
</script>

<div class="desktop-process">
	<div class="desktop-process__image">
		{#if desktop.current}
			<img
				src={assetHref(daynightAssets.aboutProcessImage)}
				alt=""
				width="1200"
				height="900"
				loading="lazy"
				decoding="async"
			/>
		{/if}
	</div>
	<ol>
		{#each steps as step, index (step.title)}
			<li>
				<span class="desktop-process__number" aria-hidden="true"
					>{String(index + 1).padStart(2, '0')}</span
				>
				<div>
					<h3>{step.title}</h3>
					<p>{step.mobileText ?? step.text}</p>
				</div>
			</li>
		{/each}
	</ol>
</div>

<style>
	.desktop-process {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-card-bg);
	}
	.desktop-process__image {
		position: relative;
		min-width: 0;
		background: var(--bc-ink);
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	ol {
		display: grid;
		gap: var(--bc-space-6);
		margin: 0;
		padding: var(--bc-space-8);
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
		gap: var(--bc-space-4);
	}
	.desktop-process__number {
		color: var(--bc-accent);
		font-size: var(--bc-text-body-lg);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-h5);
		font-variant-numeric: tabular-nums;
	}
	h3 {
		margin: 0 0 var(--bc-space-1);
		font: var(--bc-weight-heading) var(--bc-text-h5)/var(--bc-leading-h5) var(--bc-font-body);
	}
	p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
	@media (max-width: 1023px) {
		.desktop-process {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		}
		ol {
			padding: var(--bc-space-6);
		}
	}
</style>
