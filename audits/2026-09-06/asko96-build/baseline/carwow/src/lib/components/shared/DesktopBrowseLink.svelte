<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		href,
		label,
		tone = 'light'
	}: { href: string; label: string; tone?: 'light' | 'dark' } = $props();
</script>

<a {href} class="desktop-browse-link" class:desktop-browse-link--dark={tone === 'dark'}>
	<span>{label}</span><ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
</a>

<style>
	.desktop-browse-link {
		align-items: center;
		background: #fff;
		border: 1px solid #d9dde1;
		border-radius: 8px;
		box-shadow: none;
		box-sizing: border-box;
		color: #171b1e;
		display: inline-flex;
		flex: 0 0 auto;
		font: 600 15px/1.3 var(--sa-font);
		gap: 12px;
		justify-content: center;
		min-height: 44px;
		padding: 11px 16px;
		text-decoration: none;
		white-space: nowrap;
	}
	.desktop-browse-link:hover {
		background: #f0f2f3;
		border-color: #aeb5bc;
		color: #171b1e;
	}
	.desktop-browse-link--dark {
		background: #171b1e;
		border-color: #171b1e;
		color: #fff;
	}
	.desktop-browse-link--dark:hover {
		background: #363c42;
		border-color: #363c42;
		color: #fff;
	}
	.desktop-browse-link:focus-visible {
		outline: 2px solid #d50028;
		outline-offset: 3px;
	}
	.desktop-browse-link :global(svg) {
		flex-shrink: 0;
		color: inherit;
	}
	.desktop-browse-link span {
		font: inherit !important;
		color: inherit !important;
	}
</style>
