/** Pointer opening keeps a dropdown neutral; keyboard opening enters its editor. */
export function focusPopover(content: HTMLElement | null, preferred: HTMLElement | null, keyboardOpened: boolean): void {
  (keyboardOpened ? preferred ?? content : content)?.focus({ preventScroll: true });
}

/** Keep keyboard traversal inside the owning modal, not browser chrome or a child dialog. */
export function containDialogTab(event: KeyboardEvent, dialog: HTMLDialogElement): void {
  if (event.key !== 'Tab' || event.defaultPrevented || !dialog.open) return;
  // A nested popover or dialog owns its own Tab loop and initial container focus.
  if (event.target instanceof Element && event.target.closest('dialog, [role="dialog"]') !== dialog) return;
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
    'button,input,select,textarea,a[href],area[href],summary,[tabindex]'
  )).filter(element => element.tabIndex >= 0 && !element.matches(':disabled')
    && !element.closest('[hidden],[inert]') && element.closest('dialog') === dialog
    && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
  const first = controls[0], last = controls.at(-1);
  if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
  const current = document.activeElement;
  const outsideOrder = !controls.includes(current as HTMLElement);
  if (event.shiftKey && (current === first || outsideOrder)) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (current === last || outsideOrder)) {
    event.preventDefault(); first.focus();
  }
}
