import { notFound } from 'next/navigation';
import { getVehicle, vehicles } from '@/lib/catalog';
import { DetailScreen } from '@/components/DetailScreen';
export function generateStaticParams() {
  return vehicles.map((v) => ({ id: v.id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();
  return <DetailScreen vehicle={vehicle} />;
}
