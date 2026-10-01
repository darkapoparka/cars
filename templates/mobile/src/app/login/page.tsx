import { LoginScreen } from '@/components/LoginScreen';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; register?: string }>;
}) {
  const { next, register } = await searchParams;
  return <LoginScreen next={next} registerInitially={register === 'true'} />;
}
