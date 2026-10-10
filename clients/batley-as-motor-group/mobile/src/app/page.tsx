import { connection } from 'next/server';
import { ShowroomInventoryScreen } from '@/components/ShowroomInventoryScreen';
export default async function Page() {
  await connection();
  return <ShowroomInventoryScreen />;
}
