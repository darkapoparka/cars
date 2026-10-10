import type {Metadata} from 'next';
import SearchClient from '@/components/SearchClient';

export const metadata: Metadata = {title: 'Search cars'};
export default async function SearchPage({searchParams}: {searchParams: Promise<{q?: string | string[]}>}) {
  const params = await searchParams;
  return <SearchClient initialQuery={Array.isArray(params.q) ? params.q[0] : params.q ?? ''} />;
}
