import {dealerShareMetadata} from "../../../../lib/cars-dealer-share";
import {Suspense} from 'react';
import DealerRequestPage from '@/components/DealerRequestPage';
import {getCopy} from '@/lib/locale-server';
async function carsOriginalGenerateMetadata() {const tx = await getCopy(); return {title: tx('Sell or part-exchange')};}
export default function SellDetailsPage() {
  return <Suspense fallback={null}><DealerRequestPage kind="sell"/></Suspense>;
}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
