import {notFound} from 'next/navigation';
import VehicleFeatures from '@/components/VehicleFeatures';
import {getReferenceVehicleDetail} from '@/lib/reference-data.server';
import {getVehicle, vehicles} from '@/lib/data';

export function generateStaticParams() {return vehicles.map(vehicle => ({slug: vehicle.slug}));}
export default async function FeaturesPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();
  return <VehicleFeatures vehicle={vehicle} featureGroups={getReferenceVehicleDetail(slug)?.featureGroups} />;
}
