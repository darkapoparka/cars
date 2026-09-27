<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { resolveContactTopic } from '$data/company';
  import ContactHero from './ContactHero.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import TradeInEnquiry from './TradeInEnquiry.svelte';
  import VehicleEnquiry from './VehicleEnquiry.svelte';
  import './service-entry.css';

  let { topic, importUrl = null }: { topic: 'trade-in' | 'import'; importUrl?: string | null } = $props();
  const i18n = getI18n();
  const service = $derived(topic === 'import' ? 'import' : 'sell');
  const numbers = [1, 2, 3] as const;
</script>

<div class="dn-service-landing">
  <ContactHero topic={resolveContactTopic(topic)} />
  <section class="dn-service-card" id="contact-intent" aria-labelledby="service-form-title">
    <h2 id="service-form-title">{topic === 'import' ? i18n.text(resolveContactTopic(topic).title) : i18n.t('service.sell.heading')}</h2>
    {#if topic === 'trade-in'}<TradeInEnquiry inlineEntry />{:else}<VehicleEnquiry kind="import" {importUrl} inlineEntry />{/if}
  </section>
  <div class="dn-service-faq">
    <details>
      <summary>{i18n.t('service.process')}<Icon name="chevron-down" size={16} /></summary>
      <ol class="dn-service-process">{#each numbers as number (number)}
        <li><span aria-hidden="true">{number}</span>{i18n.t(`service.${service}.step${number}.copy`)}</li>
      {/each}</ol>
      <p>{i18n.t('service.demo')}</p>
    </details>
  </div>
</div>

<style>
  .dn-service-landing { background: var(--dn-mobile-canvas); padding-bottom: 40px; }
  .dn-service-card { position: relative; z-index: 1; width: min(560px, calc(100% - 32px)); margin: -120px auto 0; padding: 28px; background: var(--dn-white); border-radius: var(--dn-radius-lg); scroll-margin-top: 24px; }
  h2 { margin: 0 0 24px; text-align: center; color: var(--dn-ink); font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-service-faq { width: min(560px, calc(100% - 32px)); margin: 16px auto 0; }
  summary { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; cursor: pointer; list-style: none; color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  summary::-webkit-details-marker { display: none; }
  details[open] summary { color: var(--dn-ink); }
  ol { list-style: none; margin: 16px 0; padding: 0; display: grid; gap: 16px; }
  li { display: flex; align-items: baseline; gap: 12px; color: var(--dn-ink); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  li span { color: var(--dn-muted); }
  p { margin: 0; color: var(--dn-muted); font-size: var(--dn-text-caption); line-height: var(--dn-leading-body); }
  @media (max-width: 767px) {
    .dn-service-landing { min-height: calc(100svh - var(--dn-mobile-nav-height)); }
    .dn-service-card { width: calc(100% - 24px); margin-top: -52px; padding: 20px 16px; }
    h2 { margin-bottom: 20px; }
    .dn-service-faq { width: calc(100% - 56px); margin-top: 12px; }
  }
</style>
