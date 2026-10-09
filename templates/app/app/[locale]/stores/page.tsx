import type {Metadata} from 'next';
import StoresClient from '@/components/StoresClient';
import {getCopy} from '@/lib/locale-server';

export async function generateMetadata(): Promise<Metadata> {
  const tx = await getCopy();
  return {title: tx('Visit showroom')};
}
export default function StoresPage(){return <StoresClient/>;}
