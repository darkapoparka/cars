import { attachLocalizedValidation } from './validation';
import { getContext, setContext } from 'svelte';
import { page } from '$app/state';
import { localeHref, resolveLocale, routeParts, type LocaleState } from './core';
import { message, templateText, dealerLabel, type DealerTextField, type MessageKey, type MessageParameters } from './messages';
const localeContext = Symbol('cars.locale.v1');
const localeFocusContext = Symbol('cars.locale.focus.v1');
type LocaleReader = () => LocaleState;
export function setLocaleContext(reader: LocaleReader) { setContext(localeContext, reader); setContext(localeFocusContext, new Set<HTMLElement>()); }
export function getI18n() {
  const focusTargets = getContext<Set<HTMLElement> | undefined>(localeFocusContext) ?? new Set<HTMLElement>();
  const reader = getContext<LocaleReader | undefined>(localeContext);
  const state = () => reader?.() ?? (page.data as { localeState?: LocaleState }).localeState ?? resolveLocale({ url: page.url });
  return {
    registerFocusTarget: (node: HTMLElement) => { focusTargets.add(node); return () => { focusTargets.delete(node); }; },
    restoreFocus: () => {
      [...focusTargets].find(node => {
        const rect = node.getBoundingClientRect();
        return node.isConnected && rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= innerHeight;
      })?.focus({ preventScroll: true });
    },
    validation: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => attachLocalizedValidation(node, () => state().locale),
    // Reactive constraint arguments recreate the attachment and clear only its owned errors.
    validationFor: (..._constraints: unknown[]) => (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => attachLocalizedValidation(node, () => state().locale),
    get locale() { return state().locale; },
    get state() { return state(); },
    t: (key: MessageKey, parameters?: MessageParameters) => message(state().locale, key, parameters),
    dealer: (field: DealerTextField) => dealerLabel(state().locale, field),
    text: <T>(value: T): T => templateText(state().locale, value),
    href: (value: string) => localeHref(value, state().locale, routeParts(page.url.pathname).base)
  };
}
export function applicationUrl(url: URL): URL {
  const result = new URL(url); const parts = routeParts(result.pathname);
  result.pathname = parts.base + parts.path;
  return result;
}
