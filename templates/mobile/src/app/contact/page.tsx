import type { Metadata } from 'next';
import { getVehicle } from '@/lib/catalog';
import { showroomService } from '@/lib/showroom-services';
import { ShowroomContactScreen } from '@/components/ShowroomPages';
export const metadata: Metadata = { title: 'Contact' };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string; service?: string }>;
}) {
  const params = await searchParams;
  const vehicle = typeof params.vehicle === 'string' ? getVehicle(params.vehicle) : undefined;
  const service = showroomService(typeof params.service === 'string' ? params.service : undefined);
  return (
    <ShowroomContactScreen
      key={vehicle?.id || 'showroom-' + (service?.id || 'general')}
      vehicle={vehicle}
      serviceId={service?.id}
    />
  );
}
