<script lang="ts">
  import { onDestroy } from 'svelte';
  import { imageSrcset } from '$data/responsive-images';
  import Icon from '$components/ui/Icon.svelte';
  import { getI18n } from '$lib/locale/context';
  import { lockPageScroll, trapDialogTab } from '$lib/ui/overlay';

  const i18n = getI18n();
  let { image, title, id }: { image: string; title: string; id: string } = $props();
  let trigger = $state<HTMLAnchorElement>();
  let dialog = $state<HTMLDialogElement>();
  let open = $state(false);
  let releaseScroll: (() => void) | undefined;

  function showPhoto(event: MouseEvent) {
    if (!dialog) return;
    event.preventDefault();
    if (dialog.open) return;
    open = true;
    dialog.showModal();
    releaseScroll = lockPageScroll();
  }

  function restorePage() {
    open = false;
    releaseScroll?.();
    releaseScroll = undefined;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  $effect(() => {
    id;
    image;
    if (dialog?.open) dialog.close();
  });
  onDestroy(() => releaseScroll?.());
</script>

<a
  class="dn-vehicle-photo"
  bind:this={trigger}
  href={image}
  onclick={showPhoto}
  aria-haspopup="dialog"
  aria-controls={id}
>
  <img
    src={image}
    srcset={imageSrcset(image)}
    sizes="(max-width: 991px) 100vw, (max-width: 1199px) 65vw, 900px"
    alt={title}
    width="1245"
    height="988"
    fetchpriority="high"
    decoding="async"
  />
  <span class="dn-vehicle-photo__hint">
    <Icon name="search" size={16} />
    {i18n.t('vehicle.photo.open')}
  </span>
</a>

<dialog
  class="dn-vehicle-photo-dialog"
  {id}
  bind:this={dialog}
  aria-labelledby={`${id}-title`}
  onkeydown={trapDialogTab}
  onclose={restorePage}
  onclick={event => { if (event.target === event.currentTarget) dialog?.close(); }}
>
  <div class="dn-vehicle-photo-dialog__content">
    <header>
      <h2 id={`${id}-title`}>{title}</h2>
      <button type="button" onclick={() => dialog?.close()} aria-label={i18n.t('vehicle.photo.close')}>
        <Icon name="x" size={22} />
      </button>
    </header>
    {#if open}
      <img
        class="dn-vehicle-photo-dialog__image"
        src={image}
        srcset={imageSrcset(image)}
        sizes="(min-width: 1488px) 1440px, 100vw"
        alt={title}
        width="1245"
        height="988"
        decoding="async"
      />
    {/if}
  </div>
</dialog>

<style>
  .dn-vehicle-photo {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .dn-vehicle-photo > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .dn-vehicle-photo:focus-visible {
    outline: 3px solid var(--dn-focus);
    outline-offset: -3px;
  }

  .dn-vehicle-photo__hint {
    position: absolute;
    right: var(--dn-space-4);
    bottom: var(--dn-space-4);
    display: inline-flex;
    min-height: var(--dn-control-height-compact);
    align-items: center;
    gap: var(--dn-space-2);
    padding-inline: var(--dn-space-4);
    border-radius: var(--dn-pill);
    background: var(--dn-white);
    color: var(--dn-ink);
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-control);
  }

  .dn-vehicle-photo:hover .dn-vehicle-photo__hint { background: var(--dn-surface-hover); }

  .dn-vehicle-photo-dialog {
    width: min(1440px, calc(100% - 48px));
    height: calc(100dvh - 48px);
    max-width: none;
    max-height: none;
    margin: auto;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: var(--dn-radius);
    background: var(--dn-ink-deep);
    color: var(--dn-white);
  }

  .dn-vehicle-photo-dialog::backdrop { background: rgba(8, 10, 14, .8); }

  .dn-vehicle-photo-dialog__content {
    display: grid;
    height: 100%;
    grid-template-rows: auto minmax(0, 1fr);
    gap: var(--dn-space-4);
    padding: var(--dn-space-4);
    box-sizing: border-box;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--dn-space-4);
  }

  h2 {
    min-width: 0;
    margin: 0;
    color: inherit;
    font-size: var(--dn-text-card);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-card);
    overflow-wrap: anywhere;
  }

  button {
    display: grid;
    flex: 0 0 var(--dn-control-height-default);
    width: var(--dn-control-height-default);
    height: var(--dn-control-height-default);
    place-items: center;
    padding: 0;
    border: 1px solid var(--dn-line-on-ink);
    border-radius: var(--dn-pill);
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  button:hover { background: var(--dn-ink-hover); }
  button:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }

  .dn-vehicle-photo-dialog__image {
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 991px) {
    .dn-vehicle-photo__hint { display: none; }
    .dn-vehicle-photo-dialog { width: calc(100% - 24px); height: calc(100dvh - 24px); }
    .dn-vehicle-photo-dialog__content { padding: var(--dn-space-3); }
  }
</style>
