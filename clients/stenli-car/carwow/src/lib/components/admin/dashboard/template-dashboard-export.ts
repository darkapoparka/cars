import { daynightVehicles } from '$lib/data/daynight-vehicles';

export function setupDashboardExportPanel() {
	const details = document.querySelector<HTMLElement>('.dashboard-content--details');
	if (!details || details.querySelector('.daynight-export')) {
		return () => {};
	}

	const feed = daynightVehicles.map((vehicle) => ({
		ref: vehicle.lot,
		brand: vehicle.brand,
		model: vehicle.model,
		year: vehicle.year,
		priceBgn: vehicle.priceBgn,
		fuel: vehicle.fuel,
		gearbox: vehicle.transmission,
		category: vehicle.body,
		mileage: vehicle.mileageValue,
		power: vehicle.power,
		color: vehicle.color,
		title: vehicle.title,
		description: vehicle.description,
		images: vehicle.gallery
	}));
	if (!feed.length) {
		return () => {};
	}

	const xmlEsc = (value: unknown) =>
		String(value ?? '')
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;');

	const buildXml = () => {
		const lines = [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<ads source="СТЕНЛИ КАР" type="demo-feed">'
		];
		feed.forEach((vehicle) => {
			lines.push('  <ad>');
			lines.push(`    <ref>${xmlEsc(vehicle.ref)}</ref>`);
			lines.push(`    <make>${xmlEsc(vehicle.brand)}</make>`);
			lines.push(`    <model>${xmlEsc(vehicle.model)}</model>`);
			lines.push(`    <year>${xmlEsc(vehicle.year)}</year>`);
			lines.push(`    <price currency="BGN">${xmlEsc(vehicle.priceBgn)}</price>`);
			lines.push(`    <fuel>${xmlEsc(vehicle.fuel)}</fuel>`);
			lines.push(`    <gearbox>${xmlEsc(vehicle.gearbox)}</gearbox>`);
			lines.push(`    <category>${xmlEsc(vehicle.category)}</category>`);
			lines.push(`    <mileage unit="km">${xmlEsc(vehicle.mileage)}</mileage>`);
			lines.push(`    <power>${xmlEsc(vehicle.power)}</power>`);
			lines.push(`    <color>${xmlEsc(vehicle.color)}</color>`);
			lines.push(`    <title>${xmlEsc(vehicle.title)}</title>`);
			lines.push(`    <description>${xmlEsc(vehicle.description)}</description>`);
			lines.push('    <images>');
			vehicle.images.forEach((img) => lines.push(`      <image>${xmlEsc(img)}</image>`));
			lines.push('    </images>');
			lines.push('  </ad>');
		});
		lines.push('</ads>');
		return lines.join('\n');
	};

	const csvCell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
	const buildCsv = () => {
		const headers = [
			'ref',
			'make',
			'model',
			'year',
			'price_bgn',
			'fuel',
			'gearbox',
			'category',
			'mileage_km',
			'power',
			'color',
			'images'
		];
		const rows = [headers.join(',')];
		feed.forEach((vehicle) => {
			rows.push(
				[
					vehicle.ref,
					vehicle.brand,
					vehicle.model,
					vehicle.year,
					vehicle.priceBgn,
					vehicle.fuel,
					vehicle.gearbox,
					vehicle.category,
					vehicle.mileage,
					vehicle.power,
					vehicle.color,
					vehicle.images.join(' | ')
				]
					.map(csvCell)
					.join(',')
			);
		});
		return rows.join('\r\n');
	};

	const download = (filename: string, content: string, mime: string) => {
		const blob = new Blob([content], { type: `${mime};charset=utf-8` });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1500);
	};

	const panel = document.createElement('div');
	panel.className = 'dashboard-box bg-white daynight-export';
	panel.innerHTML = `
		<div class="daynight-export__head">
			<div>
				<p class="h4">Експорт към mobile.bg / cars.bg</p>
				<span class="daynight-export__sub">Въведете автомобила веднъж — изтеглете готов файл за качване във всяка платформа. Край на ръчното дублиране на обяви.</span>
			</div>
			<span class="daynight-export__count">${feed.length} активни обяви</span>
		</div>
		<div class="daynight-export__actions">
			<button type="button" class="daynight-export__btn daynight-export__btn--primary" data-export="mobilebg">Свали mobile.bg feed (XML)</button>
			<button type="button" class="daynight-export__btn" data-export="carsbg">Свали cars.bg feed (CSV)</button>
			<button type="button" class="daynight-export__btn daynight-export__btn--ghost" data-export="preview">Преглед на feed-а</button>
		</div>
		<pre class="daynight-export__preview" hidden></pre>
		<p class="daynight-export__hint">Файлът се качва в дилърския панел на mobile.bg / cars.bg → „Импорт на обяви". Снимките се обслужват от публични URL адреси.</p>
	`;

	const stats = details.querySelector('.grid.grid-cols-4');
	if (stats) {
		stats.insertAdjacentElement('afterend', panel);
	} else {
		details.insertBefore(panel, details.firstChild);
	}

	const preview = panel.querySelector<HTMLPreElement>('.daynight-export__preview');
	const onClick = (event: Event) => {
		const target = event.target;
		const button = target instanceof Element ? target.closest<HTMLElement>('[data-export]') : null;
		if (!button) {
			return;
		}

		event.preventDefault();
		const kind = button.dataset.export;
		if (kind === 'mobilebg') {
			download('daynight-auto-mobilebg.xml', buildXml(), 'application/xml');
		} else if (kind === 'carsbg') {
			download('daynight-auto-carsbg.csv', buildCsv(), 'text/csv');
		} else if (kind === 'preview' && preview) {
			if (preview.hasAttribute('hidden')) {
				preview.textContent = buildXml();
				preview.removeAttribute('hidden');
				button.textContent = 'Скрий feed-а';
			} else {
				preview.setAttribute('hidden', '');
				button.textContent = 'Преглед на feed-а';
			}
		}
	};
	panel.addEventListener('click', onClick);

	return () => {
		panel.removeEventListener('click', onClick);
		panel.remove();
	};
}
