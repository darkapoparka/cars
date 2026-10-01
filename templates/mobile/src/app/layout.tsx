import type { Metadata, Viewport } from 'next';
import { AppShell } from '@/components/AppShell';
import './globals.css';
export const metadata: Metadata = {
  title: 'Mobile — Cars template',
  description:
    'Cars Mobile template based on the mobile.de Android interface. Local demonstration with reference inventory.',
  robots: { index: false, follow: false },
  applicationName: 'Cars Mobile',
  icons: { icon: '/images/logo.png', shortcut: '/images/logo.png' },
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
