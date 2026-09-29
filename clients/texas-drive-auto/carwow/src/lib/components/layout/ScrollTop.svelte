<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { ArrowUp } from '@lucide/svelte';

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	class="scroll-top"
	type="button"
	aria-label={i18n.t('copy.0d26ae7f847f')}
	onclick={scrollTop}
>
	<ArrowUp size={22} />
</button>
