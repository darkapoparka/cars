import type { Handle } from "@sveltejs/kit/hooks";
import { dealer } from "./lib/content.ts";
import { brandingAttributes } from "./lib/branding.ts";
import { resolve as resolvePath } from "$app/paths";
import {
  isLocale,
  localeCookie,
  resolveRequestLocale,
} from "./lib/i18n/locales.ts";

const branding = brandingAttributes(dealer);
export const handle: Handle = async ({ event, resolve }) => {
  const locale = resolveRequestLocale(
    event.url,
    event.cookies.get(localeCookie),
    dealer.locale,
  );
  event.locals.locale = locale;
  const explicit = event.url.searchParams.getAll("lang");
  if (explicit.length === 1 && isLocale(explicit[0])) {
    const mount =
      new URL(resolvePath(""), event.url).pathname.replace(/\/$/, "") || "/";
    event.cookies.set(localeCookie, locale, {
      path: mount || "/",
      sameSite: "lax",
      httpOnly: true,
      secure: event.url.protocol === "https:",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace(
        '<html lang="en"',
        `<html lang="${locale}"${branding.style ? ` style="${branding.style}"` : ""}`,
      ),
  });
  if (response.headers.get("content-type")?.includes("text/html")) {
    response.headers.set("Content-Language", locale);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  }
  return response;
};
