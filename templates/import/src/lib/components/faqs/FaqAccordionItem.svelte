<script lang="ts">
	import type { AuxeroFaq } from '$lib/auxero/faqs';

	let {
		faq,
		forceWhite,
		open = false
	}: {
		faq: AuxeroFaq;
		forceWhite: boolean;
		open?: boolean;
	} = $props();

	// Stable, unique id from the question text (unique across the page) so summary/panel pair up.
	const hash = (value: string) => {
		let h = 5381;
		for (let i = 0; i < value.length; i += 1) h = (h * 33) ^ value.charCodeAt(i);
		return (h >>> 0).toString(36);
	};
	const panelId = $derived(`daynight-faq-${hash(faq.question)}-panel`);
</script>

<!--
  Native <details>/<summary> accordion. The /faqs and /calculator routes are SSR-only
  (csr = false / JS-light), so a JS-driven accordion never opens — its answers stayed
  permanently hidden. <details> toggles without any client JS, is keyboard-operable
  (Enter/Space), and exposes open/closed state to assistive tech. The `active` class +
  `open` attribute start in sync; native toggling drives the visible state thereafter.
-->
<details class={['flat-toggle', forceWhite && 'bg-white', open && 'active']} {open}>
	<summary class={['toggle-title', open && 'active']} aria-controls={panelId}>
		<p class="h5 title">{faq.question}</p>
		<span class="icon">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M20 15L12 7L4 15"
					stroke="#1C1C1C"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</summary>
	<div class="toggle-content" id={panelId}>
		<p class="h7 text-secondary line-height-28">{faq.answer}</p>
	</div>
</details>

<style>
	/* Make <summary> behave like the Auxero .toggle-title bar (no default disclosure marker). */
	details.flat-toggle > summary.toggle-title {
		display: block;
		cursor: pointer;
		list-style: none;
	}

	details.flat-toggle > summary.toggle-title::-webkit-details-marker {
		display: none;
	}

	details.flat-toggle > summary.toggle-title::marker {
		content: '';
	}

	/* app.css hides .toggle-content (it relied on JS to reveal it). Drive it from the native
	   [open] state instead so answers are reachable without any client JS. */
	details.flat-toggle > .toggle-content {
		display: none;
	}

	details.flat-toggle[open] > .toggle-content {
		display: block;
	}

	/* Chevron: app.css rotates it via the JS-only .active class; mirror that on [open]. */
	details.flat-toggle[open] > summary.toggle-title .icon {
		transform: rotate(0);
	}
</style>
