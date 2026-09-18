<script lang="ts">
	import { onMount as onClientMount } from 'svelte';
	let interactive = $state(false);
	onClientMount(() => {
		interactive = true;
	});
	import type { Snippet } from 'svelte';
	import { ArrowLeft, X } from '@lucide/svelte';
	let {
		titleId,
		step,
		busy = false,
		errorMessage = '',
		submitLabel,
		onSubmit,
		onBack,
		onClose,
		children
	}: {
		titleId: string;
		step: 1 | 2;
		busy?: boolean;
		errorMessage?: string;
		submitLabel: string;
		onSubmit: (event: SubmitEvent) => void;
		onBack: () => void;
		onClose: () => void;
		children: Snippet;
	} = $props();
</script>

<form
	method="post"
	class="lead-sheet"
	novalidate
	onsubmit={onSubmit}
	aria-busy={busy}
	aria-describedby={errorMessage ? `${titleId}-error` : undefined}
>
	<header class="lead-sheet__header">
		<button class="lead-sheet__close" type="button" onclick={onClose} aria-label="Затвори"
			><X size={21} strokeWidth={2.25} /></button
		>
		<div>
			<span>Етап {step} от 2</span>
			<h2 id={titleId} aria-live="polite">{step === 1 ? 'Автомобил' : 'Контакт'}</h2>
		</div>
		<span class="lead-sheet__spacer" aria-hidden="true"></span>
	</header>
	<div class="lead-sheet__progress" aria-hidden="true">
		<span class="is-active"></span><span class:is-active={step === 2}></span>
	</div>
	<div class="lead-sheet__body">
		<fieldset disabled={busy || !interactive}>{@render children()}</fieldset>
		{#if errorMessage}<p class="lead-error" id={`${titleId}-error`} role="alert">
				{errorMessage}
			</p>{/if}
	</div>
	<footer class="lead-sheet__footer">
		{#if step === 2}<button
				class="lead-back"
				type="button"
				disabled={busy || !interactive}
				onclick={onBack}><ArrowLeft size={18} strokeWidth={2.4} /> Назад</button
			>{/if}
		<button class="lead-primary" type="submit" disabled={busy || !interactive}
			>{step === 1 ? 'Продължи' : busy ? 'Изпращаме…' : submitLabel}</button
		>
	</footer>
</form>

<style>
	fieldset {
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.lead-sheet {
		display: grid;
		height: 100%;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		background: var(--sa-surface);
	}

	.lead-sheet__header {
		display: grid;
		grid-template-columns: var(--sa-mobile-action-h) minmax(0, 1fr) var(--sa-mobile-action-h);
		align-items: center;
		gap: 8px;
		border-bottom: 0;
		background: var(--sa-surface);
		color: var(--sa-ink);
		padding: calc(env(safe-area-inset-top) + 8px) var(--sa-mobile-gutter) 7px;
	}

	.lead-sheet__header > div {
		display: grid;
		gap: 1px;
		text-align: center;
	}
	.lead-sheet__header span {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.lead-sheet__header h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-control);
		font-weight: var(--sa-weight-heading);
		line-height: 1.2;
	}
	.lead-sheet__close {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0;
		cursor: pointer;
	}
	.lead-sheet__spacer {
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
	}

	.lead-sheet__progress {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 4px;
		background: var(--sa-surface);
		padding: 0 var(--sa-mobile-gutter) 8px;
	}
	.lead-sheet__progress span {
		height: 3px;
		border-radius: 999px;
		background: var(--sa-fill-2);
	}
	.lead-sheet__progress span.is-active {
		background: var(--sa-red);
	}

	.lead-sheet__body {
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--sa-surface);
		padding: 10px var(--sa-mobile-gutter) 18px;
	}
	.lead-sheet :global(.lead-fields) {
		display: grid;
		gap: 10px;
	}
	.lead-sheet :global(.lead-field-grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.lead-sheet :global(.lead-field) {
		display: grid;
		min-width: 0;
		gap: 5px;
		border: 0;
		background: transparent;
		padding: 0;
	}
	.lead-sheet :global(.lead-field:focus-within) {
		box-shadow: none;
	}
	.lead-sheet :global(.lead-field > span) {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.lead-sheet :global(.lead-field > span small) {
		font: inherit;
		font-weight: var(--sa-weight-regular);
	}
	.lead-sheet :global(.lead-field input),
	.lead-sheet :global(.lead-field textarea) {
		width: 100%;
		min-width: 0;
		border: 0;
		border-radius: 10px;
		background: var(--sa-fill);
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-base) / 1.25 var(--sa-font);
		outline: 0;
		resize: none;
	}
	.lead-sheet :global(.lead-field input) {
		height: 46px;
		padding: 0 12px;
	}
	.lead-sheet :global(.lead-field textarea) {
		min-height: 72px;
		padding: 10px 12px;
	}
	.lead-sheet :global(.lead-field input:focus),
	.lead-sheet :global(.lead-field textarea:focus) {
		background: var(--sa-fill);
		box-shadow: inset 0 0 0 2px rgba(213, 0, 50, 0.46);
	}
	.lead-sheet :global(.lead-field input::placeholder),
	.lead-sheet :global(.lead-field textarea::placeholder) {
		color: #7f8995;
		opacity: 1;
	}
	.lead-sheet :global(.lead-field--textarea) {
		padding-bottom: 0;
	}
	.lead-sheet :global(.lead-summary) {
		display: flex;
		min-height: 58px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 0;
		border-radius: 10px;
		background: var(--sa-fill);
		padding: 8px 10px;
	}
	.lead-sheet :global(.lead-summary > div) {
		display: grid;
		min-width: 0;
		gap: 2px;
	}
	.lead-sheet :global(.lead-summary span) {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-micro);
	}
	.lead-sheet :global(.lead-summary strong) {
		overflow: hidden;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-heading);
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.lead-sheet :global(.lead-summary small) {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-micro);
	}
	.lead-sheet :global(.lead-summary button) {
		min-height: var(--sa-mobile-action-h);
		flex: 0 0 auto;
		border: 0;
		border-radius: 9px;
		background: var(--sa-surface);
		color: var(--sa-ink);
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		padding: 0 10px;
		cursor: pointer;
	}
	.lead-error {
		margin: 10px 0 0;
		border-radius: 10px;
		background: #fff1f2;
		color: #b42318;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
		padding: 9px 10px;
	}
	.lead-sheet :global(.honeypot) {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.lead-sheet__footer {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 8px;
		border-top: 1px solid var(--sa-line);
		background: var(--sa-surface);
		padding: 9px var(--sa-mobile-gutter) calc(9px + env(safe-area-inset-bottom));
	}
	.lead-sheet__footer > .lead-primary:only-child {
		grid-column: 1 / -1;
	}
	.lead-back,
	.lead-primary {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 11px;
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		cursor: pointer;
	}
	.lead-back {
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0 12px;
	}
	.lead-primary {
		background: var(--sa-red);
		color: #fff;
		padding: 0 16px;
	}
	.lead-primary:disabled {
		background: var(--sa-fill-2);
		color: var(--sa-ink-soft);
		cursor: not-allowed;
	}
	.lead-sheet :global(button:focus-visible),
	.lead-sheet :global(input:focus-visible),
	.lead-sheet :global(textarea:focus-visible) {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
</style>
