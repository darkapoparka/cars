<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopBrowseLink from './DesktopBrowseLink.svelte';
	let {
		title,
		href,
		label,
		copy,
		centered = false,
		titleContent
	}: {
		title: string;
		href?: string;
		label?: string;
		copy?: string;
		centered?: boolean;
		titleContent?: Snippet;
	} = $props();
</script>

<div class="desktop-section-heading" class:desktop-section-heading--centered={centered}>
	<div>
		<h2>
			{#if titleContent}{@render titleContent()}{:else}{title}{/if}
		</h2>
		{#if copy}<p>{copy}</p>{/if}
	</div>
	{#if href && label}<DesktopBrowseLink {href} {label} />{/if}
</div>

<style>
	.desktop-section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		width: 100%;
		padding: 0;
		margin: 0 0 24px;
		text-align: left;
	}
	h2 {
		font: var(--sa-weight-strong) var(--sa-heading-section)/1.15 var(--sa-font);
		letter-spacing: -0.8px;
		color: #171b1e;
		margin: 0;
		text-align: left;
	}
	.desktop-section-heading--centered {
		justify-content: center;
		text-align: center;
	}
	.desktop-section-heading--centered h2 {
		text-align: center;
	}
	p {
		color: #606a73;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
		margin: 8px 0 0;
	}
</style>
