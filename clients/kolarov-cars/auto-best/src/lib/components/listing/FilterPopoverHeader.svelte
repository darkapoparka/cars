<script module lang="ts">
  import type { Attachment } from 'svelte/attachments';

  export type PickerNavigation = { label: string; back?: () => void; attachBack?: Attachment<HTMLButtonElement> };
</script>

<script lang="ts">
  import { Popover } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import { getI18n } from '$lib/locale/context';
  import Icon from '$components/ui/Icon.svelte';
  import FilterCloseButton from './FilterCloseButton.svelte';

  let { id, title, search, navigation }: { id: string; title: string; search?: Snippet; navigation?: PickerNavigation } = $props();
  const i18n = getI18n();
</script>

<header class="dn-picker-header" class:dn-picker-header--search={Boolean(search)} class:dn-picker-header--navigation={Boolean(navigation)} class:dn-picker-header--back={Boolean(navigation?.back)}>
  <h2 {id}>
    {#if navigation?.back}
      <button type="button" class="back" onclick={navigation.back} {@attach navigation.attachBack} aria-label={`${i18n.t('m_76900f1bfd16')}: ${navigation.label}`} title={navigation.label}><Icon name="arrow-left" size={16} /><span>{navigation.label}</span></button>
    {:else}<span>{navigation?.label ?? title}</span>{/if}
  </h2>
  {#if search}<div class="dn-picker-search">{@render search()}</div>{/if}
  <Popover.Close aria-label={i18n.t('m_84305a580997')}>
    {#snippet child({ props })}<FilterCloseButton {...props} />{/snippet}
  </Popover.Close>
</header>

<style>
  .dn-picker-header { display: flex; flex: none; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-height: calc(var(--dn-control-hit-height) + var(--dn-space-2)); padding: var(--dn-space-1) var(--dn-space-4); }
  h2 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); }
  .back { display: flex; align-items: center; gap: var(--dn-space-2); max-width: 100%; min-width: 0; min-height: var(--dn-control-hit-height); padding: 0 var(--dn-space-1); border: 0; border-radius: var(--dn-pill); background: transparent; color: inherit; font: inherit; cursor: pointer; }
  .back > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .back :global(svg) { flex: none; }
  .back:hover { background: var(--dn-surface-hover); }
  .back:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  @media (min-width: 992px) {
    .dn-picker-header { padding-block: var(--dn-space-2); }
    h2 { color: var(--dn-muted); font: var(--dn-field-label-font); }
    .dn-picker-header--search { display: flex; align-items: center; }
    /* The opener supplies the visible title; keep its duplicate available to screen readers. */
    .dn-picker-header--search h2, .dn-picker-header--search .back > span { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .dn-picker-header--search.dn-picker-header--back h2 { position: static; flex: 0 0 var(--dn-control-hit-height); width: var(--dn-control-hit-height); height: var(--dn-control-hit-height); margin: 0; overflow: visible; clip-path: none; }
    .dn-picker-header--search .back { justify-content: center; width: var(--dn-control-hit-height); padding: 0; }
    .dn-picker-search { flex: 1 1 0; min-width: 0; }
    .dn-picker-header--navigation { display: flex; gap: var(--dn-space-2); }
    .dn-picker-header--navigation h2 { color: var(--dn-ink); font: var(--dn-control-font); }
  }
</style>
