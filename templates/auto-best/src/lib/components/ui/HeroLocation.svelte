<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import Icon from './Icon.svelte';

  const i18n = getI18n();
  const directionsUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i18n.dealer('address'))}`);
</script>

<p class="dn-hero-location">
  <Icon name="map-pin" size={16} />
  <a href={directionsUrl} target="_blank" rel="noopener noreferrer">{i18n.dealer('city')}, {i18n.dealer('addressLine')}</a>
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
