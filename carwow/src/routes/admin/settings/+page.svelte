<script lang="ts">
	import Building2 from '@lucide/svelte/icons/building-2';
	import Globe from '@lucide/svelte/icons/globe';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Save from '@lucide/svelte/icons/save';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const dealer = $derived(data.dealerSettings);
	const settings = $derived(data.settingsProfile);
	const values = $derived('values' in (form ?? {}) ? form?.values : undefined);
	const errors = $derived('errors' in (form ?? {}) ? form?.errors : undefined);
	type BooleanSetting = 'feedMobileBgXml' | 'feedCarsBgCsv' | 'feedPublic' | 'feedAutoSync';

	function valueFor(field: keyof NonNullable<typeof values>, fallback: string | null | undefined) {
		return values?.[field] ?? fallback ?? '';
	}

	function errorFor(field: keyof NonNullable<typeof errors>) {
		return errors?.[field]?.[0] ?? '';
	}

	function checkedFor(field: BooleanSetting, fallback: boolean) {
		const submitted = values?.[field];
		return submitted === undefined
			? fallback
			: submitted === 'on' || submitted === 'true' || submitted === '1';
	}
</script>

<svelte:head>
	<title>Admin - Settings</title>
</svelte:head>

<AdminShell title="Settings" activePath="/admin/settings">
	<section class="px-4 lg:px-6">
		<Card.Root class="bg-sidebar text-sidebar-foreground">
			<Card.Header>
				<div>
					<Card.Description class="text-sidebar-foreground/60">Workspace settings</Card.Description>
					<Card.Title class="text-2xl font-semibold">
						{dealer?.brand_name ?? 'Dealers Point'} CMS configuration
					</Card.Title>
				</div>
				<Card.Action>
					<Badge variant="outline" class="border-sidebar-border text-sidebar-foreground capitalize">
						{dealer?.status ?? 'active'}
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-3 md:grid-cols-4">
				<div class="border-sidebar-border bg-sidebar-accent/55 rounded-lg border p-3">
					<p class="text-sidebar-foreground/60 text-xs">Dealer slug</p>
					<p class="mt-1 font-medium">{dealer?.slug ?? 'not connected'}</p>
				</div>
				<div class="border-sidebar-border bg-sidebar-accent/55 rounded-lg border p-3">
					<p class="text-sidebar-foreground/60 text-xs">City</p>
					<p class="mt-1 font-medium">{dealer?.city ?? 'Not set'}</p>
				</div>
				<div class="border-sidebar-border bg-sidebar-accent/55 rounded-lg border p-3">
					<p class="text-sidebar-foreground/60 text-xs">Currency</p>
					<p class="mt-1 font-medium">{dealer?.currency_code ?? 'EUR'}</p>
				</div>
				<div class="border-sidebar-border bg-sidebar-accent/55 rounded-lg border p-3">
					<p class="text-sidebar-foreground/60 text-xs">Updated</p>
					<p class="mt-1 font-medium">
						{dealer?.updated_at
							? new Date(dealer.updated_at).toLocaleDateString('en-GB')
							: 'Not set'}
					</p>
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<section class="px-4 lg:px-6">
		<form method="POST" class="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
			<div class="grid gap-4">
				{#if form && 'error' in form && form.error}
					<AdminMessage tone="error">{form.error}</AdminMessage>
				{/if}
				{#if form && 'success' in form && form.success}
					<AdminMessage tone="success">{form.success}</AdminMessage>
				{/if}

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Dealer identity</Card.Title>
							<Card.Description
								>Brand and legal information used across admin records</Card.Description
							>
						</div>
						<Card.Action><Building2 class="text-muted-foreground" aria-hidden="true" /></Card.Action
						>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4 md:grid-cols-2">
						<label class="grid gap-2 text-sm font-medium">
							Display name
							<Input
								name="name"
								value={valueFor('name', dealer?.name)}
								aria-invalid={!!errorFor('name')}
								required
							/>
							{#if errorFor('name')}
								<span class="text-destructive text-xs">{errorFor('name')}</span>
							{/if}
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Brand name
							<Input
								name="brandName"
								value={valueFor('brandName', dealer?.brand_name)}
								aria-invalid={!!errorFor('brandName')}
								required
							/>
						</label>
						<label class="grid gap-2 text-sm font-medium md:col-span-2">
							Legal name
							<Input name="legalName" value={valueFor('legalName', dealer?.legal_name)} />
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Contact profile</Card.Title>
							<Card.Description>Public dealership contact information</Card.Description>
						</div>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4 md:grid-cols-2">
						<label class="grid gap-2 text-sm font-medium">
							Phone
							<Input name="phone" value={valueFor('phone', dealer?.phone)} />
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Phone label
							<Input name="phoneLabel" value={valueFor('phoneLabel', dealer?.phone_label)} />
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Email
							<Input
								name="email"
								type="email"
								value={valueFor('email', dealer?.email)}
								aria-invalid={!!errorFor('email')}
							/>
							{#if errorFor('email')}
								<span class="text-destructive text-xs">{errorFor('email')}</span>
							{/if}
						</label>
						<label class="grid gap-2 text-sm font-medium">
							City
							<Input name="city" value={valueFor('city', dealer?.city)} />
						</label>
						<label class="grid gap-2 text-sm font-medium md:col-span-2">
							Address
							<Input name="address" value={valueFor('address', dealer?.address)} />
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Social channels</Card.Title>
							<Card.Description
								>Public profiles used by the site chrome and sharing surfaces</Card.Description
							>
						</div>
						<Card.Action><Globe class="text-muted-foreground" aria-hidden="true" /></Card.Action>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4 md:grid-cols-3">
						<label class="grid gap-2 text-sm font-medium">
							Facebook URL
							<Input
								name="facebookUrl"
								value={valueFor('facebookUrl', settings.social.facebookUrl)}
							/>
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Instagram URL
							<Input
								name="instagramUrl"
								value={valueFor('instagramUrl', settings.social.instagramUrl)}
							/>
						</label>
						<label class="grid gap-2 text-sm font-medium">
							TikTok URL
							<Input name="tiktokUrl" value={valueFor('tiktokUrl', settings.social.tiktokUrl)} />
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>SEO defaults</Card.Title>
							<Card.Description
								>Fallback title and description for generated public pages</Card.Description
							>
						</div>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4">
						<label class="grid gap-2 text-sm font-medium">
							Default meta title
							<Input
								name="seoTitle"
								value={valueFor('seoTitle', settings.seo.title)}
								aria-invalid={!!errorFor('seoTitle')}
							/>
							{#if errorFor('seoTitle')}
								<span class="text-destructive text-xs">{errorFor('seoTitle')}</span>
							{/if}
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Default meta description
							<Input
								name="seoDescription"
								value={valueFor('seoDescription', settings.seo.description)}
								aria-invalid={!!errorFor('seoDescription')}
							/>
							{#if errorFor('seoDescription')}
								<span class="text-destructive text-xs">{errorFor('seoDescription')}</span>
							{/if}
						</label>
					</Card.Content>
				</Card.Root>
			</div>

			<aside class="grid gap-4 self-start xl:sticky xl:top-24">
				<Card.Root>
					<Card.Header class="border-b">
						<Card.Title>Save settings</Card.Title>
						<Card.Description>Apply profile changes to the CMS dealer record</Card.Description>
					</Card.Header>
					<Card.Content class="p-4">
						<Button type="submit" class="w-full">
							<Save data-icon="inline-start" aria-hidden="true" />
							Save settings
						</Button>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Feed publishing</Card.Title>
							<Card.Description
								>Marketplace export controls backed by dealer settings</Card.Description
							>
						</div>
					</Card.Header>
					<Card.Content class="grid gap-3 p-4">
						<label class="bg-muted/30 flex items-start gap-3 rounded-lg border p-3 text-sm">
							<Checkbox
								name="feedMobileBgXml"
								value="true"
								checked={checkedFor('feedMobileBgXml', settings.feeds.mobileBgXml)}
								class="mt-0.5 size-7 rounded-md [&_[data-slot=checkbox-indicator]>svg]:size-4"
							/>
							<span class="grid gap-0.5">
								<span class="font-medium">mobile.bg XML</span>
								<span class="text-muted-foreground text-xs"
									>Expose published listings for XML export.</span
								>
							</span>
						</label>
						<label class="bg-muted/30 flex items-start gap-3 rounded-lg border p-3 text-sm">
							<Checkbox
								name="feedCarsBgCsv"
								value="true"
								checked={checkedFor('feedCarsBgCsv', settings.feeds.carsBgCsv)}
								class="mt-0.5 size-7 rounded-md [&_[data-slot=checkbox-indicator]>svg]:size-4"
							/>
							<span class="grid gap-0.5">
								<span class="font-medium">cars.bg CSV</span>
								<span class="text-muted-foreground text-xs"
									>Keep the CSV export enabled for partners.</span
								>
							</span>
						</label>
						<label class="bg-muted/30 flex items-start gap-3 rounded-lg border p-3 text-sm">
							<Checkbox
								name="feedPublic"
								value="true"
								checked={checkedFor('feedPublic', settings.feeds.public)}
								class="mt-0.5 size-7 rounded-md [&_[data-slot=checkbox-indicator]>svg]:size-4"
							/>
							<span class="grid gap-0.5">
								<span class="font-medium">Public feed endpoints</span>
								<span class="text-muted-foreground text-xs"
									>Allow generated feed routes to remain available.</span
								>
							</span>
						</label>
						<label class="bg-muted/30 flex items-start gap-3 rounded-lg border p-3 text-sm">
							<Checkbox
								name="feedAutoSync"
								value="true"
								checked={checkedFor('feedAutoSync', settings.feeds.autoSync)}
								class="mt-0.5 size-7 rounded-md [&_[data-slot=checkbox-indicator]>svg]:size-4"
							/>
							<span class="grid gap-0.5">
								<span class="font-medium">Auto-sync source inventory</span>
								<span class="text-muted-foreground text-xs"
									>Record whether scheduled source refreshes are enabled.</span
								>
							</span>
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Marketplace links</Card.Title>
							<Card.Description>External URLs and inventory feed source</Card.Description>
						</div>
						<Card.Action><LinkIcon class="text-muted-foreground" aria-hidden="true" /></Card.Action>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4">
						<label class="grid gap-2 text-sm font-medium">
							Website URL
							<Input name="websiteUrl" value={valueFor('websiteUrl', dealer?.website_url)} />
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Source inventory URL
							<Input
								name="sourceInventoryUrl"
								value={valueFor('sourceInventoryUrl', dealer?.source_inventory_url)}
							/>
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Locale</Card.Title>
							<Card.Description>Regional defaults for CMS-generated labels</Card.Description>
						</div>
						<Card.Action><Globe class="text-muted-foreground" aria-hidden="true" /></Card.Action>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4">
						<label class="grid gap-2 text-sm font-medium">
							Country code
							<Input
								name="countryCode"
								maxlength={2}
								value={valueFor('countryCode', dealer?.country_code)}
							/>
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Timezone
							<Input name="timezone" value={valueFor('timezone', dealer?.timezone)} />
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Default locale
							<Input
								name="defaultLocale"
								value={valueFor('defaultLocale', dealer?.default_locale)}
							/>
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Currency code
							<Input
								name="currencyCode"
								maxlength={3}
								value={valueFor('currencyCode', dealer?.currency_code)}
							/>
						</label>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="border-b">
						<div>
							<Card.Title>Logos</Card.Title>
							<Card.Description>Brand assets used by public and admin surfaces</Card.Description>
						</div>
						<Card.Action><ImageIcon class="text-muted-foreground" aria-hidden="true" /></Card.Action
						>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4">
						<label class="grid gap-2 text-sm font-medium">
							Light logo URL
							<Input name="logoLightUrl" value={valueFor('logoLightUrl', dealer?.logo_light_url)} />
						</label>
						<label class="grid gap-2 text-sm font-medium">
							Dark logo URL
							<Input name="logoDarkUrl" value={valueFor('logoDarkUrl', dealer?.logo_dark_url)} />
						</label>
					</Card.Content>
				</Card.Root>
			</aside>
		</form>
	</section>
</AdminShell>
