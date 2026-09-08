<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { daynightSite } from '$lib/data/daynight-site';

	type Props = {
		open: boolean;
		unreadCount?: number;
		onclick: () => void;
	};

	let { open, unreadCount = 0, onclick }: Props = $props();
</script>

<button
	class="chat-launcher"
	type="button"
	aria-label={open ? 'Close chat' : 'Open chat'}
	aria-expanded={open}
	{onclick}
>
	{#if open}
		<X aria-hidden="true" />
	{:else}
		<img
			class="chat-launcher__mascot"
			src={daynightSite.logoDark}
			alt=""
			aria-hidden="true"
		/>
	{/if}
	{#if unreadCount > 0}
		<span class="chat-launcher__badge">{unreadCount}</span>
	{/if}
</button>

<style>
	.chat-launcher {
		position: relative;
		display: grid;
		width: 56px;
		height: 56px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.46);
		border-radius: 50%;
		background:
			radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.34), transparent 30%),
			linear-gradient(145deg, #B00000 0%, #8A0000 52%, #000000 100%);
		color: #fff;
		box-shadow:
			0 18px 42px rgba(15, 23, 42, 0.24),
			inset 0 1px 0 rgba(255, 255, 255, 0.28);
		cursor: pointer;
	}

	.chat-launcher__mascot {
		display: block;
		width: 44px;
		height: 44px;
		object-fit: contain;
		pointer-events: none;
	}

	.chat-launcher :global(svg) {
		width: 24px;
		height: 24px;
		color: #fff !important;
		stroke: #fff !important;
		fill: none !important;
	}

	.chat-launcher :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
		fill: none !important;
	}

	.chat-launcher__badge {
		position: absolute;
		top: -3px;
		right: -3px;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		border: 2px solid #fff;
		border-radius: 999px;
		background: #e11d48;
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		line-height: 16px;
	}
</style>
