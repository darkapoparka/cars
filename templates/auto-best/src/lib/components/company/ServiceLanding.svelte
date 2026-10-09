<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { resolveContactTopic } from '$data/company';
  import { leadSite } from '$config/lead-site';
  import ContactHero from './ContactHero.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import TradeInInfoDrawer from './TradeInInfoDrawer.svelte';
  import ImportHowItWorks from './ImportHowItWorks.svelte';
  import TradeInEnquiry from './TradeInEnquiry.svelte';
  import VehicleEnquiry from './VehicleEnquiry.svelte';
  import './service-entry.css';
  import EntryCard from '$components/ui/entry/EntryCard.svelte';

  let { topic, importUrl = null }: { topic: 'trade-in' | 'import'; importUrl?: string | null } = $props();
  const i18n = getI18n();
  const service = $derived(topic === 'import' ? 'import' : 'sell');
  const numbers = [1, 2, 3] as const;
</script>

<div class="dn-service-landing" class:dn-service-landing--import={topic === 'import'} style:--dn-service-backdrop={`url('${leadSite.artwork.serviceBackground}')`}>
  <ContactHero topic={resolveContactTopic(topic)} />
  <section class="dn-service-card" id="contact-intent" aria-labelledby="service-form-title">
    <EntryCard titleId="service-form-title" hideTitleOnMobile title={topic === 'import' ? i18n.text(resolveContactTopic(topic).title) : i18n.t('service.sell.heading')}>
    {#if topic === 'trade-in'}<TradeInEnquiry inlineEntry />{:else}<VehicleEnquiry kind="import" {importUrl} inlineEntry />{/if}
    </EntryCard>
  </section>
  <div class="dn-service-guide">
    {#if topic === 'trade-in'}<TradeInInfoDrawer inlineEntry />{:else}<ImportHowItWorks inlineEntry />{/if}
  </div>
  <div class="dn-service-faq">
    <details>
      <summary><span class="dn-service-faq__label"><Icon name="file-invoice" size={20} />{i18n.t('service.process')}</span><Icon name="chevron-down" size={18} /></summary>
      <ol class="dn-service-process">{#each numbers as number (number)}
        <li><span aria-hidden="true">{number}</span>{i18n.t(`service.${service}.step${number}.copy`)}</li>
      {/each}</ol>
      <p>{i18n.t('service.demo')}</p>
    </details>
  </div>
</div>

<style>
  .dn-service-landing { background: var(--dn-mobile-canvas); padding-bottom: 40px; }
  .dn-service-card { position: relative; z-index: 1; width: min(560px, calc(100% - 32px)); margin: -120px auto 0; scroll-margin-top: 24px; }
  .dn-service-faq { width: min(560px, calc(100% - 32px)); margin: 16px auto 0; }
  .dn-service-guide { display: none; }
  details { border: 1px solid var(--dn-line); border-radius: var(--dn-radius-card); background: var(--dn-white); }
  summary { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: var(--dn-space-3) var(--dn-space-4); cursor: pointer; list-style: none; color: var(--dn-ink); font: var(--dn-control-font); }
  .dn-service-faq__label { display: flex; align-items: center; gap: var(--dn-space-3); }
  summary:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; border-radius: var(--dn-radius-card); }
  details[open] summary > :global(svg) { transform: rotate(180deg); }
  summary::-webkit-details-marker { display: none; }
  details[open] summary { color: var(--dn-ink); }
  ol { list-style: none; margin: 0; padding: var(--dn-space-4); border-top: 1px solid var(--dn-line); display: grid; gap: 16px; }
  li { display: flex; align-items: baseline; gap: 12px; color: var(--dn-ink); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  li span { display: grid; place-items: center; flex: 0 0 24px; height: 24px; border-radius: var(--dn-pill); background: var(--dn-surface-panel); color: var(--dn-ink); font-weight: var(--dn-weight-medium); }
  p { margin: 0; padding: 0 var(--dn-space-4) var(--dn-space-4); color: var(--dn-muted); font-size: var(--dn-text-caption); line-height: var(--dn-leading-body); }
  @media (max-width: 767px) {
    .dn-service-landing { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); }
    .dn-service-landing--import { --dn-workflow-canvas: var(--dn-theme-hero-surface-mid); }
    .dn-service-landing { position: relative; isolation: isolate; min-height: 100svh; padding-bottom: calc(var(--dn-space-8) + var(--dn-space-2) + var(--dn-mobile-nav-height) + env(safe-area-inset-bottom)); }
    .dn-service-landing::before { content: ''; position: absolute; z-index: -1; inset: auto 0 0; height: min(400px, 100%); background-image: linear-gradient(var(--dn-mobile-canvas), color-mix(in srgb, var(--dn-mobile-canvas) 92%, transparent) 40%), var(--dn-service-backdrop); background-size: 100% 100%, auto 100%; background-position: center, left bottom; background-repeat: no-repeat; pointer-events: none; }
    .dn-service-card { width: calc(100% - 24px); margin-top: -52px;  }
    .dn-service-faq { display: none; }
    .dn-service-guide { display: block; width: calc(100% - 24px); margin: var(--dn-space-3) auto 0; }
  }
</style>
