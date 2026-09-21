<script lang="ts">
	import { Popover } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	import { inventoryFilterParam } from '$lib/domain/inventory-query';
	let {
		filter,
		english = false,
		selection = $bindable<string[]>([])
	}: {
		filter: AuxeroInventoryFilter;
		english?: boolean;
		selection?: string[];
	} = $props();
	const id = $props.id();
	let query = $state('');
	const matching = $derived(
		filter.options.filter((option) =>
			option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
		)
	);
	const summary = $derived(
		selection
			.map((value) => filter.options.find((option) => option.value === value)?.label ?? value)
			.join(', ')
	);
	function toggle(value: string) {
		selection =
			filter.mode === 'single'
				? selection.includes(value)
					? []
					: [value]
				: selection.includes(value)
					? selection.filter((item) => item !== value)
					: [...selection, value];
	}
</script>

<div
	class={[
		'compact-field',
		filter.name === 'feature' && filter.options.length > 1 && 'compact-field--features'
	]}
>
	{#each selection as value (value)}<input
			type="hidden"
			name={inventoryFilterParam(filter.name)}
			{value}
		/>{/each}
	{#if filter.name === 'feature' && filter.options.length === 1}
		<span class="compact-field__label">{filter.label}</span>
		<label class="compact-field__feature"
			><input
				type="checkbox"
				checked={selection.includes(filter.options[0].value)}
				onchange={() => toggle(filter.options[0].value)}
			/>{filter.options[0].label}</label
		>
	{:else if filter.name === 'feature'}
		<fieldset class="compact-features">
			<legend>{filter.label}</legend>
			<div>
				{#each filter.options as option (option.value)}<label
						><input
							type="checkbox"
							checked={selection.includes(option.value)}
							onchange={() => toggle(option.value)}
						/><span>{option.label}</span></label
					>{/each}
			</div>
		</fieldset>
	{:else if filter.numericInput}
		<label for={id}>{filter.numericInput.label}</label>
		<div class="compact-field__number">
			<input
				{id}
				type="number"
				aria-label={filter.numericInput.label + ' (' + filter.numericInput.unit + ')'}
				min="1"
				step="1"
				inputmode="numeric"
				placeholder={english ? 'Any' : 'Без лимит'}
				value={selection[0] ?? ''}
				list={id + '-presets'}
				oninput={(event) => {
					const value = event.currentTarget.valueAsNumber;
					selection = Number.isFinite(value) ? [String(value)] : [];
				}}
			/>
			<span>{filter.numericInput.unit}</span>
		</div>
		<datalist id={id + '-presets'}
			>{#each filter.options as option (option.value)}<option value={option.value}
					>{option.label}</option
				>{/each}</datalist
		>
	{:else}
		<span id={id + '-label'} class="compact-field__label">{filter.label}</span>
		<Popover.Root onOpenChange={() => (query = '')}>
			<Popover.Trigger
				class="compact-field__trigger"
				aria-labelledby={id + '-label ' + id + '-value'}
			>
				<span id={id + '-value'}>{summary || filter.allLabel}</span><ChevronDown
					size={16}
					aria-hidden="true"
				/>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					class="compact-field__popover"
					sideOffset={8}
					align="start"
					aria-label={filter.label}
				>
					<input
						class="compact-field__search"
						type="search"
						bind:value={query}
						aria-label={(english ? 'Search in ' : 'Търси в ') + filter.label}
						placeholder={english ? 'Search options' : 'Търси в опциите'}
					/>
					<div class="compact-field__options">
						{#each matching as option (option.value)}
							<label
								><input
									type="checkbox"
									checked={selection.includes(option.value)}
									onchange={() => toggle(option.value)}
								/><span>{option.label}</span></label
							>
						{:else}<p role="status">{english ? 'No matches' : 'Няма съвпадения'}</p>{/each}
					</div>
					<div class="compact-field__actions">
						<button type="button" onclick={() => (selection = [])}
							>{english ? 'Clear' : 'Изчисти'}</button
						><Popover.Close>{english ? 'Done' : 'Готово'}</Popover.Close>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	{/if}
</div>

<style>
	.compact-field > .compact-field__feature {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		font-weight: normal;
		cursor: pointer;
	}
	.compact-field__feature input {
		accent-color: var(--bc-accent);
	}
	.compact-field--features {
		grid-column: 1 / -1;
	}
	.compact-features {
		margin: 0;
		min-width: 0;
		padding: var(--bc-space-5);
		border: 0;
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface);
	}
	.compact-features legend {
		float: left;
		width: 100%;
		padding: 0 0 var(--bc-space-4);
		font-weight: var(--bc-weight-heading);
	}
	.compact-features > div {
		clear: both;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: var(--bc-space-2);
	}
	.compact-features label {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		padding: var(--bc-space-3);
		min-height: var(--bc-control-height-standard);
		background: var(--bc-surface-raised);
		border-radius: var(--bc-radius-md);
		font-size: var(--bc-text-label);
		cursor: pointer;
	}
	.compact-features input {
		accent-color: var(--bc-accent);
	}
	.compact-field {
		display: grid;
		gap: var(--bc-space-2);
		min-width: 0;
		align-content: start;
	}
	.compact-field > label,
	.compact-field__label {
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		font-weight: var(--bc-weight-control);
	}
	.compact-field :global(.compact-field__trigger),
	.compact-field__number {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		width: 100%;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
	}
	.compact-field :global(.compact-field__trigger) {
		justify-content: space-between;
		text-align: left;
	}
	.compact-field :global(.compact-field__trigger > span) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.compact-field :global(.compact-field__trigger > svg) {
		flex: none;
	}
	.compact-field__number input {
		width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
	}
	.compact-field__number span {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	:global(.compact-field__popover) {
		z-index: calc(var(--bc-z-dialog) + 10);
		width: min(22rem, calc(100vw - 32px));
		max-height: var(--bits-popover-content-available-height);
		display: flex;
		flex-direction: column;
		gap: var(--bc-space-3);
		padding: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-panel);
	}
	.compact-field__search {
		width: 100%;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border: 1px solid var(--bc-route-pill-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font: inherit;
	}
	.compact-field__options {
		min-height: 0;
		max-height: 16rem;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.compact-field__options label {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2);
		border-radius: var(--bc-radius-md);
		cursor: pointer;
	}
	.compact-field__options label:hover,
	.compact-field__options label:has(:checked) {
		background: var(--bc-surface);
	}
	.compact-field__options input {
		accent-color: var(--bc-accent);
	}
	.compact-field__actions {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--bc-border);
		padding-top: var(--bc-space-2);
	}
	.compact-field__actions :global(button) {
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font: inherit;
	}
</style>
