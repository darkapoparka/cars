import {dealerShareMetadata} from "../../../../lib/cars-dealer-share";
import {displayMake} from '@/lib/inventory-labels';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VehicleDetailClient from '@/components/VehicleDetailClient';
import {getReferenceVehicleDetail} from '@/lib/reference-data.server';
import { getVehicle, vehicles } from '@/lib/data';

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

async function carsOriginalGenerateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  return { title: vehicle ? `${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}` : 'Vehicle' };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();
  const related = vehicles.filter((item) => item.slug !== vehicle.slug).slice(0, 3);
  return <VehicleDetailClient vehicle={vehicle} related={related} reference={getReferenceVehicleDetail(slug)} />;
}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
