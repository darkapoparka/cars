import {Suspense} from 'react';
import DealerRequestPage from '@/components/DealerRequestPage';
import {getCopy} from '@/lib/locale-server';
export async function generateMetadata() {const tx = await getCopy(); return {title: tx('Vehicle service enquiry')};}
export default function ServiceDetailsPage() {
  return <Suspense fallback={null}><DealerRequestPage kind="service"/></Suspense>;
}
