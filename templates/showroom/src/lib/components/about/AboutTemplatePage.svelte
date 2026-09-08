<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AboutContent from './AboutContent.svelte';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import { eliqAboutCompany } from '$lib/data/eliqauto-about';

	let {
		about,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		about: AuxeroAboutContent;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	mainClass="eliqauto-about-main"
	footer={{
		...shellFooter,
		hours: eliqAboutCompany.hours,
		logo: { ...shellFooter.logo, src: eliqautoAssets.logoLight }
	}}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="За нас — Eliqauto"
>
	<AboutContent {about} />
</AuxeroPublicShell>

<style>
	:global(.eliqauto-about-main + .footer .logo) {
		filter: brightness(0) invert(1);
		width: 220px;
		height: auto;
	}
</style>
