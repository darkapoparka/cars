import {dealerShareMetadata} from "../../../lib/cars-dealer-share";
import type {Metadata} from 'next';
import StoresClient from '@/components/StoresClient';
import {getCopy} from '@/lib/locale-server';

async function carsOriginalGenerateMetadata(): Promise<Metadata> {
  const tx = await getCopy();
  return {title: tx('About us')};
}
export default function StoresPage(){return <StoresClient/>;}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
