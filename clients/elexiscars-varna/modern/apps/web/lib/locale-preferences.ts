import "server-only";
import { getIntlLocale, type Locale } from "@repo/internationalization/config";
import { localizedPath, withBasePath } from "@repo/internationalization/paths";
import { createLocalePolicy } from "@repo/internationalization/policy";
import { getPreferenceMessages } from "@repo/internationalization/preferences-messages";
import { publicSite } from "@repo/marketplace/site-config";
import { headers } from "next/headers";
import { localeConfiguration } from "./locale-configuration";

export const localePolicy = createLocalePolicy(localeConfiguration);


/** Opt-in compiled edge resolver: native policy remains the sole locale parser. */
export function resolveCarsNativePreferences({
  request,
  locale,
  returnTo,
  trustedCountry,
}: {
  request: Request;
  locale: Locale;
  returnTo: string;
  trustedCountry: string | null;
}) {
  if (!localePolicy.isLocale(locale)) {
    throw new Error("Invalid native preference locale");
  }
  const origin = new URL(request.url).origin;
  const safe = localePolicy.safeReturnPath(returnTo, origin);
  const prefix = withBasePath("/" + locale);
  const path = safe ? localePolicy.routeParts(new URL(safe, origin).pathname).path : "";
  if (
    !safe || safe !== returnTo ||
    /^\/(?:admin|_cars|_vinext)(?:\/|$)/.test(path) ||
    !(new URL(safe, origin).pathname === prefix ||
      new URL(safe, origin).pathname.startsWith(prefix + "/"))
  ) {
    throw new Error("Unsafe native preference return path");
  }
  const state = localePolicy.resolveLocale({
    url: new URL(safe, origin),
    cookie: request.headers.get("cookie"),
    acceptLanguage: request.headers.get("accept-language"),
    trustedCountry,
  });
  return { state, returnTo: safe };
}

/** Build-only immutable presentation; no request API or visitor state is read. */
export function getStaticServicesPreferences(locale: Locale) {
  const returnTo = withBasePath(localizedPath(locale, "/services"));
  const { state } = resolveCarsNativePreferences({
    request: new Request("https://locale.invalid" + returnTo),
    locale, returnTo, trustedCountry: null,
  });
  const names = new Intl.DisplayNames([getIntlLocale(locale)], { type: "region" });
  const countryOptions = localePolicy.countries
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => {
      if (a.code === state.suggestedCountry) return -1;
      if (b.code === state.suggestedCountry) return 1;
      return a.name.localeCompare(b.name, locale);
    });
  return {
    state, returnTo, countryOptions,
    enabledLocales: localeConfiguration.enabledLocales,
    promptVersion: localeConfiguration.promptVersion,
    messages: getPreferenceMessages(locale),
    dealerName: publicSite.identity.shortName,
    dealerCountry: names.of(publicSite.market.countryCode) ?? publicSite.market.countryCode,
    inventoryCurrency: publicSite.market.currency,
  };
}

/** Dynamic request-only state; no shared visitor cache or mutable singleton. */
export async function getRequestPreferences(locale: Locale) {
  const requestHeaders = await headers();
  const requestPath = localePolicy.safeReturnPath(
    requestHeaders.get("x-modern-public-path"),
    "https://locale.invalid"
  );
  const returnTo = withBasePath(localizedPath(locale, requestPath ?? "/"));
  const state = localePolicy.resolveLocale({
    url: new URL(returnTo, "https://locale.invalid"),
    cookie: requestHeaders.get("cookie"),
    trustedCountry:
      process.env.VERCEL === "1"
        ? requestHeaders.get("x-vercel-ip-country")
        : null,
  });
  const names = new Intl.DisplayNames([getIntlLocale(locale)], {
    type: "region",
  });
  const countryOptions = localePolicy.countries
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => {
      if (a.code === state.suggestedCountry) {
        return -1;
      }
      if (b.code === state.suggestedCountry) {
        return 1;
      }
      return a.name.localeCompare(b.name, locale);
    });
  return {
    state,
    returnTo,
    countryOptions,
    enabledLocales: localeConfiguration.enabledLocales,
    promptVersion: localeConfiguration.promptVersion,
    messages: getPreferenceMessages(locale),
    dealerName: publicSite.identity.shortName,
    dealerCountry:
      names.of(publicSite.market.countryCode) ?? publicSite.market.countryCode,
    inventoryCurrency: publicSite.market.currency,
  };
}
