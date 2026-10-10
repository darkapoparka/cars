import { notFound } from 'next/navigation';
import { getVehicle, vehicles } from '@/lib/catalog';
import { DealerInformation } from '@/components/DealerInformation';
export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();
  return <DealerInformation vehicle={vehicle} />;
}
