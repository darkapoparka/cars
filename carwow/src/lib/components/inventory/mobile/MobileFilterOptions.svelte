<script lang="ts">
	type FilterOption = {
		value: string;
		label?: string;
		count?: number;
	};

	const defaultOptionClass = (active: boolean) => (active ? 'is-active' : '');
	const defaultOptionCount = (option: FilterOption) => option.count ?? 0;

	let {
		ariaLabel,
		allLabel,
		allCount,
		allActive,
		options,
		isSelected,
		onClear,
		onSelect,
		optionClass = defaultOptionClass,
		optionCount = defaultOptionCount,
		emptyLabel = ''
	}: {
		ariaLabel: string;
		allLabel: string;
		allCount: number;
		allActive: boolean;
		options: FilterOption[];
		isSelected: (value: string) => boolean;
		onClear: () => void | Promise<void>;
		onSelect: (value: string) => void | Promise<void>;
		optionClass?: (active: boolean) => string;
		optionCount?: (option: FilterOption) => number;
		emptyLabel?: string;
	} = $props();
</script>

<div class="mobile-filter-options" aria-label={ariaLabel}>
	<button type="button" class={allActive ? 'is-active' : ''} onclick={onClear}>
		<span>{allLabel}</span>
		<small>{allCount}</small>
	</button>
	{#each options as option (option.value)}
		{@const selected = isSelected(option.value)}
		<button
			type="button"
			class={optionClass(selected)}
			aria-pressed={selected}
			onclick={() => onSelect(option.value)}
		>
			<span>{option.label ?? option.value}</span>
			{#if selected}
				<span class="mobile-filter-options__selected-mark" aria-hidden="true"></span>
			{:else}
				<small>{optionCount(option)}</small>
			{/if}
		</button>
	{/each}
	{#if emptyLabel && !options.length}
		<p class="mobile-filter-options__empty">{emptyLabel}</p>
	{/if}
</div>
