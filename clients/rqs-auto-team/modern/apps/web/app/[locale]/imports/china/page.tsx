import { UnverifiedServicePage } from "../../components/unverified-service-page";

export default async function ChinaImportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <UnverifiedServicePage locale={locale} titleBg="Автомобил от Китай" titleEn="Vehicle from China" descriptionBg="Публичните източници не потвърждават специализирана услуга за внос от Китай. Уточнете произхода, документите и възможната доставка директно с автокъщата." descriptionEn="Public sources do not confirm a specialist China import service. Ask the dealership directly about origin, documents, and any delivery options." />;
}
