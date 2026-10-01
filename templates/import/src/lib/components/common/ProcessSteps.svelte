<script lang="ts">
	let {
		steps,
		horizontal = false,
		mobilePanel = false
	}: {
		steps: readonly { title: string; text: string; mobileText?: string }[];
		horizontal?: boolean;
		mobilePanel?: boolean;
	} = $props();
</script>

<ol
	class="process-steps"
	class:process-steps--horizontal={horizontal}
	class:process-steps--mobile-panel={mobilePanel}
	style:--step-count={steps.length}
>
	{#each steps as step, index (step.title)}<li>
			<span class="process-steps__number" aria-hidden="true">{index + 1}</span>
			<div>
				<h3>{step.title}</h3>
				<p>{mobilePanel ? (step.mobileText ?? step.text) : step.text}</p>
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
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-card);
			background: var(--bc-card-bg);
			grid-template-rows: auto 1fr;
			align-content: start;
		}
		.process-steps--horizontal .process-steps__number {
			background: var(--bc-accent-tint);
			color: var(--bc-accent);
		}
		.process-steps--horizontal h3 {
			font-family: var(--bc-font-body);
		}
		.process-steps--horizontal p {
			font-size: var(--bc-text-body);
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
	@media (max-width: 767.98px) {
		.process-steps--mobile-panel {
			grid-template-columns: 1fr;
			gap: var(--bc-space-4);
			padding: var(--bc-space-4);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-panel);
			background: var(--bc-white);
		}
		.process-steps--mobile-panel li {
			grid-template-columns: var(--bc-control-height-secondary) minmax(0, 1fr);
			padding: 0;
			background: transparent;
		}
		.process-steps--mobile-panel .process-steps__number {
			background: var(--bc-control);
		}
		.process-steps--mobile-panel h3 {
			font-size: var(--bc-mobile-card-title);
			line-height: var(--bc-mobile-card-title-leading);
		}
		.process-steps--mobile-panel p {
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
		}
	}
</style>
