import { UnverifiedServicePage } from "../components/unverified-service-page";

export default async function ImportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <UnverifiedServicePage locale={locale} titleBg="Произход и доставка" titleEn="Origin and delivery" descriptionBg="Публичните източници не потвърждават услуга за внос. Уточнете произхода, документите и възможната доставка за конкретния автомобил директно с автокъщата." descriptionEn="Public sources do not confirm an import service. Ask the dealership directly about origin, documents, and any delivery options for a specific vehicle." />;
}
