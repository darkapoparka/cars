<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import DesktopVehicleActions from '$lib/components/shared/DesktopVehicleActions.svelte';
	import { resolve } from '$app/paths';
	import { fromAction } from 'svelte/attachments';
	import {
		getDayNightVehicleCondition,
		getDayNightVehicleAvailability,
		type DayNightVehicle
	} from '$lib/data/daynight-vehicles';
	import { desktopVehicleImage, desktopVehicleImageSrcset } from '$lib/utils/desktop-vehicle-image';
	import { desktopOnlyImagePlaceholder } from '$lib/utils/desktop-only-assets';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const imageFallbackAttachment = fromAction(daynightImageFallback);
	const condition = $derived(getDayNightVehicleCondition(vehicle));
	const image = $derived(desktopVehicleImage(vehicle.image));
	const featureList = $derived(vehicle.features.join(' | '));
	const visiblePhotoCount = $derived(vehicle.gallery.length > 1 ? vehicle.gallery.length : 0);
</script>

<div
	class="daynight-home-inventory__card"
	data-daynight-vehicle-card=""
	data-daynight-slug={vehicle.slug}
	data-daynight-brand={vehicle.brand}
	data-daynight-model={vehicle.model}
	data-daynight-body={vehicle.body}
	data-daynight-fuel={vehicle.fuel}
	data-daynight-transmission={vehicle.transmission}
	data-daynight-price={vehicle.price}
	data-daynight-mileage={vehicle.mileageValue}
	data-daynight-condition={condition}
	data-daynight-features={featureList}
	data-daynight-title={vehicle.title}
	data-daynight-year={vehicle.year}
>
	<div class="daynight-home-inventory-card__top">
		<p
			class="daynight-home-inventory-card__status"
			class:daynight-home-inventory-card__status--incoming={getDayNightVehicleAvailability(
				vehicle
			) === 'incoming'}
		>
			{i18n.spec(vehicle.badges[0] ?? 'VIP')}
		</p>
		<DesktopVehicleActions slug={vehicle.slug} title={vehicle.shortTitle} />
	</div>
	<div class="daynight-home-inventory-card__media">
		<a
			href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
			aria-label={i18n.t('pattern.db06e7c6718a', { v0: vehicle.shortTitle })}
		>
			<img
				class="daynight-home-inventory-card__image"
				src={i18n.asset(image.width ? desktopOnlyImagePlaceholder : image.src)}
				srcset={desktopVehicleImageSrcset(vehicle.image, i18n.asset)}
				sizes="(min-width: 1400px) 312px, (min-width: 992px) calc((100vw - 152px) / 4), 1px"
				width={image.width}
				height={image.height}
				alt={vehicle.shortTitle}
				data-daynight-image-fallback
				loading="lazy"
				decoding="async"
				{@attach imageFallbackAttachment}
			/>
		</a>
		<div class="daynight-home-inventory-card__badges">
			<p class="daynight-home-inventory-card__badge">
				<a
					href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
					class="daynight-home-inventory-card__badge-link"
					aria-label={`${i18n.spec(vehicle.transmission)} - ${vehicle.shortTitle}`}
					>{i18n.spec(vehicle.transmission)}</a
				>
			</p>
			{#if visiblePhotoCount}
				<div class="daynight-home-inventory-card__tag-row">
					<p class="daynight-home-inventory-card__badge">
						<img src={i18n.asset('/assets/icons/picture.svg')} alt="" aria-hidden="true" />
						{visiblePhotoCount}
					</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="daynight-home-inventory-card__content">
		<p class="daynight-home-inventory-card__title">
			<a
				href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
				title={vehicle.shortTitle}>{vehicle.shortTitle}</a
			>
		</p>
		<ul class="daynight-home-inventory-card__specs">
			<li>
				<img src={i18n.asset('/assets/icons/icon-gauge.svg')} alt="" aria-hidden="true" /><span
					>{i18n.distance(vehicle.mileage)}</span
				>
			</li>
			<li>
				<img src={i18n.asset('/assets/icons/calendar.svg')} alt="" aria-hidden="true" /><span
					>{vehicle.year}</span
				>
			</li>
			<li>
				<img src={i18n.asset('/assets/icons/gaspump.svg')} alt="" aria-hidden="true" /><span
					>{i18n.spec(vehicle.fuel)}</span
				>
			</li>
		</ul>
		<p class="daynight-home-inventory-card__price">
			<span class="daynight-card-price__value">{vehicle.priceEur}</span>
			<span class="daynight-card-price__meta"
				><a href={i18n.href(resolve('/financing'))} class="daynight-card-price__link"
					>{i18n.spec(vehicle.monthly)}</a
				></span
			>
		</p>
	</div>
</div>
