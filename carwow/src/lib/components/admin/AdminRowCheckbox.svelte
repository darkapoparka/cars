<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Props = {
		name?: string;
		value?: string;
		form?: string;
		ariaLabel: string;
		class?: string;
	};

	let {
		name = 'ids',
		value = undefined,
		form = undefined,
		ariaLabel,
		class: className
	}: Props = $props();
</script>

<label
	class={cn(
		'hover:bg-muted inline-grid size-10 cursor-pointer place-items-center rounded-lg transition-colors',
		className
	)}
>
	<input
		type="checkbox"
		{name}
		{value}
		{form}
		aria-label={ariaLabel}
		class="admin-row-checkbox border-input text-primary focus-visible:ring-ring/50 bg-background size-7 shrink-0 rounded-md border outline-none focus-visible:ring-3"
	/>
	<span class="sr-only">{ariaLabel}</span>
</label>
