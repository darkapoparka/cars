'use client';

import {useLayoutEffect, useRef} from 'react';

const openModals: string[] = [];
let initialOverflow = '';
let sequence = 0;
const isolated = new Map<HTMLElement, {inert: boolean; owners: Set<string>}>();

function isolateBackground(panel: HTMLElement, id: string) {
  const elements: HTMLElement[] = [];
  for (let branch: HTMLElement | null = panel; branch?.parentElement; branch = branch.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
      const state = isolated.get(sibling) ?? {inert: sibling.inert, owners: new Set<string>()};
      state.owners.add(id);
      isolated.set(sibling, state);
      sibling.inert = true;
      elements.push(sibling);
    }
    if (branch.parentElement === document.body) break;
  }
  return () => {
    for (const element of elements) {
      const state = isolated.get(element);
      if (!state) continue;
      state.owners.delete(id);
      if (!state.owners.size) {element.inert = state.inert; isolated.delete(element);}
    }
  };
}

/** A shared, stack-safe modal boundary for keyboard, history and scroll behavior. */
export function useModal(active: boolean, onClose: () => void, options: {history?: boolean} = {}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  const manageHistory = options.history !== false;
  useLayoutEffect(() => {close.current = onClose;}, [onClose]);
  useLayoutEffect(() => {
    if (!active) return;
    const id = `cars24-modal-${++sequence}`;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!openModals.length) initialOverflow = document.body.style.overflow;
    openModals.push(id);
    document.body.style.overflow = 'hidden';
    const restoreBackground = panel.current ? isolateBackground(panel.current, id) : undefined;
    const initialUrl = location.href;
    if (manageHistory) {
      const previousModal = history.state?.cars24Modal;
      const state = {...history.state, cars24Modal: id};
      if (previousModal && !openModals.includes(previousModal)) history.replaceState(state, '');
      else history.pushState(state, '');
    }
    panel.current?.focus({preventScroll: true});
    const isTop = () => openModals.at(-1) === id;
    function popstate() {
      if (manageHistory && isTop() && history.state?.cars24Modal !== id) close.current();
    }
    function keydown(event: KeyboardEvent) {
      if (!isTop() || event.defaultPrevented) return;
      if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); close.current(); return;}
      if (event.key !== 'Tab' || !panel.current) return;
      const controls = [...panel.current.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')]
        .filter(element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
      const first = controls[0], last = controls.at(-1);
      if (!first || !last) {event.preventDefault(); panel.current.focus(); return;}
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {event.preventDefault(); last.focus();}
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) {event.preventDefault(); first.focus();}
    }
    document.addEventListener('keydown', keydown);
    window.addEventListener('popstate', popstate);
    return () => {
      const index = openModals.indexOf(id);
      if (index >= 0) openModals.splice(index, 1);
      if (!openModals.length) document.body.style.overflow = initialOverflow;
      restoreBackground?.();
      document.removeEventListener('keydown', keydown);
      window.removeEventListener('popstate', popstate);
      if (manageHistory) setTimeout(() => {
        if (history.state?.cars24Modal === id && location.href === initialUrl) history.back();
      }, 0);
      if (previous?.isConnected) previous.focus({preventScroll: true});
    };
  }, [active, manageHistory]);
  return panel;
}
