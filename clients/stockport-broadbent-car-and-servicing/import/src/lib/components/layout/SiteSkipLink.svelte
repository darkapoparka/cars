<script lang="ts">
	import { page } from '$app/state';
	import { siteShellCopy } from '$lib/content/site-shell';
</script>

<a class="site-skip" href="#main-content"
	>{siteShellCopy[page.data.locale === 'en' ? 'en' : 'bg'].skip}</a
>

<style>
	.site-skip {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 2000;
		transform: translateY(-200%);
		background: var(--bc-white);
		color: var(--bc-ink);
		padding: var(--bc-space-3);
		border-radius: var(--bc-radius-md);
	}
	.site-skip:focus {
		transform: none;
	}
</style>
