import {
	applyDayNightTemplateContent,
	type DayNightTemplateContentContext
} from './daynight-template-content';
import { renderableTemplateFiles, dashboardTemplateFiles } from '$lib/data/template-routes';
import { daynightSite } from '$lib/data/daynight-site';
import { getDayNightVehicleCondition, daynightVehicles } from '$lib/data/daynight-vehicles';
import {
	daynightTemplatePageClass,
	renderDayNightTemplateHeadStyles
} from './daynight-template-styles';
import { renderSharedHomeHeader } from './daynight-template-chrome';

const templateModules = import.meta.glob(
	[
		'../../../.template-ref/404.html',
		'../../../.template-ref/about-us.html',
		'../../../.template-ref/add-listings-2.html',
		'../../../.template-ref/add-listings.html',
		'../../../.template-ref/blog-details-2.html',
		'../../../.template-ref/blog-standard.html',
		'../../../.template-ref/calculator.html',
		'../../../.template-ref/change-password.html',
		'../../../.template-ref/clients-reviews.html',
		'../../../.template-ref/compare.html',
		'../../../.template-ref/contact-us.html',
		'../../../.template-ref/dashboard.html',
		'../../../.template-ref/dealer-details.html',
		'../../../.template-ref/faqs.html',
		'../../../.template-ref/financing.html',
		'../../../.template-ref/listing-details-3.html',
		'../../../.template-ref/listing-grid4-columns.html',
		'../../../.template-ref/listing-gridstyle-halfmap.html',
		'../../../.template-ref/message.html',
		'../../../.template-ref/my-favorites.html',
		'../../../.template-ref/my-listings.html',
		'../../../.template-ref/my-profile.html',
		'../../../.template-ref/reviews.html',
		'../../../.template-ref/sale-agents-details.html',
		'../../../.template-ref/sale-agents.html',
		'../../../.template-ref/sell-your-car.html',
		'../../../.template-ref/services-center.html',
		'../../../.template-ref/terms.html'
	],
	{
		query: '?raw',
		import: 'default'
	}
) as Record<string, () => Promise<string>>;

const templateLoadersByFile = Object.fromEntries(
	Object.entries(templateModules).map(([path, load]) => [path.split('/').pop() ?? path, load])
);
const templateHtmlCache = new Map<string, Promise<string | undefined>>();

async function loadTemplateHtml(templateFile: string) {
	if (!renderableTemplateFiles.has(templateFile)) {
		return undefined;
	}

	const loader = templateLoadersByFile[templateFile];

	if (!loader) {
		return undefined;
	}

	if (!templateHtmlCache.has(templateFile)) {
		templateHtmlCache.set(templateFile, loader());
	}

	return templateHtmlCache.get(templateFile);
}

function normalizeAssetUrls(html: string) {
	return html
		.replaceAll('./assets/', '/assets/')
		.replaceAll('href="assets/', 'href="/assets/')
		.replaceAll("href='assets/", "href='/assets/")
		.replaceAll('src="assets/', 'src="/assets/')
		.replaceAll("src='assets/", "src='/assets/")
		.replaceAll('content="./assets/', 'content="/assets/')
		.replaceAll('content="assets/', 'content="/assets/');
}

function applyBackgroundImages(html: string) {
	return html.replace(/data-background="([^"]+)"/g, (_match, src: string) => {
		return `data-background="${src}" style="background-image: url('${src}')"`;
	});
}

