export type HomeBrandStripVehicle = {
	brand: string;
};

export type HomeBrandStripItem = {
	id: string;
	brand: string;
	href: string;
	image: string;
	imageAlt: string;
	name: string;
	countLabel: string;
};

export const homeBrandStripOrder = [
	'BMW',
	'Mercedes-Benz',
	'Audi',
	'Honda',
	'Toyota',
	'Volvo',
	'Ford',
	'Hyundai',
	'Kia',
	'Mazda',
	'Ferrari',
	'Tesla',
	'Porsche',
	'Land Rover',
	'Jaguar',
	'Chevrolet',
	'Peugeot',
	'Skoda'
] as const;

export const homeBrandLogoByBrand = new Map<string, string>([
	['Audi', '/assets/images/brand/brand-3.png'],
	['BMW', '/assets/images/brand/brand-1.webp'],
	['Ferrari', '/assets/images/brand/brand-11.png'],
	['Ford', '/assets/images/brand/brand-7.png'],
	['Honda', '/assets/images/brand/brand-4.webp'],
	['Hyundai', '/assets/images/brand/brand-8.png'],
	['Kia', '/assets/images/brand/brand-9.png'],
	['Mazda', '/assets/images/brand/brand-10.png'],
	['Mercedes-Benz', '/assets/images/brand/brand-2.webp'],
	['Porsche', '/assets/images/brand/oem/porsche.webp'],
	['Land Rover', '/assets/images/brand/oem/land-rover.svg'],
	['Jaguar', '/assets/images/brand/mobile/jaguar.svg'],
	['Chevrolet', '/assets/images/brand/mobile/chevrolet.svg'],
	['Peugeot', '/assets/images/brand/mobile/peugeot.svg'],
	['Skoda', '/assets/images/brand/mobile/skoda.svg'],
	['Tesla', '/assets/images/brand/brand-12.png'],
	['Toyota', '/assets/images/brand/brand-5.webp'],
	['Volvo', '/assets/images/brand/brand-6.png']
]);

export const homeBrandDisplayNameByBrand = new Map<string, string>([['Mercedes-Benz', 'Mercedes']]);

export function formatHomeBrandVehicleCount(count: number) {
	return count > 0 ? `${count} ${count === 1 ? 'vehicle' : 'vehicles'}` : 'View make';
}

export function buildHomeBrandStripItems(vehicles: readonly HomeBrandStripVehicle[]) {
	const counts = new Map<string, number>();

	for (const vehicle of vehicles) {
		counts.set(vehicle.brand, (counts.get(vehicle.brand) ?? 0) + 1);
	}

	return homeBrandStripOrder
		.map((brand): HomeBrandStripItem | undefined => {
			const image = homeBrandLogoByBrand.get(brand);

			if (!image) {
				return undefined;
			}

			const name = homeBrandDisplayNameByBrand.get(brand) ?? brand;

			return {
				id: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				brand,
				href: `/inventory?brand=${encodeURIComponent(brand)}`,
				image,
				imageAlt: name,
				name,
				countLabel: formatHomeBrandVehicleCount(counts.get(brand) ?? 0)
			};
		})
		.filter((item): item is HomeBrandStripItem => Boolean(item));
}
