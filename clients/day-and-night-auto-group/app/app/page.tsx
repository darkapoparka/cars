import {redirect} from 'next/navigation';
import {dealer} from '@/lib/dealer-config';
import {localePath} from '@/lib/paths';
export default function EntryPage() { redirect(localePath('/', dealer.defaultLocale)); }
