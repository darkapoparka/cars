import type { Metadata } from "next";
export type PublicSearchParams = Record<string, string | string[] | undefined>;
const hasSearchCriteria = (searchParams?: PublicSearchParams): boolean =>
  Object.values(searchParams ?? {}).some((value) =>
    Array.isArray(value)
      ? value.some((entry) => entry.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

export const getPublicSearchRobots = (
  searchParams?: PublicSearchParams
): Metadata["robots"] | undefined =>
  hasSearchCriteria(searchParams)
    ? {
        follow: true,
        index: false,
      }
    : undefined;

