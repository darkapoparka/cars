<script lang="ts">
  import type { Snippet } from 'svelte';
  let { value, label, description = '', accessibleLabel, checked, multiple = false, tile = false, portrait = false, media, name, onchange }: {
    value: string; label: string; description?: string; checked: boolean;
    accessibleLabel?: string; multiple?: boolean; tile?: boolean; portrait?: boolean; media?: Snippet; name?: string; onchange: (value: string) => void;
  } = $props();
  const descriptionId = $props.id();
</script>

<label class="dn-desktop-choice" class:dn-desktop-choice--tile={tile} class:dn-desktop-choice--portrait={portrait}>
  <input type={multiple ? 'checkbox' : 'radio'} {name} {value} {checked} aria-label={accessibleLabel} aria-describedby={accessibleLabel && description ? descriptionId : undefined} onchange={() => onchange(value)}
    onclick={() => { if (!multiple && checked) onchange(value); }}
    onkeydown={event => { if (event.key === 'Enter' || !multiple && event.key === ' ') { event.preventDefault(); onchange(value); } }} />
  <span class="dn-desktop-choice-mark" data-multiple={multiple} aria-hidden="true">{#if multiple}✓{/if}</span>
  {#if media}<span class="dn-desktop-choice-media" aria-hidden="true">{@render media()}</span>{/if}
  <span class="dn-desktop-choice-label">{label}</span>
  {#if description}<small id={descriptionId}>{description}</small>{/if}
</label>

<style>
  .dn-desktop-choice { position: relative; display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-radius-control); color: var(--dn-ink); font: var(--dn-field-font); cursor: pointer; }
  input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
  .dn-desktop-choice:hover { background: var(--dn-surface-subtle); }
  .dn-desktop-choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .dn-desktop-choice-mark { display: grid; flex: 0 0 var(--dn-space-5); place-items: center; width: var(--dn-space-5); height: var(--dn-space-5); border: 1px solid var(--dn-line-strong); border-radius: var(--dn-pill); background: var(--dn-white); color: transparent; font-size: var(--dn-text-caption); line-height: var(--dn-leading-control); }
  input:checked + .dn-desktop-choice-mark { border-color: var(--dn-ink); }
  input:checked + [data-multiple='true'] { background: var(--dn-ink); color: var(--dn-white); }
  input:checked + [data-multiple='false']::after { width: var(--dn-space-2); height: var(--dn-space-2); border-radius: var(--dn-pill); background: var(--dn-ink); content: ''; }
  .dn-desktop-choice-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .dn-desktop-choice-media { display: grid; flex: 0 0 var(--dn-control-height-entry-mobile); place-items: center; width: var(--dn-control-height-entry-mobile); height: var(--dn-control-height-compact); pointer-events: none; }
  small { flex: 0 1 auto; min-width: 0; color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-ui); overflow-wrap: anywhere; }
  @media (min-width: 992px) {
    .dn-desktop-choice--tile { min-width: 0; background: var(--dn-surface-subtle); }
    .dn-desktop-choice--tile:hover { background: var(--dn-surface-hover); }
    .dn-desktop-choice--tile:has(input:checked) { background: var(--dn-surface-hover); box-shadow: inset 0 0 0 1px var(--dn-line-emphasis); }
    .dn-desktop-choice--tile .dn-desktop-choice-mark[data-multiple='true'] { border-radius: var(--dn-space-1); }
    .dn-desktop-choice--portrait { flex-direction: column; justify-content: center; gap: var(--dn-space-1); min-height: calc(var(--dn-control-height-default) * 2 + var(--dn-space-6)); padding: var(--dn-space-2); background: transparent; text-align: center; }
    .dn-desktop-choice--portrait .dn-desktop-choice-media { display: grid; flex: 0 0 var(--dn-control-height-compact); place-items: center; width: 100%; height: var(--dn-control-height-compact); pointer-events: none; }
    .dn-desktop-choice--portrait .dn-desktop-choice-label { flex: 0 0 auto; width: 100%; font: var(--dn-control-font); }
    .dn-desktop-choice--portrait small { flex: 0 0 auto; width: 100%; }
    .dn-desktop-choice--portrait .dn-desktop-choice-mark { position: absolute; top: var(--dn-space-2); right: var(--dn-space-2); opacity: 0; }
    .dn-desktop-choice--portrait:hover .dn-desktop-choice-mark,
    .dn-desktop-choice--portrait:has(input:checked) .dn-desktop-choice-mark,
    .dn-desktop-choice--portrait:has(input:focus-visible) .dn-desktop-choice-mark { opacity: 1; }
  }
  @media (forced-colors: active) {
    input { position: static; flex: 0 0 var(--dn-space-5); width: var(--dn-space-5); height: var(--dn-space-5); opacity: 1; accent-color: auto; }
    .dn-desktop-choice-mark { display: none; }
  }
</style>
