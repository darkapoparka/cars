<script lang="ts">
	let {
		name,
		active = false
	}: { name: 'home' | 'car' | 'sell' | 'import' | 'menu'; active?: boolean } = $props();
</script>

<!-- Hugeicons Stroke Rounded, MIT. See hugeicons-LICENSE.txt.
Navigation artwork: core-free-icons 4.3.0, matching templates/modern.
Home03: core-free-icons 4.3.2. SVG geometry is unmodified. -->
<svg
	aria-hidden="true"
	focusable="false"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	data-icon-family="hugeicons-stroke-rounded"
	stroke-width={active ? 1.9 : 1.5}
>
	{#if name === 'home'}
		<path
			d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15 21.5V16.5C15 15.0858 15 14.3787 14.5607 13.9393C14.1213 13.5 13.4142 13.5 12 13.5C10.5858 13.5 9.87868 13.5 9.43934 13.9393C9 14.3787 9 15.0858 9 16.5V21.5"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'car'}
		<path d="M2.5 12L4.5 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path
			d="M21.5 12.5L19.5 13"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M8 17.5L8.24567 16.8858C8.61101 15.9725 8.79368 15.5158 9.17461 15.2579C9.55553 15 10.0474 15 11.0311 15H12.9689C13.9526 15 14.4445 15 14.8254 15.2579C15.2063 15.5158 15.389 15.9725 15.7543 16.8858L16 17.5"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M2 17V19.882C2 20.2607 2.24075 20.607 2.62188 20.7764C2.86918 20.8863 3.10538 21 3.39058 21H5.10942C5.39462 21 5.63082 20.8863 5.87812 20.7764C6.25925 20.607 6.5 20.2607 6.5 19.882V18"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M17.5 18V19.882C17.5 20.2607 17.7408 20.607 18.1219 20.7764C18.3692 20.8863 18.6054 21 18.8906 21H20.6094C20.8946 21 21.1308 20.8863 21.3781 20.7764C21.7592 20.607 22 20.2607 22 19.882V17"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M20 8.5L21 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M4 8.5L3 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path
			d="M4.5 9L5.5883 5.73509C6.02832 4.41505 6.24832 3.75503 6.7721 3.37752C7.29587 3 7.99159 3 9.38304 3H14.617C16.0084 3 16.7041 3 17.2279 3.37752C17.7517 3.75503 17.9717 4.41505 18.4117 5.73509L19.5 9"
			stroke="currentColor"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 9H19.5C20.4572 10.0135 22 11.4249 22 12.9996V16.4702C22 17.0407 21.6205 17.5208 21.1168 17.5875L18 18H6L2.88316 17.5875C2.37955 17.5208 2 17.0407 2 16.4702V12.9996C2 11.4249 3.54279 10.0135 4.5 9Z"
			stroke="currentColor"
			stroke-linejoin="round"
		/>
	{:else if name === 'sell'}
		<circle
			cx="1.5"
			cy="1.5"
			r="1.5"
			transform="matrix(1 0 0 -1 16 8.00024)"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
			stroke="currentColor"
		/>
		<path
			d="M7.00002 14.0002L10 17.0002"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'import'}
		<circle cx="12" cy="12" r="10" stroke="currentColor" />
		<path
			d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z"
			stroke="currentColor"
			stroke-linejoin="round"
		/>
		<path d="M21 15H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M21 9H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
	{:else if name === 'menu'}
		<path d="M4 5L20 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M4 12L20 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M4 19L20 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
	{/if}
</svg>
