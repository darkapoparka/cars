import type { Metadata, Viewport } from 'next';
import { AppShell } from '@/components/AppShell';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Cars — Your showroom', template: '%s — Your showroom' },
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
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
