import type { Metadata } from 'next';
import InventoryClient from '@/components/InventoryClient';

export const metadata: Metadata = { title: 'Our cars' };

type CarsSearchParams = {
  emiMax?: string | string[];
  q?: string | string[];
  brand?: string | string[];
  body?: string | string[];
  filters?: string | string[];
  sort?: string | string[];
  open?: string | string[];
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<CarsSearchParams> }) {
  const params = await searchParams;
  const initialOverlay = params.filters !== undefined ? 'filters' : params.sort !== undefined ? 'sort' : null;

  return (
    <InventoryClient
      key={JSON.stringify(params)}
      initialEmiMax={params.emiMax !== undefined && Number.isFinite(Number(first(params.emiMax))) ? Math.max(0, Number(first(params.emiMax))) : undefined}
      initialQuery={first(params.q)}
      initialBrand={first(params.brand)}
      initialBody={first(params.body)}
      initialOverlay={initialOverlay}
      initialOpen={first(params.open).toUpperCase() || null}
    />
  );
}
