<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CarFront from '@lucide/svelte/icons/car-front';
	let { onclick }: { onclick: () => void } = $props();
</script>

<button type="button" class="service-input service-manual-entry" {onclick}>
	<CarFront size={24} strokeWidth={2.15} aria-hidden="true" />
	<span class="service-input__text">{nt('ui250')}</span>
	<span class="service-input__go" aria-hidden="true">
		<ArrowRight size={21} strokeWidth={2.35} />
	</span>
</button>
