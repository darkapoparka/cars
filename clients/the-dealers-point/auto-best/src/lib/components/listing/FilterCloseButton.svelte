<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { getI18n } from '$lib/locale/context';
  import Icon from '$components/ui/Icon.svelte';

  const i18n = getI18n();
  let { class: className, 'aria-label': label = i18n.t('m_84305a580997'), ...attributes }: HTMLButtonAttributes = $props();
</script>

<button {...attributes} type="button" class={['dn-picker-close', className]} aria-label={label}><Icon name="x" size={18} /></button>

<style>
  .dn-picker-close { display: grid; flex: 0 0 var(--dn-control-hit-height); place-items: center; width: var(--dn-control-hit-height); height: var(--dn-control-hit-height); margin-inline-end: calc(var(--dn-space-2) * -1); padding: 0; border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-muted); cursor: pointer; }
  .dn-picker-close:hover { background: var(--dn-surface-hover); color: var(--dn-ink); }
  .dn-picker-close:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  @media (min-width: 992px) {
    .dn-picker-close { box-sizing: border-box; margin-inline-end: 0; border: 1px solid var(--dn-line); background: var(--dn-white); color: var(--dn-ink); }
    .dn-picker-close :global(svg) { width: var(--dn-space-5); height: var(--dn-space-5); }
  }
</style>
