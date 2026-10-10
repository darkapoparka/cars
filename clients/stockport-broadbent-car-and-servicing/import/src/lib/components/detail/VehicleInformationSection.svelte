<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		title,
		variant = 'standard',
		actions,
		children
	}: {
		title: string;
		variant?: 'standard' | 'specifications';
		actions?: Snippet;
		children: Snippet;
	} = $props();
</script>

<section
	class="vehicle-information-section"
	class:vehicle-information-section--specifications={variant === 'specifications'}
>
	<header>
		<h2>{title}</h2>
		{@render actions?.()}
	</header>
	{@render children()}
</section>

<style>
	.vehicle-information-section {
		min-width: 0;
		padding: var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-5);
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4) / var(--bc-leading-h4) var(--bc-font-heading);
	}
	.vehicle-information-section--specifications {
		padding: var(--bc-space-5);
	}
	.vehicle-information-section--specifications header {
		margin-bottom: var(--bc-space-4);
	}
	.vehicle-information-section--specifications h2 {
		font: var(--bc-weight-heading) var(--bc-text-h5) / var(--bc-leading-h5) var(--bc-font-body);
	}
	@media (min-width: 768px) {
		.vehicle-information-section {
			border-radius: var(--bc-desktop-card-radius);
			box-shadow: var(--bc-editorial-shadow);
		}
		h2 {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-card-heading);
		}
	}
</style>
