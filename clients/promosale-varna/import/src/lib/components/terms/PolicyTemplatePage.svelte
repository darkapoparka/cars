<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import type { loadTemplatePolicy } from '$lib/server/template-policy-page';
	let { data }: { data: ReturnType<typeof loadTemplatePolicy> } = $props();
</script>

<AuxeroPublicShell
	copy={data.shellCopy}
	footer={data.shellFooter}
	header={data.shellHeader}
	modals={data.shellModals}
	pageDocument={data.pageDocument}
	runtimeHtml={data.shellRuntimeHtml}
	title={data.policy.title}
>
	<div class="dn-policy">
		<a class="dn-policy__back" href={resolve('/')}
			><ArrowLeft size={18} aria-hidden="true" /> Начало</a
		>
		<h1>{data.policy.title}</h1>
		<p class="dn-policy__intro">{data.policy.intro}</p>
		{#each data.policy.sections as section (section.id)}
			<section id={section.id}>
				<h2>{section.title.replace(/^\d+\.\s*/, '')}</h2>
				{#each section.body as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>
		{/each}
		<a class="dn-policy__contact" href={resolve('/contact')}
			>Контакт <ArrowRight size={20} aria-hidden="true" /></a
		>
	</div>
</AuxeroPublicShell>

<style>
	.dn-policy {
		max-width: 800px;
		margin-inline: auto;
		padding: 40px 24px 64px;
		color: var(--bc-ink);
	}
	.dn-policy__back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 10px 14px;
		border-radius: var(--bc-radius-control);
		background: var(--bc-card-bg);
		color: var(--bc-ink);
	}
	.dn-policy h1 {
		font-size: clamp(30px, 4vw, 42px);
		line-height: 1.15;
		margin: 24px 0 16px;
		color: var(--bc-ink);
	}
	.dn-policy p {
		font-size: 17px;
		line-height: 28px;
		color: var(--bc-copy);
		margin: 12px 0 0;
	}
	.dn-policy__intro {
		margin-bottom: 32px;
	}
	.dn-policy section {
		margin-top: 32px;
		scroll-margin-top: 80px;
	}
	.dn-policy h2 {
		font-size: 24px;
		line-height: 30px;
		margin: 0 0 12px;
		color: var(--bc-ink);
	}
	.dn-policy__contact {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 20px;
		margin-top: 32px;
		border-radius: var(--bc-radius-card);
		background: var(--bc-card-bg);
		color: var(--bc-ink);
		font-size: 20px;
		font-weight: 600;
	}
	.dn-policy a:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.dn-policy {
			padding: 20px 16px 32px;
		}
	}
</style>
