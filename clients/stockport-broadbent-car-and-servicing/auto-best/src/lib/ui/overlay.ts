import { containDialogTab } from './focus';

type ScrollLock = { owners: number; value: string; priority: string };
const scrollLocks = new WeakMap<HTMLElement, ScrollLock>();

/** Nested owners may release in either order; restore only after the last one. */
export function lockPageScroll() {
  const body = document.body;
  const lock = scrollLocks.get(body) ?? { owners: 0, value: body.style.getPropertyValue('overflow'), priority: body.style.getPropertyPriority('overflow') };
  scrollLocks.set(body, lock);
  lock.owners += 1;
  body.style.setProperty('overflow', 'hidden');
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lock.owners > 0) return;
    scrollLocks.delete(body);
    if (lock.value) body.style.setProperty('overflow', lock.value, lock.priority);
    else body.style.removeProperty('overflow');
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
    if (restoreScroll) window.scrollTo({ top: y, behavior: 'instant' });
  };
}

/** Event-handler adapter for native dialogs. */
export function trapDialogTab(event: KeyboardEvent) {
  if (event.currentTarget instanceof HTMLDialogElement) containDialogTab(event, event.currentTarget);
}
