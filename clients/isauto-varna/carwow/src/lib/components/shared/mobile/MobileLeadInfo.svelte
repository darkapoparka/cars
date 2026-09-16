<script lang="ts">
	import { CarFront, Check, FileText, Link2, MessageCircle, Truck, X } from '@lucide/svelte';
	import { leadInfoContent } from '$lib/data/lead-content';
	let {
		titleId,
		kind,
		onClose
	}: {
		titleId: string;
		kind: keyof typeof leadInfoContent;
		onClose: () => void;
	} = $props();
	const content = $derived(leadInfoContent[kind]);
	const icons = {
		vehicle: CarFront,
		conversation: MessageCircle,
		offer: FileText,
		listing: Link2,
		quote: FileText,
		delivery: Truck
	};
</script>

<section class="lead-explainer" aria-labelledby={titleId}>
	<header class="lead-explainer__header">
		<h2 id={titleId}>{content.title}</h2>
		<button class="lead-explainer__close" type="button" onclick={onClose} aria-label="Затвори">
			<X size={21} strokeWidth={2} aria-hidden="true" />
		</button>
	</header>
	<div class="lead-explainer__body">
		<ol class="lead-explainer__steps" aria-label="Стъпки">
			{#each content.steps as step (step.title)}
				{@const Icon = icons[step.icon]}
				<li>
					<span class="lead-explainer__icon" aria-hidden="true"
						><Icon size={22} strokeWidth={1.8} /></span
					>
					<div>
						<h3>{step.title}</h3>
						<p>{step.copy}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
	<footer class="lead-explainer__footer">
		<button class="lead-explainer__done" type="button" onclick={onClose}>
			Разбрах <Check size={18} strokeWidth={2.2} aria-hidden="true" />
		</button>
	</footer>
</section>

<style>
	.lead-explainer {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		min-height: 0;
		overflow: hidden;
		background: var(--sa-surface);
	}
	.lead-explainer__header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) var(--sa-mobile-action-h);
		align-items: center;
		gap: var(--sa-space-3);
		padding: var(--sa-space-4) var(--sa-mobile-gutter-wide) var(--sa-space-3);
		background: var(--sa-surface);
		color: var(--sa-ink);
	}
	.lead-explainer__header h2 {
		margin: 0;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}
	.lead-explainer__close {
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		padding: 0;
		border: 0;
		border-radius: var(--sa-r-pill);
		background: var(--sa-fill);
		color: var(--sa-ink);
	}
	.lead-explainer__body {
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 var(--sa-mobile-gutter-wide);
		scrollbar-width: thin;
	}
	.lead-explainer__steps {
		display: grid;
		gap: var(--sa-space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.lead-explainer__steps li {
		display: grid;
		grid-template-columns: var(--sa-mobile-mini-action) minmax(0, 1fr);
		align-items: center;
		gap: var(--sa-space-3);
		border-radius: var(--sa-r-sm);
		background: var(--sa-fill);
		padding: var(--sa-space-3);
	}
	.lead-explainer__icon {
		display: grid;
		place-items: center;
		color: var(--sa-ink);
	}
	.lead-explainer__steps li > div {
		min-width: 0;
	}
	.lead-explainer__steps h3 {
		margin: 0 0 var(--sa-space-1);
		color: var(--sa-ink);
		font-size: var(--sa-text-body-sm);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-meta);
	}
	.lead-explainer__steps p {
		margin: 0;
		color: var(--sa-ink-soft);
		font-size: var(--sa-type-body);
		line-height: var(--sa-mobile-leading-body);
		overflow-wrap: anywhere;
	}
	.lead-explainer__footer {
		display: grid;
		padding: var(--sa-space-4) var(--sa-mobile-gutter-wide)
			max(var(--sa-space-4), env(safe-area-inset-bottom));
	}
	.lead-explainer__done {
		min-height: var(--sa-mobile-search-h);
		border-radius: var(--sa-r-pill);
		gap: var(--sa-space-2);
		border: 0;
		background: var(--sa-ink);
		color: var(--sa-surface);
		font: var(--sa-weight-semibold) var(--sa-text-sm) / var(--sa-mobile-leading-meta) var(--sa-font);
		padding: var(--sa-space-3) var(--sa-space-4);
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
	.lead-explainer__done:active {
		background: var(--sa-ink-soft);
	}
	.lead-explainer__close:active {
		background: var(--sa-fill-2);
	}
</style>
