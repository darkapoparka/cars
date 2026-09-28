import InventoryClient from '@/components/InventoryClient';
import {getCopy} from '@/lib/locale-server';
export async function generateMetadata(){const tx=await getCopy();return {title:tx('Premium collection'),description:tx('Premium cars from the dealer’s collection.')};}
export default function LuxePage(){return <InventoryClient variant="luxe"/>;}
