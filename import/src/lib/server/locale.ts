import { createLocalePolicy } from '$lib/locale/policy';
import { localeConfiguration } from '$lib/locale/core';
const policy = createLocalePolicy(localeConfiguration);
export const { resolveLocale, preferenceResponse } = policy;
