import {notFound} from 'next/navigation';
import InspectionReport from '@/components/InspectionReport';
import {getVehicle} from '@/lib/data';
import {getReferenceVehicleDetail,referenceInspectionSlugs} from '@/lib/reference-data.server';

export function generateStaticParams() {return referenceInspectionSlugs().map(slug=>({slug}));}
export default async function InspectionPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const vehicle = getVehicle(slug);
  const reference=getReferenceVehicleDetail(slug);
  if (!vehicle || !reference?.inspection.length) notFound();
  return <InspectionReport vehicle={{...vehicle,image:reference.primaryImage??vehicle.image}} capturedSections={reference.inspection} />;
}
