type Size = { width: number; height: number };
type Anchor = { top: number; bottom: number; left: number };

// Keep anchored editors reachable when the viewport is short or the page scrolls.
export function desktopPopoverPosition(anchor: Anchor, popup: Size, viewport: Size) {
  const gutter = 16;
  const gap = 8;
  const below = Math.max(0, viewport.height - gutter - anchor.bottom - gap);
  const above = Math.max(0, anchor.top - gutter - gap);
  const down = below >= popup.height || below >= above;
  const maxHeight = Math.max(
    0,
    Math.min(viewport.height - gutter * 2, Math.max(120, down ? below : above)),
  );
  const height = Math.min(popup.height, maxHeight);
  const clamp = (value: number, max: number) => Math.max(gutter, Math.min(value, max));
  return {
    maxHeight,
    top: clamp(
      down ? anchor.bottom + gap : anchor.top - height - gap,
      viewport.height - gutter - height,
    ),
    left: clamp(anchor.left, viewport.width - gutter - popup.width),
  };
}
