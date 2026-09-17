import type { Attachment } from 'svelte/attachments';

/** Keep mobile form dialogs within the visible area when the keyboard opens. */
export const dialogViewport: Attachment<HTMLDialogElement> = (dialog) => {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const update = () => {
    dialog.style.setProperty('--dn-dialog-viewport-height', `${viewport.height}px`);
    dialog.style.setProperty('--dn-dialog-viewport-top', `${viewport.offsetTop}px`);
  };
  update();
  viewport.addEventListener('resize', update);
  viewport.addEventListener('scroll', update);
  return () => {
    viewport.removeEventListener('resize', update);
    viewport.removeEventListener('scroll', update);
    dialog.style.removeProperty('--dn-dialog-viewport-height');
    dialog.style.removeProperty('--dn-dialog-viewport-top');
  };
};
