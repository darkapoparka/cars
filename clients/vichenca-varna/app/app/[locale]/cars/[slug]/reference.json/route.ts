import {getReferenceVehicleDetail} from '@/lib/reference-data.server';
import {vehicles} from '@/lib/data';

export const dynamic = 'force-static';
export function generateStaticParams() {return vehicles.map(vehicle => ({slug: vehicle.slug}));}
export async function GET(_request: Request, {params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  return Response.json(getReferenceVehicleDetail(slug) ?? null);
}
