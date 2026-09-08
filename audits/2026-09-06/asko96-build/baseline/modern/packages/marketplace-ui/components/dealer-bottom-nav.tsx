"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@repo/design-system/components/ui/drawer";
import { cn } from "@repo/design-system/lib/utils";
import {
  buildMarketplaceSearchHref,
  defaultVehicleCategory,
  getCategoryPath,
  leadSite,
  type MarketplaceSearchParams,
} from "@repo/marketplace";
import {
  BookOpen,
  CarFront,
  ChevronRight,
  CircleDollarSign,
  CirclePercent,
  Globe,
  Heart,
  Info,
  MapPinned,
  Menu,
  PhoneCall,
  Plus,
  Store,
  Tag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getMarketplaceControlCopy } from "../lib/marketplace-control-copy";
import { isBuyMarketplaceCategory } from "../lib/marketplace-navigation";
import { getLocalizedPublicPath } from "../lib/public-path";
import { DealerMobileBrandBar } from "./dealer-mobile-brand-bar";
import { DealerSocialLinks } from "./dealer-social-links";
import type { MarketplaceMode } from "./marketplace-masthead";
import { mobileMarketplaceDrawerIconActionClassName } from "./mobile-marketplace-drawer";

const getDealerNavigationItemClassName = (active: boolean) =>
  cn(
    "relative flex min-h-[60px] min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[12px] leading-4 transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
    active
      ? "font-semibold text-[var(--lead-site-accent)]"
      : "font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 active:bg-zinc-100"
  );

