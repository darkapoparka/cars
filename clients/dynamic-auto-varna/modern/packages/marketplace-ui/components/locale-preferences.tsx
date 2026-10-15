"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { Locale } from "@repo/internationalization/config";
import { containDialogTab } from "@repo/internationalization/focus";
import {
  isCountry,
  type ResolvedLocale,
} from "@repo/internationalization/policy";
import type { PreferenceMessages } from "@repo/internationalization/preferences-messages";
import {
  postPreferences,
  rememberPrompt,
} from "../lib/locale-preference-request";
import {
  isPreferenceField,
  nativeValidationMessage,
} from "../lib/locale-validation";
import { mobileControlFocusClassName } from "../lib/mobile-overlay-styles";
import { DealerUiIcon } from "./dealer-ui-icon";
import overlayStyles from "./desktop-overlay.module.css";
import { LanguageFlag } from "./language-flag";

type LocaleState = ResolvedLocale<Locale>;

import {
  createContext,
  Suspense,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PreferenceContext = createContext<{
  state: LocaleState;
  open: () => void;
  returnTo: string;
} | null>(null);
export const useLocalePreferences = () => useContext(PreferenceContext);

/** Native dialog supplies modal focus containment; no mutable server visitor state. */
function NativeLocalePreferencesProvider({
  children,
  state,
  returnTo,
  countryOptions,
  messages,
  dealerName,
  dealerCountry,
  inventoryCurrency,
  enabledLocales,
  promptVersion,
  requestPending = false,
  bootstrapContext,
}: {
  children: ReactNode;
  state: LocaleState;
  returnTo: string;
  countryOptions: readonly { code: string; name: string }[];
  messages: PreferenceMessages;
  dealerName: string;
  dealerCountry: string;
  inventoryCurrency: string;
  enabledLocales: readonly Locale[];
  promptVersion: string;
  requestPending?: boolean;
  bootstrapContext?: string;
}) {
  const promptKey = `cars.prompt.${promptVersion}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const attempted = useRef(false);
  const requestVersion = useRef(0);
  const pendingRequest = useRef<AbortController | null>(null);
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const [ready, setReady] = useState(false);
  const [locale, setLocale] = useState<Locale>(state.locale);
  const [country, setCountry] = useState(state.country);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const t = (
    key: keyof PreferenceMessages,
    parameters: Record<string, string | number> = {}
  ) =>
    messages[key].replace(
      /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g,
      (placeholder, name: string) =>
        Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder
    );
  const invalidateRequest = useCallback(() => {
    requestVersion.current += 1;
    pendingRequest.current?.abort();
    pendingRequest.current = null;
    setBusy(false);
  }, []);
  useEffect(
    () => () => {
      // Unmounting must invalidate late responses as well as cancel their work.
      requestVersion.current += 1;
      pendingRequest.current?.abort();
      pendingRequest.current = null;
    },
    []
  );
  // Names and sort order come from SSR, avoiding browser/server ICU differences.
  const options = countryOptions;
  const show = useCallback(
    (manualSelection = true) => {
      if (requestPending) return;
      invalidateRequest();
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setManual(manualSelection);
      setLocale(state.locale);
      setCountry(state.country);
      setError(false);
      setOpen(true);
    },
    [state.locale, state.country, invalidateRequest, requestPending]
  );

  useEffect(() => {
    if (bootstrapContext === undefined) return;
    // A navigation or fresh native state invalidates work from the old context.
    invalidateRequest();
    setOpen(false);
    setError(false);
    setLocale(state.locale);
    setCountry(state.country);
  }, [bootstrapContext, requestPending, state.locale, state.country, invalidateRequest]);

  useEffect(() => {
    if (requestPending) { setReady(false); return; }
    setReady(true);
    if (attempted.current) {
      return;
    }
    attempted.current = true;
    if (window.location.pathname.endsWith("/locale-settings")) {
      return;
    }
    let dismissed = state.promptDismissed;
    try {
      dismissed ||= localStorage.getItem(promptKey) === "dismissed";
    } catch {
      /* Storage is optional. */
    }
    if (!dismissed) {
      show(false);
    }
  }, [state.promptDismissed, show, promptKey, requestPending]);
  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) {
      element.showModal();
      title.current?.focus({ preventScroll: true });
    }
    if (!open && element?.open) {
      element.close();
    }
  }, [open]);
  useEffect(() => {
    if (!open) {
      return;
    }
    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = window.matchMedia("(min-width: 640px)").matches
      ? "stable"
      : "auto";
    return () => {
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    const target = returnFocus.current;
    requestAnimationFrame(() => {
      if (dialog.current?.open) {
        return;
      }
      const candidates = [
        target,
        ...document.querySelectorAll<HTMLElement>(
          '[data-slot="dealer-bottom-nav"] button[aria-haspopup="dialog"], [data-locale-trigger]'
        ),
      ];
      candidates
        .find(
          (element) =>
            element &&
            element !== document.body &&
            element.isConnected &&
            element.getClientRects().length
        )
        ?.focus({ preventScroll: true });
    });
  };
  const persist = async (action: "save" | "dismiss") => {
    if (busy && action === "save") {
      return;
    }
    invalidateRequest();
    const version = requestVersion.current;
    if (action === "dismiss") {
      // Only an explicit dismissal is mirrored; storage never decides language.
      rememberPrompt(promptKey);
      close();
    }
    setBusy(true);
    setError(false);
    const controller = new AbortController();
    pendingRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const destination = await postPreferences(
        action,
        locale,
        country,
        controller.signal
      );
      if (action === "save" && version === requestVersion.current) {
        rememberPrompt(promptKey);
        window.location.assign(destination);
      }
    } catch {
      if (action === "save" && version === requestVersion.current) {
        setError(true);
      }
    } finally {
      clearTimeout(timeout);
      if (version === requestVersion.current) {
        pendingRequest.current = null;
        setBusy(false);
      }
    }
  };

  return (
    <PreferenceContext.Provider value={{ state, open: show, returnTo }}>
      <div
        className="contents"
        onChangeCapture={(event) => {
          const field = event.target;
          if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement
          ) {
            field.setCustomValidity("");
          }
        }}
        onInputCapture={(event) => {
          const field = event.target;
          if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement
          ) {
            field.setCustomValidity("");
          }
        }}
        onInvalidCapture={(event) => {
          const field = event.target;
          if (isPreferenceField(field) && !field.validity.customError) {
            field.setCustomValidity(nativeValidationMessage(field, t));
          }
        }}
      >
        {children}
      </div>
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Native modal dialog owns Escape and keyboard focus containment. */}
      <dialog
        aria-describedby="locale-preferences-description"
        aria-labelledby="locale-preferences-title"
        className={cn(
          "fixed inset-x-0 top-auto bottom-0 m-0 max-h-[90dvh] w-screen max-w-[100vw] overflow-hidden rounded-t-3xl border-0 bg-white p-0 text-zinc-950 shadow-2xl backdrop:bg-black/50 sm:inset-0 sm:m-auto sm:h-fit sm:w-[28rem] sm:rounded-2xl",
          overlayStyles.localeDialog
        )}
        data-locale-dialog
        data-locale-ready={ready}
        data-preference-country={state.country}
        data-prompt-dismissed={state.promptDismissed}
        data-suggested-country={state.suggestedCountry}
        onCancel={(event) => {
          event.preventDefault();
          persist("dismiss");
        }}
        onKeyDown={(event) =>
          containDialogTab(event.nativeEvent, event.currentTarget)
        }
        ref={dialog}
      >
        <div className="flex max-h-[90dvh] flex-col">
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-zinc-200 sm:hidden"
          />
          <div
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 px-4 pt-3 pb-4 sm:px-6 sm:pt-5",
              overlayStyles.header
            )}
          >
            <h2
              className="min-w-0 font-semibold text-lg leading-6 outline-none max-lg:font-medium"
              id="locale-preferences-title"
              ref={title}
              tabIndex={-1}
            >
              <span className="lg:hidden">{t("locale.mobileTitle")}</span>
              <span className="hidden lg:inline">{t("locale.title")}</span>
            </h2>
            <button
              aria-label={t("locale.close")}
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-transparent text-zinc-950 hover:opacity-70",
                overlayStyles.close,
                mobileControlFocusClassName
              )}
              onClick={() => persist("dismiss")}
              title={t("locale.close")}
              type="button"
            >
              <DealerUiIcon className="size-4 lg:size-5" name="close" />
            </button>
          </div>
          <p className="sr-only" id="locale-preferences-description">
            {t("locale.description")}
          </p>
          <form
            aria-busy={busy}
            className="flex min-h-0 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              persist("save");
            }}
          >
            <div
              className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6"
              data-locale-fields
            >
              {manual ? null : (
                <p className="mb-5 text-sm text-zinc-600 leading-5">
                  {t("locale.welcome", { dealer: dealerName })}
                </p>
              )}
              <label
                className="grid gap-2 font-medium text-sm"
                htmlFor="locale-country"
              >
                {t("locale.country")}
                <span className="relative block">
                  <select
                    className={cn(
                      "h-12 w-full min-w-0 appearance-none truncate rounded-lg border border-zinc-300 bg-white pr-12 pl-4 font-normal text-base",
                      mobileControlFocusClassName
                    )}
                    id="locale-country"
                    name="country"
                    onChange={(event) => {
                      if (isCountry(event.target.value)) {
                        setCountry(event.target.value);
                      }
                    }}
                    value={country}
                  >
                    {options.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 inline-flex size-5 -translate-y-1/2 text-zinc-700"
                    data-locale-country-chevron
                  >
                    <DealerUiIcon className="size-5" name="chevronDown" />
                  </span>
                </span>
              </label>
              <fieldset className="mt-5 min-w-0">
                <legend className="mb-2 font-medium text-sm">
                  {t("locale.language")}
                </legend>
                <div className="grid gap-2">
                  {enabledLocales.map((value) => (
                    <label
                      className={cn(
                        "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                        locale === value
                          ? "border-zinc-950 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      )}
                      data-language-option={value}
                      key={value}
                    >
                      <LanguageFlag locale={value} />
                      <span
                        className="min-w-0 flex-1 font-medium text-base"
                        lang={value}
                      >
                        {value === "bg" ? "Български" : "English"}
                      </span>
                      <input
                        checked={locale === value}
                        className="size-4 shrink-0 accent-zinc-950"
                        name="locale"
                        onChange={() => setLocale(value)}
                        type="radio"
                        value={value}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="mt-4 text-xs text-zinc-500 leading-5">
                {t("locale.facts", {
                  country: dealerCountry,
                  currency: inventoryCurrency,
                })}
              </p>
              {error ? (
                <p className="mt-3 text-red-700 text-sm" role="alert">
                  {t("locale.error")}
                </p>
              ) : null}
            </div>
            <div
              className={cn(
                "flex shrink-0 justify-end gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6",
                overlayStyles.footer
              )}
              data-locale-actions
            >
              <button
                className={cn(
                  "h-11 w-28 shrink-0 rounded-md px-4 font-medium text-sm text-zinc-600 hover:text-zinc-950",
                  overlayStyles.reset,
                  mobileControlFocusClassName
                )}
                onClick={() => persist("dismiss")}
                type="button"
              >
                {t(manual ? "locale.cancel" : "locale.dismiss")}
              </button>
              <button
                className={cn(
                  "h-11 w-28 shrink-0 rounded-md bg-zinc-950 px-4 font-medium text-sm text-white hover:bg-zinc-800 disabled:opacity-60",
                  overlayStyles.apply,
                  mobileControlFocusClassName
                )}
                disabled={busy}
                type="submit"
              >
                {t(busy ? "locale.saving" : "locale.confirm")}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </PreferenceContext.Provider>
  );
}


type NativePreferenceProps = Parameters<typeof NativeLocalePreferencesProvider>[0];
type NativeBootstrap = { state: LocaleState; returnTo: string };

/** Validate a native-policy response for this navigation; never infer a locale. */
export function readCarsNativeBootstrap(value: unknown, returnTo: string, locale: Locale): NativeBootstrap {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid native preference bootstrap");
  const envelope = value as Record<string, unknown>;
  if (Object.keys(envelope).sort().join(",") !== "kind,returnTo,schemaVersion,state" ||
    envelope.schemaVersion !== 1 || envelope.kind !== "cars-modern-native-preferences-bootstrap" || envelope.returnTo !== returnTo) {
    throw new Error("Stale native preference bootstrap");
  }
  const state = envelope.state as LocaleState;
  if (!state || typeof state !== "object" || Array.isArray(state) ||
    Object.keys(state).sort().join(",") !== "country,locale,promptDismissed,source,suggestedCountry" ||
    state.locale !== locale || !isCountry(state.country) || !isCountry(state.suggestedCountry) ||
    typeof state.promptDismissed !== "boolean" || !["url", "cookie", "header", "country", "default"].includes(state.source)) {
    throw new Error("Invalid native preference state");
  }
  return { state, returnTo };
}

function CarsNativeBootstrapProvider(props: NativePreferenceProps) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [hash, setHash] = useState("");
  const returnTo = pathname + (search ? "?" + search : "") + hash;
  const [resolved, setResolved] = useState<(NativeBootstrap & { navigationKey: string }) | null>(null);
  const bootstrapUsed = useRef(false);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const actual = window.location.pathname + window.location.search + window.location.hash;
    const mounted = actual.match(/^\/variant-([23])\/(en|bg)(?:\/|[?#]|$)/);
    const originalMount = props.returnTo.match(/^\/variant-([23])\//)?.[1];
    if (!mounted || mounted[1] !== originalMount || !props.enabledLocales.includes(mounted[2] as Locale)) return;
    const locale = mounted[2] as Locale;
    const controller = new AbortController();
    let active = true;
    setResolved(null);
    const read = async () => {
      const script = document.getElementById("cars-modern-native-preferences");
      const canUseScript = !bootstrapUsed.current;
      bootstrapUsed.current = true;
      if (canUseScript && script?.textContent && script.textContent.length <= 8192) {
        try { return readCarsNativeBootstrap(JSON.parse(script.textContent), actual, locale); } catch { /* A previous navigation cannot supply current state. */ }
      }
      const response = await fetch("/_cars/native-preferences/modern?returnTo=" + encodeURIComponent(actual), {
        credentials: "same-origin", cache: "no-store", signal: controller.signal,
      });
      if (!response.ok) throw new Error("Native preference bootstrap failed");
      const text = await response.text();
      if (text.length > 8192) throw new Error("Oversized native preference bootstrap");
      return readCarsNativeBootstrap(JSON.parse(text), actual, locale);
    };
    void read().then((value) => { if (active) setResolved({ ...value, navigationKey: returnTo }); }).catch(() => { /* Keep the native readiness gate closed on failure. */ });
    return () => { active = false; controller.abort(); };
  }, [returnTo, props.returnTo, props.enabledLocales]);
  const current = resolved?.navigationKey === returnTo ? resolved : null;
  const countryOptions = current ? [...props.countryOptions].sort((a, b) => {
    if (a.code === current.state.suggestedCountry) return -1;
    if (b.code === current.state.suggestedCountry) return 1;
    return a.name.localeCompare(b.name, current.state.locale);
  }) : props.countryOptions;
  return <NativeLocalePreferencesProvider {...props} state={current?.state ?? props.state} returnTo={current?.returnTo ?? props.returnTo} countryOptions={countryOptions} requestPending={!current} bootstrapContext={returnTo} />;
}

/** Opt-in only: ordinary native SSR and the no-JS form retain their existing path. */
export function LocalePreferencesProvider(props: NativePreferenceProps & { requestBootstrap?: boolean }) {
  return props.requestBootstrap ? (
    <Suspense fallback={<NativeLocalePreferencesProvider {...props} requestPending />}>
      <CarsNativeBootstrapProvider {...props} />
    </Suspense>
  ) : <NativeLocalePreferencesProvider {...props} />;
}
