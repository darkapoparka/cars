<script lang="ts">
	import { ArrowUp } from '@lucide/svelte';

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button class="scroll-top" type="button" aria-label="Scroll to top" onclick={scrollTop}>
	<ArrowUp size={22} />
</button>
