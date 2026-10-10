<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Search from '@lucide/svelte/icons/search';
	import MobileChoiceRow from './MobileChoiceRow.svelte';
	import MobileIconAction from './MobileIconAction.svelte';
	import { mobileIntakeCopy } from '$lib/content/mobile-intake';
	import type { IntakeChoice } from '$lib/domain/vehicle-intake-options';

	let {
		title,
		options,
		value,
		locale,
		backLabel,
		searchLabel,
		allowCustom = false,
		maxLength = 80,
		onback,
		onselect
	}: {
		title: string;
		options: IntakeChoice[];
		value: string;
		locale: 'en' | 'bg';
		backLabel: string;
		searchLabel?: string;
		allowCustom?: boolean;
		maxLength?: number;
		onback: () => void;
		onselect: (value: string) => void;
	} = $props();
	const id = $props.id();
	let query = $state('');
	const normalized = (text: string) => text.trim().toLocaleLowerCase(locale);
	const availableOptions: IntakeChoice[] = $derived(
		value && !options.some((option) => option.value === value)
			? [{ value, label: value }, ...options]
			: options
	);
	const choices = $derived(
		availableOptions.filter((option) => normalized(option.label).includes(normalized(query)))
	);
	const customValue = $derived(query.trim());
	const showCustom = $derived(
		allowCustom &&
			customValue.length > 1 &&
			!availableOptions.some((option) => normalized(option.value) === normalized(customValue))
	);
	const focusHeading = (element: HTMLElement) => element.focus({ preventScroll: true });

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		event.stopImmediatePropagation();
		onback();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<section class="mobile-intake-choice" aria-labelledby={`intake-choice-${id}`} data-intake-selector>
	<header>
		<MobileIconAction label={backLabel} onclick={onback}>
			<ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
		</MobileIconAction>
		<h2 id={`intake-choice-${id}`} tabindex="-1" {@attach focusHeading}>{title}</h2>
		<span class="mobile-intake-choice__spacer" aria-hidden="true"></span>
	</header>
	<div class="mobile-intake-choice__body">
		{#if searchLabel}
			<div class="mobile-intake-choice__search">
				<Search size={19} strokeWidth={2.1} aria-hidden="true" />
				<input
					type="search"
					aria-label={searchLabel}
					placeholder={searchLabel}
					maxlength={maxLength}
					enterkeyhint="done"
					autocomplete="off"
					onkeydown={(event) => {
						// Filtering a selector must not submit its surrounding intake form.
						if (event.key === 'Enter') {
							event.preventDefault();
							event.currentTarget.blur();
						}
					}}
					bind:value={query}
				/>
			</div>
		{/if}
		<div class="mobile-intake-choice__scroll">
			<ul class="mobile-choice-list">
				{#if showCustom}
					<li>
						<MobileChoiceRow
							label={`${mobileIntakeCopy[locale].useValue} “${customValue}”`}
							onselect={() => onselect(customValue)}
						/>
					</li>
				{/if}
				{#each choices as option (option.value)}
					<li>
						<MobileChoiceRow
							label={option.label}
							selected={value === option.value}
							image={option.flag}
							imageKind="flag"
							onselect={() => onselect(option.value)}
						/>
					</li>
				{/each}
			</ul>
			{#if !choices.length && !showCustom}
				<p>{mobileIntakeCopy[locale].noMatches}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.mobile-intake-choice {
		--bc-control-height-standard: var(--bc-control-height-chip);
		display: flex;
		height: 100%;
		min-height: 0;
		flex-direction: column;
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	header {
		display: grid;
		grid-template-columns:
			var(--bc-control-height-standard) minmax(0, 1fr)
			var(--bc-control-height-standard);
		align-items: center;
		gap: 8px;
		padding: max(8px, env(safe-area-inset-top)) var(--bc-mobile-gutter) 7px;
	}
	h2 {
		min-width: 0;
		overflow: hidden;
		margin: 0;
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		outline: 0;
	}
	.mobile-intake-choice__spacer {
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
	}
	.mobile-intake-choice__body {
		display: flex;
		min-height: 0;
		flex: 1;
		flex-direction: column;
		gap: 12px;
		padding: 8px var(--bc-mobile-gutter) max(18px, env(safe-area-inset-bottom));
	}
	.mobile-intake-choice__search {
		display: flex;
		min-height: var(--bc-control-height-standard);
		flex: 0 0 auto;
		align-items: center;
		gap: var(--bc-space-2);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-bg-strong);
		padding: 0 var(--bc-space-4);
	}
	.mobile-intake-choice__search :global(svg) {
		flex: 0 0 auto;
	}
	/* Own the input inside the legacy account shell, including its single focus ring. */
	.mobile-intake-choice .mobile-intake-choice__search input[type='search'] {
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-standard) !important;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: inherit;
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
		padding: 0 !important;
		appearance: none;
		outline: 0;
	}
	.mobile-intake-choice__search input:focus,
	.mobile-intake-choice__search input:focus-visible {
		outline: 0;
		box-shadow: none;
	}
	.mobile-intake-choice__search:focus-within {
		box-shadow: inset 0 0 0 2px var(--bc-accent);
	}
	.mobile-intake-choice__scroll {
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
	}
	ul {
		overflow: hidden;
		margin: 0;
		border-radius: 10px;
		background: var(--bc-white);
		padding: 0;
		list-style: none;
	}

	p {
		margin: 12px 0;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
	}
	@media (min-width: 768px) {
		li + li {
			border-top: 1px solid var(--bc-border);
		}
	}
	@media (max-width: 767.98px) {
		.mobile-intake-choice__search :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
		}
	}
</style>
