import type { Metadata } from 'next';
import InventoryClient from '@/components/InventoryClient';
import {readInventorySearch} from '@/lib/inventory-search';
import {getCopy} from '@/lib/locale-server';

export async function generateMetadata(): Promise<Metadata> {
  const tx = await getCopy();
  return {title: tx('Our cars')};
}

type CarsSearchParams = {
  emiMax?: string | string[];
  q?: string | string[];
  brand?: string | string[];
  body?: string | string[];
  maxPrice?: string | string[];
  filters?: string | string[];
  sort?: string | string[];
  open?: string | string[];
  selection?: string | string[];
  order?: string | string[];
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<CarsSearchParams> }) {
  const params = await searchParams;
  const state = readInventorySearch({get: key => first(params[key as keyof CarsSearchParams]) || null, getAll: key => {
    const value = params[key as keyof CarsSearchParams];
    return value === undefined ? [] : Array.isArray(value) ? value : [value];
  }});
  const initialOverlay = params.filters !== undefined ? 'filters' : params.sort !== undefined ? 'sort' : null;

  return (
    <InventoryClient
      key={JSON.stringify(params)}
      initialEmiMax={state.emiMax}
      initialQuery={state.query}
      initialFilters={state.filters}
      initialSort={state.sort}
      initialOverlay={initialOverlay}
      initialOpen={first(params.open).toUpperCase() || null}
    />
  );
}
