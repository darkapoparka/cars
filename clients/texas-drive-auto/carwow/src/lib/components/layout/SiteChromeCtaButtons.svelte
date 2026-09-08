<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import SiteChromeIcon from './SiteChromeIcon.svelte';

	let { mobile = false, compact = false }: { mobile?: boolean; compact?: boolean } = $props();
</script>

<div
	class={[
		'ml-auto flex items-center gap-5',
		mobile ? 'flex-wrap justify-center' : 'justify-end max-[1180px]:gap-3'
	]}
>
	<a
		href={resolve('/sell-your-car/request')}
		class={[
			'inline-flex items-center justify-center rounded-sa-sm border leading-none font-bold whitespace-nowrap text-sa-surface no-underline transition-colors duration-150 ease-sa',
			!mobile
				? 'h-12 w-12 border-transparent bg-transparent p-0 text-sa-ink hover:bg-black/5'
				: compact
					? 'h-10 min-h-10 border-transparent bg-transparent px-3 text-[14px] hover:bg-white/12 focus-visible:bg-white/12'
					: 'h-11 min-h-11 border-sa-red bg-sa-red px-5 text-[14px] hover:border-sa-dark hover:bg-sa-dark focus-visible:border-sa-dark focus-visible:bg-sa-dark max-[1180px]:px-4'
		]}
		data-daynight-header-tool="sell"
		aria-label={daynightSite.sellCarCta}
		title={daynightSite.sellCarCta}
	>
		{#if mobile}
			{compact ? 'Sell' : daynightSite.sellCarCta}
		{:else}
			<SiteChromeIcon name="plus-circle" />
		{/if}
	</a>
</div>
