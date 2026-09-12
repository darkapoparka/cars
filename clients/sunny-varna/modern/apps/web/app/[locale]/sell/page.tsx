import { UnverifiedServicePage } from "../components/unverified-service-page";

export default async function SellPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <UnverifiedServicePage locale={locale} titleBg="Вашият автомобил" titleEn="Your vehicle" descriptionBg="Публичните източници не потвърждават изкупуване или бартер. Попитайте директно дали автокъщата разглежда предложения за автомобил." descriptionEn="Public sources do not confirm purchasing or trade-in services. Ask the dealership directly whether it considers vehicle offers." />;
}
