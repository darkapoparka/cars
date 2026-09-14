<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/body-scroll-lock';
	import type { Attachment } from 'svelte/attachments';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let inputElement = $state<HTMLInputElement>();
	let query = $state('');

	function close() {
		open = false;
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		const nextQuery = query.trim();

		close();
		await goto(resolve(nextQuery ? `/inventory?q=${encodeURIComponent(nextQuery)}` : '/inventory'));
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			close();
		}
	}

	const captureInputElement: Attachment<HTMLInputElement> = (node) => {
		inputElement = node;

		return () => {
			if (inputElement === node) {
				inputElement = undefined;
			}
		};
	};

	const manageModalLifecycle: Attachment<HTMLDivElement> = () => {
		lockBodyScroll();
		const focusSearchInput = () => {
			inputElement?.focus({
				preventScroll: true
			});
		};
		focusSearchInput();
		const focusFrame = window.requestAnimationFrame(focusSearchInput);
		const focusTimer = window.setTimeout(focusSearchInput, 0);
		const delayedFocusTimer = window.setTimeout(focusSearchInput, 100);

		return () => {
			window.cancelAnimationFrame(focusFrame);
			window.clearTimeout(focusTimer);
			window.clearTimeout(delayedFocusTimer);
			unlockBodyScroll();
		};
	};
</script>

{#snippet searchIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M18 6L6 18M6 6L18 18"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<svelte:document onkeydown={handleDocumentKeydown} />

<div
	class={[
		'fixed inset-0 z-[999] items-center justify-center p-6 max-[575px]:p-4',
		open ? 'pointer-events-auto flex' : 'pointer-events-none hidden'
	]}
	id="searchForm"
	aria-hidden={open ? 'false' : 'true'}
	role="dialog"
	aria-modal="true"
	aria-labelledby="headerSearchTitle"
>
	{#if open}
		<button
			type="button"
			class="absolute inset-0 cursor-pointer border-0 bg-sa-ink/50 p-0 backdrop-blur-[2px]"
			aria-label="Затвори търсенето"
			onclick={close}
		></button>
		<div
			class="relative z-[1] w-[min(720px,calc(100vw-32px))] rounded-sa-md bg-sa-surface p-[34px] shadow-sa-lg max-[575px]:px-5 max-[575px]:pt-7 max-[575px]:pb-[22px]"
			{@attach manageModalLifecycle}
		>
			<button
				class="absolute top-3.5 right-3.5 inline-grid size-10 cursor-pointer place-items-center rounded-sa-pill border-0 bg-sa-bg text-sa-ink transition duration-150 ease-sa hover:bg-sa-fill focus-visible:bg-sa-fill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue [&_svg]:size-6 [&_svg_path]:stroke-current"
				id="searchModalClose"
				type="button"
				aria-label="Затвори търсенето"
				onclick={close}
			>
				{@render closeIcon()}
			</button>
			<h2
				class="m-0 mr-12 mb-6 text-sa-2xl leading-[1.16] font-bold text-sa-ink max-[575px]:text-sa-xl"
				id="headerSearchTitle"
			>
				Какво търсите?
			</h2>
			<form
				class="block"
				action={resolve('/inventory')}
				method="get"
				role="search"
				onsubmit={submit}
			>
				<div class="relative">
					<input
						type="text"
						class="w-full rounded-none border-0 border-b-2 border-sa-line bg-transparent py-2.5 pr-[60px] pl-0 font-sa text-sa-lg leading-7 font-semibold text-sa-ink shadow-none outline-0 placeholder:text-sa-faint placeholder:opacity-100 focus:border-sa-blue"
						placeholder="Търси по марка, модел, година, гориво..."
						autocomplete="off"
						id="searchModalInput"
						name="q"
						bind:value={query}
						{@attach captureInputElement}
					/>
					<button
						type="submit"
						class="absolute right-0 bottom-1 inline-grid size-11 cursor-pointer place-items-center rounded-sa-pill border-0 bg-sa-blue text-sa-surface transition duration-150 ease-sa hover:bg-sa-blue-strong focus-visible:bg-sa-blue-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue [&_svg]:size-6 [&_svg_path]:stroke-current"
						aria-label="Търси"
					>
						{@render searchIcon()}
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>
