export const serviceEntry = page => page.locator('.dn-service-entry:visible');
export const serviceAction = page => serviceEntry(page).locator('.dn-service-entry__submit');

export async function fillServiceEntry(page, fields) {
  const entry = serviceEntry(page);
  const editor = page.locator('.dn-service-editor[open]');
  if (await entry.locator('.dn-service-entry__field').count()) {
    if (!await editor.count()) await entry.locator('.dn-service-entry__field').click();
    for (const [name, value] of Object.entries(fields)) await editor.locator(`[name="${name === 'link' ? 'reference' : name}"]`).fill(value);
    await editor.locator('.dn-service-editor__save').click();
  } else {
    for (const [name, value] of Object.entries(fields)) await entry.locator(`[name="${name}"]`).fill(value);
  }
}
