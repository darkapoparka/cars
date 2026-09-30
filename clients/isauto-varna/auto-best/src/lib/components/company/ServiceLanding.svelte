<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { resolveContactTopic } from '$data/company';
  import ContactHero from './ContactHero.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import ServiceCallBanner from './ServiceCallBanner.svelte';
  import TradeInEnquiry from './TradeInEnquiry.svelte';
  import VehicleEnquiry from './VehicleEnquiry.svelte';
  import './service-entry.css';
  import EntryCard from '$components/ui/entry/EntryCard.svelte';

  let { topic, importUrl = null }: { topic: 'trade-in' | 'import'; importUrl?: string | null } = $props();
  const i18n = getI18n();
  const service = $derived(topic === 'import' ? 'import' : 'sell');
  const numbers = [1, 2, 3] as const;
</script>

<div class="dn-service-landing">
  <ContactHero topic={resolveContactTopic(topic)} />
  <section class="dn-service-card" id="contact-intent" aria-labelledby="service-form-title">
    <EntryCard titleId="service-form-title" title={topic === 'import' ? i18n.text(resolveContactTopic(topic).title) : i18n.t('service.sell.heading')}>
    {#if topic === 'trade-in'}<TradeInEnquiry inlineEntry />{:else}<VehicleEnquiry kind="import" {importUrl} inlineEntry />{/if}
    </EntryCard>
  </section>
  <ServiceCallBanner {topic} />
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
  details { border: 1px solid var(--dn-line); border-radius: var(--dn-radius); background: var(--dn-white); }
  summary { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: var(--dn-space-3) var(--dn-space-4); cursor: pointer; list-style: none; color: var(--dn-ink); font: var(--dn-control-font); }
  .dn-service-faq__label { display: flex; align-items: center; gap: var(--dn-space-3); }
  summary:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; border-radius: var(--dn-radius); }
  details[open] summary > :global(svg) { transform: rotate(180deg); }
  summary::-webkit-details-marker { display: none; }
  details[open] summary { color: var(--dn-ink); }
  ol { list-style: none; margin: 0; padding: var(--dn-space-4); border-top: 1px solid var(--dn-line); display: grid; gap: 16px; }
  li { display: flex; align-items: baseline; gap: 12px; color: var(--dn-ink); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  li span { display: grid; place-items: center; flex: 0 0 24px; height: 24px; border-radius: var(--dn-pill); background: var(--dn-surface-panel); color: var(--dn-ink); font-weight: var(--dn-weight-medium); }
  p { margin: 0; padding: 0 var(--dn-space-4) var(--dn-space-4); color: var(--dn-muted); font-size: var(--dn-text-caption); line-height: var(--dn-leading-body); }
  @media (max-width: 767px) {
    .dn-service-landing { min-height: calc(100svh - var(--dn-mobile-nav-height)); }
    .dn-service-card { width: calc(100% - 24px); margin-top: -52px;  }
    .dn-service-faq { display: none; }
  }
</style>
