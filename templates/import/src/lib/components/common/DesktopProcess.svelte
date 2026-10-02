<script lang="ts">
	let { steps }: { steps: readonly { title: string; text: string; mobileText?: string }[] } =
		$props();
</script>

<ol class="desktop-process">
	{#each steps as step, index (step.title)}
		<li>
			<span class="desktop-process__number" aria-hidden="true"
				>{String(index + 1).padStart(2, '0')}</span
			>
			<h3>{step.title}</h3>
			<p>{step.mobileText ?? step.text}</p>
		</li>
	{/each}
</ol>

<style>
	.desktop-process {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-rows: auto auto 1fr;
		align-content: start;
		gap: var(--bc-space-2);
		min-width: 0;
		padding: var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-card-bg);
	}
	.desktop-process__number {
		margin-bottom: var(--bc-space-1);
		color: var(--bc-accent);
		font-size: var(--bc-text-body-lg);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-h5);
		font-variant-numeric: tabular-nums;
	}
	h3 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h5)/var(--bc-leading-h5) var(--bc-font-body);
	}
	p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
	@media (min-width: 768px) {
		.desktop-process {
			gap: var(--bc-space-4);
		}
		li {
			padding: var(--bc-space-5);
			border-color: var(--bc-desktop-editorial-border);
			border-radius: var(--bc-desktop-editorial-radius);
			box-shadow: var(--bc-desktop-editorial-shadow);
		}
		.desktop-process__number {
			display: grid;
			place-items: center;
			width: var(--bc-space-8);
			height: var(--bc-space-8);
			margin-bottom: var(--bc-space-2);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-desktop-editorial-canvas);
			color: var(--bc-desktop-editorial-muted);
			font-size: var(--bc-text-body);
			font-weight: var(--bc-weight-body);
		}
		h3 {
			font-size: var(--bc-text-control);
		}
		p {
			color: var(--bc-desktop-editorial-muted);
			line-height: var(--bc-leading-body-lg);
		}
	}
	@media (max-width: 1023px) {
		.desktop-process {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
