import type { Attachment } from "svelte/attachments";

/** Own the modal lifecycle and return the page to its original scroll and focus. */
export const ownCatalogDialog: Attachment<HTMLDialogElement> = (node) => {
  const opener =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
  const root = document.documentElement;
  const overflow = root.style.overflow;
  const padding = root.style.paddingRight;
  const overflowAnchor = root.style.overflowAnchor;
  const scroll = {
    left: window.scrollX,
    top: window.scrollY,
    behavior: "instant" as const,
  };
  const gutter = window.innerWidth - root.clientWidth;
  const paddingAmount =
    Number.parseFloat(getComputedStyle(root).paddingRight) || 0;
  root.style.overflow = "hidden";
  root.style.overflowAnchor = "none";
  if (gutter > 0) root.style.paddingRight = `${paddingAmount + gutter}px`;
  node.showModal();
  node
    .querySelector<HTMLButtonElement>("header button")
    ?.focus({ preventScroll: true });
  window.scrollTo(scroll);
  return () => {
    node.close();
    root.style.overflow = overflow;
    root.style.paddingRight = padding;
    root.style.overflowAnchor = overflowAnchor;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    window.scrollTo(scroll);
  };
};

export function containCatalogTab(
  event: KeyboardEvent & { currentTarget: EventTarget & HTMLDialogElement },
) {
  if (event.key !== "Tab") return;
  const controls = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
    ),
  ].filter((element) => element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls.at(-1);
  const target =
    event.shiftKey && document.activeElement === first
      ? last
      : !event.shiftKey && document.activeElement === last
        ? first
        : undefined;
  if (target) {
    event.preventDefault();
    target.focus({ preventScroll: true });
  }
}
