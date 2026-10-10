import {dealerShareMetadata} from "../../../lib/cars-dealer-share";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { showroomService, showroomServices } from '@/lib/showroom-services';
import { getShowroomServiceDetail } from '@/lib/showroom-service-details';
import { ShowroomServiceDetailScreen } from '@/components/ShowroomServiceDetailScreen';

export function generateStaticParams() {
  return showroomServices.map((service) => ({ id: service.id }));
}

async function carsOriginalGenerateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = showroomService(id);
  if (!service) notFound();
  return { title: service.title, description: service.copy };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = showroomService(id);
  const detail = getShowroomServiceDetail(id);
  if (!service || !detail) notFound();
  return <ShowroomServiceDetailScreen service={service} detail={detail} />;
}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
