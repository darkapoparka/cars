import type { LocaleState } from '$lib/locale/core';
declare global { namespace App { interface Locals { localeState: LocaleState; } interface PageData { localeState?: LocaleState; } } }
export {};
