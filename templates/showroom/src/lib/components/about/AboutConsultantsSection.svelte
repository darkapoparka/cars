<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRight, Mail, Phone } from '@lucide/svelte';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	let { consultants }: { consultants: AuxeroAgentCard[] } = $props();
	const hrefAttrs = (href: string) => ({ href });
</script>

<section class="about-contacts">
	<div class="container">
		<AboutSectionHeader heading="С кого да се свържете" />
		<div class="about-contacts__grid">
			{#each consultants as consultant (consultant.slug)}
				<article class="about-contact">
					<h3>
						<a href={resolve('/agents/[slug]', { slug: consultant.slug })}
							>{consultant.name}<ArrowUpRight size={18} aria-hidden="true" /></a
						>
					</h3>
					<p>{consultant.title}</p>
					<div class="about-contact__actions">
						<a {...hrefAttrs(consultant.phoneHref)} aria-label={`Позвъни — ${consultant.name}`}
							><Phone size={16} aria-hidden="true" />Позвъни</a
						>
						<a {...hrefAttrs(consultant.emailHref)} aria-label={`Имейл — ${consultant.name}`}
							><Mail size={16} aria-hidden="true" />Имейл</a
						>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.about-contacts {
		padding-block: 32px;
	}
	.about-contacts__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.about-contact {
		border-top: 1px solid var(--bc-border);
		padding-top: 12px;
		min-width: 0;
	}
	.about-contact h3 {
		margin: 0;
		font-size: 18px;
		line-height: 1.4;
		font-weight: 600;
	}
	.about-contact h3 a {
		display: flex;
		min-height: 44px;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		color: var(--bc-ink);
	}
	.about-contact h3 :global(svg) {
		flex-shrink: 0;
	}
	.about-contact p {
		margin: 4px 0 8px;
		font-size: 14px;
		line-height: 1.5;
		color: var(--bc-muted);
	}
	.about-contact__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.about-contact__actions a {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		min-height: 44px;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 600;
	}
	.about-contact a:hover {
		color: var(--bc-accent);
	}
	.about-contact a:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 4px;
		border-radius: 4px;
	}
	@media (max-width: 767px) {
		.about-contacts {
			padding-block: 24px;
		}
		.about-contacts__grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}
	}
</style>
