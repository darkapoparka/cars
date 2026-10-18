import { LoginScreen } from '@/components/LoginScreen';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; register?: string | string[] }>;
}) {
  const { next, register } = await searchParams;
  return (
    <LoginScreen
      next={typeof next === 'string' ? next : undefined}
      registerInitially={register === 'true'}
    />
  );
}
