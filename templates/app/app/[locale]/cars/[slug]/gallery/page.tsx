import {displayMake} from '@/lib/inventory-labels';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import VehicleGallery from '@/components/VehicleGallery';
import {getReferenceVehicleDetail} from '@/lib/reference-data.server';
import {getVehicle, vehicles} from '@/lib/data';
import type {GalleryCategory} from '@/lib/vehicle-gallery';

export function generateStaticParams() {return vehicles.map(vehicle => ({slug: vehicle.slug}));}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const vehicle = getVehicle(slug);
  return {title: vehicle ? `${displayMake(vehicle.make)} ${vehicle.model} photos` : 'Vehicle photos'};
}
export default async function GalleryPage({params, searchParams}: {params: Promise<{slug: string}>; searchParams: Promise<{category?: string | string[]}>}) {
  const {slug} = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();
  const query = await searchParams;
  const category = Array.isArray(query.category) ? query.category[0] : query.category;
  const initialCategory: GalleryCategory = category === 'Interiors' || category === 'Features' ? category : 'Exteriors';
  return <VehicleGallery key={slug} vehicle={vehicle} initialCategory={initialCategory} capturedPhotos={getReferenceVehicleDetail(slug)?.gallery} />;
}
