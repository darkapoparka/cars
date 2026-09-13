<script lang="ts">
	import { ArrowRight, CarFront } from '@lucide/svelte';
	let { onclick }: { onclick: () => void } = $props();
</script>

<button type="button" class="service-input service-manual-entry" {onclick}>
	<CarFront size={24} strokeWidth={2.15} aria-hidden="true" />
	<span class="service-input__text">Опиши автомобила</span>
	<span class="service-input__go" aria-hidden="true">
		<ArrowRight size={21} strokeWidth={2.35} />
	</span>
</button>
