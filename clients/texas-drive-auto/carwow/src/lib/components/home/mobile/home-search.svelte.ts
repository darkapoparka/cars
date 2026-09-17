import { SvelteURLSearchParams, SvelteSet } from 'svelte/reactivity';
import type { HomeMobileData } from '$lib/types/home';

type Facet = 'brand' | 'model' | 'body';
const normalize = (value: string) => value.toLocaleLowerCase('bg-BG').trim();
const toggle = (values: string[], value: string) =>
	values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

/** A draft belongs to one mounted search sheet, never to a module-level singleton. */
export class HomeSearchState {
	#readData: () => HomeMobileData;
	query = $state('');
	searchPrice = $state('');
	searchView = $state<'main' | Facet>('main');
	facetQuery = $state('');
	selectedBrands = $state<string[]>([]);
	selectedModels = $state<string[]>([]);
	selectedBodies = $state<string[]>([]);

	constructor(readData: () => HomeMobileData) {
		this.#readData = readData;
	}

	get allModelOptions() {
		return this.#readData().modelOptions.filter(
			(option) =>
				!this.selectedBrands.length ||
				option.brands.some((brand) => this.selectedBrands.includes(brand))
		);
	}
	get modelChips() {
		const matching = this.allModelOptions;
		return [
			...matching.filter((option) => this.selectedModels.includes(option.model)),
			...matching.filter((option) => !this.selectedModels.includes(option.model))
		].slice(0, this.selectedBrands.length ? 10 : 8);
	}
	get facetBrandList() {
		const needle = normalize(this.facetQuery);
		return this.#readData()
			.brands.filter((brand) => !needle || normalize(brand).includes(needle))
			.sort(
				(left, right) =>
					Number(this.selectedBrands.includes(right)) - Number(this.selectedBrands.includes(left))
			);
	}
	get facetModelList() {
		const needle = normalize(this.facetQuery);
		return this.allModelOptions
			.filter((option) => !needle || normalize(option.model).includes(needle))
			.sort(
				(left, right) =>
					Number(this.selectedModels.includes(right.model)) -
					Number(this.selectedModels.includes(left.model))
			);
	}
	get facetTitle() {
		return this.searchView === 'brand'
			? 'Марка'
			: this.searchView === 'model'
				? 'Модел'
				: 'Каросерия';
	}
	get searchHref(): '/inventory' | `/inventory?${string}` {
		const params = new SvelteURLSearchParams();
		if (this.query.trim()) params.set('q', this.query.trim());
		if (this.searchPrice) params.set('price', this.searchPrice);
		for (const [key, values] of [
			['brand', this.selectedBrands],
			['model', this.selectedModels],
			['body', this.selectedBodies]
		] as const) {
			for (const value of values) if (value) params.append(key, value);
		}
		const query = params.toString();
		return query ? `/inventory?${query}` : '/inventory';
	}
	openFacet = (view: Facet) => {
		this.searchView = view;
		this.facetQuery = '';
	};
	backToMain = () => {
		this.searchView = 'main';
		this.facetQuery = '';
	};
	toggleBrand = (brand: string) => {
		this.selectedBrands = toggle(this.selectedBrands, brand);
		if (!this.selectedBrands.length || !this.selectedModels.length) return;
		const valid = new SvelteSet(this.allModelOptions.map((option) => option.model));
		this.selectedModels = this.selectedModels.filter((model) => valid.has(model));
	};
	toggleModel = (model: string) => {
		this.selectedModels = toggle(this.selectedModels, model);
	};
	toggleBody = (body: string) => {
		this.selectedBodies = toggle(this.selectedBodies, body);
	};
}
