type StyleLock = { owners: number; value: string; priority: string; scrollY: number };
// DOM-keyed browser resources, never request/user state. Each release is idempotent.
const locks = new WeakMap<HTMLElement, Map<string, StyleLock>>();

function acquireStyle(node: HTMLElement, property: string, value: string) {
  let properties = locks.get(node);
  if (!properties) { properties = new Map(); locks.set(node, properties); }
  let lock = properties.get(property);
  if (!lock) {
    lock = { owners: 0, value: node.style.getPropertyValue(property), priority: node.style.getPropertyPriority(property), scrollY: window.scrollY };
    properties.set(property, lock);
    node.style.setProperty(property, value);
  }
  lock.owners++;
  let released = false;
  return () => {
    if (released) return null;
    released = true;
    if (--lock.owners > 0) return null;
    if (lock.value) node.style.setProperty(property, lock.value, lock.priority);
    else node.style.removeProperty(property);
    properties.delete(property);
    if (!properties.size) locks.delete(node);
    return lock.scrollY;
  };
}

/** Nested owners cannot accidentally unlock each other's page. Browser-only. */
export function lockPageScroll() {
  const release = acquireStyle(document.body, 'overflow', 'hidden');
  return () => { release(); };
}

/** The matching :has(:modal) CSS owns fixed geometry; this owns its offset. */
export function preserveScrollOffset(property: `--${string}`) {
  const release = acquireStyle(document.body, property, `-${window.scrollY}px`);
  return (restoreScroll = true) => {
    const y = release();
    if (restoreScroll && y !== null) window.scrollTo(0, y);
  };
}

/** Keep keyboard cycling inside a modal, including an empty/disabled dialog. */
export function trapDialogTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !(event.currentTarget instanceof HTMLDialogElement)) return;
  const dialog = event.currentTarget;
  const nodes = [...dialog.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')]
    .filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && node.getClientRects().length && !node.closest('[hidden],[inert]'));
  const first = nodes[0], last = nodes.at(-1);
  if (!first) { event.preventDefault(); dialog.focus(); }
  else if (event.shiftKey && (document.activeElement === first || !nodes.includes(document.activeElement as HTMLElement))) {
    event.preventDefault(); last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}
