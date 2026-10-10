import {dealerShareMetadata} from "../../../lib/cars-dealer-share";
import type {Metadata} from 'next';
import type {ReactNode} from 'react';

const carsOriginalMetadata: Metadata = {robots: {index: false, follow: false}};

export default function HomeAlternativeLayout({children}: {children: ReactNode}) {
  return children;
}

export async function generateMetadata() {
  return dealerShareMetadata(carsOriginalMetadata);
}
