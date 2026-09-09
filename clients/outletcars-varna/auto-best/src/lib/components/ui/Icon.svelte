<script lang="ts">
  type IconName =
    | 'adjustments'
    | 'arrow-left'
    | 'arrow-right'
    | 'calendar'
    | 'chevron-down'
    | 'clock'
    | 'file-invoice'
    | 'fuel'
    | 'globe'
    | 'home'
    | 'mail'
    | 'map-pin'
    | 'menu'
    | 'message'
    | 'phone'
    | 'search'
    | 'car'
    | 'tag'
    | 'transmission'
    | 'x';

  interface Props {
    name: IconName;
    size?: number;
    strokeWidth?: number;
  }

  let { name, size = 20, strokeWidth = 1.7 }: Props = $props();
</script>

<svg
  class="dn-icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'adjustments'}
    <path d="M4 3v5.5M4 13.5V21M12 3v1.5M12 9.5V21M20 3v9.5M20 17.5V21" />
    <circle cx="4" cy="11" r="2.5" />
    <circle cx="12" cy="7" r="2.5" />
    <circle cx="20" cy="15" r="2.5" />
  {:else if name === 'chevron-down'}
    <path d="m6 9 6 6 6-6" />
  {:else if name === 'map-pin'}
    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
  {:else if name === 'phone'}
    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
  {:else if name === 'clock'}
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 7v5l3 3" />
  {:else if name === 'mail'}
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <path d="M3 7l9 6l9 -6" />
  {:else if name === 'calendar'}
    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2V7" />
    <path d="M16 3v4M8 3v4M4 11h16M8 15h2v2H8z" />
  {:else if name === 'search'}
    <circle cx="10.75" cy="10.75" r="7.25" />
    <path d="m16.1 16.1l4.4 4.4" />
  {:else if name === 'home'}
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5.5 10v10h13V10M9.5 20v-6h5v6" />
  {:else if name === 'car'}
    <path d="M5 17h14M6 17l-1-3l2-5h10l2 5l-1 3" />
    <path d="M7 9l1.5-3h7L17 9M7 17v2M17 17v2" />
    <circle cx="8" cy="14" r="1" />
    <circle cx="16" cy="14" r="1" />
  {:else if name === 'globe'}
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.4 2.45 3.5 5.45 3.5 9s-1.1 6.55-3.5 9c-2.4-2.45-3.5-5.45-3.5-9S9.6 5.45 12 3" />
  {:else if name === 'menu'}
    <path d="M4 7h16M4 12h16M4 17h16" />
  {:else if name === 'fuel'}
    <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0V9l-3 -3" />
    <path d="M4 20V6a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14M3 20h12M18 7v1a1 1 0 0 0 1 1h1M4 11h10" />
  {:else if name === 'transmission'}
    <path d="M3 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M10 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M10 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 8v8M12 8v8M19 8v2a2 2 0 0 1 -2 2H5" />
  {:else if name === 'tag'}
    <path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71A2 2 0 0 0 11.172 3H6a3 3 0 0 0 -3 3" />
  {:else if name === 'file-invoice'}
    <path d="M14 3v4a1 1 0 0 0 1 1h4M17 21H7a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2M9 7h1M9 13h6M13 17h2" />
  {:else if name === 'message'}
    <path d="M8 9h8M8 13h6M12 21l-3 -3H6a3 3 0 0 1 -3 -3V7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3" />
  {:else if name === 'arrow-left'}
    <path d="M19 12H5M11 18l-6 -6M11 6l-6 6" />
  {:else if name === 'arrow-right'}
    <path d="M5 12h14M13 18l6 -6M13 6l6 6" />
  {:else if name === 'x'}
    <path d="M18 6l-12 12M6 6l12 12" />
  {/if}
</svg>

<style>
  .dn-icon {
    display: block;
    flex: 0 0 auto;
  }
</style>
