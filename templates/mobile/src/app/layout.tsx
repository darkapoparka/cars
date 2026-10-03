import type { Metadata, Viewport } from 'next';
import * as stylex from '@stylexjs/stylex';
import { AppShell } from '@/components/AppShell';
import { colors } from '@/styles/tokens.stylex';
import './globals.css';
const s = stylex.create({ canvas: { backgroundColor: colors.background } });
export const metadata: Metadata = {
  title: { default: 'Коли — Вашият автосалон', template: '%s — Вашият автосалон' },
  description:
    'Browse cars, explore showroom services and contact the dealer. Showroom template with sample inventory.',
  robots: { index: false, follow: false },
  applicationName: 'Cars Mobile',
  icons: { icon: '/icons/native-vector/car.svg' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" {...stylex.props(s.canvas)}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
