<script lang="ts">
	import Action from '$lib/components/common/Action.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	type SectionCtaHref = '/blog' | '/compare' | '/inventory' | '/inventory?view=4' | '/reviews';
	let { href, label }: { href: SectionCtaHref; label: string } = $props();
</script>

<Action {href} variant="strong" size="compact" class="daynight-section-cta">
	<span>{label}</span><ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
</Action>
