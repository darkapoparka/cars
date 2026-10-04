<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	let {
		children,
		steps,
		processTitle,
		actionHref,
		actionLabel
	}: {
		children: Snippet;
		steps: ComponentProps<typeof ProcessSteps>['steps'];
		processTitle: string;
		actionHref: string;
		actionLabel: string;
	} = $props();
</script>

<section class="site-section">
	<div class="site-container intake-page">
		<div class="site-panel site-stack service-intake">{@render children()}</div>
		<div class="service-process">
			<h2 class="site-heading">{processTitle}</h2>
			<ProcessSteps {steps} horizontal />
			<Action href={actionHref} variant="secondary">{actionLabel}</Action>
		</div>
	</div>
</section>

<style>
	.intake-page {
		display: grid;
		gap: var(--bc-space-8);
	}
	.service-intake {
		width: min(100%, 860px);
		margin-inline: auto;
		padding: var(--bc-space-8);
	}
	.service-process {
		display: grid;
		gap: var(--bc-space-6);
		width: min(100%, var(--bc-desktop-editorial-width));
		margin-inline: auto;
	}
	.service-process > h2 {
		text-align: center;
	}
	.service-process > :global(.site-action) {
		justify-self: center;
	}
</style>
