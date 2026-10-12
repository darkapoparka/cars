"use client";

import type { MarketplaceSearchParams, NativeMarketplaceInventory } from "@repo/marketplace";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import {
  getNativeMarketplaceRedirect,
  readNativeMarketplaceFilters,
  type NativeMarketplaceRoute,
} from "../lib/native-marketplace-inventory";

interface NativeMarketplaceQuerySyncProps {
  route: NativeMarketplaceRoute;
  inventory: NativeMarketplaceInventory;
  onChange: (filters: MarketplaceSearchParams) => void;
}

const NativeMarketplaceQueryObserver = ({ route, inventory, onChange }: NativeMarketplaceQuerySyncProps) => {
  const pathname = usePathname();
  const search = useSearchParams()?.toString();
  const router = useRouter();
  const callback = useRef(onChange);
  callback.current = onChange;
  const binding = JSON.stringify(route);
  useEffect(() => {
    const update = () => {
      const filters = readNativeMarketplaceFilters(window.location.href, route);
      if (!filters) return;
      const redirect = getNativeMarketplaceRedirect(window.location.href, route, inventory);
      if (redirect) {
        router.replace(redirect, { scroll: false });
        return;
      }
      callback.current(filters);
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [pathname, search, binding, inventory, router]);
  return null;
};

/** Only the explicit inventory opt-in subscribes to native query navigation. */
export const NativeMarketplaceQuerySync = (props: NativeMarketplaceQuerySyncProps) => (
  <Suspense fallback={null}>
    <NativeMarketplaceQueryObserver {...props} />
  </Suspense>
);
