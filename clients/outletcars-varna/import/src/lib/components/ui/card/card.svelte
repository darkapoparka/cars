<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = 'default',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { size?: 'default' | 'sm' } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	data-size={size}
	class={cn(
		'border-border/80 bg-card text-card-foreground group/card flex flex-col gap-5 overflow-hidden rounded-lg border py-5 text-sm shadow-sm has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
