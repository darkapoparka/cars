<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import Action from '$lib/components/common/Action.svelte';
	import MobilePageHero from '$lib/components/common/MobilePageHero.svelte';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { MediaQuery } from 'svelte/reactivity';
	const desktop = new MediaQuery('(min-width: 768px)', true);
	let {
		policy
	}: {
		policy: {
			title: string;
			intro: string;
			sections: { id: string; title: string; body: string[] }[];
		};
	} = $props();
</script>

<main id="main-content">
	<div class="site-desktop-only"><PageIntro title={policy.title} /></div>
	<MobilePageHero title={policy.title} />
	<div class="site-container policy-page">
		<p class="policy-intro">{policy.intro}</p>
		{#each policy.sections as section, index (section.id)}
			<details
				id={section.id}
				open={desktop.current || index === 0 || page.url.hash === '#' + section.id}
			>
				<summary
					onclick={(event) => {
						if (desktop.current) event.preventDefault();
					}}
					><h2>{section.title.replace(/^\d+\.\s*/, '')}</h2>
					<ChevronDown size={20} aria-hidden="true" /></summary
				>
				{#each section.body as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</details>
		{/each}
		<Action href="/contact" variant="secondary">{nt('ui137')}</Action>
	</div>
</main>

<style>
	.policy-page {
		max-width: var(--bc-container-narrow);
		padding-block: var(--bc-section-sm);
	}
	.policy-intro {
		font-size: var(--bc-text-body-lg);
	}
	details {
		margin-block: var(--bc-space-8);
		scroll-margin-top: var(--bc-space-8);
	}
	h2 {
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
		margin: 0 0 var(--bc-space-3);
	}
	p {
		color: var(--bc-copy);
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
	}
	summary {
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary :global(svg) {
		display: none;
	}
	@media (min-width: 768px) {
		.policy-page {
			margin-block: var(--bc-space-8);
			padding: var(--bc-space-8);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-desktop-card-radius);
			background: var(--bc-surface-raised);
			box-shadow: var(--bc-editorial-shadow);
		}
		h2 {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-card-heading);
		}
		p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
	}
	@media (max-width: 767.98px) {
		details {
			margin-block: var(--bc-space-3);
			overflow: hidden;
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-panel);
			background: var(--bc-white);
		}
		summary {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--bc-space-3);
			min-height: var(--bc-control-height-primary);
			padding: var(--bc-space-4);
		}
		summary h2 {
			margin: 0;
			font-size: var(--bc-text-control);
		}
		summary :global(svg) {
			display: block;
			flex: none;
			transition: transform var(--bc-motion-fast);
		}
		details[open] summary :global(svg) {
			transform: rotate(180deg);
		}
		details p {
			margin: 0;
			padding: 0 var(--bc-space-4) var(--bc-space-4);
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body-lg);
		}
		.policy-intro {
			margin: 0 0 var(--bc-space-4);
			font-size: var(--bc-text-body);
		}
	}
</style>
