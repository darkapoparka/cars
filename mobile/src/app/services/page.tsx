import {dealerShareMetadata} from "../../lib/cars-dealer-share";
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ShowroomServicesScreen } from '@/components/ShowroomServicesScreen';
const carsOriginalMetadata: Metadata = { title: 'Services' };
export default async function Page() {
  await connection();
  return <ShowroomServicesScreen />;
}

export async function generateMetadata() {
  return dealerShareMetadata(carsOriginalMetadata);
}
