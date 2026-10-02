// WebKit does not focus a button on pointer click. Give native dialogs an
// explicit opener so dismissal restores focus in each supported browser.
export function showDialog(dialog: HTMLDialogElement, event: MouseEvent) {
  (event.currentTarget as HTMLElement).focus({ preventScroll: true });
  dialog.showModal();
}
