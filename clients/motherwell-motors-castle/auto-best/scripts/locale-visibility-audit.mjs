/** Read-only geometry check for labels that must not be ellipsized or clipped.
 * Passed directly to page.evaluate; keep this function free of module closures.
 */
export function clippedBudgetLabels() {
  const issues = [];
  for (const element of document.querySelectorAll('.mh-budget-card__copy > strong, .mh-budget-card__copy > span')) {
    if (!element.checkVisibility()) continue;
    const range = document.createRange();
    range.selectNodeContents(element);
    const textRects = [...range.getClientRects()];
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      const clipX = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX);
      const clipY = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY);
      const box = ancestor.getBoundingClientRect();
      const clipped = textRects.some(rect =>
        (clipX && (rect.left < box.left - 1 || rect.right > box.right + 1)) ||
        (clipY && (rect.top < box.top - 1 || rect.bottom > box.bottom + 1)));
      if (clipped) { issues.push({ text: element.textContent.trim(), container: ancestor.className }); break; }
      if (ancestor.classList.contains('mh-budget-card')) break;
    }
  }
  return issues;
}

/** Fixed navigation labels must remain inside their own hit targets. */
export function overflowingDockLabels() {
  const issues = [];
  for (const label of document.querySelectorAll('.mobile-bottom-dock__label')) {
    if (!label.checkVisibility()) continue;
    const target = label.closest('a,button');
    if (!target) continue;
    const range = document.createRange();
    range.selectNodeContents(label);
    const box = target.getBoundingClientRect();
    const clipped = [...range.getClientRects()].some(rect =>
      rect.left < box.left - 1 || rect.right > box.right + 1 ||
      rect.top < box.top - 1 || rect.bottom > box.bottom + 1);
    if (clipped) issues.push({ text: label.textContent.trim(), target: target.getAttribute('href') || 'button' });
  }
  return issues;
}

/** Tab text must fit its own hit target, even when visible overflow hides the defect from page-width checks. */
export function overflowingTabLabels() {
  const issues = [];
  for (const tab of document.querySelectorAll('[role="tab"]')) {
    if (!tab.checkVisibility()) continue;
    const box = tab.getBoundingClientRect();
    const walker = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT);
    let overflow = false;
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      overflow ||= [...range.getClientRects()].some(rect => rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1);
    }
    if (overflow) issues.push({ text: tab.textContent.trim(), width: box.width, selected: tab.getAttribute("aria-selected") });
  }
  return issues;
}
