/** One gap and viewport inset for search menus; Floating UI handles collisions. */
export const searchPickerSpacing = { sideOffset: 8, collisionPadding: 16 } as const;

/** Keep compact menus under their field, but outside the whole search surface. */
export function searchPickerAnchor(
  trigger: HTMLElement | null | undefined,
  surface: HTMLElement | null | undefined,
  fullWidth = false
) {
  if (!trigger || !surface) return trigger ?? undefined;
  if (fullWidth) return surface;
  return {
    contextElement: surface,
    getBoundingClientRect() {
      const field = trigger.getBoundingClientRect();
      const box = surface.getBoundingClientRect();
      return new DOMRect(field.x, box.y, field.width, box.height);
    }
  };
}
