<script lang="ts">
  import { tick, onDestroy, type Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  let { title, children }: { title: string; children: Snippet } = $props();
  let dialog: HTMLDialogElement;
  let opener: HTMLElement | null = null;
  const id = $props.id();
  let previousOverflow = "";
  export async function open() {
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    await tick();
    if (!dialog.open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    }
  }
  export function close() {
    dialog?.close();
  }
  function restore() {
    document.body.style.overflow = previousOverflow;
    opener?.focus();
  }
  onDestroy(() => {
    if (dialog?.open) {
      dialog.close();
      restore();
    }
  });
</script>

<dialog
  bind:this={dialog}
  class="dn-sheet"
  aria-labelledby={id}
  onclose={restore}
>
  <header class="dn-sheet-header">
    <h2 {id}>{title}</h2>
    <button
      class="dn-icon-button"
      type="button"
      aria-label="Close dialog"
      onclick={close}><Icon name="close" /></button
    >
  </header>
  <div class="dn-sheet-content">{@render children()}</div>
</dialog>
