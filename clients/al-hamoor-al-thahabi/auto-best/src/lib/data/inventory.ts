export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = string;

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

const rows = [
  [1,'Mercedes-Benz','CLA250 Premium + 2.0L',2025,22000,'Sedan',95000,'https://www.dubicars.com/2025-mercedes-benz-cla250-premium-20l-965722.html'],
  [2,'Nissan','Rogue Platinum',2023,56000,'SUV',45000,'https://www.dubicars.com/2023-nissan-rogue-1005647.html'],
  [3,'Toyota','Prado TX-L',2011,212000,'SUV',56000,'https://www.dubicars.com/2011-toyota-prado-1010924.html'],
  [4,'Chevrolet','Malibu LT',2022,95000,'Sedan',32000,'https://www.dubicars.com/2022-chevrolet-malibu-1018774.html'],
  [5,'Toyota','Rush EX 1.5L',2023,121000,'SUV',43000,'https://www.dubicars.com/2023-toyota-rush-15l-ex-916417.html'],
  [6,'Chevrolet','Trax LT 1.8L AWD',2020,106000,'SUV',14500,'https://www.dubicars.com/2020-chevrolet-trax-lt-18l-awd-906007.html'],
  [7,'Ford','Figo Ambiente',2019,185000,'Sedan',13500,'https://www.dubicars.com/2019-ford-figo-1017078.html'],
  [8,'Nissan','Sentra SV 1.6L',2021,116000,'Sedan',23000,'https://www.dubicars.com/2021-nissan-sentra-sv-16l-113-hp-969234.html']
] as const;

export const featuredVehicles: Vehicle[] = rows.map(([id,make,model,year,mileage,body,price,evidenceUrl]) => ({
  id, make, title: `${make} ${model}`, year: String(year), yearNumber: year,
  mileage: `${new Intl.NumberFormat('en-AE').format(mileage)} km`, mileageKm: mileage,
  category: body, body, fuel: 'Petrol', transmission: 'Automatic', equipment: [], condition: 'used',
  priceEur: price, verification: 'sample', evidenceUrl, image: '/dealer/vehicle-preview.svg',
  href: `/listing-detail-v1/${id}`
}));

export const formatVehiclePrice = (price: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(price);
