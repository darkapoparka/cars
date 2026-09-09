<script lang="ts">
	import { resolve } from '$app/paths';

	type UploadField = {
		id: string;
		title: string;
		sectionClass: string;
		previewWrapperClass?: string;
		previewClass: string;
		imageId: string;
		image: `/${string}`;
		imageAlt: string;
		contentTitleClass: string;
		descriptionClass: string;
		target: string;
	};

	type TextField = {
		id: string;
		name: string;
		label: string;
		value: string;
		placeholder: string;
		ariaLabel: string;
		className?: string;
		wrapperClass?: string;
		clear?: boolean;
	};

	type SocialField = {
		id: string;
		name: string;
		icon: `/${string}`;
		value: string;
	};

	type LocationOption = {
		id: string;
		label: string;
		value: string;
		checked?: boolean;
	};

	const uploadFields: UploadField[] = [
		{
			id: 'avatar',
			title: 'Upload Avatar*',
			sectionClass: 'upload-section mb-18',
			previewClass: 'upload-preview upload-preview--avatar',
			imageId: 'avatarPreview',
			image: '/assets/images/avatar/avatar-10.jpg',
			imageAlt: 'Avatar Preview',
			contentTitleClass: 'font-weight-600 mb-6',
			descriptionClass: 'text-xs text-secondary mb-6',
			target: 'avatarInput'
		},
		{
			id: 'poster',
			title: ' Dealer Poster*',
			sectionClass: 'upload-section mb-20',
			previewWrapperClass: 'upload-preview--poster-wrapper',
			previewClass: 'upload-preview--poster',
			imageId: 'posterPreview',
			image: '/assets/images/avatar/avatar-11.jpg',
			imageAlt: 'Dealer Poster Preview',
			contentTitleClass: 'font-weight-600 mb-4',
			descriptionClass: 'text-xs text-secondary mb-12',
			target: 'posterInput'
		}
	];

	const nameFields: TextField[] = [
		{
			id: 'first_name',
			name: 'first_name',
			label: 'Fist Name*',
			value: 'John',
			placeholder: 'Fist Name*',
			ariaLabel: 'Fist Name',
			className: 'input-large input-clear active',
			wrapperClass: 'md-col-span-2 padding-0',
			clear: true
		},
		{
			id: 'last_name',
			name: 'last_name',
			label: 'Фамилия*',
			value: 'Smith',
			placeholder: 'Фамилия*',
			ariaLabel: 'Фамилия',
			className: 'input-large input-clear',
			wrapperClass: 'md-col-span-2 padding-0',
			clear: true
		}
	];

	const contactFields: TextField[] = [
		{
			id: 'Phone',
			name: 'Phone',
			label: 'Phone*',
			value: '123  456  7890 ',
			placeholder: 'Phone',
			ariaLabel: 'Phone'
		},
		{
			id: 'SalesPhone',
			name: 'SalesPhone',
			label: 'Sales Phone*',
			value: 'demo@getrich.local',
			placeholder: 'Sales Phone*',
			ariaLabel: 'Sales Phone'
		},
		{
			id: 'EmailAddress',
			name: 'EmailAddress',
			label: 'Email Address*',
			value: 'demo@getrich.local',
			placeholder: 'Email Address*',
			ariaLabel: 'Email Address'
		},
		{
			id: 'Company',
			name: 'Company',
			label: 'Company*',
			value: 'demo@getrich.local',
			placeholder: 'Company*',
			ariaLabel: 'Company'
		}
	];

	const socialRows: SocialField[][] = [
		[
			{
				id: 'Facebook',
				name: 'Facebook',
				icon: '/assets/icons/input-facebook.svg',
				value: 'http://www.facebook.com/avitex'
			},
			{ id: 'skype', name: 'skype', icon: '/assets/icons/input-skype.svg', value: '' },
			{ id: 'xUrl', name: 'xUrl', icon: '/assets/icons/input-x.svg', value: '' }
		],
		[
			{ id: 'telegram', name: 'telegram', icon: '/assets/icons/input-telegram.svg', value: '' },
			{ id: 'instagram', name: 'instagram', icon: '/assets/icons/input-instagram.svg', value: '' },
			{ id: 'youtube', name: 'youtube', icon: '/assets/icons/input-youtube.svg', value: '' }
		]
	];

	const locationText = 'Пловдив, Пловдив, гр. Пловдив, Индустриална зона — Тракия, Цариградско шосе, Индустриална зона — Тракия';
	const locationOptions: LocationOption[] = [
		{
			id: 'location-main',
			label: locationText,
			value: locationText,
			checked: true
		},
		{
			id: 'location-rwd',
			label: `${locationText} 2`,
			value: 'RWD'
		},
		{
			id: 'location-awd',
			label: `${locationText} 3`,
			value: 'AWD'
		}
	];
	const description =
		'Това е фронтенд MVP на клиентски профил. Реална регистрация, вход и съхранение на данни се свързват след избор на backend/auth. \n                                        ';
	const mapSrc =
		'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s';
