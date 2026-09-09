import "./styles.css";
import "./mobile-final-polish.css";
import "./desktop-header.css";
import { analyticsConsentBootstrapScript } from "@repo/analytics";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { Toaster } from "@repo/design-system/components/ui/sonner";
import { TooltipProvider } from "@repo/design-system/components/ui/tooltip";
import { cn } from "@repo/design-system/lib/utils";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import { isLocale, locales, normalizeLocale } from "@repo/internationalization";
import { leadSite } from "@repo/marketplace";
import { getLocalizedPath } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import { MobileFinancingInterceptor } from "./components/mobile-financing-interceptor";
import { MobileVisibleViewport } from "./components/mobile-visible-viewport";

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

const publicSans = Inter({
  display: "swap",
  subsets: ["cyrillic", "latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  applicationName: leadSite.name,
  robots: { index: false, follow: false },
  icons: {
    icon: [{ type: "image/svg+xml", url: leadSite.logoPath }],
  },
  metadataBase: new URL(getPublicWebBaseUrl()),
};

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const normalizedLocale = normalizeLocale(locale);

  return (
    <html
      className={cn(
        publicSans.className,
        publicSans.variable,
        "touch-manipulation scroll-smooth subpixel-antialiased"
      )}
      data-scroll-behavior="smooth"
      lang={normalizedLocale}
      style={
        {
          "--lead-site-accent": leadSite.accent,
          "--lead-site-accent-active":
            "color-mix(in srgb, var(--lead-site-accent) 68%, black)",
          "--lead-site-accent-bright":
            "color-mix(in srgb, var(--lead-site-accent) 82%, white)",
          "--lead-site-accent-hover":
            "color-mix(in srgb, var(--lead-site-accent) 82%, black)",
          "--lead-site-accent-ring":
            "color-mix(in srgb, var(--lead-site-accent) 55%, transparent)",
          "--lead-site-accent-soft":
            "color-mix(in srgb, var(--lead-site-accent) 9%, white)",
        } as CSSProperties
      }
      suppressHydrationWarning
    >
      <head>
        {leadSite.staticDemoMode ? null : (
          <script id="analytics-consent-bootstrap">
            {analyticsConsentBootstrapScript}
          </script>
        )}
      </head>
      <body>
        <p role="note" style={{margin:0,padding:"10px 16px",textAlign:"center",fontSize:13,background:"#f3f4f6",color:"#374151"}}>Неофициално демо. Обяви към 09.09.2026. Снимките и финалната марка очакват одобрение. Запитванията не се изпращат.</p>
        <MobileVisibleViewport />
        <ThemeProvider>
          {leadSite.staticDemoMode ? (
            <TooltipProvider>{children}</TooltipProvider>
          ) : (
            <AnalyticsProvider
              locale={normalizedLocale}
              privacyHref={getLocalizedPath(normalizedLocale, "/legal/privacy")}
              vercelAnalyticsEnabled={Boolean(process.env.VERCEL)}
            >
              <TooltipProvider>{children}</TooltipProvider>
            </AnalyticsProvider>
          )}
          <MobileFinancingInterceptor locale={normalizedLocale} />
          <Toaster />
        </ThemeProvider>
        {leadSite.staticDemoMode ||
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_AUTOMARKET_PUBLIC_E2E === "true" ? null : (
          <Toolbar />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
