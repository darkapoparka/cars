import { placeholderImageSlugs, daynightVehicles, type Car } from '$lib/data/daynight-vehicles';
import type {
	DetailFeatureItem,
	DetailFeatureTab,
	DetailTemplatePage
} from '$lib/types/template-page';
import { vehicleSeo } from './daynight-seo';

function slugifyFeature(label: string) {
	return label.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-');
}

function toFeatureItems(tabId: string, labels: string[]): DetailFeatureItem[] {
	return labels
		.map((label) => label.trim())
		.filter(Boolean)
		.map((label, index) => ({
			id: `${tabId}-feature-${index}-${slugifyFeature(label)}`,
			label
		}));
}

// Native PDP "Опознайте автомобила" feature tabs, built from real Car data.
// "Описание" is rendered by DesktopDetailFeatureTabs from vehicle.description;
// this adds the spec tabs: Екстри (vehicle.features) + Акценти (vehicle.highlights).
// A tab is omitted when its source list is empty so no blank panel renders.
export function buildDetailFeatureTabs(vehicle: Car): DetailFeatureTab[] {
	const tabs: DetailFeatureTab[] = [];

	if (vehicle.features.length) {
		const id = 'feature-tab-ekstri';
		tabs.push({
			id,
			label: 'Екстри',
			active: false,
			features: toFeatureItems(id, vehicle.features)
		});
	}

	if (vehicle.highlights.length) {
		const id = 'feature-tab-aktsenti';
		tabs.push({
			id,
			label: 'Акценти',
			active: false,
			features: toFeatureItems(id, vehicle.highlights)
		});
	}

	return tabs;
}

// Same-body cars rank first, then same-brand, then closest price — so the strip
// always shows genuinely comparable stock instead of the template's demo cards.
function pickSimilarVehicles(current: Car, vehicles: Car[], count = 4) {
	const score = (candidate: Car) =>
		(candidate.body === current.body ? 2 : 0) + (candidate.brand === current.brand ? 1 : 0);

	return vehicles
		.filter((candidate) => candidate.slug !== current.slug)
		.map((candidate) => ({
			candidate,
			score: score(candidate) - (placeholderImageSlugs.has(candidate.slug) ? 1 : 0),
			priceDelta: Math.abs(candidate.price - current.price)
		}))
		.sort((a, b) => b.score - a.score || a.priceDelta - b.priceDelta)
		.slice(0, count)
		.map((entry) => entry.candidate);
}

export async function loadDetailTemplatePage(
	slug: string,
	vehicles: Car[] = daynightVehicles
): Promise<DetailTemplatePage | null> {
	const vehicle = vehicles.find((candidate) => candidate.slug === slug);

	if (!vehicle) {
		return null;
	}

	return {
		kind: 'detail',
		slug,
		vehicle,
		...vehicleSeo(vehicle),
		scriptSrcs: [],
		detailFeatureTabs: buildDetailFeatureTabs(vehicle),
		detailSimilarVehicles: pickSimilarVehicles(vehicle, vehicles)
	};
}
