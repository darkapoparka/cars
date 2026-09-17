<script lang="ts">
	import FileSearch from '@lucide/svelte/icons/file-search';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description: string;
		class?: string;
		children?: Snippet;
	};

	let { title, description, class: className, children }: Props = $props();
</script>

<div
	class={cn(
		'bg-muted/30 flex min-h-52 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center',
		className
	)}
>
	<span class="bg-background text-muted-foreground rounded-lg border p-3">
		<FileSearch aria-hidden="true" />
	</span>
	<div class="grid gap-1">
		<p class="text-sm font-semibold">{title}</p>
		<p class="text-muted-foreground mx-auto max-w-md text-sm">{description}</p>
	</div>
	{#if children}
		<div class="flex flex-wrap justify-center gap-2 pt-1">
			{@render children()}
		</div>
	{/if}
</div>
