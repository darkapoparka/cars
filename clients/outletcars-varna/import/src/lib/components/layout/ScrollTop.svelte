<script lang="ts">
	import { ArrowUp } from '@lucide/svelte';

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button class="scroll-top" type="button" aria-label="Scroll to top" onclick={scrollTop}>
	<ArrowUp size={22} />
</button>

<style>
	.scroll-top {
		position: fixed;
		right: 28px;
		bottom: 28px;
		z-index: 60;
		display: grid;
		width: 54px;
		height: 54px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--bc-accent);
		color: #ffffff;
		box-shadow: 0 12px 34px rgb(0 0 0 / 0.18);
		cursor: pointer;
	}

	@media (max-width: 520px) {
		.scroll-top {
			right: 16px;
			bottom: 16px;
			width: 48px;
			height: 48px;
		}
	}
</style>
