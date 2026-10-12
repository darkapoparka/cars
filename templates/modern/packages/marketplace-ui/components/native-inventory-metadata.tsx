"use client";

import { useSearchParams } from "next/navigation";
import { getPublicSearchRobots } from "../../../apps/web/lib/native-public-search-metadata";

/** React owns this route metadata during native query navigation. The cheap
 * document path uses the same source rule and an actual native head receipt. */
export function NativeInventoryMetadata({ initialHref }: { initialHref: string }) {
  const search = useSearchParams();
  const url = new URL(initialHref);
  url.search = search.toString();
  const raw: Record<string, string | string[]> = {};
  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    Object.defineProperty(raw, key, { value: values.length === 1 ? values[0] : values,
      enumerable: true, configurable: true });
  }
  const robots = getPublicSearchRobots(raw);
  return robots ? <meta content="noindex, follow" data-native-inventory-metadata="robots" name="robots" /> : null;
}
