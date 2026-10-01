<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import Icon from './Icon.svelte';

  let { aboveTitle = false, compact = false }: { aboveTitle?: boolean; compact?: boolean } = $props();
  const i18n = getI18n();
  const directionsUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i18n.dealer('address'))}`);
</script>

<p class="dn-hero-location" class:dn-hero-location--above-title={aboveTitle} class:dn-hero-location--compact={compact}>
  <Icon name="map-pin" size={compact ? 14 : 16} />
  <a
    href={directionsUrl}
    title={compact ? i18n.dealer('address') : undefined}
    aria-label={compact ? i18n.dealer('address') : undefined}
    target="_blank"
    rel="noopener noreferrer"
  >{#if compact}{i18n.dealer('city')}{:else}{i18n.dealer('city')}, {i18n.dealer('addressLine')}{/if}</a>
</p>

<style>
  .dn-hero-location {
    display: none;
  }
  @media (min-width: 992px) {
    :global(.dn-route-hero .dn-route-hero__copy) .dn-hero-location {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      width: fit-content;
      max-width: 100%;
      min-height: 32px;
      margin: var(--dn-space-3) auto 0;
      padding: var(--dn-space-1) var(--dn-space-4);
      border-radius: var(--dn-pill);
      background: var(--dn-surface-raised);
      color: var(--dn-muted);
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-meta);
      text-wrap: balance;
    }
    :global(.dn-route-hero .dn-route-hero__copy) .dn-hero-location--above-title {
      margin: 0 auto var(--dn-space-3);
    }
    :global(.dn-route-hero .dn-route-hero__copy) .dn-hero-location--compact {
      min-height: 28px;
      gap: var(--dn-space-1);
      padding: 0 var(--dn-space-3);
    }
    .dn-hero-location--compact a {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
    }
    .dn-hero-location :global(svg) {
      flex-shrink: 0;
    }
    a {
      color: inherit;
    }
    a:hover {
      color: var(--dn-ink);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    a:focus-visible {
      outline: 2px solid var(--dn-focus);
      outline-offset: 4px;
      border-radius: 2px;
    }
  }
</style>
