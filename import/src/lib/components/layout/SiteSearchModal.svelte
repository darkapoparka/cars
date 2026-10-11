<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	// Token-pure clean site search modal. Opened from the header search icon via
	// the bindable `open` prop. GET submit contract: navigates to /inventory?q=…
	// (trimmed empty query → just /inventory), matching the themed header form.
	let { open = $bindable(false), placeholder = '' }: { open?: boolean; placeholder?: string } =
		$props();

	let query = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);

	// DOM integration: focus the input when the dialog opens. This is the one
	// acceptable $effect here — it reacts to `open` and touches the live element.
	$effect(() => {
		if (open) {
			inputEl?.focus();
		}
	});

	async function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const trimmed = query.trim();
		const target = trimmed ? `/inventory?q=${encodeURIComponent(trimmed)}` : '/inventory';
		open = false;
		await goto(resolve(target as `/inventory${string}`));
	}

	function onKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#snippet searchIcon()}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet closeIcon()}
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M18 6L6 18M6 6L18 18"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#if open}
	<div
		class="daynight-search-modal fixed inset-0 z-[80] grid place-items-center p-6 font-bc-body"
		role="dialog"
		aria-modal="true"
		aria-label="Търсене в сайта"
	>
		<button
			type="button"
			aria-label="Затвори търсенето"
			class="daynight-search-modal__backdrop absolute inset-0 cursor-pointer bg-black/65"
			onclick={() => (open = false)}
		></button>

		<div
			class="daynight-search-modal__panel relative z-[1] w-full max-w-[720px] rounded-bc-section bg-white p-8 shadow-bc-modal sm:p-11"
		>
			<button
				type="button"
				aria-label="Затвори търсенето"
				class="daynight-search-modal__close absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full text-bc-ink transition-colors hover:text-bc-accent"
				onclick={() => (open = false)}
			>
				{@render closeIcon()}
			</button>

			<p
				class="daynight-search-modal__eyebrow mb-4 text-sm font-bold tracking-wide text-bc-muted uppercase"
			>
				Какво търсиш?
			</p>

			<form
				class="daynight-search-modal__form grid grid-cols-[1fr_auto] gap-3"
				onsubmit={submitSearch}
			>
				<input
					bind:this={inputEl}
					bind:value={query}
					type="text"
					name="q"
					{placeholder}
					autocomplete="off"
					aria-label="Търси в наличните автомобили"
					class="daynight-search-modal__input min-h-11 w-full rounded-bc-md border border-bc-border bg-white px-4 text-base text-bc-ink outline-none focus:border-bc-accent"
				/>
				<button
					type="submit"
					aria-label="Търси"
					class="daynight-search-modal__submit grid min-h-11 w-12 place-items-center rounded-bc-md bg-bc-accent text-bc-accent-contrast transition-colors hover:bg-bc-accent-contrast hover:text-white"
				>
					{@render searchIcon()}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	/* These structural rules keep the modal correct on legacy Auxero routes where
	   Tailwind utility classes are intentionally not loaded. */
	.daynight-search-modal {
		position: fixed;
		inset: 0;
		z-index: 80;
		display: grid;
		place-items: center;
		padding: 24px;
		font-family: var(--bc-font-body, ui-sans-serif, system-ui, sans-serif);
	}

	.daynight-search-modal__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgb(0 0 0 / 0.65);
		cursor: pointer;
	}

	.daynight-search-modal__panel {
		position: relative;
		z-index: 1;
		width: min(720px, 100%);
		border-radius: 28px;
		background: #ffffff;
		padding: 32px;
		box-shadow: 0 24px 80px rgb(0 0 0 / 0.2);
	}

	.daynight-search-modal__close {
		position: absolute;
		top: 16px;
		right: 16px;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--bc-ink, #1c1c1c);
		cursor: pointer;
	}

	.daynight-search-modal__close:hover,
	.daynight-search-modal__close:focus-visible {
		color: var(--bc-accent, #b9161c);
	}

	.daynight-search-modal__eyebrow {
		margin: 0 0 16px;
		color: var(--bc-muted, #696665);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 20px;
		text-transform: uppercase;
	}

	.daynight-search-modal__form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 12px;
	}

	.daynight-search-modal__input {
		box-sizing: border-box;
		min-height: 44px;
		width: 100%;
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 8px;
		background: #ffffff;
		padding: 0 16px;
		color: var(--bc-ink, #1c1c1c);
		font: inherit;
		font-size: var(--bc-text-search);
		line-height: var(--bc-leading-search);
		font-weight: var(--bc-weight-body);
	}

	.daynight-search-modal__input:focus {
		border-color: var(--bc-accent, #b9161c);
		outline: 3px solid rgb(185 22 28 / 0.22);
		outline-offset: 1px;
	}

	.daynight-search-modal__submit {
		display: grid;
		min-height: 44px;
		width: 48px;
		place-items: center;
		border: 0;
		border-radius: 8px;
		background: var(--bc-accent, #b9161c);
		color: #ffffff;
		cursor: pointer;
	}

	.daynight-search-modal__submit:hover,
	.daynight-search-modal__submit:focus-visible {
		background: var(--bc-accent-hover, #8f1016);
	}

	@media (max-width: 640px) {
		.daynight-search-modal__panel {
			padding: 32px 20px 22px;
		}

		.daynight-search-modal__form {
			grid-template-columns: 1fr;
		}

		.daynight-search-modal__submit {
			width: 100%;
		}
	}
</style>
