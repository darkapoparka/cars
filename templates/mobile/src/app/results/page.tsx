import { redirect } from 'next/navigation';
import { parseFilters } from '@/lib/search';
import { showroomInventoryHref } from '@/lib/showroom';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value);
  }
  redirect(
    showroomInventoryHref(parseFilters(params.toString()), params.get('sort') || 'standard'),
  );
}
