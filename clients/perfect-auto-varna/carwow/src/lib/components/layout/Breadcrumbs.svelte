<script lang="ts">
	import { previewPath } from '$lib/utils/preview-paths';
	import { ChevronRight } from '@lucide/svelte';

	interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		items: Crumb[];
	}

	let { items }: Props = $props();
</script>

<section class="breadcrumb-band">
	<div class="container">
		<ul class="breadcrumb-list" aria-label="Breadcrumb">
			<li><a href="/variant-3/">Home</a></li>
			{#each items as item (item.label)}
				<li><ChevronRight size={14} /></li>
				<li>
					{#if item.href}
						<a href={previewPath(item.href)}>{item.label}</a>
					{:else}
						<span>{item.label}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>
