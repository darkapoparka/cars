<script lang="ts">
  import MoreHorizontal from '@lucide/svelte/icons/ellipsis';
  import { getI18n } from '$lib/locale/context';
  import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';

  const i18n = getI18n();
  let open = $state(false);
  let root: HTMLDivElement | undefined;
  let trigger: HTMLButtonElement | undefined;

  function handlePointerDown(event: PointerEvent) {
    if (open && event.target instanceof Node && !root?.contains(event.target)) open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!open || event.key !== 'Escape') return;
    event.preventDefault();
    open = false;
    trigger?.focus();
  }
</script>

<svelte:window onpointerdown={handlePointerDown} onkeydown={handleKeydown} />
<div class="locale-settings-menu" bind:this={root}>
  <button
    bind:this={trigger}
    type="button"
    aria-label={i18n.locale === 'en' ? 'Menu' : 'Меню'}
    aria-expanded={open}
    aria-controls="import-locale-settings-menu"
    onclick={() => (open = !open)}
  >
    <MoreHorizontal size={20} strokeWidth={2} aria-hidden="true" />
  </button>
  {#if open}
    <div
      id="import-locale-settings-menu"
      class="locale-settings-menu__panel"
      role="group"
      aria-label={i18n.t('title')}
    >
      <LocaleTrigger beforeOpen={() => { open = false; return trigger; }} />
    </div>
  {/if}
</div>

<style>
  .locale-settings-menu { position: relative; display: inline-flex; flex: 0 0 auto; }
  .locale-settings-menu > button { display: inline-grid; width: 44px; height: 44px; place-items: center; border: 0; border-radius: 9999px; background: transparent; color: inherit; cursor: pointer; }
  .locale-settings-menu > button:hover, .locale-settings-menu > button:focus-visible { background: rgb(255 255 255 / 12%); }
  .locale-settings-menu > button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .locale-settings-menu__panel { position: absolute; top: calc(100% + 8px); right: 0; z-index: 1000; width: min(18rem, calc(100vw - 2rem)); padding: 4px; border: 1px solid #d9dee4; border-radius: 12px; background: #fff; color: #1c2630; box-shadow: 0 16px 40px rgb(0 0 0 / 18%); }
  .locale-settings-menu__panel :global(a[data-locale-selector]) { width: 100%; justify-content: flex-start; white-space: normal; }
</style>
