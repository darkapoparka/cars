import type { MetadataRoute } from "next";

/** Branch-review demo; publication is a separate coordinator task. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
