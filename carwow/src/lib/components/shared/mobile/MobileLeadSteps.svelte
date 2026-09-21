<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { leadInfoContent } from '$lib/data/lead-content';
	import MobileLeadImageBanner from './MobileLeadImageBanner.svelte';
	let { kind, onOpen }: { kind: keyof typeof leadInfoContent; onOpen: () => void } = $props();
	const content = $derived(leadInfoContent[kind]);
</script>

<section aria-label={i18n.text(content.title)}>
	<MobileLeadImageBanner
		title={i18n.t('copy.4dbb828642ef')}
		action={i18n.t('copy.52ac512573fc')}
		image={resolve('/assets/images/home-promos/gclass-urus-pair-v4.webp')}
		{onOpen}
	/>
</section>
