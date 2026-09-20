/**
 * Framework-neutral locale routing and preference policy.
 * No DOM, filesystem, geolocation service, business writes or visitor-global state.
 * Registering a language here does NOT release it in any application.
 */
export declare const languageRegistry: Readonly<{
    readonly en: Readonly<{
        name: "English";
        direction: "ltr";
        formatLocale: "en";
    }>;
    readonly bg: Readonly<{
        name: "Български";
        direction: "ltr";
        formatLocale: "bg-BG";
    }>;
    readonly ar: Readonly<{
        name: "العربية";
        direction: "rtl";
        formatLocale: "ar-AE";
    }>;
    readonly de: Readonly<{
        name: "Deutsch";
        direction: "ltr";
        formatLocale: "de-DE";
    }>;
    readonly uk: Readonly<{
        name: "Українська";
        direction: "ltr";
        formatLocale: "uk-UA";
    }>;
    readonly tr: Readonly<{
        name: "Türkçe";
        direction: "ltr";
        formatLocale: "tr-TR";
    }>;
    readonly ro: Readonly<{
        name: "Română";
        direction: "ltr";
        formatLocale: "ro-RO";
    }>;
    readonly el: Readonly<{
        name: "Ελληνικά";
        direction: "ltr";
        formatLocale: "el-GR";
    }>;
}>;
export type Language = keyof typeof languageRegistry;
export type Direction = 'ltr' | 'rtl';
export declare const isKnownLanguage: (value: unknown) => value is Language;
export declare const countries: readonly string[];
export declare const isCountry: (value: unknown) => value is string;
export interface LocaleConfiguration<L extends Language> {
    readonly schemaVersion: 1;
    readonly dealerId: string;
    readonly dealerName: string;
    readonly defaultLocale: L;
    readonly enabledLocales: readonly L[];
    readonly dealerCountry: string;
    readonly inventoryCurrency: string;
    readonly formatLocales: Readonly<Record<L, string>>;
    readonly preferenceMaxAge: number;
    readonly promptVersion: string;
    /** Optional approximate suggestions, never a substitute for an explicit preference. */
    readonly suggestedLanguages: Readonly<Partial<Record<string, L>>>;
}
export interface ResolvedLocale<L extends Language> {
    locale: L;
    country: string;
    suggestedCountry: string;
    promptDismissed: boolean;
    source: 'url' | 'cookie' | 'header' | 'country' | 'default';
}
export interface LocaleInput {
    readonly url: URL;
    readonly cookie?: string | null;
    readonly acceptLanguage?: string | null;
    /** Populate only from the trusted hosting adapter; never from URL/user input. */
    readonly trustedCountry?: string | null;
}
export declare function createLocaleRouting<const L extends Language>(input: LocaleConfiguration<L>): Readonly<{
    contract: Readonly<{
        enabledLocales: readonly L[];
        directions: Readonly<Record<L, Direction>>;
        languageNames: Readonly<Record<L, string>>;
        formatLocales: Readonly<Readonly<Record<L, string>>>;
        suggestedLanguages: Readonly<{
            [x: string]: L | undefined;
        }>;
        disabledLocales: readonly ("en" | "bg" | "ar" | "de" | "uk" | "tr" | "ro" | "el")[];
        schemaVersion: 1;
        dealerId: string;
        dealerName: string;
        defaultLocale: L;
        dealerCountry: string;
        inventoryCurrency: string;
        preferenceMaxAge: number;
        promptVersion: string;
    }>;
    countries: readonly string[];
    isCountry: (value: unknown) => value is string;
    isLocale: (value: unknown) => value is L;
    intlLocale: (locale: L) => Readonly<Readonly<Record<L, string>>>[L];
    formatPrice: (value: number, locale: L) => string;
    routeParts: (pathname: string) => {
        base: string;
        locale: L | null;
        path: string;
        first: string;
    };
    isResource: (pathname: string) => boolean;
    unsupportedLocale: (pathname: string) => boolean;
    localeHref: (href: string, locale: L, defaultBase?: string) => string;
    safeReturnPath: (value: unknown, origin: string) => string | null;
}>;
/** Reject ambiguous duplicate preferences instead of guessing a cookie path's precedence. */
export declare function cookieValue(header: string | null | undefined, name: string): string | null;
export declare function privateHeaders(locale?: string): Headers;
/** Create a dealer policy, not a visitor singleton. Each resolution returns a new state. */
export declare function createLocalePolicy<const L extends Language>(configuration: LocaleConfiguration<L>): Readonly<{
    preferredLanguage: (header: string | null | undefined) => L | null;
    resolveLocale: (input: LocaleInput) => ResolvedLocale<L>;
    preferenceResponse: (request: Request) => Promise<Response>;
    contract: Readonly<{
        enabledLocales: readonly L[];
        directions: Readonly<Record<L, Direction>>;
        languageNames: Readonly<Record<L, string>>;
        formatLocales: Readonly<Readonly<Record<L, string>>>;
        suggestedLanguages: Readonly<{
            [x: string]: L | undefined;
        }>;
        disabledLocales: readonly ("en" | "bg" | "ar" | "de" | "uk" | "tr" | "ro" | "el")[];
        schemaVersion: 1;
        dealerId: string;
        dealerName: string;
        defaultLocale: L;
        dealerCountry: string;
        inventoryCurrency: string;
        preferenceMaxAge: number;
        promptVersion: string;
    }>;
    countries: readonly string[];
    isCountry: (value: unknown) => value is string;
    isLocale: (value: unknown) => value is L;
    intlLocale: (locale: L) => Readonly<Readonly<Record<L, string>>>[L];
    formatPrice: (value: number, locale: L) => string;
    routeParts: (pathname: string) => {
        base: string;
        locale: L | null;
        path: string;
        first: string;
    };
    isResource: (pathname: string) => boolean;
    unsupportedLocale: (pathname: string) => boolean;
    localeHref: (href: string, locale: L, defaultBase?: string) => string;
    safeReturnPath: (value: unknown, origin: string) => string | null;
}>;
