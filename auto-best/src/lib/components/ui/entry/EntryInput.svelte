<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();
  let { value = $bindable(''), element = $bindable(), class: className = '', ...attributes }: Omit<HTMLInputAttributes, 'value'> & { value?: string; element?: HTMLInputElement } = $props();
</script>
<input {...attributes} class={['dn-entry-field dn-entry-input', className]} bind:this={element} bind:value {@attach i18n.validation} />
<style>
  .dn-entry-input { display: block; width: 100%; min-width: 0; height: var(--dn-entry-height); margin: 0; padding: 0 var(--dn-space-4); }
  .dn-entry-input::placeholder { color: var(--dn-muted); opacity: 1; }
</style>
