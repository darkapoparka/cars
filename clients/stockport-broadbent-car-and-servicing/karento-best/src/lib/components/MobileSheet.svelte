<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { afterNavigate } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { on } from "svelte/events";
  import MobileCloseButton from "#lib/components/mobile/MobileCloseButton.svelte";

  let {
    open = $bindable(false),
    title,
    label = title,
    description,
    headerLeading,
    children,
    footer,
    class: className = "",
  }: {
    open?: boolean;
    title: string;
    label?: string;
    description?: string;
    headerLeading?: Snippet;
    children: Snippet;
    footer?: Snippet;
    class?: string;
  } = $props();

  const phone = new MediaQuery("(max-width: 767.98px)");
  let dialog: HTMLDialogElement | undefined;
  let opener: HTMLElement | undefined;
  const id = $props.id();

  const ownDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    $effect(() => {
      if (open && phone.current) {
        if (!node.open) {
          opener =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : undefined;
          node.showModal();
          node.querySelector<HTMLButtonElement>("header button")?.focus();
        }
        const viewport = window.visualViewport;
        const updateViewport = () => {
          // Keyboard resizing is independent of the layout viewport on phones.
          // Let the browser retain its normal zoom behavior when pinching.
          const unzoomed = viewport?.scale === 1;
          const height = unzoomed ? viewport.height : window.innerHeight;
          const top = unzoomed ? viewport.offsetTop : 0;
          node.style.setProperty("--mobile-sheet-height", `${height}px`);
          node.style.setProperty("--mobile-sheet-top", `${top}px`);
          node.style.setProperty(
            "--mobile-sheet-bottom",
            `${Math.max(0, window.innerHeight - height - top)}px`,
          );
        };
        const resize = () => {
          updateViewport();
          const field = document.activeElement;
          const content = node.querySelector<HTMLElement>(
            ".mobile-sheet-content",
          );
          if (
            content &&
            field instanceof HTMLElement &&
            content.contains(field) &&
            field.matches("input,textarea,select")
          ) {
            const bounds = field.getBoundingClientRect();
            const visible = content.getBoundingClientRect();
            if (bounds.bottom > visible.bottom - 12)
              content.scrollTop += bounds.bottom - visible.bottom + 12;
            else if (bounds.top < visible.top + 12)
              content.scrollTop -= visible.top - bounds.top + 12;
          }
        };
        updateViewport();
        const removeResize = on(viewport ?? window, "resize", resize);
        const removeScroll = viewport
          ? on(viewport, "scroll", updateViewport)
          : undefined;
        return () => {
          removeResize();
          removeScroll?.();
          for (const property of ["height", "top", "bottom"])
            node.style.removeProperty(`--mobile-sheet-${property}`);
        };
      } else if (node.open) {
        node.close();
      }
    });
    $effect(() => {
      if (open && title)
        node
          .querySelector<HTMLElement>(".mobile-sheet-content")
          ?.scrollTo(0, 0);
    });
    return () => {
      node.close();
      dialog = undefined;
    };
  };

  function close() {
    open = false;
  }

  function returnFocus() {
    // A queued close event can arrive after the same sheet has reopened.
    if (dialog?.open) return;
    open = false;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }

  function dismissBackdrop(event: MouseEvent) {
    if (event.target !== event.currentTarget || !dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  }

  afterNavigate(close);
</script>

<dialog
  class={["mobile-filter-sheet mobile-sheet", className]}
  aria-label={label}
  aria-describedby={description ? `${id}-description` : undefined}
  {@attach ownDialog}
  onclose={returnFocus}
  oncancel={close}
  onclick={dismissBackdrop}
>
  <header class={headerLeading ? "mobile-sheet-header-leading" : undefined}>
    {#if headerLeading}{@render headerLeading()}{/if}
    <div class="mobile-sheet-heading"
      ><h2>{title}</h2>{#if description}<p id={`${id}-description`}
          >{description}</p
        >{/if}</div
    >
    <MobileCloseButton
      label={locale.t("action.closeNamed", {
        name: label.toLocaleLowerCase(),
      })}
      onclick={close}
    />
  </header>
  <div class="mobile-sheet-content">{@render children()}</div>
  {#if footer}<footer>{@render footer()}</footer>{/if}
</dialog>

<style>
  @media (max-width: 767.98px) {
    dialog.mobile-sheet {
      transition-property: none;
      bottom: var(--mobile-sheet-bottom, 0px);
      max-height: min(86dvh, var(--mobile-sheet-height, 100dvh));
    }
    dialog.mobile-sheet.mobile-catalog-editor {
      top: var(--mobile-sheet-top, 0px);
      bottom: auto;
      height: var(--mobile-sheet-height, 100dvh);
      max-height: var(--mobile-sheet-height, 100dvh);
    }
    .mobile-catalog-editor > header {
      padding-top: calc(12px + env(safe-area-inset-top, 0px));
    }
    .mobile-sheet > header {
      gap: var(--karento-space-2);
    }
    .mobile-sheet-heading {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .mobile-sheet-content {
      scroll-padding-block: 12px;
    }
  }
</style>
