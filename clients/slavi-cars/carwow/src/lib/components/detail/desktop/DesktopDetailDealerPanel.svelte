<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	const phoneHref = `tel:${daynightSite.phone}`;
	const viberHref = `viber://chat?number=%2B359${daynightSite.phone.slice(1)}`;
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
				src="/assets/images/avatar/contact-avatar.webp"
				alt="Slavi Cars"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>

			<div class="content">
				<a href={resolve('/about/slavi-cars')} class="h4 font-weight-600 mb-8">
					Slavi Cars
				</a>

				<div class="verify">
					<img
						src="/assets/icons/SealCheck.svg"
						alt="verified"
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
					<p class="text-highlight text-sm">Проверена автокъща</p>
				</div>
			</div>
		</div>

		<ul class="contact-info mb-20">
			<li>
				<p class="icon">
					<img
						src="/assets/icons/MapPin.svg"
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
				</p>
				<div class="flex flex-col gap-4">
					<a {...mapLinkProps}>{daynightSite.location}</a>
					<a {...mapLinkProps} class="text-underline text-highlight text-sm"> Виж локация </a>
				</div>
			</li>
		</ul>
		<ul class="contact-info mb-28">
			<li class="items-center">
				<p class="icon">
					<img
						src="/assets/icons/PhoneCall.svg"
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="lazy"
					/>
				</p>
				<div class="flex flex-col">
					<a href={phoneHref}>
						{daynightSite.phoneLabel}
					</a>
				</div>
			</li>
		</ul>

		<a href={phoneHref} class="sa-cta sa-cta-primary sa-cta-compact mb-12 w-full">
			<img
				src="/assets/icons/PhoneCall-2.svg"
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="lazy"
			/>
			Обади се за оглед
		</a>

		<a href={viberHref} class="sa-cta sa-cta-ghost sa-cta-compact w-full">
			<img
				src="/assets/icons/ChatCircleDots.svg"
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="lazy"
			/>
			Viber чат
		</a>
	</div>
</div>
