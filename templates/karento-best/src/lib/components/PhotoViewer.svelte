<script lang="ts">
  import { onMount, tick, untrack } from "svelte";
  import { page } from "$app/state";
  let images = $state<string[]>([]);
  let index = $state(0);
  let dialog = $state<HTMLDialogElement>();
  const route = $derived(page.url.pathname);
  $effect(() => {
    void route;
    untrack(() => {
      dialog?.close();
      images = [];
    });
  });
  function move(amount: number) {
    index = (index + amount + images.length) % images.length;
  }
  onMount(() => {
    const show = async (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (
        !detail ||
        typeof detail !== "object" ||
        !("images" in detail) ||
        !Array.isArray(detail.images) ||
        !detail.images.every((image: unknown) => typeof image === "string") ||
        !detail.images.length
      )
        return;
      images = detail.images;
      index =
        "index" in detail && typeof detail.index === "number"
          ? Math.max(0, Math.min(images.length - 1, detail.index))
          : 0;
      await tick();
      dialog?.showModal();
    };
    window.addEventListener("karento-gallery", show);
    return () => {
      window.removeEventListener("karento-gallery", show);
      dialog?.close();
    };
  });
</script>

{#if images.length}
  <dialog
    class="karento-photo-viewer"
    bind:this={dialog}
    aria-label="Photo viewer"
    onclose={() => {
      images = [];
    }}
    onkeydown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}
  >
    <div class="karento-photo-controls"
      ><button
        type="button"
        aria-label="Close photo viewer"
        onclick={() => dialog?.close()}>×</button
      ></div
    >
    <div class="karento-photo-image"
      ><button
        type="button"
        aria-label="Previous photo"
        onclick={() => move(-1)}>‹</button
      ><img
        src={images[index]}
        alt={`Photo ${index + 1} of ${images.length}`}
      /><button type="button" aria-label="Next photo" onclick={() => move(1)}
        >›</button
      ></div
    >
    <p aria-live="polite">{index + 1} / {images.length}</p>
  </dialog>
{/if}
