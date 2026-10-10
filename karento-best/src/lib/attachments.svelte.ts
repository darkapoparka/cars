import { tick } from "svelte";
import { on } from "svelte/events";
import type { Attachment } from "svelte/attachments";

/** Own the legacy-styled quantity control without loading a widget library. */
export const quantity: Attachment<HTMLElement> = (node) => {
  const input = node.querySelector<HTMLInputElement>(".qty-val");
  const click = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element) || !input) return;
    const step = target.closest(".qty-up")
      ? 1
      : target.closest(".qty-down")
        ? -1
        : 0;
    if (!step) return;
    event.preventDefault();
    input.value = String(Math.max(1, (Number(input.value) || 1) + step));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  return on(node, "click", click);
};

/** Listen once; keep open-state tracking separate from the focus-trap lifetime. */
export function drawerFocus(getOpen: () => boolean): Attachment<HTMLElement> {
  return (node) => {
    let open = false;
    let previous: HTMLElement | null = null;
    let frame = 0;
    const controls = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href],button,summary,[tabindex="0"]',
        ),
      ).filter(
        (el) =>
          !el.hidden &&
          !el.matches(':disabled,[aria-disabled="true"]') &&
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility !== "hidden" &&
          (!el.closest("details:not([open])") || el.tagName === "SUMMARY"),
      );
    const update = (value: boolean) => {
      if (value && !open) {
        previous =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const focus = () => {
          const control =
            node.querySelector<HTMLElement>(
              '.close-canvas, .mobile-header-logo [role="button"]',
            ) || controls()[0];
          control?.focus();
          if (open && document.activeElement !== control)
            frame = requestAnimationFrame(focus);
        };
        frame = requestAnimationFrame(focus);
      }
      if (!value && open) {
        cancelAnimationFrame(frame);
        previous?.focus();
      }
      open = value;
    };
    const keydown = (event: KeyboardEvent) => {
      if (!open || event.key !== "Tab") return;
      const list = controls();
      const first = list[0];
      const last = list.at(-1);
      if (!first) return;
      if (!node.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const removeKeydown = on(document, "keydown", keydown);
    $effect(() => update(getOpen()));
    return () => {
      cancelAnimationFrame(frame);
      removeKeydown();
      if (open && previous?.isConnected) previous.focus();
    };
  };
}

/** Open, select and dismiss a dropdown with native keyboard/focus behavior. */
export function dropdownNavigation(
  setOpen: (open: boolean) => void,
): Attachment<HTMLElement> {
  return (node) => {
    let active = true;
    const click = (event: MouseEvent) => {
      if (event.target instanceof Node && !node.contains(event.target))
        setOpen(false);
    };
    const selected = async (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest(".dropdown-item")
      )
        return;
      await tick();
      if (active && event.defaultPrevented)
        node.querySelector<HTMLElement>("[data-bs-toggle]")?.focus();
    };
    const keydown = async (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        node.querySelector<HTMLElement>("[data-bs-toggle]")?.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setOpen(true);
      await tick();
      if (!active) return;
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(".dropdown-item"),
      );
      if (!items.length) return;
      const index = items.findIndex((item) => item === document.activeElement);
      const next =
        index === -1
          ? event.key === "ArrowDown"
            ? 0
            : items.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length;
      items[next].focus();
    };
    const removeClick = on(document, "click", click);
    const removeSelected = on(node, "click", selected);
    const removeKeydown = on(node, "keydown", keydown);
    return () => {
      active = false;
      removeClick();
      removeSelected();
      removeKeydown();
    };
  };
}
