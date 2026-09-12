<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils.js';

	type Option = {
		value: string;
		label: string;
	};

	type Props = {
		id?: string;
		name: string;
		value?: string | null;
		options: readonly Option[];
		ariaLabel?: string;
		class?: string;
		controlClass?: string;
		size?: 'sm' | 'default';
	};

	let {
		id = undefined,
		name,
		value = '',
		options,
		ariaLabel = undefined,
		class: className,
		controlClass: controlClassName,
		size = 'sm'
	}: Props = $props();

	const sizeClass = $derived(
		size === 'sm'
			? 'h-9 rounded-lg py-0 pl-3 pr-8 text-xs'
			: 'h-10 rounded-lg py-0 pl-3 pr-9 text-sm'
	);
</script>

<div class={cn('relative inline-flex w-fit max-w-full shrink-0 justify-self-start', className)}>
	<select
		{id}
		{name}
		aria-label={ariaLabel}
		class={cn(
			'admin-select-control border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 max-w-full min-w-32 appearance-none border capitalize transition-colors outline-none focus-visible:ring-3',
			sizeClass,
			controlClassName
		)}
	>
		{#each options as option (option.value)}
			<option value={option.value} selected={value === option.value}>{option.label}</option>
		{/each}
	</select>
	<ChevronDown
		size={16}
		strokeWidth={2.2}
		class="text-muted-foreground pointer-events-none absolute end-3 top-1/2 -translate-y-1/2"
		aria-hidden="true"
	/>
</div>
