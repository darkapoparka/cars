<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn(
		'bg-muted/35 flex items-center rounded-b-lg border-t p-5 group-data-[size=sm]/card:p-4',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
