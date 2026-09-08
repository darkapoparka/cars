<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';

	let { card }: { card: AuxeroAgentCard } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class={`sale-agent-box eliqauto-no-image-zoom ${card.active ? 'active' : ''}`}>
	<div class="card-top mb-20">
		<a class="flex w-full" href={resolve('/agents/[slug]', { slug: card.slug })}>
			<img class="w-full" src={card.image} alt={card.name} />
		</a>
		<ul class="sale-agent-social flex justify-center gap-12">
			{#each card.socials as social (social.label)}
				<li>
					<a
						{...externalHref(social.href)}
						target="_blank"
						aria-label={social.label}
						rel="noreferrer"
					>
						<img src={`/assets/icons/${social.icon}`} alt={social.label} />
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="card-bottom flex items-center justify-between gap-16">
		<div class="content">
			<a
				class="h5 font-weight-600 sale-agent-title"
				href={resolve('/agents/[slug]', { slug: card.slug })}>{card.name}</a
			>
			<p class="text-secondary text-sm">{card.title}</p>
			{#if card.management}
				<p class="text-secondary mt-4 text-sm" data-eliqauto-agent-status={card.management.status}>
					{card.management.statusText}
				</p>
				<p class="text-secondary mt-4 text-sm" data-eliqauto-agent-note={card.slug}>
					{card.management.note}
				</p>
			{/if}
		</div>

		<ul class="contact">
			<li>
				<a {...externalHref(card.phoneHref)} aria-label={`Call ${card.name}`}>
					<img src="/assets/icons/PhoneCall.svg" alt="phone" />
				</a>
			</li>
			<li>
				<a {...externalHref(card.emailHref)} aria-label={`Email ${card.name}`}>
					<img src="/assets/icons/input-telegram.svg" alt="email" />
				</a>
			</li>
		</ul>
	</div>

	{#if card.management}
		<div class="mt-16 flex flex-wrap gap-8">
			<a
				href={resolve(card.management.assignedLeadsHref)}
				class="btn btn-small btn-primary-3 font-weight-600">{card.management.assignedLeadsLabel}</a
			>
			<a
				href={resolve(card.management.messagesHref)}
				class="btn btn-small btn-line-style-2 font-weight-600">Messages</a
			>
		</div>
	{/if}
</div>
