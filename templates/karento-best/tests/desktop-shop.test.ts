import assert from "node:assert/strict";
import test from "node:test";
import {
  desktopShopDestination,
  matchDesktopShop,
  readDesktopShopFilters,
  shopFilterLabel,
} from "../src/lib/data/desktop-shop.ts";
import {
  availableShopBrands,
  availableShopCategories,
  withShopReferenceFacets,
} from "../src/lib/data/shop-reference-facets.ts";
import { listingProducts } from "../src/lib/data/vehicle-listing.ts";

test("shop filter labels localize the UI without translating machine values or converting dollars", () => {
  assert.equal(
    shopFilterLabel("category", "wheels-tires", "bg"),
    "Джанти и гуми",
  );
  assert.equal(shopFilterLabel("minPrice", "25", "bg"), "От $25");
  assert.equal(shopFilterLabel("budget", "50", "bg"), "До $50");
  assert.equal(shopFilterLabel("brand", "Mobil", "bg"), "Mobil");
  assert.equal(
    shopFilterLabel("category", "custom-category", "bg"),
    "custom-category",
  );
});
import {
  hasReferenceDiscount,
  referenceProductDestination,
  selectedReferenceProduct,
} from "../src/lib/data/shop-mobile.ts";

test("shop keywords combine case-insensitive terms with actual price bounds", () => {
  const products = [
    { title: "Synthetic Motor Oil", price: "$1,200.50" },
    { title: "Motor Oil Conventional", price: "$30.00" },
    { title: "Synthetic Brake Fluid", price: "$40.00" },
    { title: "Synthetic Motor Oil Unknown", price: "Not supplied" },
  ];
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(
        new URLSearchParams("q=MOTOR+synthetic&minPrice=1000&budget=1300"),
      ),
    ),
    [products[0]],
  );
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(new URLSearchParams("budget=0")),
    ),
    [],
  );
});

test("price and name sorting retain the filtered collection and equal-price order", () => {
  const products = [
    { title: "C oil", price: "$80.00" },
    { title: "B oil", price: "$40.00" },
    { title: "A oil", price: "$40.00" },
    { title: "Other part", price: "$20.00" },
  ];
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(new URLSearchParams("q=oil&sort=price-asc")),
    ),
    [products[1], products[2], products[0]],
  );
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(new URLSearchParams("q=oil&sort=price-desc")),
    ),
    [products[0], products[1], products[2]],
  );
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(new URLSearchParams("q=oil&sort=name-asc")),
    ),
    [products[2], products[1], products[0]],
  );
});

test("invalid bounds and unsupported sorts cannot silently exclude the collection", () => {
  const filters = readDesktopShopFilters(
    new URLSearchParams("minPrice=-1&budget=Infinity&sort=most-viewed&q=++"),
  );
  assert.deepEqual(filters, {
    q: "",
    category: "",
    brand: "",
    minPrice: "",
    budget: "",
    sort: "",
  });
  assert.deepEqual(matchDesktopShop(listingProducts, filters), listingProducts);
});

test("applying, removing and clearing shop filters preserves unrelated query and fragment state", () => {
  const parameters = new URLSearchParams(
    "q=Oil&category=oil-fluids&brand=Mobil&minPrice=20&budget=100&sort=price-desc&campaign=shop&filters=open",
  );
  const filters = readDesktopShopFilters(parameters);
  const applied = new URL(
    desktopShopDestination(
      "/shop",
      { ...filters, q: "Dash cam" },
      parameters,
      "#shop-results",
    ),
    "http://localhost",
  );
  assert.equal(applied.searchParams.get("campaign"), "shop");
  assert.equal(applied.searchParams.get("q"), "Dash cam");
  assert.equal(applied.searchParams.get("category"), "oil-fluids");
  assert.equal(applied.searchParams.get("brand"), "Mobil");
  assert.equal(applied.searchParams.has("filters"), false);
  assert.equal(applied.hash, "#shop-results");
  const removed = new URL(
    desktopShopDestination("/shop", { ...filters, budget: "" }, parameters),
    "http://localhost",
  );
  assert.equal(removed.searchParams.has("budget"), false);
  assert.equal(removed.searchParams.get("minPrice"), "20");
  assert.equal(removed.searchParams.get("sort"), "price-desc");
  assert.equal(
    desktopShopDestination(
      "/shop",
      readDesktopShopFilters(new URLSearchParams()),
      parameters,
    ),
    "/shop?campaign=shop",
  );
});

test("shop facets intersect with keyword and price filters using supplied product taxonomy", () => {
  const products = withShopReferenceFacets(listingProducts);
  const brakes = matchDesktopShop(
    products,
    readDesktopShopFilters(new URLSearchParams("category=brakes")),
  );
  assert.deepEqual(
    brakes.map((product) => product.id),
    [listingProducts[5].id, listingProducts[9].id],
  );
  const rotor = matchDesktopShop(
    products,
    readDesktopShopFilters(
      new URLSearchParams(
        "category=brakes&brand=right+stuff&q=drilled&minPrice=90&budget=100",
      ),
    ),
  );
  assert.deepEqual(rotor, [products[5]]);
  assert.deepEqual(
    matchDesktopShop(
      products,
      readDesktopShopFilters(
        new URLSearchParams("category=brakes&brand=Mobil"),
      ),
    ),
    [],
  );
  assert.equal(
    matchDesktopShop(
      products,
      readDesktopShopFilters(
        new URLSearchParams("category=oil-fluids&brand=Mobil"),
      ),
    ).length,
    4,
  );
  assert.equal(shopFilterLabel("category", "wheels-tires"), "Wheels & tires");
  assert.equal(
    readDesktopShopFilters(new URLSearchParams("category=__proto__")).category,
    "",
  );
});

test("facet choices come from the collection, preserve explicit metadata and omit missing metadata", () => {
  const products = withShopReferenceFacets(listingProducts);
  assert.equal(availableShopCategories(products).length, 5);
  assert.deepEqual(availableShopBrands(products, "brakes"), [
    "R1 Concepts",
    "Right Stuff",
  ]);
  assert.deepEqual(
    availableShopCategories([products[1]]).map((option) => option.value),
    ["electronics"],
  );
  const custom = withShopReferenceFacets([
    { ...listingProducts[0], category: "lighting" as const, brand: "Custom" },
  ]);
  assert.equal(custom[0].category, "lighting");
  assert.equal(custom[0].brand, "Custom");
  const unclassified = withShopReferenceFacets([
    { ...listingProducts[0], id: "new-product" },
  ]);
  assert.deepEqual(availableShopBrands(unclassified), []);
  assert.deepEqual(availableShopCategories(unclassified), []);
  assert.equal(listingProducts[0].title, products[0].title);
});

test("each reference product keeps its own detail selection without false discounts", () => {
  assert.equal(
    new Set(listingProducts.map(referenceProductDestination)).size,
    listingProducts.length,
  );
  for (const product of listingProducts) {
    const url = new URL(
      referenceProductDestination(product),
      "http://localhost",
    );
    assert.equal(url.pathname, "/shop/product");
    assert.equal(url.searchParams.get("product"), product.id);
    assert.equal(selectedReferenceProduct(url.searchParams), product);
    assert.equal(hasReferenceDiscount(product), false);
  }
});
