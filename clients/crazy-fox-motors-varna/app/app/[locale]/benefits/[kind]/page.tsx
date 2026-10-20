import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import BenefitsPage from '@/components/BenefitsPage';

export function generateStaticParams() {return [{kind: 'returns'}, {kind: 'warranty'}];}
export async function generateMetadata({params}: {params: Promise<{kind: string}>}): Promise<Metadata> {
  const {kind} = await params;
  return {title: kind === 'warranty' ? 'Lifetime Warranty' : 'Return policy'};
}
export default async function PolicyPage({params}: {params: Promise<{kind: string}>}) {
  const {kind} = await params;
  if (kind !== 'returns' && kind !== 'warranty') notFound();
  return <BenefitsPage key={kind} kind={kind} />;
}
