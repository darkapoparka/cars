<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { onDestroy, tick } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import type { Attachment } from "svelte/attachments";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  let images = $state<string[]>([]);
  let index = $state(0);
  let dialog: HTMLDialogElement | undefined;
  const ownDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      node.close();
      dialog = undefined;
    };
  };
  let active = true;
  let request = 0;
  const phone = new MediaQuery("(max-width: 767.98px)");
  let swipe: { pointer: number; x: number; y: number } | undefined;
  afterNavigate(() => {
    request++;
    dialog?.close();
    images = [];
  });
  function move(amount: number) {
    if (images.length < 2) return;
    index = (index + amount + images.length) % images.length;
  }
  function startSwipe(event: PointerEvent) {
    swipe = undefined;
    if (
      images.length < 2 ||
      !phone.current ||
      !event.isPrimary ||
      event.pointerType !== "touch" ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    swipe = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
    if (event.currentTarget instanceof HTMLElement)
      event.currentTarget.setPointerCapture(event.pointerId);
  }
  function endSwipe(event: PointerEvent) {
    const start = swipe;
    swipe = undefined;
    if (!start || start.pointer !== event.pointerId) return;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (
      Math.abs(horizontal) >= 48 &&
      Math.abs(horizontal) > Math.abs(vertical) * 1.5
    )
      move(horizontal < 0 ? 1 : -1);
  }
  async function show(event: CustomEvent<unknown>) {
    swipe = undefined;
    const detail = event.detail;
    if (
      !detail ||
      typeof detail !== "object" ||
      !("images" in detail) ||
      !Array.isArray(detail.images) ||
      !detail.images.every((image: unknown) => typeof image === "string") ||
      !detail.images.length
    )
      return;
    const current = ++request;
    images = detail.images;
    index =
      "index" in detail &&
      typeof detail.index === "number" &&
      Number.isInteger(detail.index)
        ? Math.max(0, Math.min(images.length - 1, detail.index))
        : 0;
    await tick();
    if (active && request === current && images.length && dialog?.isConnected)
      dialog.showModal();
  }
  onDestroy(() => {
    active = false;
    dialog?.close();
  });
</script>

<svelte:window onkarento-gallery={show} />

{#if images.length}
  <dialog
    class="karento-photo-viewer"
    {@attach ownDialog}
    aria-label={locale.t("ui.photo-viewer.photo-viewer")}
    onclose={(event) => {
      if (event.currentTarget === dialog && !event.currentTarget.open)
        images = [];
    }}
    onkeydown={(event) => {
      if (
        images.length > 1 &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}
  >
    <div class="karento-photo-controls"
      ><button
        type="button"
        aria-label={locale.t("ui.photo-viewer.close-photo-viewer")}
        onclick={() => dialog?.close()}
        >{#if phone.current}<MobileIcon
            name="close"
            size={20}
          />{:else}×{/if}</button
      ></div
    >
    <div
      class="karento-photo-image"
      role="group"
      aria-label={phone.current
        ? locale.t(images.length > 1 ? "gallery.navigation" : "gallery.photo")
        : images.length > 1
          ? "Photo navigation"
          : "Photo"}
      onpointerdown={startSwipe}
      onpointerup={endSwipe}
      onpointercancel={() => (swipe = undefined)}
      >{#if images.length > 1}<button
          type="button"
          aria-label={locale.t("ui.photo-viewer.previous-photo")}
          onclick={() => move(-1)}>‹</button
        >{/if}<img
        src={images[index]}
        alt={phone.current
          ? locale.t("gallery.photoPosition", {
              number: locale.number(index + 1),
              count: locale.number(images.length),
            })
          : `Photo ${index + 1} of ${images.length}`}
        draggable="false"
      />{#if images.length > 1}<button
          type="button"
          aria-label={locale.t("ui.photo-viewer.next-photo")}
          onclick={() => move(1)}>›</button
        >{/if}</div
    >
    <p class="desktop-type-meta" aria-live="polite"
      >{index + 1} / {images.length}{#if phone.current && images.length > 1}<span
          class="mobile-photo-hint"
          >{locale.t("ui.photo-viewer.swipe-to-browse")}</span
        >{/if}</p
    >
  </dialog>
{/if}

<style>
  @media (max-width: 767.98px) {
    :global(body:has(.karento-photo-viewer[open])) {
      overflow: hidden;
    }
    dialog.karento-photo-viewer {
      position: fixed;
      inset: 0;
      width: 100%;
      max-width: none;
      height: 100dvh;
      max-height: 100dvh;
      margin: 0;
      padding: calc(12px + env(safe-area-inset-top, 0px)) 12px
        calc(20px + env(safe-area-inset-bottom, 0px));
      border-radius: 0;
    }
    dialog.karento-photo-viewer[open] {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
    }
    .karento-photo-controls button {
      display: grid;
      place-items: center;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      padding: 0;
      background: transparent;
    }
    .karento-photo-image {
      position: relative;
      min-height: 0;
      touch-action: pan-y pinch-zoom;
    }
    .karento-photo-image img {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .karento-photo-image button {
      position: absolute;
      z-index: 1;
      left: 8px;
    }
    .karento-photo-image button:last-child {
      left: auto;
      right: 8px;
    }
    .mobile-photo-hint {
      display: block;
      margin-top: 4px;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
