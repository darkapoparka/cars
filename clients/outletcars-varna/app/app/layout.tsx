import type {Metadata, Viewport} from 'next';
import './app.css';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {assetPath, basePath} from '@/lib/paths';
import {LocaleProvider} from '@/lib/locale';
import {getLocale, getCopy} from '@/lib/locale-server';
import AppShell from '@/components/AppShell';
import * as stylex from '@stylexjs/stylex';
import {blueCampaignTheme} from './campaign-theme.stylex';
import {bulgarianTypography} from './tokens.stylex';
import {typography} from './typography.stylex';
export async function generateMetadata(): Promise<Metadata> {
  const tx = await getCopy();
  return {title: {default: showroom.name, template: `%s · ${showroom.name}`},
    description: tx(dealer.previewNotice), applicationName: showroom.name,
    robots: {index: false, follow: false}, manifest: assetPath('/manifest.webmanifest')};
}
export const viewport: Viewport = {width: 'device-width', initialScale: 1,
  themeColor: '#ffffff', colorScheme: 'light'};
export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const locale = await getLocale();
  return <html lang={locale}><head>
    <link rel="icon" href={assetPath(dealer.logo.icon)}/>
    <link rel="apple-touch-icon" href={assetPath(dealer.logo.icon)}/>
    {basePath && process.env.CARS_PREVIEW_SWITCHER !== '0' ? <script defer src="/preview-switcher.js"/> : null}
  </head><body data-cars-app="true" {...stylex.props(typography.base, showroom.bannerTheme === 'blue' && blueCampaignTheme, locale === 'bg' && bulgarianTypography)}>
    <LocaleProvider locale={locale}><AppShell>{children}</AppShell></LocaleProvider>
  </body></html>;
}
