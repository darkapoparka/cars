<script lang="ts">
	let {
		steps,
		horizontal = false
	}: { steps: readonly { title: string; text: string }[]; horizontal?: boolean } = $props();
</script>

<ol
	class="process-steps"
	class:process-steps--horizontal={horizontal}
	style:--step-count={steps.length}
>
	{#each steps as step, index (step.title)}<li>
			<span class="process-steps__number" aria-hidden="true">{index + 1}</span>
			<div>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</div>
		</li>{/each}
</ol>

<style>
	.process-steps {
		display: grid;
		gap: var(--bc-space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: var(--bc-control-height-secondary) minmax(0, 1fr);
		align-items: start;
		gap: var(--bc-space-3);
	}
	.process-steps__number {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-secondary);
		height: var(--bc-control-height-secondary);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: var(--bc-accent);
		font-weight: var(--bc-weight-heading);
	}
	h3 {
		margin: 0 0 var(--bc-space-1);
		font: var(--bc-weight-heading) var(--bc-text-h5)/1.35 var(--bc-font-heading);
	}
	p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
	.process-steps--horizontal {
		grid-template-columns: repeat(var(--step-count), minmax(0, 1fr));
	}
	.process-steps--horizontal li {
		grid-template-columns: 1fr;
		text-align: start;
		padding: var(--bc-space-6);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
	}
	.process-steps--horizontal .process-steps__number {
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.process-steps--horizontal p {
		font-size: var(--bc-text-body-lg);
	}
	@media (max-width: 1023px) {
		.process-steps--horizontal {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 768px) {
		.process-steps--horizontal li {
			grid-template-rows: auto 1fr;
			align-content: start;
		}
	}
	@media (max-width: 575px) {
		.process-steps--horizontal {
			grid-template-columns: 1fr;
		}
		.process-steps--horizontal li {
			grid-template-columns: var(--bc-control-height-secondary) minmax(0, 1fr);
			padding: var(--bc-space-4);
		}
		.process-steps--horizontal p {
			font-size: var(--bc-text-body);
		}
	}
</style>
