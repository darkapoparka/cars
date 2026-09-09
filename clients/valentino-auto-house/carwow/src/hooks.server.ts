import crypto from 'node:crypto';
import { json, type Handle, type HandleServerError } from '@sveltejs/kit';
import { getRouteBodyClasses } from '$lib/data/template-routes';

const appBodyPattern = /<body\b(?=[^>]*\bdata-sveltekit-preload-data=)([^>]*)>/i;
function renderBodyTagWithClasses(match: string, attributes: string, bodyClasses: string[]) {
  const classValue = bodyClasses.join(' ');
  const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/i);
  if (!classMatch) return `<body${attributes} class="${classValue}">`;
  const mergedClasses = Array.from(new Set([...classMatch[2].split(/\s+/).filter(Boolean), ...bodyClasses])).join(' ');
  return match.replace(classMatch[0], ` class="${mergedClasses}"`);
}
export function injectBodyClasses(html: string, bodyClasses: string[]) {
  const bodyMatch = appBodyPattern.exec(html);
  if (!bodyMatch || bodyMatch.index === undefined) return html;
  const replacement = renderBodyTagWithClasses(bodyMatch[0], bodyMatch[1], bodyClasses);
  return `${html.slice(0, bodyMatch.index)}${replacement}${html.slice(bodyMatch.index + bodyMatch[0].length)}`;
}
/** This independent branch copy is a static review demo, irrespective of ambient credentials. */
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = null;
  event.locals.staffProfile = null;
  event.locals.session = null;
  event.locals.user = null;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(event.request.method)) {
    return json({ success: false, status: 'unavailable', deliveryState: 'unavailable', message: 'Демо преглед: заявката не е изпратена. Използвайте публикувания телефон.' }, { status: 503, headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
  }
  const bodyClasses = getRouteBodyClasses(event.url.pathname);
  const response = await resolve(event, bodyClasses.length ? { transformPageChunk: ({ html }: { html: string }) => injectBodyClasses(html, bodyClasses) } : undefined);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
};
export const handleError: HandleServerError = ({ error, event, status, message }) => {
  const errorId = crypto.randomUUID();
  console.error('Unhandled preview error.', { errorId, status, route: event.route.id, pathname: event.url.pathname, message: error instanceof Error ? error.message : String(error) });
  return { message: status >= 500 ? 'Възникна грешка при прегледа.' : message, errorId };
};
