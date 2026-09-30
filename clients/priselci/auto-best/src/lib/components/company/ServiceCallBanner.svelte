<script lang="ts">
  import { asset } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import { leadSite } from '$config/lead-site';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

  let { topic }: { topic: 'trade-in' | 'import' } = $props();
  const i18n = getI18n();
  const service = $derived(topic === 'import' ? 'import' : 'sell');
  const image = $derived(leadSite.artwork.serviceBanners[service]);
</script>

<aside class="dn-service-banner" aria-labelledby="service-banner-title">
  <picture aria-hidden="true"><source media="(max-width: 767px)" srcset={asset(image)} /><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="960" height="540" loading="lazy" decoding="async" /></picture>
  <div class="dn-service-banner__copy">
    <h2 id="service-banner-title">{i18n.t(`service.${service}.banner.title`)}</h2>
    <p>{i18n.t(`service.${service}.banner.copy`)}</p>
    <a class="dn-compact-control dn-quick-pill" href={brand.phoneHref} aria-label={i18n.t('m_aba9830dff26', { p0: brand.phone })}>{i18n.t('action.callShort')}<MobileActionIcon name="arrow" size={15} /></a>
  </div>
</aside>

<style>
  .dn-service-banner { display: none; }
  @media (max-width: 767px) {
    .dn-service-banner { display: block; position: relative; isolation: isolate; overflow: hidden; width: calc(100% - 24px); margin: var(--dn-space-4) auto 0; border-radius: var(--dn-radius); background: var(--dn-ink); color: var(--dn-white); }
    picture { position: absolute; inset: 0; z-index: -2; }
    img { width: 100%; height: 100%; object-fit: contain; object-position: right center; mask-image: linear-gradient(90deg, transparent, black 35%); }
    .dn-service-banner__copy { display: flex; flex-direction: column; align-items: flex-start; width: 100%; padding: var(--dn-space-4); }
    h2 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); }
    p { margin: var(--dn-space-2) 0 var(--dn-space-4); max-width: 100%; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
    a { --dn-compact-control-ink: var(--dn-ink); --dn-compact-control-surface: var(--dn-white); margin-top: 0; }
    a:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }
</style>
