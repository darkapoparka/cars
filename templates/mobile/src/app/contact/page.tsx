import type { Metadata } from 'next';
import { getVehicle } from '@/lib/catalog';
import { ShowroomContactScreen } from '@/components/ShowroomPages';
export const metadata: Metadata = { title: 'Contact' };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string; service?: string }>;
}) {
  const params = await searchParams;
  return (
    <ShowroomContactScreen
      vehicle={typeof params.vehicle === 'string' ? getVehicle(params.vehicle) : undefined}
      serviceId={typeof params.service === 'string' ? params.service : undefined}
    />
  );
}
