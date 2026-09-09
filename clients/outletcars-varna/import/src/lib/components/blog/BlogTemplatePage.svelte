<script lang="ts">
	import type { AuxeroBlogListPageData } from '$lib/auxero/blog-list';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { BlogPost } from '$lib/data/blog';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import BlogListGrid from './BlogListGrid.svelte';

	let {
		blogPage,
		pageDocument,
		posts,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		blogPage: AuxeroBlogListPageData;
		pageDocument: AuxeroPageDocument;
		posts: BlogPost[];
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Новини — OUTLETCARS.BG — Варна"
>
	<section class="pb-100" data-daynight-blog-page>
		<div class="container"><h1 class="h2">{blogPage.title}</h1></div>
		<div class="tf-spacing-style3"></div>
		<div class="container">
			<BlogListGrid {posts} />
		</div>
	</section>
</AuxeroPublicShell>
