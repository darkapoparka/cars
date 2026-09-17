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
	['Audi', '/variant-3/assets/images/brand/brand-3.png'],
	['BMW', '/variant-3/assets/images/brand/brand-1.webp'],
	['Ferrari', '/variant-3/assets/images/brand/brand-11.png'],
	['Ford', '/variant-3/assets/images/brand/brand-7.png'],
	['Honda', '/variant-3/assets/images/brand/brand-4.webp'],
	['Hyundai', '/variant-3/assets/images/brand/brand-8.png'],
	['Kia', '/variant-3/assets/images/brand/brand-9.png'],
	['Mazda', '/variant-3/assets/images/brand/brand-10.png'],
	['Mercedes-Benz', '/variant-3/assets/images/brand/brand-2.webp'],
	['Porsche', '/variant-3/assets/images/brand/oem/porsche.webp'],
	['Land Rover', '/variant-3/assets/images/brand/oem/land-rover.svg'],
	['Jaguar', '/variant-3/assets/images/brand/mobile/jaguar.svg'],
	['Chevrolet', '/variant-3/assets/images/brand/mobile/chevrolet.svg'],
	['Peugeot', '/variant-3/assets/images/brand/mobile/peugeot.svg'],
	['Skoda', '/variant-3/assets/images/brand/mobile/skoda.svg'],
	['Tesla', '/variant-3/assets/images/brand/brand-12.png'],
	['Toyota', '/variant-3/assets/images/brand/brand-5.webp'],
	['Volvo', '/variant-3/assets/images/brand/brand-6.png']
]);

export const homeBrandDisplayNameByBrand = new Map<string, string>([['Mercedes-Benz', 'Mercedes']]);

export function formatHomeBrandVehicleCount(count: number) {
	return count > 0 ? `${count} ${count === 1 ? 'автомобил' : 'автомобила'}` : 'Виж марката';
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
