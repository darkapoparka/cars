import {dealerShareMetadata} from "../../../../lib/cars-dealer-share";
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import BenefitsPage from '@/components/BenefitsPage';

export function generateStaticParams() {return [{kind: 'returns'}, {kind: 'warranty'}];}
async function carsOriginalGenerateMetadata({params}: {params: Promise<{kind: string}>}): Promise<Metadata> {
  const {kind} = await params;
  return {title: kind === 'warranty' ? 'Lifetime Warranty' : 'Return policy'};
}
export default async function PolicyPage({params}: {params: Promise<{kind: string}>}) {
  const {kind} = await params;
  if (kind !== 'returns' && kind !== 'warranty') notFound();
  return <BenefitsPage key={kind} kind={kind} />;
}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
