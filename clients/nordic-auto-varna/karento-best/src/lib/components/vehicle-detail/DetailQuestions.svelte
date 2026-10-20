<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    referenceQuestions,
    type DetailQuestion,
  } from "#lib/data/vehicle-detail.ts";
  let {
    questions = referenceQuestions,
  }: { questions?: readonly DetailQuestion[] } = $props();
</script>

<div class="card card-body"
  ><div class="list-questions"
    >{#each questions as question (question.id)}
      <div class={["item-question", { active: question.featured }]}
        ><div class="head-question"
          ><p class="text-md-bold neutral-1000 desktop-type-control"
            >{locale.text(question.question)}</p
          ></div
        ><div class="content-question"
          ><p class="text-sm-medium neutral-800 desktop-type-body-small"
            >{locale.text(question.answer)}</p
          ></div
        ></div
      >
    {/each}</div
  ></div
>

<style>
  @media (min-width: 992px) {
    .list-questions .item-question {
      padding: var(--karento-desktop-card-padding-compact)
        var(--karento-desktop-card-padding);
      margin-bottom: var(--karento-desktop-space-3);
      border-radius: var(--karento-desktop-card-radius);
    }
    .item-question .head-question {
      margin-bottom: var(--karento-desktop-space-2);
    }
  }
</style>
