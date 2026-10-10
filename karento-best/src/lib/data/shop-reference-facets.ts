import type { ListingProduct } from "./vehicle-listing.ts";

export const shopCategories = [
  {
    value: "oil-fluids",
    label: "Oil & fluids",
    labelKey: "reference.dynamic.shop-categories.oil-fluids.label",
  },
  {
    value: "electronics",
    label: "Electronics",
    labelKey: "reference.dynamic.shop-categories.electronics.label",
  },
  {
    value: "lighting",
    label: "Lighting",
    labelKey: "reference.dynamic.shop-categories.lighting.label",
  },
  {
    value: "wheels-tires",
    label: "Wheels & tires",
    labelKey: "reference.dynamic.shop-categories.wheels-tires.label",
  },
  {
    value: "brakes",
    label: "Brakes",
    labelKey: "reference.dynamic.shop-categories.brakes.label",
  },
] as const;

export type ShopCategory = (typeof shopCategories)[number]["value"];
export interface ShopProductFacets {
  category?: ShopCategory;
  brand?: string;
}
export type DesktopShopProduct = ListingProduct & ShopProductFacets;

// Sample taxonomy follows the supplied product titles. This is not stock or
// vehicle-fitment data; dealers supply their own facets alongside their catalogue.
const referenceFacets: Readonly<Record<string, Required<ShopProductFacets>>> = {
  "/variant-6/assets/imgs/shop/shop-list/product1.png": {
    category: "oil-fluids",
    brand: "Mobil",
  },
  "/variant-6/assets/imgs/shop/shop-list/product2.png": {
    category: "electronics",
    brand: "Thinkware",
  },
  "/variant-6/assets/imgs/shop/shop-list/product3.png": {
    category: "oil-fluids",
    brand: "Mobil",
  },
  "/variant-6/assets/imgs/shop/shop-list/product4.png": {
    category: "lighting",
    brand: "Spyder",
  },
  "/variant-6/assets/imgs/shop/shop-list/product5.png": {
    category: "wheels-tires",
    brand: "HRE",
  },
  "/variant-6/assets/imgs/shop/shop-list/product6.png": {
    category: "brakes",
    brand: "Right Stuff",
  },
  "/variant-6/assets/imgs/shop/shop-list/product7.png": {
    category: "wheels-tires",
    brand: "Pirelli",
  },
  "/variant-6/assets/imgs/shop/shop-list/product8.png": {
    category: "lighting",
    brand: "Lumen",
  },
  "/variant-6/assets/imgs/shop/shop-list/product9.png": {
    category: "oil-fluids",
    brand: "Shell",
  },
  "/variant-6/assets/imgs/shop/shop-list/product10.png": {
    category: "brakes",
    brand: "R1 Concepts",
  },
  "/variant-6/assets/imgs/shop/shop-list/product11.png": {
    category: "oil-fluids",
    brand: "Mobil",
  },
  "/variant-6/assets/imgs/shop/shop-list/product12.png": {
    category: "oil-fluids",
    brand: "Mobil",
  },
};

export function withShopReferenceFacets<
  T extends ListingProduct & ShopProductFacets,
>(products: readonly T[]): (T & ShopProductFacets)[] {
  return products.map((product) => ({
    ...referenceFacets[product.id],
    ...product,
  }));
}

export function availableShopCategories(
  products: readonly ShopProductFacets[],
) {
  return shopCategories.filter((option) =>
    products.some((product) => product.category === option.value),
  );
}

export function availableShopBrands(
  products: readonly ShopProductFacets[],
  category = "",
): string[] {
  return [
    ...new Set(
      products
        .filter((product) => !category || product.category === category)
        .map((product) => product.brand?.trim())
        .filter((brand): brand is string => !!brand),
    ),
  ].sort((a, b) => a.localeCompare(b));
}
