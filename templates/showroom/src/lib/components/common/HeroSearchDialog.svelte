<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Search, X } from '@lucide/svelte';

	let {
		title,
		description,
		placeholder,
		value = '',
		suggestions = [],
		onSearch,
		onComplete,
		children
	}: {
		title: string;
		description: string;
		placeholder: string;
		value?: string;
		suggestions?: string[];
		onSearch: (query: string) => void | Promise<void>;
		onComplete?: () => void;
		children: Snippet<[(trigger: HTMLElement) => void]>;
	} = $props();

	let open = $state(false);
	let draft = $state('');
	let submitting = $state(false);
	let error = $state('');
	let input: HTMLInputElement;
	let trigger: HTMLElement;
	const id = $props.id();
	const inputId = `${id}-query`;

	function openSearch(source: HTMLElement) {
		trigger = source;
		draft = value;
		error = '';
		open = true;
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		error = '';
		try {
			await onSearch(draft.trim());
			open = false;
			await tick();
			onComplete?.();
		} catch {
			error = 'Търсенето не успя. Опитай отново.';
		} finally {
			submitting = false;
		}
	}
</script>

<Dialog.Root bind:open>
	{@render children(openSearch)}
	<Dialog.Content
		class="eliqauto-hero-search-dialog"
		overlayClass="eliqauto-hero-search-overlay"
		showCloseButton={false}
		onOpenAutoFocus={(event) => {
			event.preventDefault();
			input?.focus();
		}}
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			trigger?.focus({ preventScroll: true });
		}}
	>
		<div class="dialog-heading">
			<div>
				<Dialog.Title class="eliqauto-hero-search-dialog__title">{title}</Dialog.Title>
				<Dialog.Description class="eliqauto-hero-search-dialog__description"
					>{description}</Dialog.Description
				>
			</div>
			<Dialog.Close class="eliqauto-hero-search-dialog__close" aria-label="Затвори търсенето">
				<X size={22} aria-hidden="true" />
			</Dialog.Close>
		</div>
		<form onsubmit={submit} aria-busy={submitting}>
			<div class="dialog-body">
				<label for={inputId}>Какво търсиш?</label>
				<div class="query-field">
					<Search size={20} aria-hidden="true" />
					<input
						bind:this={input}
						bind:value={draft}
						id={inputId}
						type="search"
						name="q"
						{placeholder}
						autocomplete="off"
					/>
				</div>
				{#if suggestions.length}
					<div class="suggestions" role="group" aria-label="Бързо търсене">
						{#each suggestions as suggestion (suggestion)}
							<button
								type="button"
								aria-pressed={draft === suggestion}
								onclick={() => {
									draft = draft === suggestion ? '' : suggestion;
									input?.focus();
								}}>{suggestion}</button
							>
						{/each}
					</div>
				{/if}
				{#if error}<p class="search-error" role="alert">{error}</p>{/if}
			</div>
			<div class="dialog-actions">
				<Dialog.Close class="eliqauto-hero-search-dialog__cancel">Отказ</Dialog.Close>
				<button type="submit" disabled={submitting}
					><Search size={18} aria-hidden="true" />{submitting ? 'Търсене…' : 'Търси'}</button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global(.eliqauto-hero-search-overlay) {
		position: fixed;
		inset: 0;
		/* The retained desktop header and its menus occupy layers 100–160. */
		z-index: 200;
		background: rgb(12 12 13 / 0.64);
		backdrop-filter: none;
	}
	:global(.eliqauto-hero-search-dialog) {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		translate: none;
		display: grid;
		margin: 0;
		z-index: 201;
		width: min(680px, calc(100vw - 32px));
		max-width: none;
		max-height: calc(100dvh - 32px);
		overflow-y: auto;
		gap: 0;
		padding: 0;
		border: 1px solid var(--bc-border);
		border-radius: 16px;
		background: #fff;
		color: var(--bc-ink);
		box-shadow: none;
		font-family: var(--bc-font-body);
		animation: none;
	}
	.dialog-heading {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 24px;
		padding: 28px 28px 0;
	}
	:global(.eliqauto-hero-search-dialog__title) {
		margin: 0;
		font-size: 26px;
		font-weight: 600;
		line-height: 1.3;
		color: var(--bc-ink);
	}
	:global(.eliqauto-hero-search-dialog__description) {
		margin: 8px 0 0;
		font-size: 16px;
		line-height: 1.5;
		color: var(--bc-copy);
	}
	:global(.eliqauto-hero-search-dialog__close) {
		display: grid;
		place-items: center;
		flex: 0 0 44px;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 8px;
		background: var(--bc-surface);
		color: var(--bc-ink);
		cursor: pointer;
	}
	.dialog-body {
		padding: 24px 28px 28px;
	}
	label {
		display: block;
		margin-bottom: 8px;
		font-size: 15px;
		font-weight: 600;
		color: var(--bc-ink);
	}
	.query-field {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		border: 1px solid var(--bc-border-strong);
		border-radius: 8px;
		padding: 0 14px;
		color: var(--bc-copy);
	}
	.query-field:focus-within {
		border-color: var(--bc-ink);
		outline: 1px solid var(--bc-ink);
	}
	.query-field :global(svg) {
		flex: 0 0 auto;
	}
	.query-field input {
		width: 100%;
		min-width: 0;
		height: 50px;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		outline: none;
		font: inherit;
		font-size: 16px;
		color: var(--bc-ink);
	}
	.query-field input::placeholder {
		color: var(--bc-copy);
	}
	.suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}
	.suggestions button {
		min-height: 44px;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: var(--bc-surface);
		padding: 8px 16px;
		color: var(--bc-ink);
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.suggestions button[aria-pressed='true'] {
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: #fff;
	}
	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		padding: 20px 28px;
		border-top: 1px solid var(--bc-border);
		background: var(--bc-surface);
	}
	.dialog-actions button,
	:global(.eliqauto-hero-search-dialog__cancel) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-width: 112px;
		min-height: 48px;
		padding: 0 20px;
		border: 1px solid var(--bc-border-strong);
		border-radius: 8px;
		background: #fff;
		color: var(--bc-ink);
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
	}
	.dialog-actions button[type='submit'] {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #fff;
	}
	.dialog-actions button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	button:focus-visible,
	:global(.eliqauto-hero-search-dialog__close:focus-visible),
	:global(.eliqauto-hero-search-dialog__cancel:focus-visible) {
		outline: 2px solid var(--bc-ink);
		outline-offset: 3px;
	}
	.search-error {
		margin: 16px 0 0;
		color: var(--bc-danger);
		font-size: 16px;
	}
	@media (hover: hover) and (pointer: fine) {
		.suggestions button:hover,
		.dialog-actions button:hover:not(:disabled),
		:global(.eliqauto-hero-search-dialog__close:hover),
		:global(.eliqauto-hero-search-dialog__cancel:hover) {
			border-color: var(--bc-ink);
			background: var(--bc-ink);
			color: #fff;
		}
	}
	@media (max-width: 600px) {
		.dialog-heading {
			padding: 20px 20px 0;
		}
		.dialog-body {
			padding: 20px;
		}
		.dialog-actions {
			padding: 16px 20px;
		}
	}
</style>
