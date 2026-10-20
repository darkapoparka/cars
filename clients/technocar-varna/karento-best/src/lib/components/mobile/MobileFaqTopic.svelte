<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { FaqSupportTopic } from "#lib/data/faq.ts";
  import FaqSupportIcon from "#lib/components/faq/FaqSupportIcon.svelte";
  import MobileIcon from "./MobileIcon.svelte";
  let { topic }: { topic: FaqSupportTopic } = $props();
</script>

<a
  class="mobile-faq-topic"
  href={locale.href(topic.href)}
  aria-label={locale.text(topic.title)}
>
  <span class="mobile-faq-topic-icon"><FaqSupportIcon name={topic.icon} /></span
  >
  <span class="mobile-faq-topic-copy">
    <strong>{locale.text(topic.title)}</strong>
    <span>{locale.text(topic.description)}</span>
  </span>
  <MobileIcon name="arrow-right" />
</a>
