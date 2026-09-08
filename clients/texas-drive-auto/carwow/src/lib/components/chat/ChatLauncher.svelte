<script lang="ts">
	import { MessageCircle, X } from '@lucide/svelte';

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
		<MessageCircle aria-hidden="true" />
	{/if}
	<span class="chat-launcher__label">Chat preview</span>
	{#if unreadCount > 0}
		<span class="chat-launcher__badge">{unreadCount}</span>
	{/if}
</button>

<style>
	.chat-launcher {
		position: relative;
		display: grid;
		width: 48px;
		height: 48px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.46);
		border-radius: 50%;
		background: var(--sa-ink);
		color: #fff;
		box-shadow: none;
		cursor: pointer;
	}

	.chat-launcher__label {
		display: none;
		color: inherit;
	}
	.chat-launcher:focus-visible {
		outline: 2px solid var(--sa-ink);
		outline-offset: 3px;
	}
	@media (max-width: 991px) {
		.chat-launcher {
			display: flex;
			justify-content: center;
			gap: 8px;
			width: 100%;
			border-radius: 8px;
			background: var(--sa-red);
			font: inherit;
			font-weight: 600;
		}
		.chat-launcher__label {
			display: inline;
		}
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
