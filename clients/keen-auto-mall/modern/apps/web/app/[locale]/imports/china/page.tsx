import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPublicLocalizedMetadata } from "@/lib/public-metadata";
import { getPublicWebBaseUrl } from "@/lib/public-url";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const path = "/imports/china";

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const isBg = normalizeSeoLocale(locale) === "bg";

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: isBg
      ? "Започнете заявка за автомобил от Китай с доставка до България от Keen Auto Mall."
      : "Start a request for a vehicle from China with delivery to Bulgaria from Keen Auto Mall.",
    locale,
    path,
    title: isBg
      ? "Внос от Китай | Keen Auto Mall"
      : "Import from China | Keen Auto Mall",
  });
};

export default async function ChinaImportPage({ params }: PageProps) {
  const { locale } = await params;
  const normalizedLocale = normalizeSeoLocale(locale);

  redirect(
    `${getLocalizedPath(normalizedLocale, "/imports")}?origin=CN&start=1#import-request`
  );
}
