import {Suspense} from 'react';
import DealerRequestPage from '@/components/DealerRequestPage';
import {getCopy} from '@/lib/locale-server';
export async function generateMetadata() {const tx = await getCopy(); return {title: tx('Sell or part-exchange')};}
export default function SellDetailsPage() {
  return <Suspense fallback={null}><DealerRequestPage kind="sell"/></Suspense>;
}
