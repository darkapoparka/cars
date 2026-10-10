import {redirect} from 'next/navigation';
import {dealer} from '@/lib/dealer-config';
import {browserPath} from '@/lib/paths';
export default function EntryPage() { redirect(browserPath('/', dealer.defaultLocale)); }
