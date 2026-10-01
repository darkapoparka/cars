export type VehicleCategory = 'car' | 'bike' | 'electric-bike' | 'motorhome' | 'truck';
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  variant: string;
  price: number;
  monthly?: number;
  financeMonthly?: number;
  leaseTerms?: { months: number; annualMileage: number; customer: string; deposit: number };
  priceNote?: string;
  deliveryPossible?: boolean;
  technicalDiagrams?: Record<string, string>;
  previousPrice?: number;
  attributes?: Record<string, string>;
  technicalData?: [string, string][];
  specialFeatures?: string[];
  damaged?: boolean;
  country?: string;
  year: number;
  registration: string;
  mileage: number;
  power: number;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  seats: number;
  doors: number;
  dealer: string;
  location: string;
  rating: number;
  reviews: number;
  images: string[];
  sponsored?: boolean;
  deal?: boolean;
  category: VehicleCategory;
  features: string[];
};
export type Filters = {
  category: VehicleCategory;
  makes: string[];
  excludedMakes: string[];
  models: string[];
  makeModels: Record<string, string[]>;
  excludedModels: Record<string, string[]>;
  makeVariants: Record<string, string>;
  excludedMakeVariants: Record<string, string>;
  modelVariants: Record<string, Record<string, string>>;
  excludedModelVariants: Record<string, Record<string, string>>;
  query: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  minMileage: string;
  maxMileage: string;
  maxPower: string;
  minLease: string;
  maxLease: string;
  country: string;
  condition: string[];
  details: string[];
  fuel: string[];
  transmission: string[];
  body: string[];
  color: string[];
  features: string[];
  minPower: string;
  seats: string;
  maxSeats: string;
  doors: string;
  location: string;
  radius: string;
  payment: 'buy' | 'lease';
  deal: boolean;
  seller: string;
  excludeDamaged: boolean;
  damagedOnly: boolean;
};
export type SavedSearch = { id: string; name: string; filters: Filters; notifications: boolean };
export const defaultFilters: Filters = {
  category: 'car',
  makes: [],
  excludedMakes: [],
  models: [],
  makeModels: {},
  excludedModels: {},
  makeVariants: {},
  excludedMakeVariants: {},
  modelVariants: {},
  excludedModelVariants: {},
  query: '',
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  minMileage: '',
  maxMileage: '',
  maxPower: '',
  minLease: '',
  maxLease: '',
  country: '',
  condition: [],
  details: [],
  fuel: [],
  transmission: [],
  body: [],
  color: [],
  features: [],
  minPower: '',
  seats: '',
  maxSeats: '',
  doors: '',
  location: '',
  radius: '100',
  payment: 'buy',
  deal: false,
  seller: 'Any',
  excludeDamaged: true,
  damagedOnly: false,
};
