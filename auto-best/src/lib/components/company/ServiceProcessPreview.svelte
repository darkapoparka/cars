<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

  let { service }: { service: 'sell' | 'import' } = $props();
  const i18n = getI18n();
</script>

<span class="dn-service-process-preview">
  <span class="dn-service-process-preview__text">
    <span class="dn-service-process-preview__title">{i18n.t('m_15f4f5be4ade')}</span>
    <span class="dn-service-process-preview__copy">{i18n.t(`service.${service}.processPreview`)}</span>
  </span>
  <span class="dn-service-process-preview__arrow" aria-hidden="true"><MobileActionIcon name="arrow" size={20} /></span>
</span>

<style>
  .dn-service-process-preview { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; width: 100%; min-width: 0; gap: var(--dn-space-4); }
  .dn-service-process-preview__text { display: grid; min-width: 0; gap: var(--dn-space-1); }
  .dn-service-process-preview__arrow { display: grid; place-items: center; width: 20px; height: 20px; }
  .dn-service-process-preview__title { font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
  .dn-service-process-preview__copy { color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-regular); line-height: var(--dn-leading-body); }
</style>
