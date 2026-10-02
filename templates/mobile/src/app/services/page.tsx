import type { Metadata } from 'next';
import { ShowroomServicesScreen } from '@/components/ShowroomPages';
export const metadata: Metadata = { title: 'Services' };
export default function Page() {
  return <ShowroomServicesScreen />;
}
