'use client';
let count = 0;
let original = '';
/** All nested dialogs share one lock, so parent/child unmount order cannot trap the page. */
export function lockDocumentScroll(): () => void {
  if (count === 0) original = document.body.style.overflow;
  count += 1;
  document.body.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    count = Math.max(0, count - 1);
    if (count === 0) document.body.style.overflow = original;
  };
}
