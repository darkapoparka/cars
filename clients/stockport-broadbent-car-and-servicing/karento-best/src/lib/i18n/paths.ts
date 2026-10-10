import { isLocale } from "./locales.ts";
import type { Locale } from "./locales.ts";

/** One mount-aware navigation boundary; retains vehicle IDs, other queries and hashes. */
export function localeHref(input: string, locale: Locale, mount = ""): string {
  if (!isLocale(locale)) throw new Error("Unsupported Signature locale");
  if (
    !input ||
    input.startsWith("#") ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(input)
  )
    return input;
  if (/[\\\u0000-\u001f]/.test(input))
    throw new Error("Unsafe Signature navigation path");
  if (
    mount &&
    (!mount.startsWith("/") || mount.startsWith("//") || /[?#\\]/.test(mount))
  )
    throw new Error("Invalid Signature mount");
  const base = mount.replace(/\/$/, "");
  const url = new URL(
    input.startsWith("/") ? input : "/" + input,
    "https://signature.invalid",
  );
  if (base && url.pathname !== base && !url.pathname.startsWith(base + "/"))
    url.pathname = base + url.pathname;
  url.searchParams.set("lang", locale);
  return url.pathname + url.search + url.hash;
}

/** A shared page must carry its resolved language even when it came from a cookie. */
export function localizedShareUrl(
  url: URL,
  locale: Locale,
  mount = "",
): string {
  return new URL(
    localeHref(url.pathname + url.search + url.hash, locale, mount),
    url.origin,
  ).href;
}
