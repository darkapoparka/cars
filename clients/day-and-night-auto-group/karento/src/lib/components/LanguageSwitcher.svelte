<script lang="ts">
  import { page } from "$app/state";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { locales, supportedLocales } from "#lib/i18n/locales.ts";
  const locale = useLocale();
</script>

<div class="mt-20" data-signature-language>
  <p class="text-sm-medium neutral-500 desktop-type-body-small"
    >{locale.t("locale.label")}</p
  >
  <div class="d-flex gap-2" role="group" aria-label={locale.t("locale.label")}>
    {#each supportedLocales as language (language)}
      <a
        class="btn btn-gray desktop-type-control"
        href={locale.href(
          page.url.pathname + page.url.search + page.url.hash,
          language,
        )}
        lang={language}
        hreflang={language}
        aria-current={locale.locale === language ? "true" : undefined}
        aria-label={locale.t("locale.switch", {
          language: locales[language].label,
        })}>{locales[language].label}</a
      >
    {/each}
  </div>
</div>
