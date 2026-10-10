'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import { desktopFilterStyles as s } from './showroom-desktop-filters.stylex';
import { desktopPopoverPosition } from '@/lib/desktop-popover';

const filterTrigger = '[data-desktop-hero-filter], [data-quick-filter], [data-desktop-sort]';
const focusable = 'button, input, select, textarea, a[href], summary, [tabindex]';

function controls(parent: ParentNode) {
  return [...parent.querySelectorAll<HTMLElement>(focusable)].filter(
    (element) =>
      element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length,
  );
}

export function ShowroomDesktopPopover({
  label,
  anchor,
  anchorSelector,
  matchAnchorSelector,
  initialFocusSelector,
  keyboardOpening = false,
  children,
  xstyle,
  onClose,
  onDismiss,
}: {
  label: string;
  anchor?: HTMLElement;
  anchorSelector: string;
  matchAnchorSelector?: string;
  initialFocusSelector?: string;
  keyboardOpening?: boolean;
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
  onClose: () => void;
  onDismiss: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const popup = root.current;
    const opener = anchor?.isConnected
      ? anchor
      : document.querySelector<HTMLElement>(anchorSelector) ||
        document.querySelector<HTMLElement>('[data-desktop-search-box]');
    trigger.current = opener;
    if (!popup || !opener) return;
    const widthAnchor = matchAnchorSelector
      ? opener.closest<HTMLElement>(matchAnchorSelector)
      : null;
    const positionAnchor = widthAnchor || opener;
    function position() {
      if (!popup || !opener) return;
      const box = positionAnchor.getBoundingClientRect();
      if (widthAnchor)
        popup.style.setProperty(
          '--filter-width',
          Math.min(box.width, window.innerWidth - 32) + 'px',
        );
      else popup.style.removeProperty('--filter-width');
      const width = popup.offsetWidth;
      const height = popup.getBoundingClientRect().height;
      const position = desktopPopoverPosition(
        box,
        { width, height },
        { width: window.innerWidth, height: window.innerHeight },
      );
      popup.style.setProperty('--filter-height', position.maxHeight + 'px');
      popup.style.setProperty('--filter-top', position.top + 'px');
      popup.style.setProperty('--filter-left', position.left + 'px');
      // The fallback position must never be painted while the anchor is being measured.
      popup.style.visibility = 'visible';
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(opener);
    if (positionAnchor !== opener) observer.observe(positionAnchor);
    observer.observe(popup);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [anchor, anchorSelector, matchAnchorSelector]);

  useEffect(() => {
    if (!initialFocusSelector) return;
    const popup = root.current;
    if (!popup || popup.contains(document.activeElement)) return;
    // Pointer opening starts with browsing; keyboard opening starts with the search field.
    const field = [...popup.querySelectorAll<HTMLElement>(initialFocusSelector)].find(
      (element) => !element.matches(':disabled') && element.getClientRects().length,
    );
    (keyboardOpening && field ? field : popup).focus({ preventScroll: true });
  }, [anchor, anchorSelector, initialFocusSelector, keyboardOpening]);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        root.current?.contains(target) ||
        trigger.current?.contains(target)
      )
        return;
      // Another filter replaces this editor directly, preserving a single history entry.
      if (target.closest(filterTrigger)) return;
      onDismiss();
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [onDismiss]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={root}
      role="dialog"
      tabIndex={-1}
      aria-modal={false}
      aria-label={label}
      data-desktop-popover
      onBlur={(event) => {
        const target = event.relatedTarget;
        if (
          !(target instanceof Element) ||
          event.currentTarget.contains(target) ||
          trigger.current?.contains(target) ||
          target.closest(filterTrigger)
        )
          return;
        onDismiss();
      }}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          trigger.current?.focus({ preventScroll: true });
          onClose();
        } else if (event.key === 'Tab') {
          const inside = controls(event.currentTarget);
          const active = document.activeElement;
          if (
            (event.shiftKey && (active === event.currentTarget || active === inside[0])) ||
            (!event.shiftKey && active === inside.at(-1))
          ) {
            const outside = controls(document.body).filter(
              (element) => !event.currentTarget.contains(element),
            );
            const index = outside.findIndex((element) => element === trigger.current);
            const next = event.shiftKey ? trigger.current : outside[index + 1];
            if (next) {
              event.preventDefault();
              next.focus({ preventScroll: true });
              onDismiss();
            }
          }
        }
      }}
      {...stylex.props(s.popover, xstyle)}
    >
      {children}
    </div>,
    document.body,
  );
}
