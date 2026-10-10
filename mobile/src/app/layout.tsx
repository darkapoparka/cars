import {dealerShareMetadata} from "../lib/cars-dealer-share";
import type { Metadata, Viewport } from 'next';
import * as stylex from '@stylexjs/stylex';
import { AppShell } from '@/components/AppShell';
import { colors } from '@/styles/tokens.stylex';
import { showroomMetadata } from '@/lib/showroom-config';
import './globals.css';
const s = stylex.create({
  canvas: {
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 700px)': colors.stripe,
    },
  },
});
const carsOriginalMetadata: Metadata = {...showroomMetadata(), icons: {
  icon: [{url: "/variant-5/dealer-brand/app-icon.png", type: "image/png"}],
  apple: [{url: "/variant-5/dealer-brand/app-icon.png", type: "image/png"}],
}, manifest: "/variant-5/dealer-brand/site.webmanifest"};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" {...stylex.props(s.canvas)}>
      <head><script defer src="/preview-switcher.js" /></head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  return dealerShareMetadata(carsOriginalMetadata);
}
