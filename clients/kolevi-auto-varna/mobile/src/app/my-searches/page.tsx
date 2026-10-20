import { MySearchesScreen } from '@/components/SavedScreens';
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <MySearchesScreen initialTab={tab === 'dealers' ? 'dealers' : 'searches'} />;
}
