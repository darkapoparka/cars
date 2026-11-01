<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { ArticleHeaderMetadata } from "#lib/data/page-headers.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { metadata }: { metadata: ArticleHeaderMetadata } = $props();
</script>

<div class="card-meta-user"
  ><div class="box-author-small"
    ><img class="border-0" src={metadata.avatar} alt="" /><p
      class="text-sm-bold desktop-type-meta">{locale.text(metadata.author)}</p
    ></div
  ><div class="card-meta gap-2 d-flex"
    ><span class="post-date text-white desktop-type-meta"
      >{locale.date(metadata.date)}</span
    >{" "}<span class="post-time text-white desktop-type-meta"
      >{locale.text(metadata.duration)}</span
    >{" "}<span class="post-comment text-white desktop-type-meta"
      >{locale.text(metadata.comments)}</span
    ></div
  ></div
>