export const DealerBottomNav = ({
  activeMode,
  locale,
}: {
  activeMode?: MarketplaceMode | null;
  locale?: string;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const navigationLabel = isBg
    ? "Навигация на автокъщата"
    : "Dealership navigation";
  const items = [
    {
      active: activeMode === "buy",
      href: buildMarketplaceSearchHref(
        { category: defaultVehicleCategory },
        getLocalizedPublicPath(locale, getCategoryPath(defaultVehicleCategory))
      ),
      icon: CarFront,
      label: isBg ? "Коли" : "Cars",
    },
    {
      active: activeMode === "imports",
      href: getLocalizedPublicPath(locale, "/imports"),
      icon: Globe,
      label: isBg ? "Внос" : "Import",
    },
    {
      active: activeMode === "sell",
      href: getLocalizedPublicPath(locale, "/sell"),
      icon: Tag,
      label: isBg ? "Продай" : "Sell",
    },
    {
      active: activeMode === "lease",
      href: getLocalizedPublicPath(locale, "/lease"),
      icon: CirclePercent,
      label: isBg ? "Лизинг" : "Lease",
    },
  ];
  const menuLabel = isBg ? "Меню" : "Menu";
  const secondaryMenuItems = [
    {
      href: getLocalizedPublicPath(locale, "/cars"),
      icon: CarFront,
      label: isBg ? "Всички автомобили" : "All vehicles",
    },
    {
      href: getLocalizedPublicPath(locale, "/guides"),
      icon: BookOpen,
      label: isBg ? "Съвети за покупка" : "Buying guides",
    },
    {
      href: getLocalizedPublicPath(locale, "/contact"),
      icon: Info,
      label: isBg ? "За нас и контакти" : "About and contact",
    },
  ];

  return (
    <>
      <nav
        aria-label={navigationLabel}
        className="fixed inset-x-0 bottom-0 z-40 border-zinc-200/70 border-t bg-white lg:hidden"
        data-slot="dealer-bottom-nav"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid min-h-[60px] max-w-lg grid-cols-5 px-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const visuallyActive = item.active && !menuOpen;

            return (
              <Link
                aria-current={item.active ? "page" : undefined}
                className={getDealerNavigationItemClassName(visuallyActive)}
                href={item.href}
                key={item.label}
              >
                <span className="grid h-7 w-10 place-items-center">
                  <Icon
                    aria-hidden="true"
                    className="size-[22px]"
                    strokeWidth={visuallyActive ? 2.2 : 1.8}
                  />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
          <button
            aria-controls="dealer-mobile-menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className={getDealerNavigationItemClassName(
              menuOpen || !activeMode
            )}
            onClick={() => setMenuOpen(true)}
            ref={menuTriggerRef}
            type="button"
          >
            <span className="grid h-7 w-10 place-items-center">
              <Menu
                aria-hidden="true"
                className="size-[22px]"
                strokeWidth={menuOpen || !activeMode ? 2.2 : 1.8}
              />
            </span>
            <span className="whitespace-nowrap">{menuLabel}</span>
          </button>
        </div>
      </nav>

      <Drawer modal onOpenChange={setMenuOpen} open={menuOpen}>
        <DrawerContent
          className="!bg-white mx-auto h-[calc(100dvh-max(0.75rem,env(safe-area-inset-top))-7rem)] max-w-lg overflow-hidden border-0 data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[calc(100dvh-max(0.75rem,env(safe-area-inset-top)))] data-[vaul-drawer-direction=bottom]:rounded-t-3xl"
          data-slot="dealer-mobile-menu"
          id="dealer-mobile-menu"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() =>
              menuTriggerRef.current?.focus({ preventScroll: true })
            );
          }}
        >
          <DrawerHeader className="shrink-0 px-5 pt-4 pb-4">
            <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3">
              <div>
                <DrawerTitle className="sr-only">{menuLabel}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {leadSite.name}
                </DrawerDescription>
              </div>
              <DealerMobileBrandBar
                isBg={isBg}
                locale={locale}
                onNavigate={() => setMenuOpen(false)}
                tone="clean"
                wordmarkTone="dark"
              />
              <Button
                aria-label={isBg ? "Затвори менюто" : "Close menu"}
                className={cn(
                  mobileMarketplaceDrawerIconActionClassName,
                  "bg-zinc-100"
                )}
                onClick={() => setMenuOpen(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-[18px]" />
              </Button>
            </div>
          </DrawerHeader>

          <div
            className="no-scrollbar min-h-0 overflow-y-auto overscroll-contain px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            data-slot="dealer-mobile-menu-body"
          >
            <div
              className="grid grid-cols-2 gap-3"
              data-slot="dealer-mobile-menu-primary-actions"
            >
              <a
                className="flex min-h-20 min-w-0 flex-col items-start justify-center gap-1.5 rounded-xl bg-[var(--lead-site-accent)] px-3.5 py-3 text-white transition-colors hover:bg-[var(--lead-site-accent-hover)] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:bg-[var(--lead-site-accent-hover)]"
                href={leadSite.phoneHref}
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center gap-2 font-semibold text-[14px] leading-5">
                  <PhoneCall
                    aria-hidden="true"
                    className="size-[18px]"
                    strokeWidth={1.8}
                  />
                  <span>{isBg ? "Обадете се" : "Call now"}</span>
                </span>
                <span className="text-[13px] tabular-nums leading-4">
                  {leadSite.phoneDisplay}
                </span>
              </a>
              <a
                className="flex min-h-20 min-w-0 flex-col items-start justify-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-3 text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:bg-zinc-200"
                href={leadSite.mapsUrl}
                onClick={() => setMenuOpen(false)}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex items-center gap-2 font-semibold text-[14px] leading-5">
                  <MapPinned
                    aria-hidden="true"
                    className="size-[18px]"
                    strokeWidth={1.8}
                  />
                  <span>{isBg ? "Локация" : "Location"}</span>
                </span>
                <span className="text-[13px] text-zinc-600 leading-4">
                  {isBg ? leadSite.city : "Sofia"}
                </span>
              </a>
            </div>

            <nav
              aria-label={isBg ? "Още страници" : "More pages"}
              className="mt-4 grid gap-2"
              data-slot="dealer-mobile-menu-secondary-nav"
            >
              {secondaryMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className="flex min-h-14 items-center gap-3 rounded-xl bg-zinc-100 px-4 font-semibold text-[15px] text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:bg-zinc-200"
                    href={item.href}
                    key={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-5 shrink-0 text-zinc-600"
                      strokeWidth={1.8}
                    />
                    <span className="min-w-0 flex-1 py-3">{item.label}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-zinc-400"
                    />
                  </Link>
                );
              })}
            </nav>
            <DealerSocialLinks isBg={isBg} links={leadSite.socialLinks} />
            <p className="mt-4 text-[13px] text-zinc-600 leading-5">
              {leadSite.address}
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const BottomMarketplaceNav = ({
  appBaseUrl,
  filters,
  locale,
}: {
  appBaseUrl: string;
  filters: MarketplaceSearchParams;
  locale?: string;
}) => {
  const copy = getMarketplaceControlCopy(locale);

  if (leadSite.staticDemoMode) {
    return (
      <DealerBottomNav
        activeMode={filters.category === "lease" ? "lease" : "buy"}
        locale={locale}
      />
    );
  }

  const items = [
    {
      href: buildMarketplaceSearchHref(
        { category: defaultVehicleCategory },
        getLocalizedPublicPath(locale, getCategoryPath(defaultVehicleCategory))
      ),
      icon: Store,
      label: copy.bottomNav.buy,
      active: isBuyMarketplaceCategory(filters.category),
    },
    {
      href: buildMarketplaceSearchHref(
        { category: "lease" },
        getLocalizedPublicPath(locale, getCategoryPath("lease"))
      ),
      icon: CircleDollarSign,
      label: copy.bottomNav.lease,
      active: filters.category === "lease",
    },
    {
      href: getLocalizedPublicPath(locale, "/sell"),
      icon: Plus,
      label: copy.bottomNav.sell,
      active: false,
    },
    {
      href: appBaseUrl ? `${appBaseUrl}/saved` : "/saved",
      icon: Heart,
      label: copy.bottomNav.saved,
      active: false,
    },
    {
      href: appBaseUrl ? `${appBaseUrl}/account` : "/account",
      icon: User,
      label: copy.bottomNav.account,
      active: false,
    },
  ];

  return (
    <nav
      aria-label={copy.bottomNav.navigation}
      className="fixed right-0 bottom-0 left-0 z-40 border-border border-t bg-background/95 backdrop-blur-xl lg:hidden"
      data-slot="marketplace-bottom-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex min-h-14 max-w-lg items-center px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 font-medium text-micro transition-colors",
                item.active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon
                className="h-5 w-5"
                fill={item.active ? "currentColor" : "none"}
                strokeWidth={item.active ? 2.5 : 1.7}
              />
              <span className="max-w-full text-center leading-tight [overflow-wrap:anywhere]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
