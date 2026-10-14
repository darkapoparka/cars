import { listingProducts, type ListingProduct } from "./vehicle-listing.ts";

/** Reference catalogue selection; this is not live stock or a checkout record. */
export function selectedReferenceProduct(
  parameters: Pick<URLSearchParams, "get">,
): ListingProduct {
  return (
    listingProducts.find(
      (product) => product.id === parameters.get("product"),
    ) ?? listingProducts[0]
  );
}

export function referenceProductDestination(product: ListingProduct): string {
  const hashIndex = product.href.indexOf("#");
  const hash = hashIndex < 0 ? "" : product.href.slice(hashIndex);
  const destination =
    hashIndex < 0 ? product.href : product.href.slice(0, hashIndex);
  const queryIndex = destination.indexOf("?");
  const pathname =
    queryIndex < 0 ? destination : destination.slice(0, queryIndex);
  const parameters = new URLSearchParams(
    queryIndex < 0 ? "" : destination.slice(queryIndex + 1),
  );
  parameters.set("product", product.id);
  return pathname + "?" + parameters.toString() + hash;
}

export function hasReferenceDiscount(product: ListingProduct): boolean {
  const amount = (value: string) => Number(value.replace(/[^\d.]/g, ""));
  return amount(product.originalPrice) > amount(product.price);
}
