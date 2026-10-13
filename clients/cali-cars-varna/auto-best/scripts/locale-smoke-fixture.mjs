import { previewUrl } from './browser.mjs';

// Existing discovery/enquiry suites exercise a returning Bulgarian visitor.
// First-visit, preference persistence, conflicts and no-JS have dedicated suites.
export function appPath(value) {
  const pathname = new URL(value, previewUrl()).pathname;
  return pathname.replace(/^\/(en|bg)(?=\/|$)/, '') || '/';
}
export async function returningContext(browser, options = {}) {
  const context = await browser.newContext({ locale: 'bg-BG', ...options });
  await seed(context);
  return context;
}
export async function returningPage(browser, options = {}) {
  const page = await browser.newPage({ locale: 'bg-BG', ...options });
  await seed(page.context());
  return page;
}
async function seed(context) {
  await context.addCookies([
    { name: 'cars_prompt', value: 'v1', url: previewUrl(), httpOnly: true, sameSite: 'Lax' },
    { name: 'cars_locale', value: 'bg', url: previewUrl(), httpOnly: true, sameSite: 'Lax' },
    { name: 'cars_country', value: 'BG', url: previewUrl(), httpOnly: true, sameSite: 'Lax' }
  ]);
}