</script>

{#snippet clearButton(target: string)}
	<button type="button" class="input-clear-btn" data-target={target}>
		<img
			src={resolve('/assets/icons/clear.svg')}
			alt="Clear"
			data-daynight-img="1"
			decoding="async"
			loading="eager"
		/>
	</button>
{/snippet}

{#snippet uploadField(field: UploadField)}
	<p class={field.id === 'poster' ? 'font-weight-600 mb-12' : 'font-weight-600 mb-12'}>
		{field.title}
	</p>
	<div class={field.sectionClass}>
		<div class={field.previewWrapperClass ?? 'flex items-start gap-20'}>
			<div class={field.previewClass}>
				<img
					id={field.imageId}
					src={resolve(field.image)}
					alt={field.imageAlt}
					data-daynight-img="1"
					decoding="async"
					loading="eager"
				/>
			</div>
			<div class="upload-content flex-1">
				<p class={field.contentTitleClass}>Upload File</p>
				<p class={field.descriptionClass}>
					PNG, JPG, SVG dimension (400 * 400) max file not more then size 4 mb.
				</p>
				<div class="flex">
					<div class="upload-action">
						<button type="button" class="upload-btn" data-target={field.target}>Choose File</button>
						<input
							type="file"
							id={field.target}
							accept="image/png,image/jpeg,image/jpg,image/svg+xml"
							class="upload-input"
							aria-label="Поле"
						/>
						<span class="text-muted file-name text-xs" data-target={field.target}
							>No file choose</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet textInput(field: TextField)}
	<div class={field.wrapperClass}>
		<p class="font-weight-600 mb-8">{field.label}</p>
		<div class="input-clear-wrapper">
			<input
				class={field.className ?? 'input-large'}
				type="text"
				name={field.name}
				id={field.id}
				value={field.value}
				placeholder={field.placeholder}
				aria-label={field.ariaLabel}
			/>
			{#if field.clear}
				{@render clearButton(field.id)}
			{/if}
		</div>
	</div>
{/snippet}

{#snippet socialField(field: SocialField)}
	<div class="input-clear-wrapper input-social-wrapper">
		<img
			class="prefix-icon"
			src={resolve(field.icon)}
			alt="Clear"
			data-daynight-img="1"
			decoding="async"
			loading="lazy"
		/>
		<input
			class="input-large input-clear"
			type="text"
			name={field.name}
			id={field.id}
			value={field.value}
			placeholder="URL"
			aria-label="URL"
		/>
		{@render clearButton(field.id)}
	</div>
{/snippet}

<div class="dashboard-content--inner">
	<div class="dashboard-content--details">
		<button
			class="btn btn-primary btn-large font-weight-600 dashboard-toggle-btn mb-24"
			id="dashboardToggleBtn"
			aria-label="Toggle Моят профил"
			type="button"
		>
			Show Моят профил
		</button>
		<p class="h3 mb-40">Данни за контакт</p>
		<form action="#">
			<div class="dashboard-box style-5 mb-38 bg-white">
				<p class="h4 mb-20">Become Dealer</p>

				<p class="hightlight-text text-primary mb-20 text-sm">
					Your current account type is normal. If you want to become a dealer, please click on
					button Become a Dealer
				</p>

				<div class="mb-40 flex">
					<a
						href={resolve('/sell-your-car/request')}
						class="btn btn-primary btn-large-3 font-weight-600"
					>
						Become A Dealer
					</a>
				</div>

				<p class="h4 mb-20">Информация</p>

				{#each uploadFields as field (field.id)}
					{@render uploadField(field)}
				{/each}

				<div class="mb-14 grid grid-cols-2 gap-20">
					{#each nameFields as field (field.id)}
						{@render textInput(field)}
					{/each}

					<div class="padding-0 col-span-2">
						<p class="font-weight-600 mb-8">Description*</p>
						<textarea
							placeholder="Вашето съобщение*"
							rows="4"
							name="message"
							class="message textarea-primary text-secondary"
							id="message"
							required
							aria-label="Съобщение">{description}</textarea
						>
					</div>
				</div>

				<div class="lg-grid-cols-2 md-grid-cols-1 mb-22 grid grid-cols-4 gap-20">
					{#each contactFields as field (field.id)}
						{@render textInput(field)}
					{/each}
				</div>

				<div class="md-grid-cols-1 grid grid-cols-2 gap-20">
					<div>
						<p class="font-weight-600 mb-8">Gender*</p>
						<select name="Gender" id="Gender" aria-label="Male" value="Male">
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
					</div>

					<div>
						<p class="font-weight-600 mb-8">Day of Birth*</p>
						<input
							type="date"
							name="DayofBirth"
							id="DayofBirth"
							value="1994-03-22"
							aria-label="Поле"
						/>
					</div>
				</div>
			</div>

			<div class="dashboard-box style-5 mb-40 bg-white">
				<p class="h4 mb-20">Social Network</p>

				{#each socialRows as row, index (`social-row-${index}`)}
					<div
						class={index === 0
							? 'md-grid-cols-1 mb-20 grid grid-cols-3 gap-32'
							: 'md-grid-cols-1 grid grid-cols-3 gap-32'}
					>
						{#each row as field (field.id)}
							{@render socialField(field)}
						{/each}
					</div>
				{/each}
			</div>

			<div class="dashboard-box style-3 bg-white">
				<p class="h4 mb-20">Location</p>

				<div class="md-grid-cols-1 mb-20 grid grid-cols-2 gap-20">
					<div>
						<p class="font-weight-600 mb-8">Full Address*</p>
						<input
							class="input-large"
							type="text"
							id="PriceListing"
							name="PriceListing"
							placeholder={locationText}
							value=""
							required
							aria-label={locationText}
						/>
					</div>
					<div>
						<p class="font-weight-600 mb-8">Map Location*</p>
						<div class="filter-select-dropdown style2 bg-white" data-name="SelectLocation">
							<input type="checkbox" id="SelectLocation" class="filter-select-dropdown__toggle" />
							<label for="SelectLocation" class="filter-select-dropdown__text">
								<span>{locationText}</span>
							</label>
							<div class="filter-select-dropdown__menu">
								<div class="filter-select-dropdown__list">
									{#each locationOptions as option (option.id)}
										<label class="filter-checkbox">
											<input
												type="checkbox"
												name="SelectLocation"
												value={option.value}
												checked={option.checked}
											/>
											<span>{option.label}</span>
										</label>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="widget-gg-map radius-8 flex overflow-hidden">
					<iframe
						src={mapSrc}
						height="281"
						style="border:0;width: 100%;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Success Automobile map"
					></iframe>
				</div>
			</div>
		</form>
	</div>
</div>
