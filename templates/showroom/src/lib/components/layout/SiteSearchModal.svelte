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
		class="fixed inset-0 z-[80] grid place-items-center p-6 font-bc-body"
		role="dialog"
		aria-modal="true"
		aria-label="Търсене в сайта"
	>
		<button
			type="button"
			aria-label="Затвори търсенето"
			class="absolute inset-0 cursor-pointer bg-black/65"
			onclick={() => (open = false)}
		></button>

		<div
			class="relative z-[1] w-full max-w-[720px] rounded-bc-section bg-white p-8 shadow-bc-modal sm:p-11"
		>
			<button
				type="button"
				aria-label="Затвори търсенето"
				class="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full text-bc-ink transition-colors hover:text-bc-accent"
				onclick={() => (open = false)}
			>
				{@render closeIcon()}
			</button>

			<p class="mb-4 text-sm font-bold tracking-wide text-bc-muted uppercase">Какво търсиш?</p>

			<form class="grid grid-cols-[1fr_auto] gap-3" onsubmit={submitSearch}>
				<input
					bind:this={inputEl}
					bind:value={query}
					type="text"
					name="q"
					{placeholder}
					autocomplete="off"
					aria-label="Търси в наличните автомобили"
					class="min-h-11 w-full rounded-bc-md border border-bc-border bg-white px-4 text-base text-bc-ink outline-none focus:border-bc-accent"
				/>
				<button
					type="submit"
					aria-label="Търси"
					class="grid min-h-11 w-12 place-items-center rounded-bc-md bg-bc-accent text-bc-accent-contrast transition-colors hover:bg-bc-accent-hover"
				>
					{@render searchIcon()}
				</button>
			</form>
		</div>
	</div>
{/if}
