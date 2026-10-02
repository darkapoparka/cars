export interface Filters {
  q: string;
  make: string;
  model: string;
  body: string;
  fuel: string;
  condition: string;
  min: string;
  max: string;
  year: string;
  sort: string;
  page: number;
}
export const emptyFilters: Filters = {
  q: "",
  make: "",
  model: "",
  body: "",
  fuel: "",
  condition: "",
  min: "",
  max: "",
  year: "",
  sort: "recommended",
  page: 1,
};
const finite = (text: string) =>
  text.trim() !== "" && Number.isFinite(Number(text)) && Number(text) >= 0;
export function parseFilters(search: string): Filters {
  const params = new URLSearchParams(search);
  const filters = { ...emptyFilters };
  for (const key of [
    "q",
    "make",
    "model",
    "body",
    "fuel",
    "condition",
    "min",
    "max",
    "year",
    "sort",
  ] as const)
    filters[key] =
      params.get(key) ?? params.get(`filter-${key}`) ?? filters[key];
  for (const key of ["min", "max", "year"] as const)
    if (!finite(filters[key])) filters[key] = "";
  if (
    !["recommended", "price-low", "price-high", "newest", "mileage"].includes(
      filters.sort,
    )
  )
    filters.sort = "recommended";
  filters.page = Math.max(1, Math.floor(Number(params.get("page")) || 1));
  return filters;
}
export function filterQuery(filters: Partial<Filters>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== "" &&
      value != null &&
      value !== emptyFilters[key as keyof Filters]
    )
      params.set(key, String(value));
  }
  return params.size ? `?${params}` : "";
}
export function filterVehicles<
  T extends {
    title: string;
    make: string;
    model: string;
    body: string;
    fuel: string;
    condition: string;
    price: number;
    year: number;
    mileage: number;
  },
>(items: T[], filters: Filters): T[] {
  const equal = (a: string, b: string) =>
    !b || a.toLowerCase() === b.toLowerCase();
  const needle = filters.q.toLowerCase().trim();
  const results = items.filter(
    (v) =>
      (!needle ||
        `${v.title} ${v.make} ${v.model} ${v.year}`
          .toLowerCase()
          .includes(needle)) &&
      equal(v.make, filters.make) &&
      equal(v.model, filters.model) &&
      equal(v.body, filters.body) &&
      equal(v.fuel, filters.fuel) &&
      equal(v.condition, filters.condition) &&
      (!finite(filters.min) || v.price >= Number(filters.min)) &&
      (!finite(filters.max) || v.price <= Number(filters.max)) &&
      (!finite(filters.year) || v.year >= Number(filters.year)),
  );
  if (filters.sort === "price-low") results.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-high") results.sort((a, b) => b.price - a.price);
  if (filters.sort === "newest") results.sort((a, b) => b.year - a.year);
  if (filters.sort === "mileage") results.sort((a, b) => a.mileage - b.mileage);
  return results;
}
export type LoanResult = {
  principal: number;
  monthly: number;
  interest: number;
  total: number;
  months: number;
};
export function calculateLoan(
  price: number,
  deposit: number,
  apr: number,
  months: number,
): LoanResult | { error: string } {
  if (
    ![price, deposit, apr, months].every(Number.isFinite) ||
    price <= 0 ||
    deposit < 0 ||
    deposit > price ||
    apr < 0 ||
    apr > 100 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 360
  )
    return {
      error:
        "Enter a positive price and term, an APR between 0 and 100%, and a deposit no greater than the price.",
    };
  const principal = price - deposit;
  const rate = apr / 1200;
  const monthly =
    rate === 0
      ? principal / months
      : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  return {
    principal,
    monthly,
    interest: Math.max(0, monthly * months - principal),
    total: monthly * months + deposit,
    months,
  };
}
export function safeReturn(value: string | null) {
  if (value === "/") return "/";
  if (
    !value ||
    !/^\/(inventory|listings|favorites|home-\d+)(\/|\?|$)/.test(value) ||
    value.startsWith("//")
  )
    return "/inventory/";
  return value;
}
export function validatedIds(value: unknown, valid: string[]): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter((id) => typeof id === "string" && valid.includes(id)),
        ),
      ]
    : [];
}
