<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	const phoneHref = daynightSite.phoneHref;
	const viberHref = daynightSite.viberHref;
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
</script>

<div class="listing-details--sidebar-box mb-40">
	<div class="listing-details--contact">
		<div class="listing-details--contact-dealer mb-28">
			<img
				src={i18n.asset('/assets/images/avatar/contact-avatar.webp')}
				alt={`${daynightSite.shortName}`}
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>

			<div class="content">
				<a
					href={i18n.href(resolve('/about/daynight-auto-plovdiv'))}
					class="h4 font-weight-600 mb-8"
				>
					{daynightSite.shortName}
				</a>

				<div class="verify">
					<img
						src={i18n.asset('/assets/icons/SealCheck.svg')}
						alt={i18n.t('copy.1c34f88707b5')}
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
					<p class="text-highlight text-sm">{i18n.t('copy.aa0ad8ef6502')}</p>
				</div>
			</div>
		</div>

		<ul class="contact-info mb-20">
			<li>
				<p class="icon">
					<img
						src={i18n.asset('/assets/icons/MapPin.svg')}
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
				</p>
				<div class="flex flex-col gap-4">
					<a {...mapLinkProps}>{i18n.dealer('address')}</a>
					<a {...mapLinkProps} class="text-underline text-highlight text-sm">
						{i18n.t('copy.d78ccda3011d')}
					</a>
				</div>
			</li>
		</ul>
		<ul class="contact-info mb-28">
			<li class="items-center">
				<p class="icon">
					<img
						src={i18n.asset('/assets/icons/PhoneCall.svg')}
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
				</p>
				<div class="flex flex-col">
					<a href={i18n.href(phoneHref)}>
						{daynightSite.phoneLabel}
					</a>
				</div>
			</li>
		</ul>

		<a href={i18n.href(phoneHref)} class="sa-cta-compact mb-12 sa-cta w-full sa-cta-primary">
			<img
				src={i18n.asset('/assets/icons/PhoneCall-2.svg')}
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="lazy"
			/>
			{i18n.t('copy.30ebf6dff086')}
		</a>

		<a href={i18n.href(viberHref)} class="sa-cta-compact sa-cta w-full sa-cta-ghost">
			<img
				src={i18n.asset('/assets/icons/ChatCircleDots.svg')}
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="lazy"
			/>
			{i18n.t('copy.0e6a70363e9c')}
		</a>
	</div>
</div>
