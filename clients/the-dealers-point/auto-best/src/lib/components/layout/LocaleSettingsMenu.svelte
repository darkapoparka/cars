<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import Icon from '$components/ui/Icon.svelte';
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
    aria-label={i18n.t('m_99af6606ff9d')}
    aria-expanded={open}
    aria-controls="auto-best-locale-settings-menu"
    onclick={() => (open = !open)}
  >
    <Icon name="menu" size={20} />
  </button>
  {#if open}
    <div
      id="auto-best-locale-settings-menu"
      class="locale-settings-menu__panel"
      role="group"
      aria-label={i18n.t('locale.title')}
    >
      <LocaleTrigger fullLabel beforeOpen={() => { open = false; return trigger; }} />
    </div>
  {/if}
</div>

<style>
  .locale-settings-menu { position: relative; display: inline-flex; flex: 0 0 auto; }
  .locale-settings-menu > button { display: inline-grid; width: 44px; height: 44px; place-items: center; border: 1px solid transparent; border-radius: var(--dn-radius-control); background: transparent; color: inherit; cursor: pointer; }
  .locale-settings-menu > button:hover { background: var(--dn-surface); }
  .locale-settings-menu > button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .locale-settings-menu__panel { position: absolute; top: calc(100% + 8px); right: 0; z-index: 1000; width: min(18rem, calc(100vw - 2rem)); padding: 4px; border: 1px solid #d7dee6; border-radius: 12px; background: #fff; color: #172432; box-shadow: 0 16px 40px rgb(23 36 50 / 18%); }
  .locale-settings-menu__panel :global(.cars-locale-trigger) { width: 100%; justify-content: flex-start; border-color: transparent; white-space: normal; }
</style>
