<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardStat } from "#lib/data/dashboard.ts";
  let {
    stats,
    rowClass,
    mode,
  }: {
    stats: readonly DashboardStat[];
    rowClass: string;
    mode: "member" | "owner" | "wallet";
  } = $props();
</script>

<div class={rowClass}>
  {#each stats as stat (stat.key)}
    <div class={stat.columnClass}
      ><div class="card shadow-none"
        ><div class="card-body">
          <div class={stat.layoutClass}>
            <span class={stat.badgeClass}><i class={stat.iconClass}></i></span>
            <div>
              {#if mode === "member"}<h5 class="desktop-type-stat-compact"
                  >{stat.valuePrefix}<span
                    class={stat.countClass}
                    data-count={stat.count}>{stat.value}</span
                  >{locale.text(stat.valueSuffix)}</h5
                ><p class="desktop-type-body-small">{locale.text(stat.title)}</p
                >
              {:else}<p class="desktop-type-body-small"
                  >{locale.text(stat.title)}</p
                ><h5 class="desktop-type-stat-compact"
                  >{stat.valuePrefix}<span
                    class={stat.countClass}
                    data-count={stat.count}>{stat.value}</span
                  >{locale.text(stat.valueSuffix)}</h5
                ><p class="desktop-type-meta"
                  ><span class={stat.changeClass}
                    >{#if stat.changeIcon}<i class={stat.changeIcon}
                      ></i>{/if}{stat.change}</span
                  >{#if stat.period !== undefined}{locale.text(
                      stat.period,
                    )}{/if}</p
                >{/if}
            </div>
          </div>
        </div></div
      ></div
    >
  {/each}
</div>
