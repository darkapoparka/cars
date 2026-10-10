import {dealerShareMetadata} from "../../../../lib/cars-dealer-share";
import {Suspense} from 'react';
import DealerRequestPage from '@/components/DealerRequestPage';
import {getCopy} from '@/lib/locale-server';
async function carsOriginalGenerateMetadata() {const tx = await getCopy(); return {title: tx('Vehicle service enquiry')};}
export default function ServiceDetailsPage() {
  return <Suspense fallback={null}><DealerRequestPage kind="service"/></Suspense>;
}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
