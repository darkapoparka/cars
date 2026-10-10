import type { Attachment } from "svelte/attachments";

/** Make an overflowing native rail keyboard-reachable; grids keep normal focus. */
export const focusableScroll: Attachment<HTMLElement> = (node) => {
  const update = () => {
    if (node.scrollWidth > node.clientWidth + 1) node.tabIndex = 0;
    else node.removeAttribute("tabindex");
  };
  const observer = new ResizeObserver(update);
  observer.observe(node);
  const labels = new MutationObserver(update);
  labels.observe(node, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  const revealFocused = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement) || event.target === node) return;
    const railBounds = node.getBoundingClientRect();
    const targetBounds = event.target.getBoundingClientRect();
    const styles = getComputedStyle(node);
    const railLeft = railBounds.left + node.clientLeft;
    const left = railLeft + (parseFloat(styles.scrollPaddingLeft) || 0);
    const right =
      railLeft +
      node.clientWidth -
      (parseFloat(styles.scrollPaddingRight) || 0);
    if (targetBounds.left < left) node.scrollLeft += targetBounds.left - left;
    else if (targetBounds.right > right)
      node.scrollLeft += targetBounds.right - right;
  };
  node.addEventListener("focusin", revealFocused);
  update();
  return () => {
    observer.disconnect();
    labels.disconnect();
    node.removeEventListener("focusin", revealFocused);
    node.removeAttribute("tabindex");
  };
};
