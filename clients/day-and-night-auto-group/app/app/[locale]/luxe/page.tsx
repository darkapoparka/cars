import {dealerShareMetadata} from "../../../lib/cars-dealer-share";
import InventoryClient from '@/components/InventoryClient';
import {getCopy} from '@/lib/locale-server';
async function carsOriginalGenerateMetadata(){const tx=await getCopy();return {title:tx('Premium collection'),description:tx('Premium cars from the dealer’s collection.')};}
export default function LuxePage(){return <InventoryClient variant="luxe"/>;}

export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {
  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));
}
