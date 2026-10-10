/** Measure rendered content without counting spare space in a sized scroll area. */
export function overlayContentHeight(element: HTMLElement): number {
  const top = element.getBoundingClientRect().top;
  const padding = Number.parseFloat(getComputedStyle(element).paddingBottom) || 0;
  const bottoms = [...element.children].map(child => child.getBoundingClientRect().bottom);
  return Math.ceil(Math.max(top, ...bottoms) - top + element.scrollTop + padding);
}
