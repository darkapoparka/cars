import type {Metadata} from 'next';
import StoresClient from '@/components/StoresClient';

export const metadata:Metadata={title:'Visit showroom'};
export default function StoresPage(){return <StoresClient/>;}
