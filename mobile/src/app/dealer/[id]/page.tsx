import { notFound } from 'next/navigation';
import { getVehicle, vehicles } from '@/lib/catalog';
import { DealerInventory } from '@/components/DealerInventory';
export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { id } = await params;
  const { sort } = await searchParams;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();
  return <DealerInventory vehicle={vehicle} sort={sort} />;
}
