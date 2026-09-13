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
	title="Новини — Day Night Auto"
>
	<section class="daynight-blog-page" data-daynight-blog-page>
		<div class="bc-container daynight-blog-page__inner">
			<header class="daynight-blog-page__header">
				<h1 class="h2">{blogPage.title}</h1>
			</header>
			<BlogListGrid {posts} />
		</div>
	</section>
</AuxeroPublicShell>

<style>
	.daynight-blog-page__inner {
		padding-block: 56px 88px;
	}

	.daynight-blog-page__header {
		margin-bottom: 40px;
	}

	.daynight-blog-page__header :global(h1) {
		margin: 0;
	}

	@media (max-width: 767px) {
		.daynight-blog-page__inner {
			padding-block: 32px 56px;
		}

		.daynight-blog-page__header {
			margin-bottom: 28px;
		}
	}
</style>
