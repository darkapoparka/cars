<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';

  const i18n = getI18n();
  const address = $derived(i18n.dealer('address'));
  const directionsUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
</script>

<div class="dn-showroom-map" role="group" aria-label={i18n.t('m_cd07db46b2c6', { p0: brand.name })}>
  <div class="dn-showroom-map__place">
    <span class="dn-showroom-map__pin" aria-hidden="true"><Icon name="map-pin" size={30} /></span>
    <strong>{brand.name}</strong>
    <span class="dn-showroom-map__address">{address}</span>
  </div>
  <a class="dn-showroom-map__link" href={directionsUrl} target="_blank" rel="noopener noreferrer">
    {i18n.t('m_7f22a6352074')} <Icon name="arrow-right" size={18} />
  </a>
</div>

<style>
  .dn-showroom-map {
    position: relative;
    display: grid;
    min-height: 260px;
    place-items: center;
    overflow: hidden;
    padding: 32px;
    border: 1px solid #e6e8eb;
    border-radius: 24px;
    background: radial-gradient(circle at 50% 38%, #fff 0, #f4f6f8 55%, #e9edf1 100%);
    text-align: center;
  }
  .dn-showroom-map::before {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(#dfe4e9 1px, transparent 1px), linear-gradient(90deg, #dfe4e9 1px, transparent 1px);
    background-size: 36px 36px;
    opacity: .38;
    content: '';
  }
  .dn-showroom-map__place {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 8px;
    max-width: 360px;
    padding-bottom: 58px;
    color: var(--dn-ink);
  }
  .dn-showroom-map__pin {
    display: grid;
    width: 54px;
    height: 54px;
    place-items: center;
    border-radius: 50%;
    background: #fff;
    color: var(--dn-red);
    box-shadow: 0 8px 24px rgba(18, 25, 38, .12);
  }
  .dn-showroom-map__place strong { font-size: var(--dn-text-lead); }
  .dn-showroom-map__address { color: #545c67; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-showroom-map__link {
    position: absolute;
    right: 16px;
    bottom: 16px;
    left: 16px;
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 18px;
    border: 1px solid rgba(20, 23, 29, .1);
    border-radius: var(--dn-radius-button);
    background: #fff;
    color: var(--dn-ink);
    font-size: var(--dn-control-size);
    font-weight: var(--dn-control-weight);
  }
  .dn-showroom-map__link:hover { color: var(--dn-red); }
  .dn-showroom-map__link:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  @media (max-width: 767px) {
    .dn-showroom-map { min-height: 240px; padding: 24px; }
  }
</style>
