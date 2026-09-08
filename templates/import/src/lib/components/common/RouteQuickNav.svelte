<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		label,
		items,
		value = '',
		align = 'start',
		onchange,
		summary
	}: {
		label: string;
		items: { label: string; value: string; href?: string }[];
		value?: string;
		align?: 'start' | 'center';
		onchange?: (value: string) => void;
		summary?: Snippet;
	} = $props();
</script>

<div class="route-quick-nav" class:route-quick-nav--center={align === 'center'}>
	<nav aria-label={label}>
		{#each items as item (item.value)}
			{#if item.href}
				<a href={item.href} aria-current={value === item.value ? 'location' : undefined}
					>{item.label}</a
				>
			{:else}
				<button
					type="button"
					aria-pressed={value === item.value}
					onclick={() => onchange?.(item.value)}>{item.label}</button
				>
			{/if}
		{/each}
	</nav>
	{#if summary}<div class="route-quick-nav__summary" aria-live="polite">
			{@render summary()}
		</div>{/if}
</div>

<style>
	.route-quick-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
		padding-block: 24px;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 10px;
	}
	.route-quick-nav--center,
	.route-quick-nav--center nav {
		justify-content: center;
	}
	a,
	button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		min-height: var(--bc-route-pill-height, 48px);
		padding: 0 16px;
		border: 1px solid var(--bc-route-pill-border, #b4bcc6);
		border-radius: 999px;
		background: #fff;
		color: #25282c;
		font: inherit;
		font-size: var(--bc-route-pill-font, 18px);
		font-weight: 550;
		line-height: 26px;
		text-decoration: none;
		cursor: pointer;
	}
	button[aria-pressed='true'],
	a[aria-current] {
		background: #1c1c1c;
		color: #fff;
		border-color: #1c1c1c;
	}
	a:hover,
	button:hover {
		border-color: var(--bc-accent);
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.route-quick-nav__summary {
		color: var(--bc-muted);
		font-size: 14px;
	}
	@media (max-width: 767px) {
		a,
		button {
			min-height: 44px;
			font-size: 16px;
		}
	}
</style>
