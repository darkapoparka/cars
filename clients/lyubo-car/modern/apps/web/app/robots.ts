import type { MetadataRoute } from "next";

// This entire independent client copy is a review demo, not a public dealer site.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
