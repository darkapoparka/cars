import { vehicles } from '$lib/data/vehicles';
import type { DayNightSession } from '$lib/types/account';

export type DayNightGarageState = {
	compare: string[];
	favorites: string[];
};

type GaragePatch = Partial<DayNightGarageState>;
type GarageVehicle = (typeof vehicles)[number];

const vehicleSlugs = new Set(vehicles.map((vehicle) => vehicle.slug));
const garageByAccount = new Map<string, DayNightGarageState>();

export const normalizeGarageList = (value: unknown) =>
	Array.isArray(value)
		? value.filter((item): item is string => vehicleSlugs.has(String(item)))
		: [];

const defaultGarageState = (): DayNightGarageState => ({
	compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
	favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
});

const accountGarageKey = (session: DayNightSession) =>
	`${session.role}:${session.email.toLowerCase()}`;

const cloneGarageState = (state: DayNightGarageState): DayNightGarageState => ({
	compare: [...state.compare],
	favorites: [...state.favorites]
});

export const getDayNightGarageState = (session: DayNightSession) => {
	const key = accountGarageKey(session);
	const state = garageByAccount.get(key) ?? defaultGarageState();

	if (!garageByAccount.has(key)) {
		garageByAccount.set(key, cloneGarageState(state));
	}

	return cloneGarageState(state);
};

export const updateDayNightGarageState = (session: DayNightSession, patch: GaragePatch) => {
	const current = getDayNightGarageState(session);
	const next = {
		compare: patch.compare ? normalizeGarageList(patch.compare).slice(0, 4) : current.compare,
		favorites: patch.favorites ? normalizeGarageList(patch.favorites) : current.favorites
	};

	garageByAccount.set(accountGarageKey(session), next);

	return cloneGarageState(next);
};

export const getDayNightFavoriteVehicles = (session: DayNightSession) =>
	getDayNightGarageState(session)
		.favorites.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
		.filter((vehicle): vehicle is GarageVehicle => Boolean(vehicle));
