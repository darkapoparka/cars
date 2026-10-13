export type PublicLocale = 'en' | 'bg';
export type SiteLocaleConfig = {
	default: PublicLocale;
	supported: readonly PublicLocale[];
	currency: string;
	country: string;
	formatLocales: Record<PublicLocale, string>;
	suggestedLanguages: Readonly<Partial<Record<string, PublicLocale>>>;
	preferenceMaxAge: number;
	promptVersion: string;
};
