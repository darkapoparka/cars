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
export async function generateMetadata(): Promise<Metadata> {
  const tx = await getCopy();
  return {title: {default: showroom.name, template: `%s · ${showroom.name}`},
    description: tx(dealer.previewNotice), applicationName: showroom.name,
    robots: {index: false, follow: false}, manifest: assetPath('/manifest.webmanifest'),
    icons: {icon: assetPath(dealer.logo.icon), apple: assetPath(dealer.logo.icon)}};
}
export const viewport: Viewport = {width: 'device-width', initialScale: 1,
  themeColor: '#ffffff', colorScheme: 'light'};
export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const locale = await getLocale();
  return <html lang={locale}><head>
    {basePath ? <script defer src="/preview-switcher.js"/> : null}
  </head><body data-cars-app="true" {...stylex.props(showroom.bannerTheme === 'blue' && blueCampaignTheme)}>
    <LocaleProvider locale={locale}><AppShell>{children}</AppShell></LocaleProvider>
  </body></html>;
}
