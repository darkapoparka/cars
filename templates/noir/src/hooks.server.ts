import { site } from "#lib/config/site.ts";
import type { Handle } from "@sveltejs/kit/hooks";

export const handle: Handle = ({ event, resolve }) => {
  const lang = event.params.lang ?? site.defaultLocale;
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%lang%", lang),
  });
};
