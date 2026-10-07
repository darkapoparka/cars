<script lang="ts">
  import { Popover } from 'bits-ui';
  import { getI18n } from '$lib/locale/context';
  import Icon from '$components/ui/Icon.svelte';

  let { id, title }: { id: string; title: string } = $props();
  const i18n = getI18n();
</script>

<header class="dn-picker-header">
  <h2 {id}>{title}</h2>
  <Popover.Close type="button" class="dn-picker-close" aria-label={i18n.t('m_84305a580997')}><Icon name="x" size={18} /></Popover.Close>
</header>

<style>
  .dn-picker-header { display: flex; flex: none; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-height: calc(var(--dn-control-hit-height) + var(--dn-space-2)); padding: var(--dn-space-1) var(--dn-space-4); }
  h2 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); }
  :global(.dn-picker-close) { display: grid; flex: 0 0 var(--dn-control-hit-height); place-items: center; width: var(--dn-control-hit-height); height: var(--dn-control-hit-height); margin-inline-end: calc(var(--dn-space-2) * -1); padding: 0; border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-muted); cursor: pointer; }
  :global(.dn-picker-close:hover) { background: var(--dn-surface-hover); color: var(--dn-ink); }
  :global(.dn-picker-close:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
</style>
