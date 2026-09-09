/** Each owner releases its lock once, including navigation/unmount cleanup. */
export function lockPageScroll() {
  const body = document.body;
  const previous = body.style.overflow;
  body.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    body.style.overflow = previous;
  };
}

export function preserveScrollOffset(property: `--${string}`) {
  const y = window.scrollY;
  const previous = document.body.style.getPropertyValue(property);
  document.body.style.setProperty(property, `-${y}px`);
  let released = false;
  return (restoreScroll = true) => {
    if (released) return;
    released = true;
    if (previous) document.body.style.setProperty(property, previous);
    else document.body.style.removeProperty(property);
    if (restoreScroll) window.scrollTo(0, y);
  };
}

/** Keep keyboard cycling inside a modal instead of moving to browser chrome. */
export function trapDialogTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !(event.currentTarget instanceof HTMLDialogElement)) return;
  const nodes = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')]
    .filter(node => node.getClientRects().length && !node.closest('[hidden]'));
  const first = nodes[0], last = nodes.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}
