import { UnverifiedServicePage } from "../components/unverified-service-page";

export default async function LeasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <UnverifiedServicePage locale={locale} titleBg="Начини на плащане" titleEn="Purchase terms" descriptionBg="Уточнете директно с автокъщата какви начини на плащане са възможни за избрания автомобил." descriptionEn="Confirm available purchase and payment options directly with the dealership." />;
}
