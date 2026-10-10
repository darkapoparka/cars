'use client';
import { useEffect, useState } from 'react';

const closed = { open: false, height: 0, offsetTop: 0 };

function editingText() {
  const active = document.activeElement;
  if (active instanceof HTMLTextAreaElement) return !active.readOnly && !active.disabled;
  if (active instanceof HTMLInputElement)
    return (
      !active.readOnly &&
      !active.disabled &&
      ['text', 'search', 'email', 'tel', 'url', 'number', 'password'].includes(active.type)
    );
  return active instanceof HTMLElement && active.isContentEditable;
}

export function useMobileKeyboard(enabled = true) {
  const [keyboard, setKeyboard] = useState(closed);
  useEffect(() => {
    if (!enabled) return;
    const viewport = window.visualViewport;
    let fullHeight = window.innerHeight;
    let width = window.innerWidth;
    let wasOpen = false;
    let frame = 0;
    const update = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        fullHeight = window.innerHeight;
      }
      fullHeight = Math.max(fullHeight, window.innerHeight);
      const height = viewport?.height ?? window.innerHeight;
      // Browser bars and pinch zoom should not hide actions. Text focus alone
      // also leaves them available for users with a hardware keyboard.
      const open =
        width <= 699 &&
        Math.abs((viewport?.scale ?? 1) - 1) < 0.02 &&
        (editingText() || wasOpen) &&
        fullHeight - height > 120;
      // Keep the frame stable after tapping an action until the browser finishes
      // closing the keyboard; growing it on blur can move the tapped button.
      wasOpen = open;
      const next = open
        ? { open, height: Math.round(height), offsetTop: Math.round(viewport?.offsetTop ?? 0) }
        : closed;
      setKeyboard((current) =>
        current.open === next.open &&
        current.height === next.height &&
        current.offsetTop === next.offsetTop
          ? current
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('resize', schedule);
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      document.removeEventListener('focusin', schedule);
      document.removeEventListener('focusout', schedule);
    };
  }, [enabled]);
  useEffect(() => {
    if (!keyboard.open) return;
    const frame = requestAnimationFrame(() => {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [keyboard]);
  return enabled ? keyboard : closed;
}
