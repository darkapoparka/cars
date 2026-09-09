export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '360° camera'
  | 'Panoramic roof'
  | 'Navigation'
  | 'Parking sensors'
  | 'Keyless access'
  | 'Adaptive cruise control';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: `/listing-detail-v1/${number}`;
};

const records = [
  { id: 1, sourceId: 'cmtl6wllu000up1mcmlq0al57', image: '/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp', body: 'Hatchback', make: 'Lexus', title: 'Lexus CT200h Platinum', yearNumber: 2018, mileageKm: 168000, fuel: 'Hybrid', priceEur: 64000 },
  { id: 2, sourceId: 'cmtl6pxpd000qp1mcvd0b9ktz', image: '/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp', body: 'Sedan', make: 'Lexus', title: 'Lexus IS300 Platinum', yearNumber: 2023, mileageKm: 40000, fuel: 'Petrol', priceEur: 105000 },
  { id: 3, sourceId: 'cmqev42oy00i8p13h9qatx95x', image: '/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp', body: 'Coupe', make: 'Lexus', title: 'Lexus RC-F 5.0', yearNumber: 2020, mileageKm: 140000, fuel: 'Petrol', priceEur: 150000 },
  { id: 4, sourceId: 'cmtfwz86o011dp1we5d9fkdvp', image: '/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp', body: 'Sedan', make: 'Lexus', title: 'Lexus IS350 F-Sport', yearNumber: 2024, mileageKm: 151000, fuel: 'Petrol', priceEur: 140000 },
  { id: 5, sourceId: 'cmte58re000ykp1we0fkcsw8e', image: '/dealer/stock/cmte58re000ykp1we0fkcsw8e/1.webp', body: 'Sedan', make: 'Lexus', title: 'Lexus GS250 Platinum', yearNumber: 2015, mileageKm: 52000, fuel: 'Petrol', priceEur: 65000 },
  { id: 6, sourceId: 'cmtb7oa3k00rsp1weiw6cwm9m', image: '/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/1.webp', body: 'Coupe', make: 'Lexus', title: 'Lexus RC350 F-Sport', yearNumber: 2021, mileageKm: 120000, fuel: 'Petrol', priceEur: 80000 },
  { id: 7, sourceId: 'cmt6yyshu00ljp1wewaxpucal', image: '/dealer/stock/cmt6yyshu00ljp1wewaxpucal/1.webp', body: 'Sedan', make: 'Lexus', title: 'Lexus ES350 F-Sport', yearNumber: 2023, mileageKm: 77000, fuel: 'Petrol', priceEur: 145000 },
  { id: 8, sourceId: 'cmt4d2ajl00gsp1wehldp9v1e', image: '/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/1.webp', body: 'SUV', make: 'Lexus', title: 'Lexus LX570 Signature', yearNumber: 2016, mileageKm: 228000, fuel: 'Petrol', priceEur: 175000 },
  { id: 9, sourceId: 'cmt4czt2400gqp1weg7ck3qba', image: '/dealer/stock/cmt4czt2400gqp1weg7ck3qba/1.webp', body: 'SUV', make: 'Lexus', title: 'Lexus TX350 Platinum', yearNumber: 2024, mileageKm: 53000, fuel: 'Petrol', priceEur: 185000 },
  { id: 10, sourceId: 'cms38d0r90058p1a10q2alud6', image: '/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp', body: 'SUV', make: 'Lexus', title: 'Lexus RX350 Premier', yearNumber: 2024, mileageKm: 12000, fuel: 'Petrol', priceEur: 165000 }
] as const;

export const featuredVehicles: Vehicle[] = records.map((record) => ({
  id: record.id,
  verification: 'sample',
  evidenceUrl: `https://albasmamotors.com/car/${record.sourceId}`,
  image: record.image,
  category: record.body,
  body: record.body,
  make: record.make,
  title: record.title,
  year: String(record.yearNumber),
  yearNumber: record.yearNumber,
  mileage: `${new Intl.NumberFormat('en-AE').format(record.mileageKm)} km`,
  mileageKm: record.mileageKm,
  fuel: record.fuel,
  transmission: 'Not published',
  equipment: [],
  condition: record.mileageKm <= 100 ? 'new' : 'used',
  priceEur: record.priceEur,
  href: `/listing-detail-v1/${record.id}`
}));

// The retained field name is a template API boundary; values are native AED.
export const formatVehiclePrice = (amountAed: number) =>
  amountAed > 0 ? `AED ${new Intl.NumberFormat('en-AE').format(amountAed)}` : 'Price on request';
