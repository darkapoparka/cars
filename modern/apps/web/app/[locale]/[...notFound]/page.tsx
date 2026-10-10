import {dealerShareMetadata} from "../../../lib/cars-dealer-share";
import { leadSite } from "@repo/marketplace";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface UnknownLocalizedPageProps {
  params: Promise<{ locale: string }>;
}

const carsOriginalGenerateMetadata = async ({
  params,
}: UnknownLocalizedPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const isBg = locale === "bg";

  return {
    robots: {
      follow: false,
      index: false,
    },
    title: isBg
      ? `Страницата не е намерена | ${leadSite.name}`
      : `Page not found | ${leadSite.name}`,
  };
};

const UnknownLocalizedPage = () => notFound();

export default UnknownLocalizedPage;

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