function rewriteTemplateLinks(html: string) {
	return html.replace(
		/href=(["'])(?!https?:|mailto:|tel:|#)(?:\.\/|\/)?([^"']+\.html)\1/g,
		(_match, quote: string, file: string) => {
			return `href=${quote}/${file}${quote}`;
		}
	);
}

function addBodyClass(html: string, className: string) {
	const bodyClassPattern = /<body([^>]*)class=(["'])([^"']*)\2([^>]*)>/i;

	if (bodyClassPattern.test(html)) {
		return html.replace(
			bodyClassPattern,
			(match, before: string, quote: string, classes: string, after: string) => {
				if (classes.split(/\s+/).includes(className)) {
					return match;
				}

				return `<body${before}class=${quote}${classes} ${className}${quote}${after}>`;
			}
		);
	}

	return html.replace(/<body([^>]*)>/i, `<body$1 class="${className}">`);
}

function applySharedHomeHeader(html: string, templateFile: string) {
	if (dashboardTemplateFiles.has(templateFile)) {
		return html;
	}

	const sharedHeader = renderSharedHomeHeader();

	const withHeader = html.replace(/\s*<!-- Header -->[\s\S]*?\s*<!-- Header -->/, sharedHeader);

	return addBodyClass(withHeader, 'daynight-page-home-header');
}

function injectLocalBehavior(html: string, templateFile: string) {
	const pageClass = daynightTemplatePageClass(templateFile);
	const headInjection = renderDayNightTemplateHeadStyles(templateFile);
	const inventoryFilterData = JSON.stringify(
		daynightVehicles.map((vehicle) => ({
			brand: vehicle.brand,
			model: vehicle.model,
			shortTitle: vehicle.shortTitle,
			title: vehicle.title,
			price: vehicle.price,
			fuel: vehicle.fuel,
			transmission: vehicle.transmission,
			body: vehicle.body,
			mileageValue: vehicle.mileageValue,
			features: vehicle.features,
			year: vehicle.year,
			condition: getDayNightVehicleCondition(vehicle)
		}))
	).replaceAll('<', '\\u003c');
	const bodyInjection = `
<script>
(() => {
	document.body.classList.add('${pageClass}');
	const inventoryTotal = () => window.__daynightVisibleInventoryCount ?? ${daynightVehicles.length};
	const labelMap = new Map([
		['Home', 'Начало'],
		['Listing', 'Автомобили'],
		['Pages', 'Още'],
		['All Brand', 'Всички марки'],
		['All Model', 'Всички модели'],
		['All Miles', 'Всички пробези'],
		['All Price', 'Всички цени'],
		['All Car', 'Всички'],
		['New Car', 'Нови'],
		['Used Car', 'Употребявани'],
		['Автомобили по тип', 'По тип автомобил'],
		['Check All Car Type', 'Всички типове'],
		['Check Всички Type', 'Виж всички типове'],
		['View All Brand', 'Всички марки'],
		['View Всички марки', 'Виж всички марки'],
		['Filters', 'Филтри'],
		['Lowest Price', 'Най-ниска цена'],
		['No accidents', 'Без удари'],
		['Great Price', 'Добра цена'],
		['Black', 'Черен'],
		['REMOVE ALL', 'Изчисти'],
		['Remove All', 'Изчисти'],
		['Special', 'Специално'],
		['Compare', 'Сравни'],
		['PREV', 'ПРЕДИШНА'],
		['NEXT', 'СЛЕДВАЩА'],
		['Play Video', 'Видео преглед'],
		['View All Photo', 'Виж всички снимки'],
		['View All Photos', 'Виж всички снимки'],
		['Write A Review', 'Добавете отзив'],
		['Login To Add A Review', 'Вход за добавяне на отзив'],
		['View More Reviews (98)', '${daynightSite.reviewLinkLabel}'],
		['Chat via WhatsApp', 'Viber / WhatsApp'],
		['View details', 'Виж детайли'],
		['See Finance', 'Финансиране'],
		['AUDI', '${daynightVehicles[0]?.brand.toUpperCase() ?? 'CHRYSLER'}'],
		['HYUNDAI', '${daynightVehicles[1]?.brand.toUpperCase() ?? 'BMW'}'],
		['KIA', '${daynightVehicles[2]?.brand.toUpperCase() ?? 'BMW'}'],
		['CHEVROLET', '${daynightVehicles[3]?.brand.toUpperCase() ?? 'MERCEDES-BENZ'}'],
		['Benzin Auto', 'Бензин Автоматик'],
		['Diesel Auto', 'Дизел Автоматик'],
		['You might also like', 'Подобни автомобили']
	]);
	const translateLabels = () => {
		document.querySelectorAll('a, span, button, option, p, div, .current').forEach((element) => {
			element.childNodes.forEach((node) => {
				if (node.nodeType !== Node.TEXT_NODE) return;
				const current = node.textContent.trim();
				if (labelMap.has(current)) {
					node.textContent = node.textContent.replace(current, labelMap.get(current));
				}
				if (/\\bVehicles\\b/.test(node.textContent)) {
					node.textContent = node.textContent.replaceAll('Vehicles', 'автомобила');
				}
				if (/\\b27 matches\\b/.test(node.textContent)) {
					node.textContent = node.textContent.replaceAll('27 matches', inventoryTotal() + ' автомобила');
				}
			});
		});
		const matchesCount = document.querySelector('#filterMatchesCount');
		if (matchesCount) {
			const count = inventoryTotal();
			if (matchesCount.textContent !== count + ' ') {
				matchesCount.textContent = count + ' ';
			}
			const next = matchesCount.nextSibling;
			if (next && next.nodeType === Node.TEXT_NODE && next.textContent.includes('matches')) {
				next.textContent = next.textContent.replace('matches', 'автомобила');
			}
		}
	};
	translateLabels();
	window.setTimeout(translateLabels, 250);
	window.setTimeout(translateLabels, 1000);
	new MutationObserver(translateLabels).observe(document.body, { childList: true, subtree: true });
	const setupInventoryQuickFilters = () => {
		if (document.querySelector('[data-daynight-svelte-inventory-runtime]')) return;

		const form = document.querySelector('[data-daynight-inventory-filter]');
		if (!form) return;

		const cards = Array.from(document.querySelectorAll('[data-daynight-vehicle-card]'));
		if (!cards.length) return;

		const vehicleData = ${inventoryFilterData};
		const normalize = (value) => (value || '').toString().toLocaleLowerCase('bg-BG').trim();
		const parsePrice = (value) => Number(((value || '').match(/[\\d\\s]+/)?.[0] || '0').replace(/\\s/g, ''));
		const findMeta = (title) => {
			const normalizedTitle = normalize(title);
			return vehicleData.find((vehicle) => {
				const shortTitle = normalize(vehicle.shortTitle);
				const fullTitle = normalize(vehicle.title);
				const brandModel = normalize(vehicle.brand + ' ' + vehicle.model);
				return (
					(shortTitle && normalizedTitle.includes(shortTitle)) ||
					(brandModel && normalizedTitle.includes(brandModel)) ||
					(fullTitle && fullTitle.includes(normalizedTitle))
				);
			});
		};
		const cardData = cards.map((card) => {
			const holder = card.closest('.item, .col-xl-3, .col-lg-4, .col-md-6, .col-sm-6') || card;
			const scope = card.closest('.content-inner');
			const titleText = card.querySelector('.card-box__title')?.textContent || '';
			const categoryText = card.querySelector('.category a')?.textContent || '';
			const tagText = Array.from(card.querySelectorAll('.tag span'))
				.map((span) => span.textContent || '')
				.join(' ');
			const meta = findMeta(titleText);
			const dataset = card.dataset || {};
			const haystack = normalize([
				titleText,
				categoryText,
				tagText,
				dataset.daynightBrand,
				dataset.daynightModel,
				dataset.daynightFuel,
				dataset.daynightTransmission,
				dataset.daynightBody,
				dataset.daynightFeatures,
				meta?.brand,
				meta?.model,
				meta?.fuel,
				meta?.transmission,
				meta?.body,
				(meta?.features || []).join(' '),
				meta?.year
			].join(' '));

			return {
				holder,
				scope,
				slug: dataset.daynightSlug || meta?.slug || titleText,
				brand: normalize(dataset.daynightBrand || meta?.brand || categoryText),
				model: normalize(dataset.daynightModel || meta?.model || titleText),
				body: normalize(dataset.daynightBody || meta?.body),
				features: normalize(dataset.daynightFeatures || (meta?.features || []).join(' ')),
				condition: normalize(dataset.daynightCondition || meta?.condition),
				mileage: Number(dataset.daynightMileage) || Number(meta?.mileageValue) || 0,
				price: Number(dataset.daynightPrice) || Number(meta?.price) || parsePrice(card.querySelector('.card-box__price')?.textContent),
				haystack
			};
		});
		const fields = Array.from(form.querySelectorAll('select[name]'));
		const searchInput = form.querySelector('input[name="q"]');
		const dropdowns = Array.from(form.querySelectorAll('[data-daynight-quick-dropdown]'));
		const empty = document.querySelector('.daynight-inventory-empty');
		const openSidebarButton = form.querySelector('[data-daynight-open-sidebar]');
		let selectedCondition = '';
		const normalizeCondition = (value) => {
			const normalized = normalize(value);
			if (['new', 'nov', 'novi', 'нов', 'нови', 'нов внос'].includes(normalized)) return 'new';
			if (['used', 'upotrebyavani', 'употребявани', 'употребяван'].includes(normalized)) return 'used';
			return '';
		};
		const setDropdownOpen = (dropdown, isOpen) => {
			dropdown.classList.toggle('active', isOpen);
			const toggle = dropdown.querySelector('.filter-select-dropdown__toggle');
			const trigger = dropdown.querySelector('.filter-select-dropdown__text');
			const menu = dropdown.querySelector('.filter-select-dropdown__menu');
			if (toggle) {
				toggle.checked = isOpen;
			}
			if (trigger) {
				trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			}
			if (menu) {
				menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
				if (isOpen) {
					menu.style.setProperty('opacity', '1', 'important');
					menu.style.setProperty('transform', 'translateY(0)', 'important');
					menu.style.setProperty('visibility', 'visible', 'important');
				} else {
					menu.style.removeProperty('opacity');
					menu.style.removeProperty('transform');
					menu.style.removeProperty('visibility');
				}
			}
		};
		const closeDropdowns = (except) => {
			dropdowns.forEach((dropdown) => {
				if (dropdown === except) return;
				setDropdownOpen(dropdown, false);
			});
		};
		const toggleDropdown = (toggle) => {
			toggle.checked = !toggle.checked;
			toggle.dispatchEvent(new Event('change', { bubbles: true }));
		};
		const shouldHandleDropdownClick = (target) => {
			return !target.closest('.filter-select-dropdown__text, .filter-select-dropdown__menu');
		};
		const compactQuickLabels = {
			price: {
				'under-10000': '≤ 10k EUR',
				'under-20000': '≤ 20k EUR',
				'under-30000': '≤ 30k EUR',
				'under-50000': '≤ 50k EUR',
				'over-50000': '> 50k EUR'
			},
			mileage: {
				'under-100000': '≤ 100k км',
				'under-150000': '≤ 150k км',
				'under-200000': '≤ 200k км',
				'over-200000': '> 200k км'
			},
			transmission: {
				Автоматик: 'Автомат'
			}
		};
		const getCompactQuickLabel = (name, value, fallback) => {
			return compactQuickLabels[name]?.[value] || fallback;
		};
		const syncQuickDropdown = (dropdown) => {
			const select = dropdown.querySelector('select');
			const valueLabel = dropdown.querySelector('[data-daynight-quick-value]');
			const trigger = dropdown.querySelector('.filter-select-dropdown__text');
			if (!select || !valueLabel) return;

			const optionText = select.options[select.selectedIndex]?.textContent || select.options[0]?.textContent || '';
			const baseLabel = dropdown.getAttribute('data-name') || optionText;
			const visibleLabel = select.value
				? getCompactQuickLabel(select.name, select.value, optionText)
				: baseLabel;
			valueLabel.textContent = visibleLabel;
			if (trigger) {
				trigger.setAttribute('aria-label', baseLabel + ': ' + (optionText || visibleLabel));
				trigger.setAttribute('title', optionText || visibleLabel);
			}
			dropdown.classList.toggle('is-selected', Boolean(select.value));
			dropdown.querySelectorAll('[data-daynight-quick-option]').forEach((option) => {
				option.checked = option.value === select.value;
			});
		};
		const syncQuickDropdowns = () => {
			dropdowns.forEach(syncQuickDropdown);
		};
		dropdowns.forEach((dropdown) => {
			const select = dropdown.querySelector('select');
			const toggle = dropdown.querySelector('.filter-select-dropdown__toggle');
			if (!select || !toggle) return;

			dropdown.addEventListener('click', (event) => {
				event.stopPropagation();
				const target = event.target;
				if (!(target instanceof Element) || !shouldHandleDropdownClick(target)) return;

				event.preventDefault();
				toggleDropdown(toggle);
			});
			toggle.addEventListener('change', () => {
				if (toggle.checked) {
					closeDropdowns(dropdown);
					setDropdownOpen(dropdown, true);
				} else {
					setDropdownOpen(dropdown, false);
				}
			});
			const trigger = dropdown.querySelector('.filter-select-dropdown__text');
			trigger?.addEventListener('click', (event) => {
				event.preventDefault();
				toggleDropdown(toggle);
			});
			trigger?.addEventListener('keydown', (event) => {
				if (event.key !== 'Enter' && event.key !== ' ') return;
				event.preventDefault();
				toggleDropdown(toggle);
			});
			dropdown.querySelectorAll('[data-daynight-quick-option]').forEach((option) => {
				option.addEventListener('change', (event) => {
					event.stopPropagation();
					select.value = option.value;
					syncQuickDropdown(dropdown);
					closeDropdowns();
					select.dispatchEvent(new Event('change', { bubbles: true }));
				});
			});
			select.addEventListener('change', () => syncQuickDropdown(dropdown));
		});
		document.addEventListener('click', (event) => {
			if (!event.target.closest('[data-daynight-quick-dropdown]')) {
				closeDropdowns();
			}
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeDropdowns();
			}
		});
		window.addEventListener('resize', () => closeDropdowns());
		const priceMatches = (price, value) => {
			if (!value) return true;
			if (value === 'under-10000') return price > 0 && price <= 10000;
			if (value === 'under-20000') return price > 0 && price <= 20000;
			if (value === 'under-30000') return price > 0 && price <= 30000;
			if (value === 'under-50000') return price > 0 && price <= 50000;
			if (value === 'over-50000') return price > 50000;
			return true;
		};
		const mileageMatches = (mileage, value) => {
			if (!value) return true;
			if (value === 'under-100000') return mileage > 0 && mileage <= 100000;
			if (value === 'under-150000') return mileage > 0 && mileage <= 150000;
			if (value === 'under-200000') return mileage > 0 && mileage <= 200000;
			if (value === 'over-200000') return mileage > 200000;
			return true;
		};
		const getState = () => {
			const state = Object.fromEntries(fields.map((field) => [field.name, field.value]));
			if (searchInput) {
				state.q = searchInput.value;
			}
			if (selectedCondition) {
				state.condition = selectedCondition;
			}
			return state;
		};
		const setStateFromParams = (params) => {
			fields.forEach((field) => {
				field.value = params.has(field.name) ? params.get(field.name) || '' : '';
			});
			if (searchInput) {
				searchInput.value = params.has('q') ? params.get('q') || '' : '';
			}
			selectedCondition = normalizeCondition(params.get('condition') || params.get('type'));
		};
		const updateCounts = (visibleCount) => {
			window.__daynightVisibleInventoryCount = visibleCount;
			document.querySelectorAll('p').forEach((paragraph) => {
				const text = paragraph.textContent || '';
				if (/Показани\\s+\\d+\\s+автомобила/.test(text)) {
					paragraph.textContent = 'Показани ' + visibleCount + ' автомобила';
				} else if (/^\\s*\\d+\\s+автомобила\\s*$/.test(text)) {
					paragraph.textContent = visibleCount + ' автомобила';
				}
			});
			const matchesCount = document.querySelector('#filterMatchesCount');
			if (matchesCount) {
				matchesCount.textContent = visibleCount + ' ';
			}
		};
		const isActiveScope = (data) => {
			if (!data.scope) return true;
			const anyActiveScope = cardData.some((item) => item.scope?.classList.contains('active'));
			if (anyActiveScope) return data.scope.classList.contains('active');
			const style = getComputedStyle(data.scope);
			return style.display !== 'none' && style.visibility !== 'hidden';
		};
		const syncUrl = (state) => {
			const params = new URLSearchParams(window.location.search);
			fields.forEach((field) => {
				if (state[field.name]) {
					params.set(field.name, state[field.name]);
				} else {
					params.delete(field.name);
				}
			});
			if (state.q) {
				params.set('q', state.q);
			} else {
				params.delete('q');
			}
			if (state.condition) {
				params.set('condition', state.condition);
			} else {
				params.delete('condition');
			}
			const query = params.toString();
			window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''));
		};
		const matches = (data, state) => {
			if (state.q) {
				const terms = normalize(state.q).split(/\\s+/).filter(Boolean);
				if (terms.length && !terms.every((term) => data.haystack.includes(term))) return false;
			}
			if (state.brand && data.brand !== normalize(state.brand)) return false;
			if (state.model && data.model !== normalize(state.model) && !data.haystack.includes(normalize(state.model))) return false;
			if (state.fuel && !data.haystack.includes(normalize(state.fuel))) return false;
			if (state.transmission && !data.haystack.includes(normalize(state.transmission))) return false;
			if (state.body && data.body !== normalize(state.body) && !data.haystack.includes(normalize(state.body))) return false;
			if (state.feature && !data.features.includes(normalize(state.feature)) && !data.haystack.includes(normalize(state.feature))) return false;
			if (state.condition && data.condition !== state.condition) return false;
			if (!priceMatches(data.price, state.price)) return false;
			if (!mileageMatches(data.mileage, state.mileage)) return false;
			return true;
		};
		const apply = (updateUrl = true) => {
			const state = getState();
			const visibleVehicleKeys = new Set();
			cardData.forEach((data) => {
				const isVisible = matches(data, state);
				if (isVisible) {
					data.holder.style.display = '';
					data.holder.removeAttribute('data-daynight-filter-hidden');
				} else {
					data.holder.style.display = 'none';
					data.holder.setAttribute('data-daynight-filter-hidden', 'true');
				}
				if (isVisible && isActiveScope(data)) {
					visibleVehicleKeys.add(data.slug);
				}
			});
			const visibleCount = visibleVehicleKeys.size;
			updateCounts(visibleCount);
			if (empty) {
				const isEmpty = visibleCount === 0;
				empty.classList.toggle('is-visible', isEmpty);
				empty.hidden = !isEmpty;
			}
			syncQuickDropdowns();
			if (updateUrl) {
				syncUrl(state);
			}
		};

		const params = new URLSearchParams(window.location.search);
		setStateFromParams(params);
		syncQuickDropdowns();
		openSidebarButton?.addEventListener('click', (event) => {
			event.preventDefault();
			closeDropdowns();
			const sidebar = document.querySelector('#filterSidebar');
			if (sidebar) {
				sidebar.classList.add('active');
				document.body.style.overflow = 'hidden';
			}
		});
		let searchTimer;
		searchInput?.addEventListener('input', () => {
			window.clearTimeout(searchTimer);
			searchTimer = window.setTimeout(() => apply(true), 120);
		});
		form.addEventListener('change', () => apply(true));
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			closeDropdowns();
			apply(true);
		});
		form.querySelectorAll('.daynight-inventory-type-pill').forEach((pill) => {
			pill.addEventListener('click', (event) => {
				const href = pill.getAttribute('href');
				if (!href) return;

				event.preventDefault();
				const url = new URL(href, window.location.href);
				setStateFromParams(url.searchParams);
				closeDropdowns();
				syncQuickDropdowns();
				apply(true);
			});
		});
		form.querySelector('[data-daynight-reset]')?.addEventListener('click', () => {
			fields.forEach((field) => {
				field.value = '';
			});
			if (searchInput) {
				searchInput.value = '';
			}
			selectedCondition = '';
			closeDropdowns();
			syncQuickDropdowns();
			apply(true);
		});
		document.querySelectorAll('.listing-tabs .item-menu').forEach((tab) => {
			tab.addEventListener('click', () => window.setTimeout(() => apply(false), 80));
		});
		apply(false);
		window.setTimeout(() => apply(false), 300);
		window.setTimeout(() => apply(false), 1100);
	};
	setupInventoryQuickFilters();
	const headerSearchPath = (form) => {
		const query = (new FormData(form).get('q') || '').toString().trim();
		const params = new URLSearchParams();
		if (query) {
			params.set('q', query);
		}
		const serialized = params.toString();
		return serialized ? '/inventory?' + serialized : '/inventory';
	};
	const setupHeaderSearch = () => {
		const formShell = document.querySelector('#searchForm.daynight-header-search');
		const toggle = document.querySelector('#searchToggle');
		const wrapper = toggle?.closest('.header-search-wrapper');
		const form = document.querySelector('.daynight-header-search-form');
		if (!formShell || !wrapper || !toggle || !form) return;

		const closeHeaderSearch = () => {
			formShell.classList.remove('active');
			formShell.setAttribute('aria-hidden', 'true');
			wrapper.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		};
		const openHeaderSearch = () => {
			formShell.classList.add('active');
			formShell.setAttribute('aria-hidden', 'false');
			wrapper.classList.add('is-open');
			toggle.setAttribute('aria-expanded', 'true');
			document.body.style.overflow = 'hidden';
		};
		const toggleHeaderSearch = () => {
			if (formShell.classList.contains('active')) {
				closeHeaderSearch();
			} else {
				openHeaderSearch();
			}
		};

		document.addEventListener('click', (event) => {
			if (!(event.target instanceof Element)) return;
			if (event.target.closest('#searchToggle')) {
				event.preventDefault();
				toggleHeaderSearch();
				return;
			}
			if (event.target.closest('#searchModalClose')) {
				event.preventDefault();
				closeHeaderSearch();
				return;
			}
			if (event.target.classList.contains('search-modal__overlay')) {
				closeHeaderSearch();
				return;
			}
			if (!event.target.closest('.daynight-header-search')) {
				closeHeaderSearch();
			}
		});
		document.addEventListener('keydown', (event) => {
			if (
				event.target instanceof Element &&
				event.target.closest('#searchToggle') &&
				(event.key === 'Enter' || event.key === ' ')
			) {
				event.preventDefault();
				toggleHeaderSearch();
				return;
			}
			if (event.key === 'Escape') {
				closeHeaderSearch();
			}
		});
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			closeHeaderSearch();
			window.location.href = headerSearchPath(form);
		});
	};
	setupHeaderSearch();
	const setupHeroLocationPreview = () => {
		document.querySelectorAll('.search-cars__location-wrap').forEach((wrap) => {
			const loadMap = () => {
				const iframe = wrap.querySelector('iframe[data-map-src]');
				const mapSrc = iframe?.dataset.mapSrc;
				if (iframe && mapSrc && !iframe.src) {
					iframe.src = mapSrc;
				}
			};
			wrap.addEventListener('mouseenter', loadMap);
			wrap.addEventListener('focusin', loadMap);
		});
	};
	setupHeroLocationPreview();
	const go = (url) => {
		window.location.href = url;
	};
	const heroSearchPath = (root) => {
		const params = new URLSearchParams();
		const activeType = root?.querySelector('.search-cars__type-option.active');
		const condition = activeType?.dataset.vehicleCondition || '';
		if (condition && condition !== 'all') {
			params.set('condition', condition);
		}
		const query = params.toString();
		return query ? '/inventory?' + query : '/inventory';
	};
	document.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) {
			return;
		}
		const typeOption = event.target.closest('.search-cars__type-option');
		if (typeOption) {
			event.preventDefault();
			const group = typeOption.closest('.search-cars__type');
			group?.querySelectorAll('.search-cars__type-option').forEach((option) => {
				const isActive = option === typeOption;
				option.classList.toggle('active', isActive);
				option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
			});
			return;
		}
		const search = event.target.closest('.search-cars__search');
		if (search) {
			if (search.closest('[data-daynight-inventory-filter]')) {
				return;
			}
			event.preventDefault();
			go(heroSearchPath(search.closest('.search-cars')));
			return;
		}
		const listingCard = event.target.closest('.card-box a, .view-details');
		if (listingCard && /listing-details/i.test(listingCard.getAttribute('href') || '')) {
			event.preventDefault();
			go('/inventory/audi-a6-avant-e-tron');
		}
	});
	document.addEventListener('submit', (event) => {
		const form = event.target;
		if (!form.matches('.send-inquiry')) {
			return;
		}

		event.preventDefault();
		let status = form.querySelector('.daynight-form-status');
		if (!status) {
			status = document.createElement('p');
			status.className = 'daynight-form-status text-highlight font-weight-600 mt-12';
			form.appendChild(status);
		}
		status.textContent = 'Inquiry sent locally';
	});
})();
</script>`;

	return html
		.replace('</head>', `${headInjection}\n</head>`)
		.replace('</body>', `${bodyInjection}\n</body>`);
}

export async function renderDayNightTemplate(
	templateFile: string,
	routePath = '',
	contentContext?: DayNightTemplateContentContext
) {
	const sourceHtml = await loadTemplateHtml(templateFile);

	if (!sourceHtml) {
		return undefined;
	}

	const normalized = normalizeAssetUrls(sourceHtml);
	const withBackgrounds = applyBackgroundImages(normalized);
	const withRoutes = rewriteTemplateLinks(withBackgrounds);
	const withDayNightContent = applyDayNightTemplateContent(
		withRoutes,
		templateFile,
		routePath,
		contentContext
	);
	const withSharedHeader = applySharedHomeHeader(withDayNightContent, templateFile);

	return injectLocalBehavior(withSharedHeader, templateFile);
}
