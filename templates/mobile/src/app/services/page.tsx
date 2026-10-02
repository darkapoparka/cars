import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ShowroomServicesScreen } from '@/components/ShowroomPages';
export const metadata: Metadata = { title: 'Services' };
export default async function Page() {
  await connection();
  return <ShowroomServicesScreen />;
}
