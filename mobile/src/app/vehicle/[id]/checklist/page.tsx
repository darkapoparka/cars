import { notFound } from 'next/navigation';
import { getVehicle, vehicles } from '@/lib/catalog';
import { NativeChecklist } from '@/components/NativeChecklist';
export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();
  return <NativeChecklist vehicle={vehicle} />;
}
