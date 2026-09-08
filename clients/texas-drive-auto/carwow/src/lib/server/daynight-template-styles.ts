export function daynightTemplatePageClass(templateFile: string) {
	return `daynight-template-${templateFile.replace(/[^a-z0-9]/gi, '-')}`;
}

export function renderDayNightTemplateHeadStyles(templateFile: string) {
	const pageClass = daynightTemplatePageClass(templateFile);

	const styles = `
<style>
	html {
		scrollbar-gutter: stable;
	}

	body.${pageClass} .preload {
		display: none !important;
	}

	body .wow,
	body .animated {
		animation-delay: 0s !important;
		animation-duration: 0s !important;
		animation-name: none !important;
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
		visibility: visible !important;
	}

	.daynight-header-logo {
		display: inline-block;
		text-decoration: none;
	}

	.header .logo {
		flex: 0 0 192px;
		width: 192px;
	}

	.header .logo-mobile {
		flex: 0 0 184px;
		width: 184px;
	}

	.header .logo .daynight-header-logo,
	.header .logo .daynight-header-logo__image {
		width: 192px !important;
	}

	.header .logo-mobile .daynight-header-logo,
	.header .logo-mobile .daynight-header-logo__image {
		width: 184px !important;
	}

	.header .logo .daynight-header-logo,
	.header .logo-mobile .daynight-header-logo,
	.header .logo .daynight-header-logo__image,
	.header .logo-mobile .daynight-header-logo__image {
		display: block;
		height: auto !important;
		max-width: none !important;
		max-height: none !important;
		object-fit: contain;
	}

	body.dashboard .daynight-dashboard-header {
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
		position: relative;
		z-index: 20;
	}

	body.dashboard .daynight-dashboard-header .header-container-fluid {
		padding-left: 40px;
		padding-right: 40px;
	}

	body.dashboard .daynight-dashboard-header__inner {
		gap: 20px;
		justify-content: space-between;
		min-height: 92px;
	}

	body.dashboard .daynight-dashboard-header__brand {
		display: none;
		flex: 0 0 168px;
		text-decoration: none;
	}

	body.dashboard .daynight-dashboard-header__brand img {
		display: block;
		height: auto;
		width: 168px;
	}

	body.dashboard .daynight-dashboard-header__summary {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	body.dashboard .daynight-dashboard-header__summary span {
		color: #64748b;
		font-size: 14px;
		line-height: 1.2;
	}

	body.dashboard .daynight-dashboard-header__summary strong {
		color: #111827;
		font-size: 22px;
		font-weight: 600;
		line-height: 1.15;
	}

	body.dashboard .daynight-dashboard-header__actions {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		gap: 12px;
	}

	body.dashboard .daynight-dashboard-header__ghost,
	body.dashboard .daynight-dashboard-header__user,
	body.dashboard .daynight-dashboard-header__cta {
		align-items: center;
		border-radius: 14px;
		display: inline-flex;
		font-weight: 600;
		line-height: 1;
		min-height: 50px;
		text-decoration: none;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease,
			box-shadow 0.18s ease;
		white-space: nowrap;
	}

	body.dashboard .daynight-dashboard-header__ghost {
		background: #fff;
		border: 1px solid #e5e7eb;
		color: #111827;
		padding: 0 18px;
	}

	body.dashboard .daynight-dashboard-header__ghost:hover,
	body.dashboard .daynight-dashboard-header__ghost:focus {
		background: #f3f4f6;
		border-color: #d1d5db;
		color: #111827;
	}

	body.dashboard .daynight-dashboard-header__user {
		color: #111827;
		gap: 10px;
		padding: 0 8px 0 12px;
	}

	body.dashboard .daynight-dashboard-header__user:hover,
	body.dashboard .daynight-dashboard-header__user:focus {
		background: #f3f4f6;
		color: #111827;
	}

	body.dashboard .daynight-dashboard-header__user .avatar {
		border: 2px solid #fff;
		border-radius: 50%;
		box-shadow: 0 0 0 1px #e5e7eb;
		height: 42px;
		object-fit: cover;
		width: 42px;
	}

	body.dashboard .daynight-dashboard-header__cta {
		background: #d71920;
		box-shadow: 0 12px 24px rgba(40, 125, 250, 0.22);
		color: #fff;
		gap: 10px;
		padding: 0 24px;
	}

	body.dashboard .daynight-dashboard-header__cta:hover,
	body.dashboard .daynight-dashboard-header__cta:focus {
		background: #111827;
		color: #fff;
	}

	body.dashboard .daynight-dashboard-header__cta span {
		align-items: center;
		border: 1px solid rgba(255, 255, 255, 0.7);
		border-radius: 50%;
		display: inline-flex;
		font-size: 18px;
		height: 22px;
		justify-content: center;
		line-height: 20px;
		width: 22px;
	}

	.daynight-sticky-logo {
		display: none;
		flex: 0 0 178px;
		margin-right: 22px;
		text-decoration: none;
		width: 178px;
	}

	.daynight-sticky-logo__image {
		display: block;
		height: auto;
		object-fit: contain;
		width: 178px;
	}

	.header .header-top-bar {
		background: #d71920 !important;
		border-bottom: 1px solid #a50f15;
		height: 36px !important;
		padding: 7px 0 !important;
	}

	.header .header-top-bar a,
	.header .header-top-bar .core-dropdown__button,
	.header .header-top-bar .core-dropdown__label {
		color: #fff !important;
		text-decoration: none;
	}

	.header .header-top-bar--text {
		color: #fff !important;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
		text-decoration: none !important;
	}

	.header .header-top-bar--text a {
		border-bottom: 0;
		text-decoration: none !important;
		text-underline-offset: 0;
		transition: opacity 0.14s ease;
	}

	.header .header-top-bar--text a:hover,
	.header .header-top-bar--text a:focus-visible {
		opacity: 0.82;
	}

	.header .header-top-bar .header-top-bar--socical {
		border-color: rgba(255, 255, 255, 0.24) !important;
		border-left-color: rgba(255, 255, 255, 0.24) !important;
	}

	.header .header-top-bar .header-top-bar--socical a {
		align-items: center;
		display: inline-flex;
		opacity: 0.94;
		min-height: 24px;
		min-width: 24px;
		justify-content: center;
		transition: opacity 0.14s ease, transform 0.14s ease;
	}

	.header .header-top-bar .header-top-bar--socical a:hover,
	.header .header-top-bar .header-top-bar--socical a:focus-visible {
		opacity: 1;
		transform: translateY(-1px);
	}

	.daynight-social-logo {
		display: block;
		height: 20px;
		object-fit: contain;
		width: 20px;
	}

	.daynight-social-icon {
		display: block;
		height: 20px;
		width: 20px;
	}

	.header .header-top-bar svg {
		color: #fff !important;
	}

	.header .header-top-bar svg [stroke],
	.header .header-top-bar a:hover svg [stroke],
	.header .header-top-bar a:focus svg [stroke] {
		stroke: #fff !important;
	}

	.header .header-top-bar svg [fill]:not([fill="none"]),
	.header .header-top-bar a:hover svg [fill]:not([fill="none"]),
	.header .header-top-bar a:focus svg [fill]:not([fill="none"]) {
		fill: #fff !important;
	}

	.header .header-top-bar .header-top-bar--socical svg .brand-cutout {
		fill: #111827 !important;
	}

	.header.header-style-2 .header-inner-style-2 {
		height: 78px !important;
	}

	/* Header rows stack in DESCENDING z-order (top bar > white row > nav) so a
	   popup hanging from any row (language menu, map preview) paints over the
	   rows below it. The sticky nav state keeps 920; the search modal sits at 999. */
	.header.header-style-2 .header-style-2-main {
		position: relative;
		z-index: 930;
	}

	.header.header-style-2 .bg-primary {
		position: relative;
		z-index: 910;
	}

	.header.header-style-2 .header-fixed-primary,
	.header.header-style-2 .header-fixed-primary .main-nav-wrapper,
	.header.header-style-2 .header-fixed-primary #main-nav {
		position: relative;
		z-index: 920;
	}

	.header.header-style-2 .header-style-2-main > .container {
		max-width: none;
		padding-left: 24px;
		padding-right: 24px;
		width: 100%;
	}

	.header.header-style-2 .header-top-bar > .container,
	.header.header-style-2 .header-fixed-primary .header-inner {
		max-width: none !important;
		padding-left: 24px;
		padding-right: 24px;
		width: 100%;
	}

	.header.header-style-2 .header-right {
		gap: 24px;
		justify-content: space-between;
		width: calc(100% - 190px);
	}

	.header.header-style-2 .header-contact {
		gap: 10px;
		margin-right: auto;
	}

	.header.header-style-2 .header-contact li {
		align-items: center;
		background: #f5f6f8;
		border: 1px solid #e6e8ec;
		border-radius: 14px;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
		display: inline-flex;
		gap: 10px;
		min-height: 52px;
		padding: 7px 12px 7px 8px;
		position: relative;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			box-shadow 0.14s ease;
	}

	.header.header-style-2 .header-contact li:hover,
	.header.header-style-2 .header-contact li:focus-within {
		background: #eef1f5;
		border-color: #d5dae3;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.86),
			0 12px 26px rgba(15, 23, 42, 0.1);
	}

	.header.header-style-2 .header-contact .icon {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 999px;
		box-shadow: none;
		color: #6b7280;
		display: inline-flex;
		justify-content: center;
		max-height: 34px;
		max-width: 34px;
		min-height: 34px;
		min-width: 34px;
		transition:
			color 0.12s ease-out,
			background-color 0.12s ease-out,
			box-shadow 0.12s ease-out;
	}

	.header.header-style-2 .header-contact .icon:hover,
	.header.header-style-2 .header-contact .icon:focus-visible {
		background: rgba(148, 163, 184, 0.14);
		box-shadow: none;
		color: #475569;
	}

	.header.header-style-2 .header-contact li:first-child .icon {
		color: #64748b;
	}

	.header.header-style-2 .header-contact li:nth-child(2) .icon {
		color: #64748b;
	}

	.header.header-style-2 .header-contact .icon svg {
		height: 20px;
		width: 20px;
	}

	.header.header-style-2 .header-contact .icon svg path {
		stroke: currentColor !important;
	}

	.header.header-style-2 .header-contact .daynight-header-contact__body {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}

	.header.header-style-2 .header-contact li .text {
		color: #374151;
		font-size: 15px !important;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 19px !important;
		white-space: nowrap;
	}

	.header.header-style-2 .header-contact li .text:hover,
	.header.header-style-2 .header-contact li .text:focus-visible {
		color: #374151;
	}

	.header.header-style-2 .header-contact li .text-xs {
		color: #64748b;
		display: inline-flex;
		font-size: 12px !important;
		letter-spacing: 0.02em;
		line-height: 14px !important;
		margin-top: 0;
	}

	.header.header-style-2 .header-contact li:first-child .text-xs {
		color: #64748b;
		text-transform: none;
	}

	.header.header-style-2 .header-contact li:nth-child(2) .text-xs {
		color: #111827;
	}

	.daynight-contact-popover {
		background: #fff;
		border: 1px solid #e1e5ec;
		border-radius: 12px;
		box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
		color: #111827;
		display: flex;
		flex-direction: column;
		gap: 4px;
		left: 0;
		opacity: 0;
		padding: 12px;
		pointer-events: none;
		position: absolute;
		text-decoration: none;
		top: calc(100% + 8px);
		transform: translateY(-4px);
		transition:
			opacity 0.16s ease,
			transform 0.16s ease,
			visibility 0.16s ease;
		visibility: hidden;
		width: 236px;
		z-index: 65;
	}

	.daynight-contact-popover::before {
		content: "";
		height: 10px;
		left: 0;
		position: absolute;
		right: 0;
		top: -10px;
	}

	.daynight-header-contact--phone:hover .daynight-contact-popover,
	.daynight-header-contact--phone:focus-within .daynight-contact-popover {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
		visibility: visible;
	}

	.daynight-contact-popover strong {
		color: #111827;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.daynight-contact-popover > span {
		color: #64748b;
		font-size: 12px;
		line-height: 17px;
	}

	.daynight-contact-popover__actions {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 8px;
	}

	.daynight-contact-popover__actions a {
		align-items: center;
		background: #f3f4f6;
		border: 1px solid #e5e7eb;
		border-radius: 9px;
		color: #111827;
		display: inline-flex;
		font-size: 12px;
		font-weight: 700;
		height: 36px;
		justify-content: center;
		line-height: 16px;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	.daynight-contact-popover__actions a:hover,
	.daynight-contact-popover__actions a:focus-visible {
		background: #111827;
		border-color: #111827;
		color: #fff;
	}

	.daynight-map-preview {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18);
		color: #111827;
		display: block;
		left: 0;
		opacity: 0;
		padding: 10px;
		pointer-events: none;
		position: absolute;
		text-decoration: none;
		top: calc(100% + 8px);
		transform: translateY(-4px);
		transition:
			opacity 0.16s ease,
			transform 0.16s ease,
			visibility 0.16s ease;
		visibility: hidden;
		width: 268px;
		z-index: 65;
	}

	.daynight-map-preview::before {
		content: "";
		height: 10px;
		left: 0;
		position: absolute;
		right: 0;
		top: -10px;
	}

	.daynight-header-contact--location:hover .daynight-map-preview,
	.daynight-header-contact--location:focus-within .daynight-map-preview {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
		visibility: visible;
	}

	.daynight-map-preview__thumb {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		display: block;
		height: 82px;
		margin-bottom: 9px;
		overflow: hidden;
		position: relative;
	}

	.daynight-map-preview__thumb::before,
	.daynight-map-preview__thumb::after {
		background: #cbd5e1;
		content: "";
		position: absolute;
	}

	.daynight-map-preview__thumb::before {
		height: 1px;
		left: 14px;
		right: 14px;
		top: 35px;
		transform: rotate(-8deg);
	}

	.daynight-map-preview__thumb::after {
		bottom: 18px;
		height: 1px;
		left: -20px;
		right: 34px;
		transform: rotate(18deg);
	}

	.daynight-map-preview__pin {
		background: #d71920;
		border: 3px solid #fff;
		border-radius: 999px;
		box-shadow: 0 8px 16px rgba(215, 25, 32, 0.24);
		height: 18px;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 18px;
		z-index: 1;
	}

	.daynight-map-preview__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.daynight-map-preview__body strong {
		color: #111827;
		font-size: 14px;
		font-weight: 700;
		line-height: 19px;
	}

	.daynight-map-preview__body span {
		color: #64748b;
		font-size: 12px;
		line-height: 17px;
	}

	.daynight-map-preview__body em {
		color: #111827;
		font-size: 12px;
		font-style: normal;
		font-weight: 700;
		line-height: 17px;
		margin-top: 4px;
	}

	.header-search-wrapper {
		position: relative;
	}

	.header-search-wrapper .header-action-btn {
		cursor: pointer;
	}

	.daynight-header-search.search-modal {
		z-index: 999;
	}

	.daynight-header-search.active,
	.header-search-wrapper.is-open .daynight-header-search {
		pointer-events: auto;
	}

	.daynight-header-search .search-modal__content {
		background-color: #fff;
	}

	.daynight-header-search__input {
		background: transparent !important;
		border: none !important;
		border-bottom: 2px solid #e7e7e7 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		font-size: 18px !important;
		line-height: 28px !important;
		padding: 8px 60px 8px 0 !important;
	}

	.daynight-header-search__input::placeholder {
		color: #999;
		font-size: 18px;
		line-height: 28px;
		opacity: 1;
	}

	.daynight-header-search__input.active,
	.daynight-header-search__input:active,
	.daynight-header-search__input:focus {
		border-bottom-color: #111827 !important;
		box-shadow: none !important;
	}

	.header .header-button {
		margin-left: auto;
	}

	/* Topmost header row — its language menu must clear both rows below. */
	.header .header-top-bar {
		position: relative;
		z-index: 940;
	}

	/* Placeholder/fallback car images are light — the white overlay pills on the
	   photo become unreadable, so flip them to dark chips on those cards only. */
	.card-box:has(.card--img[src^="data:image/svg"]) .bottom .category,
	.card-box:has(.card--img[src^="data:image/svg"]) .bottom .category a,
	.card-box:has(.card--img.daynight-img-fallback) .bottom .category,
	.card-box:has(.card--img.daynight-img-fallback) .bottom .category a {
		color: #111827 !important;
	}

	.header .btn.btn-line.bg-sign-in {
		background: #14161b !important;
		border-color: #14161b !important;
		border-width: 1px;
		box-shadow: none;
		color: #fff !important;
		height: 50px;
		padding: 0 24px;
	}

	.header .btn.btn-line.bg-sign-in svg path {
		stroke: #fff !important;
	}

	.header .btn.btn-primary {
		background: #d71920 !important;
		border-color: #d71920 !important;
		box-shadow: none;
		color: #fff !important;
		height: 50px;
		padding: 0 27px;
	}

	.header .btn.btn-primary svg path {
		stroke: #fff !important;
	}

	body .btn,
	body .btn::before,
	body .btn::after,
	body .header-action-btn,
	body .header-action-btn::after,
	body .compare-details,
	body .compare-details::after,
	body .view-details,
	body #main-nav .sub-menu li a,
	body #main-nav .sub-menu li .menu-item-inner,
	body #main-nav .sub-menu li .menu-item-inner-title,
	body .card-box.card-box-style-1,
	body .card-box.card-box-style-1 .card--img,
	body .card-box-style-5,
	body .card-box-style-5 .image img {
		transition-duration: 0.12s !important;
		transition-timing-function: ease-out !important;
	}

	/* === Static, fast hover model ===
	   No fill-sweeps, no image zooms, no lifts, no hover-underlines. Buttons keep
	   explicit DayNight hover colours instead of generic black overlays. */
	body .btn::before,
	body .btn::after,
	body .search-cars__search::before,
	body .search-cars__search::after,
	body .compare-details::before,
	body .compare-details::after,
	body .header-action-btn::after {
		display: none !important;
	}

	body .btn,
	body .search-cars__search,
	body .compare-details,
	body .view-details {
		transition:
			background-color 0.12s ease-out,
			border-color 0.12s ease-out,
			color 0.12s ease-out !important;
	}

	body .sr-only {
		border: 0 !important;
		clip: rect(0 0 0 0) !important;
		clip-path: inset(50%) !important;
		height: 1px !important;
		margin: -1px !important;
		overflow: hidden !important;
		padding: 0 !important;
		position: absolute !important;
		white-space: nowrap !important;
		width: 1px !important;
	}

	body .btn:hover,
	body .search-cars__search:hover,
	body .compare-details:hover {
		transform: none !important;
		box-shadow: none !important;
	}

	body .search-cars__search:hover,
	body .search-cars__search:focus-visible {
		background: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
	}

	body .search-cars__search:hover img,
	body .search-cars__search:focus-visible img {
		filter: brightness(0) invert(1) !important;
	}

	body .btn.btn-primary:hover,
	body .btn.btn-primary:focus-visible {
		background: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
	}

	body .header .btn.btn-primary:hover,
	body .header .btn.btn-primary:focus-visible {
		background: #14161b !important;
		border-color: #14161b !important;
		color: #fff !important;
	}

	/* Cards: no image zoom, no lift, no hover-underline — just brighten + faint shadow */
	body .card-box:hover .card--img,
	body .card-box-style-1:hover .card--img,
	body .card-box-style-2:hover .card--img,
	body .vehicle-card:hover .vehicle-card__media img {
		transform: none !important;
	}

	body .card-box-style-1:hover,
	body .card-box-style-2:hover {
		background: #fff !important;
		box-shadow: none !important;
	}

	body [class*='card-box']:hover a:not(.text-underline):not(.daynight-card-price__link),
	body [class*='card-box']:hover .card-box__title a {
		text-decoration: none !important;
	}

	body .category-card:hover {
		transform: none !important;
	}

	#main-nav-mobile .header-button-mobile {
		display: grid !important;
		gap: 10px !important;
		grid-template-columns: 1fr;
		height: auto !important;
		padding: 0 16px;
		width: 100%;
	}

	#main-nav-mobile .header-button-mobile .btn {
		font-size: 14px !important;
		height: 44px;
		justify-content: center;
		line-height: 20px !important;
		margin: 0 !important;
		min-width: 0;
		padding: 0 14px !important;
		width: 100%;
	}

	#main-nav-mobile .header-button-mobile .btn:first-child {
		background: transparent !important;
		border: 1px solid rgba(255, 255, 255, 0.36) !important;
		color: #fff !important;
	}

	#main-nav-mobile .header-button-mobile .btn:last-child {
		background: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
	}

	#main-nav-mobile .header-button-mobile .btn svg path {
		stroke: #fff !important;
	}

	#main-nav-mobile .menu {
		height: calc(100vh - 206px);
		top: 206px;
	}

	body.main-nav-mobile .header-fixed-primary .header-actions .header-action-btn {
		pointer-events: none;
		visibility: hidden;
	}

	.header .bg-primary,
	.header .header-fixed-primary {
		background:
			linear-gradient(90deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%),
			#101820 !important;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
	}

	.header .header-fixed-primary {
		height: 58px !important;
		min-height: 58px !important;
	}

	body.daynight-page-home-header .header-wrapper-style-3 {
		height: 172px !important;
	}

	.header.header-style-2.header-style-3 .header-fixed-primary {
		height: 58px !important;
		min-height: 58px !important;
		padding-bottom: 0 !important;
		padding-top: 0 !important;
	}

	.header .header-fixed-primary .header-inner,
	.header .header-fixed-primary .main-nav-wrapper {
		height: 58px !important;
		min-height: 58px !important;
	}

	.header .header-fixed-primary .main-nav-wrapper {
		justify-content: center;
		position: relative;
	}

	.header .header-fixed-primary #main-nav {
		margin: 0 !important;
		position: static;
		transform: none;
	}

	.header.header-style-2.header-style-3 .header-fixed-primary #main-nav,
	.header.header-style-2.header-style-3 .header-fixed-primary #main-nav .menu,
	.header.header-style-2.header-style-3 .header-fixed-primary #main-nav .menu > li {
		align-items: center;
		display: flex;
		height: 58px !important;
		min-height: 58px !important;
	}

	.header .header-fixed-primary #main-nav .menu > li > a {
		align-items: center;
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.9) !important;
		display: flex;
		gap: 5px;
		height: 58px !important;
		line-height: 20px !important;
		padding: 0 10px !important;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.header .header-fixed-primary #main-nav .menu > li:hover > a,
	.header .header-fixed-primary #main-nav .menu > li:focus-within > a {
		background: rgba(255, 255, 255, 0.08);
		color: #fff !important;
	}

	.header .header-fixed-primary #main-nav .menu > li > a .chevron-down {
		display: block;
		flex: 0 0 auto;
	}

	.header .header-fixed-primary #main-nav .menu > li:not(.menu-item--static) > .sub-menu.sub-menu--container {
		border-radius: 0 0 10px 10px;
		display: block;
		left: 50%;
		max-height: none;
		min-width: 252px;
		overflow: visible;
		padding: 8px;
		top: 100% !important;
		/* Fade only — no vertical slide, so the panel never animates up over the
		   header bar on close. */
		transform: translate(-50%, 0);
		transform-origin: top center;
		transition:
			opacity 0.14s ease,
			visibility 0.14s ease;
		width: max-content;
		z-index: 1000;
	}

	.header
		.header-fixed-primary
		#main-nav
		.menu
		> li:not(.menu-item--static):hover
		> .sub-menu.sub-menu--container {
		transform: translate(-50%, 0) !important;
	}

	.header .header-fixed-primary #main-nav .sub-menu.sub-menu--container > li {
		display: block;
		width: 100%;
	}

	.header .header-fixed-primary #main-nav .sub-menu.sub-menu--container a {
		align-items: center;
		border-radius: 8px;
		display: flex;
		min-width: 252px;
		padding: 10px 12px;
		transition:
			background-color 0.12s ease,
			color 0.12s ease;
		white-space: nowrap;
	}

	.header .header-fixed-primary #main-nav .sub-menu.sub-menu--container a:hover {
		background-color: #f4f6fa;
	}

	.header .header-fixed-primary .header-actions {
		margin-left: 0;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.header.is-fixed.is-custom {
		background:
			linear-gradient(90deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%),
			#101820 !important;
		background-color: #101820 !important;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		height: 58px !important;
		min-height: 58px !important;
		top: 0 !important;
		transform: none !important;
	}

	.header.is-fixed.is-custom .header-top-bar,
	.header.is-fixed.is-custom .header-style-2-main {
		display: none !important;
		height: 0 !important;
		min-height: 0 !important;
		overflow: hidden !important;
		padding-bottom: 0 !important;
		padding-top: 0 !important;
	}

	.header.is-fixed.is-custom .bg-primary,
	.header.is-fixed.is-custom .header-fixed-primary {
		background:
			linear-gradient(90deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%),
			#101820 !important;
		background-color: #101820 !important;
		height: 58px !important;
		min-height: 58px !important;
	}

	.header.is-fixed.is-custom .daynight-sticky-logo {
		display: block;
		left: 75px;
		margin: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.header.is-fixed.is-custom #main-nav {
		margin: 0 !important;
	}

	.header.is-fixed.is-custom .header-fixed-primary #main-nav .menu > li > a {
		height: 58px !important;
		line-height: 20px !important;
		padding: 0 !important;
	}

	.header.is-fixed.is-custom .header-actions {
		margin-left: 0;
	}

	.header .header-contact a.text {
		white-space: nowrap;
	}

	.header .header-contact li:first-child > div {
		min-width: 118px;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles {
		align-items: stretch;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 0 0 12px 12px;
		box-shadow: 0 24px 58px rgba(15, 23, 42, 0.16);
		display: flex !important;
		flex-direction: column !important;
		flex-wrap: nowrap !important;
		gap: 0;
		left: 50vw !important;
		max-width: 1410px !important;
		opacity: 0;
		overflow: hidden;
		padding: 0;
		pointer-events: none;
		position: fixed !important;
		right: auto !important;
		/* Must equal the header's resting bottom edge (top strip 36px + logo row +
		   60px nav bar = 174px) so this fixed, full-width mega panel opens flush
		   with the bar instead of 2px inside it. The .is-fixed scrolled state
		   below overrides this to the collapsed 58px nav. */
		top: 174px !important;
		/* Fade only (no -12px slide) so the panel doesn't animate up over the bar on close. */
		transform: translate(-50%, 0) !important;
		transform-origin: top center;
		transition:
			opacity 0.14s ease,
			transform 0.14s ease,
			visibility 0.14s ease;
		visibility: hidden;
		width: min(1410px, calc(100vw - 60px)) !important;
		z-index: 1000;
	}

	#main-nav .menu > li.menu-item--static:hover .sub-menu.daynight-mega--vehicles {
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, 0) !important;
		visibility: visible;
	}

	.header.is-fixed.is-custom #main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles {
		top: 58px !important;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .daynight-mega__content {
		align-items: stretch;
		display: flex;
		gap: 44px;
		padding: 30px 42px 32px;
		width: 100%;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .daynight-mega__vehicle-panel {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
		width: auto;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .daynight-mega__vehicles {
		display: grid !important;
		grid-template-columns: repeat(4, minmax(150px, 1fr));
		gap: 18px 26px;
		width: 100% !important;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .daynight-mega__links {
		border-left: 1px solid #e7e7e7;
		display: grid !important;
		flex: 0 0 360px;
		gap: 22px;
		grid-template-columns: repeat(2, minmax(120px, 1fr));
		padding-left: 34px;
		width: 360px !important;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .sub-menu-item-listing {
		min-width: 0;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .sub-menu-item-listing .h5 {
		font-size: 15px;
		line-height: 22px;
		margin-bottom: 12px;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .sub-menu-item-inner {
		gap: 4px;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .sub-menu-item-inner a {
		border-radius: 8px;
		color: #5c5e62;
		display: inline-flex;
		font-size: 14px;
		line-height: 20px;
		/* !important to beat the template's .padding-0 utility on these links. */
		padding: 6px 8px !important;
		transition:
			background-color 0.12s ease,
			color 0.12s ease;
	}

	#main-nav .menu > li.menu-item--static .sub-menu.daynight-mega--vehicles .sub-menu-item-inner a:hover {
		background-color: #f4f6fa;
		color: #111827;
	}

	.daynight-mega-car {
		align-items: center;
		background: transparent;
		border-radius: 8px;
		color: #1c1c1c;
		display: flex !important;
		flex-direction: column;
		min-width: 0;
		padding: 4px 8px 8px !important;
		text-align: center;
		text-decoration: none;
	}

	.daynight-mega-car:hover {
		background: #f7f7f7;
	}

	.daynight-mega-car__image-wrap {
		align-items: end;
		display: flex;
		height: 112px;
		justify-content: center;
		margin-bottom: 7px;
		width: 100%;
	}

	.daynight-mega-car__image {
		display: block;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
	}

	.daynight-mega-car__title {
		color: #1c1c1c;
		display: block;
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		margin-bottom: 2px;
		white-space: nowrap;
	}

	.daynight-mega-car__meta {
		color: #5c5e62;
		display: block;
		font-size: 13px;
		line-height: 18px;
		margin-bottom: 8px;
		white-space: nowrap;
	}

	.daynight-mega-car__actions {
		display: flex;
		gap: 14px;
		justify-content: center;
	}

	.daynight-mega-car__actions span {
		color: #111827;
		font-size: 13px;
		line-height: 18px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.daynight-mega__footer {
		align-items: center;
		background: transparent;
		border-top: 1px solid #eceff3;
		display: flex;
		flex: 0 0 auto;
		gap: 22px;
		justify-content: flex-start;
		margin-top: 24px;
		padding: 16px 0 0;
		width: 100%;
	}

	.daynight-mega__footer-button {
		align-items: center;
		background: #111827;
		border-radius: 8px;
		color: #fff !important;
		display: inline-flex;
		font-size: 15px;
		font-weight: 700;
		height: 44px;
		justify-content: center;
		line-height: 20px;
		padding: 0 22px;
		white-space: nowrap;
	}

	.daynight-mega__footer-button:hover {
		background: #d71920;
		color: #fff !important;
	}

	.daynight-mega__footer-copy {
		border-left: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 22px;
	}

	.daynight-mega__footer-copy strong {
		color: #111827;
		font-size: 15px;
		line-height: 22px;
	}

	.daynight-mega__footer-copy span {
		color: #667085;
		font-size: 13px;
		line-height: 20px;
	}

	@media (max-width: 1199px) {
		body.dashboard .daynight-dashboard-header__brand {
			display: block;
		}

		body.dashboard .daynight-dashboard-header__ghost {
			display: none;
		}
	}

	@media (max-width: 575px) {
		.header .logo,
		.header .logo-mobile {
			flex-basis: 158px;
			width: 158px;
		}

		.header .logo .daynight-header-logo,
		.header .logo-mobile .daynight-header-logo,
		.header .logo .daynight-header-logo__image,
		.header .logo-mobile .daynight-header-logo__image {
			width: 158px !important;
		}

		.daynight-header-search .search-modal__content {
			height: auto;
			min-height: 190px;
			padding: 34px 20px;
		}

		.daynight-header-search .search-modal__close {
			right: 20px;
			top: 20px;
		}

		.daynight-header-search .search-modal__title {
			font-size: 22px;
			margin-bottom: 24px;
		}

		.daynight-header-search__input,
		.daynight-header-search__input::placeholder {
			font-size: 16px;
			line-height: 24px;
		}

		body.dashboard .daynight-dashboard-header .header-container-fluid {
			padding-left: 16px;
			padding-right: 16px;
		}

		body.dashboard .daynight-dashboard-header__inner {
			gap: 12px;
			min-height: 78px;
		}

		body.dashboard .daynight-dashboard-header__brand {
			flex-basis: 132px;
			width: 132px;
		}

		body.dashboard .daynight-dashboard-header__brand img {
			width: 132px;
		}

		body.dashboard .daynight-dashboard-header__summary span,
		body.dashboard .daynight-dashboard-header__user,
		body.dashboard .daynight-dashboard-header__cta {
			display: none;
		}

		body.dashboard .daynight-dashboard-header__summary strong {
			font-size: 17px;
		}
	}

	@media (max-width: 991px) {
		body.dashboard .daynight-dashboard-header .header-container-fluid {
			padding-left: 24px;
			padding-right: 24px;
		}

		body.dashboard .daynight-dashboard-header__inner {
			min-height: 86px;
		}

		body.dashboard .daynight-dashboard-header__summary strong {
			font-size: 19px;
		}

		body.dashboard .daynight-dashboard-header__user {
			display: none;
		}

		body.dashboard .daynight-dashboard-header__cta {
			min-height: 46px;
			padding: 0 18px;
		}

		.header.header-style-2 .header-fixed-primary .header-actions {
			left: 0;
			margin-right: 0 !important;
			right: 0;
			width: 100%;
		}

		.header.header-style-2 .header-fixed-primary .logo-mobile-header {
			margin-left: 0 !important;
		}

		.header.is-fixed.is-custom .daynight-sticky-logo {
			flex-basis: 154px;
			left: 15px;
			margin-right: auto;
			width: 154px;
		}

		.header.is-fixed.is-custom .daynight-sticky-logo__image {
			width: 154px;
		}

		.header.is-fixed.is-custom .logo-mobile-header {
			display: none !important;
		}

		.header.is-fixed.is-custom .header-actions {
			margin-left: auto;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles {
			padding: 0 20px 16px;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__content {
			display: block;
			padding: 0;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__vehicle-panel {
			width: 100%;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__vehicles {
			display: grid;
			gap: 10px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			margin-bottom: 16px;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles .daynight-mega__links {
			border-left: 0;
			display: grid;
			gap: 14px;
			grid-template-columns: 1fr;
			padding-left: 0;
		}

		#main-nav-mobile .sub-menu.daynight-mega--vehicles .sub-menu-item-inner a {
			color: #cfd2d8;
			font-size: 14px;
			line-height: 20px;
			padding-left: 40px;
		}

		#main-nav-mobile .daynight-mega-car {
			padding: 8px 0 !important;
		}

		#main-nav-mobile .daynight-mega-car__image-wrap {
			height: 62px;
			margin-bottom: 6px;
		}

		#main-nav-mobile .daynight-mega-car__title {
			color: #fff;
			font-size: 14px;
			line-height: 20px;
			white-space: normal;
		}

		#main-nav-mobile .daynight-mega-car__meta {
			display: none;
		}

		#main-nav-mobile .daynight-mega-car__actions {
			gap: 10px;
		}

		#main-nav-mobile .daynight-mega__footer {
			align-items: stretch;
			background: transparent;
			border-top: 1px solid rgba(255, 255, 255, 0.12);
			flex-direction: column;
			gap: 10px;
			padding: 14px 0 0;
		}

		#main-nav-mobile .daynight-mega__footer-button {
			height: 42px;
			width: 100%;
		}

		#main-nav-mobile .daynight-mega__footer-copy {
			border-left: 0;
			padding-left: 0;
			text-align: center;
		}

		#main-nav-mobile .daynight-mega__footer-copy strong {
			color: #fff;
			font-size: 13px;
			line-height: 18px;
		}

		#main-nav-mobile .daynight-mega__footer-copy span {
			color: #cfd2d8;
			font-size: 12px;
			line-height: 17px;
		}
	}

	@media (max-width: 575px) {
		body.dashboard .daynight-dashboard-header .header-container-fluid {
			padding-left: 16px;
			padding-right: 16px;
		}

		body.dashboard .daynight-dashboard-header__inner {
			gap: 12px;
			min-height: 78px;
		}

		body.dashboard .daynight-dashboard-header__brand {
			flex-basis: 132px;
			width: 132px;
		}

		body.dashboard .daynight-dashboard-header__brand img {
			width: 132px;
		}

		body.dashboard .daynight-dashboard-header__summary strong {
			font-size: 17px;
		}
	}

	body.home-style-9 #main-nav .menu > li > a:hover,
	body.home-style-9 #main-nav .menu > li:hover > a,
	body.home-style-9 .sub-menu li a:hover,
	body.home-style-9 .sub-menu li a.current-item,
	body.home-style-9 #main-nav-mobile ul ul li.current-item a,
	body.home-style-9 #main-nav-mobile ul > li.current-menu-item > a,
	body.home-style-9 #main-nav-mobile ul > li > a:hover,
	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover,
	body.home-style-9 .header .header-action-btn:hover,
	body.home-style-9 .search-cars__tab:hover,
	body.home-style-9 .search-cars__tab.active {
		color: #111827 !important;
	}

	body.home-style-9 #main-nav .menu li.menu-item-has-children > a:hover::after,
	body.home-style-9 #main-nav .menu li.menu-item-has-children:hover > a::after {
		color: #111827 !important;
	}

	/* DayNight: blue hover on the dark nav bar keeps the header tied to the brand strip. */
	body.home-style-9 #main-nav .menu > li > a:hover,
	body.home-style-9 #main-nav .menu > li:hover > a {
		color: #111827 !important;
	}

	body.home-style-9 #main-nav .menu li.menu-item-has-children > a:hover::after,
	body.home-style-9 #main-nav .menu li.menu-item-has-children:hover > a::after {
		color: #111827 !important;
	}

	body.home-style-9 #main-nav .menu > li > a:hover .chevron-down path,
	body.home-style-9 #main-nav .menu > li:hover > a .chevron-down path,
	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover svg path,
	body.home-style-9 .header .header-action-btn:hover svg path,
	body.home-style-9 #main-nav-mobile ul ul li.current-item a .chevron-down path,
	body.home-style-9 #main-nav-mobile ul > li.current-menu-item > a .chevron-down path,
	body.home-style-9 #main-nav-mobile ul > li > a:hover .chevron-down path {
		stroke: #fff !important;
	}

	body.home-style-9 #main-nav .menu > li > a:hover .chevron-down path,
	body.home-style-9 #main-nav .menu > li:hover > a .chevron-down path {
		stroke: #111827 !important;
	}

	body.home-style-9 .sub-menu li a,
	body.inner-page #main-nav .sub-menu li a,
	body.inner-page #main-nav .sub-menu li .menu-item-inner-title {
		border-radius: 10px;
	}

	body.home-style-9 .sub-menu li a:hover,
	body.home-style-9 .sub-menu li a.current-item,
	body.inner-page #main-nav .sub-menu li a:hover,
	body.inner-page #main-nav .sub-menu li a.current-item,
	body.inner-page #main-nav .sub-menu li .menu-item-inner-title:hover {
		background: #f4f5f6 !important;
	}

	body.home-style-9 #main-nav .menu > li > a::before,
	body.home-style-9 .search-cars__tab.active::after,
	body.home-style-9 .header .header-action-btn.header-action-icon::after,
	body.home-style-9 .search-cars__range-wrapper #slider-range .ui-slider-range {
		background: #111827 !important;
		background-color: #111827 !important;
	}

	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover,
	body.home-style-9 .header .header-action-btn:hover,
	body.home-style-9 .search-cars__filter:hover,
	body.home-style-9 .search-cars__filter.active {
		border-color: #111827 !important;
	}

	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover,
	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover::before,
	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover::after {
		background: #111827 !important;
		background-color: #111827 !important;
		border-color: #111827 !important;
		color: #fff !important;
	}

	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover {
		transition: none !important;
	}

	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover::before,
	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover::after {
		opacity: 0 !important;
		transition: none !important;
	}

	body.home-style-9 .header .btn.btn-line.bg-sign-in:hover svg path {
		stroke: #fff !important;
		transition: none !important;
	}

	body.home-style-9 .search-cars__range-wrapper #slider-range .ui-slider-handle,
	body.home-style-9 .search-cars__range-input::-webkit-slider-thumb,
	body.home-style-9 .search-cars__range-input::-moz-range-thumb {
		border-color: #111827 !important;
	}

	/* One consistent grey across the whole home: grey sections + the inventory
	   container share a single tone so the page reads as intentional bands
	   (white / grey / white / dark) instead of three near-identical light greys. */

	/* DayNight: tighter, more "static" section rhythm (was 100px top/bottom). */

	/* DayNight: brands as a static, full-width row (spans the same width as the
	   "Vehicles by type" section) — 6 per row, no carousel, no centered cap. */

	/* DayNight: rotate the dropdown caret 180° when its menu opens. */
	body.home-style-9 #main-nav .menu > li > a .chevron-down {
		transition: transform 0.25s ease;
	}

	body.home-style-9 #main-nav .menu > li:hover > a .chevron-down {
		transform: rotate(180deg);
	}

	@media (max-width: 991px) {
	}

	@media (max-width: 575px) {
	}

	body .card-box.card-box-style-1 .card-box__price {
		align-items: start !important;
		column-gap: 18px;
		display: grid !important;
		grid-template-columns: minmax(0, 1fr) auto;
		min-height: 40px;
	}

	body .daynight-card-price__value {
		align-items: flex-start;
		align-self: start;
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 24px;
		font-weight: 800;
		justify-self: start;
		letter-spacing: 0;
		line-height: 1.05;
		min-height: 0;
		white-space: nowrap;
	}

	body .daynight-card-price__meta {
		align-items: flex-end;
		display: inline-flex;
		flex-direction: column;
		gap: 0;
		justify-self: end;
		justify-content: flex-start;
		line-height: 1;
		min-height: 0;
		min-width: 0;
		text-align: right;
	}

	body .daynight-card-price__monthly,
	body .daynight-card-price__link {
		white-space: nowrap;
	}

	body .daynight-card-price__monthly {
		font-size: 15px;
		line-height: 18px;
	}

	body .daynight-card-price__link {
		align-items: center;
		color: #475569 !important;
		display: inline-flex;
		font-size: 12px;
		line-height: 15px;
		min-height: 15px;
		text-decoration-color: currentColor !important;
	}

	body .card-box.card-box-style-1 .daynight-inventory-card__price-row {
		align-items: flex-end !important;
		column-gap: 12px !important;
		display: flex !important;
		justify-content: space-between !important;
		min-height: 52px;
	}

	body .daynight-inventory-card__price-row .daynight-card-price__stack {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	body .daynight-inventory-card__price-row .daynight-card-price__value {
		color: #101828;
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 0.98;
	}

	body .daynight-inventory-card__price-row .daynight-card-price__monthly {
		color: #667085;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
	}

	body .daynight-inventory-card__price-row .daynight-inventory-card__arrow {
		align-items: center;
		align-self: flex-end;
		background: #050505;
		border-radius: 999px;
		color: #fff !important;
		display: inline-flex;
		flex: 0 0 32px;
		height: 32px;
		justify-content: center;
		min-height: 32px;
		padding: 0;
		text-decoration: none !important;
		transition:
			background-color 140ms ease,
			transform 140ms ease;
		width: 32px;
	}

	body .daynight-inventory-card__price-row .daynight-inventory-card__arrow:hover {
		background: #b00000;
		transform: translateX(1px);
	}

	body .daynight-inventory-card__price-row .daynight-inventory-card__arrow:focus-visible {
		outline: 2px solid #b00000;
		outline-offset: 3px;
	}

	body .daynight-inventory-card__price-row .daynight-inventory-card__arrow svg {
		height: 17px;
		width: 17px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card] {
		display: flex !important;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.image {
		flex: 0 0 auto;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.content {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-height: 178px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.card-box__price {
		margin-top: auto !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2,
	body.daynight-template-listing-gridstyle-halfmap-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
	.tag.style2 {
		align-items: center;
		flex-wrap: nowrap;
		gap: 7px;
		justify-content: flex-start;
		min-height: 32px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li,
	body.daynight-template-listing-gridstyle-halfmap-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li {
		align-items: center;
		background: #f6f8fb;
		border: 1px solid #e4e8ef;
		border-radius: 7px;
		color: #344054;
		display: inline-flex;
		flex: 0 0 auto;
		height: 30px;
		min-width: 0;
		padding: 0 8px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li:last-child,
	body.daynight-template-listing-gridstyle-halfmap-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li:last-child {
		flex: 1 1 auto;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li
		img,
	body.daynight-template-listing-gridstyle-halfmap-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li
	img {
		flex: 0 0 auto;
		height: 14px;
		margin-right: 5px;
		opacity: 0.72;
		width: 14px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li
		span,
	body.daynight-template-listing-gridstyle-halfmap-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.tag.style2
		li
	span {
		color: #344054;
		font-size: 13px;
		line-height: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	body .daynight-inventory-searchbar .daynight-inventory-searchbar__submit {
		background: #111827 !important;
		border-color: #111827 !important;
		color: #fff !important;
	}

	body .daynight-inventory-searchbar .daynight-inventory-searchbar__submit:hover,
	body .daynight-inventory-searchbar .daynight-inventory-searchbar__submit:focus-visible {
		background: #020617 !important;
		border-color: #020617 !important;
		box-shadow: 0 0 0 3px rgba(215, 25, 32, 0.38) !important;
	}

	body .card-box .top .bg-primary-2.highlight,
	body .card-box .top .bg-primary-2.text-white {
		background: #d71920 !important;
		color: #fff !important;
	}

	body.daynight-page-home-header #main-nav .menu > li > a,
	body.daynight-page-home-header #main-nav .menu > li > a > span {
		color: #fff !important;
	}

	body.daynight-page-home-header #main-nav .menu > li > a .chevron-down path {
		stroke: #fff !important;
	}

	body.daynight-page-home-header #main-nav .menu > li > a:hover,
	body.daynight-page-home-header #main-nav .menu > li:hover > a,
	body.daynight-page-home-header #main-nav .menu > li.current-menu-item > a,
	body.daynight-page-home-header #main-nav .menu > li > a:hover > span,
	body.daynight-page-home-header #main-nav .menu > li:hover > a > span,
	body.daynight-page-home-header #main-nav .menu > li.current-menu-item > a > span {
		color: #fff !important;
	}

	body.daynight-page-home-header #main-nav .menu > li > a:hover .chevron-down path,
	body.daynight-page-home-header #main-nav .menu > li:hover > a .chevron-down path,
	body.daynight-page-home-header
		#main-nav
		.menu
		> li.current-menu-item
		> a
		.chevron-down
		path {
		stroke: #fff !important;
	}

	/* Red nav bar: white underline indicator + a soft modern dropdown shadow.
	   app.css ships the heavier legacy treatment (off-brand #111827 accents + a
	   dark 0.3 halo); only the inner-page header was overriding it. The shadow
	   override repeats :not(.sub-menu--full) so it out-specifies the app.css
	   base rule and wins. */
	body.daynight-page-home-header #main-nav .menu > li > a::before {
		background-color: #fff;
	}

	body.daynight-page-home-header #main-nav .menu > li .sub-menu:not(.sub-menu--full) {
		border: 1px solid rgba(15, 23, 42, 0.08);
		box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
	}

	body.daynight-page-home-header #main-nav .sub-menu li a:hover,
	body.daynight-page-home-header #main-nav .sub-menu li a.current-item {
		color: #111827;
	}

	body.daynight-page-home-header .header-style-2-main .btn.btn-line.bg-sign-in {
		background: #111827 !important;
		/* !important required: the base .bg-sign-in rule sets a near-black border
		   with !important, which otherwise wins and outlines the blue fill in black. */
		border-color: #111827 !important;
		color: #fff !important;
	}

	body.daynight-page-home-header .header-style-2-main .header-action-btn {
		border-color: #1c1c1c;
		color: #1c1c1c;
	}

	body.daynight-page-home-header .header-style-2-main .btn.btn-line.bg-sign-in svg path {
		stroke: #fff !important;
	}

	body.daynight-page-home-header .header-style-2-main .header-action-btn svg path {
		stroke: #1c1c1c;
	}

	body.daynight-page-home-header .bg-primary .header-actions .header-action-btn svg path {
		stroke: #fff !important;
	}

	body.daynight-page-home-header .bg-primary .mobile-button::before,
	body.daynight-page-home-header .bg-primary .mobile-button::after,
	body.daynight-page-home-header .bg-primary .mobile-button span {
		background-color: #fff !important;
	}

	body.inner-page .header.bg-white {
		background-color: #fff;
		border-bottom: 1px solid rgba(15, 23, 42, 0.08);
	}

	body.inner-page #main-nav .menu > li > a {
		color: #1c1c1c;
	}

	body.inner-page #main-nav .menu > li > a > span {
		color: inherit !important;
	}

	body.inner-page #main-nav .sub-menu {
		background-color: #fff;
		border: 1px solid rgba(15, 23, 42, 0.08);
		box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
	}

	body.inner-page #main-nav .sub-menu li a,
	body.inner-page #main-nav .sub-menu li .menu-item-inner,
	body.inner-page #main-nav .sub-menu li .menu-item-inner-title {
		color: #1c1c1c;
	}

	body.inner-page #main-nav .sub-menu li a:hover,
	body.inner-page #main-nav .sub-menu li a.current-item,
	body.inner-page #main-nav .sub-menu li .menu-item-inner-title:hover {
		color: #111827;
	}

	body.inner-page #main-nav .sub-menu li .menu-item-inner-title svg path {
		stroke: #6b7280;
	}

	body.inner-page #main-nav .sub-menu li .menu-item-inner-title:hover svg path {
		stroke: #111827;
	}

	body.inner-page #main-nav .menu > li > a .chevron-down path {
		stroke: #4b4b4b;
	}

	body.inner-page #main-nav .menu > li > a:hover,
	body.inner-page #main-nav .menu > li:hover > a,
	body.inner-page #main-nav .menu > li.current-menu-item > a {
		color: #111827 !important;
	}

	body.inner-page #main-nav .menu > li > a:hover > span,
	body.inner-page #main-nav .menu > li:hover > a > span,
	body.inner-page #main-nav .menu > li.current-menu-item > a > span {
		color: #111827 !important;
	}

	body.inner-page #main-nav .menu > li > a:hover .chevron-down path,
	body.inner-page #main-nav .menu > li:hover > a .chevron-down path,
	body.inner-page #main-nav .menu > li.current-menu-item > a .chevron-down path {
		stroke: #111827 !important;
	}

	body.inner-page #main-nav .menu > li > a::before {
		background-color: #111827;
	}

	body.inner-page #main-nav .menu li.menu-item-has-children > a:hover::after,
	body.inner-page #main-nav .menu li.menu-item-has-children:hover > a::after {
		color: #111827 !important;
	}

	body.inner-page #main-nav-mobile ul ul li.current-item a,
	body.inner-page #main-nav-mobile ul > li.current-menu-item > a,
	body.inner-page #main-nav-mobile ul > li > a:hover {
		color: #111827 !important;
	}

	body.inner-page #main-nav-mobile ul ul li.current-item a .chevron-down path,
	body.inner-page #main-nav-mobile ul > li.current-menu-item > a .chevron-down path,
	body.inner-page #main-nav-mobile ul > li > a:hover .chevron-down path {
		stroke: #111827 !important;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in {
		background: #111827 !important;
		border-color: #111827 !important;
		color: #fff !important;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in svg path {
		stroke: #fff !important;
	}

	body.inner-page .header .header-action-btn svg path {
		stroke: #1c1c1c;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover {
		border-color: #d71920;
		color: #d71920;
	}

	body.inner-page .header .header-action-btn:hover {
		border-color: #111827;
		color: #111827;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover,
	body.inner-page .header .btn.btn-line.bg-sign-in:hover::before,
	body.inner-page .header .btn.btn-line.bg-sign-in:hover::after {
		background: #d71920 !important;
		background-color: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover {
		transition: none !important;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover::before,
	body.inner-page .header .btn.btn-line.bg-sign-in:hover::after {
		opacity: 0 !important;
		transition: none !important;
	}

	body.inner-page .header .btn.btn-primary:hover,
	body.inner-page .header .btn.btn-primary:hover::before {
		background: #111827 !important;
		border-color: #111827 !important;
	}

	body.inner-page .header .btn.btn-primary:hover svg path {
		stroke: #fff !important;
	}

	body.inner-page .header .header-action-btn.header-action-icon::after {
		background: #111827 !important;
	}

	body.inner-page .mobile-button::before,
	body.inner-page .mobile-button::after,
	body.inner-page .mobile-button span {
		background-color: #1c1c1c;
	}

	body.inner-page .mobile-button:hover::before,
	body.inner-page .mobile-button:hover::after,
	body.inner-page .mobile-button:hover span {
		background-color: #111827 !important;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover svg path,
	body.inner-page .header .header-action-btn:hover svg path {
		stroke: #111827;
	}

	body.inner-page .header .btn.btn-line.bg-sign-in:hover svg path {
		stroke: #fff !important;
		transition: none !important;
	}

	.daynight-inner-hero {
		align-items: flex-end;
		background: #111827;
		color: #fff;
		display: flex;
		isolation: isolate;
		min-height: 386px;
		overflow: hidden;
		position: relative;
	}

	.daynight-inner-hero::after {
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.76) 0%, rgba(0, 0, 0, 0.5) 43%, rgba(0, 0, 0, 0.12) 100%),
			linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.42) 100%);
		content: '';
		inset: 0;
		position: absolute;
		z-index: -1;
	}

	.daynight-inner-hero__media {
		inset: 0;
		position: absolute;
		z-index: -2;
	}

	.daynight-inner-hero__media img {
		display: block;
		height: 100%;
		object-fit: cover;
		object-position: center;
		width: 100%;
	}

	.daynight-inner-hero--about .daynight-inner-hero__media img {
		object-position: center 58%;
	}

	.daynight-inner-hero--sell .daynight-inner-hero__media img {
		object-position: center 46%;
	}

	.daynight-inner-hero--services .daynight-inner-hero__media img {
		object-position: center 50%;
	}

	.daynight-inner-hero__content {
		padding-bottom: 72px;
		padding-top: 86px;
		position: relative;
		z-index: 1;
	}

	.daynight-inner-hero h1 {
		color: #fff;
		font-size: clamp(42px, 5vw, 74px);
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.02;
		margin: 0 0 16px;
		max-width: 820px;
	}

	.daynight-inner-hero p {
		color: rgba(255, 255, 255, 0.86);
		font-size: 19px;
		line-height: 1.55;
		margin: 0;
		max-width: 650px;
	}

	.daynight-inner-hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}

	.daynight-inner-hero__button {
		align-items: center;
		border-radius: 8px;
		display: inline-flex;
		font-size: 16px;
		font-weight: 600;
		justify-content: center;
		line-height: 1;
		min-height: 52px;
		padding: 0 24px;
		text-decoration: none;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
	}

	.daynight-inner-hero__button--primary {
		background: #111827;
		border: 1px solid #111827;
		color: #fff;
	}

	.daynight-inner-hero__button--primary:hover,
	.daynight-inner-hero__button--primary:focus {
		background: #d71920;
		border-color: #d71920;
		color: #fff;
	}

	.daynight-inner-hero__button--secondary {
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.5);
		color: #fff;
	}

	.daynight-inner-hero__button--secondary:hover,
	.daynight-inner-hero__button--secondary:focus {
		background: rgba(255, 255, 255, 0.22);
		border-color: #fff;
		color: #fff;
	}

	.daynight-inner-hero + section {
		background: #fff;
		color: #1c1c1c;
		padding-top: 72px !important;
	}

	body.daynight-template-services-center-html .daynight-inner-hero + section {
		padding-top: 76px !important;
	}

	body.daynight-template-services-center-html .background-light.py-100 {
		background: #f6f8fc;
	}

	body.daynight-template-services-center-html .background-light.py-100 > .container > p {
		color: #667085;
		font-size: 17px;
		margin-left: auto;
		margin-right: auto;
		max-width: 680px;
	}

	body.daynight-template-services-center-html .service-box {
		border: 1px solid #e3e7ef !important;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 30px;
	}

	body.daynight-template-services-center-html .service-box .icon {
		height: 48px;
		width: 48px;
	}

	body.daynight-template-services-center-html .service-box .h4 {
		color: #111827;
		line-height: 1.22;
		text-decoration: none;
	}

	body.daynight-template-services-center-html .service-box p.text-secondary {
		line-height: 1.55;
	}

	body.daynight-template-services-center-html section.relative.py-100 {
		padding-bottom: 82px;
		padding-top: 82px;
	}

	body.daynight-template-services-center-html .services-center-info {
		padding: 20px 34px 20px 0;
	}

	body.daynight-template-services-center-html .services-center-form {
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 8px;
		box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
		padding: 30px;
	}

	body.daynight-template-services-center-html .services-center-form input,
	body.daynight-template-services-center-html .services-center-form select,
	body.daynight-template-services-center-html .services-center-form textarea {
		background: #f6f8fc;
		border: 1px solid #e3e7ef;
		border-radius: 8px;
	}

	body.daynight-template-contact-us-html .daynight-raw-template-shell,
	body.daynight-template-contact-us-html section {
		background: #f6f8fc;
	}

	body.daynight-template-contact-us-html .daynight-contact-primary {
		padding: 66px 0 42px !important;
	}

	body.daynight-template-contact-us-html .daynight-contact-primary .tf-spacing {
		display: none;
	}

	body.daynight-template-contact-us-html .contact-page > .grid {
		align-items: stretch;
	}

	body.daynight-template-contact-us-html .contact-page-info,
	body.daynight-template-contact-us-html .contact-page-form {
		background: #fff;
		border: 1px solid #e3e7ef;
		border-radius: 8px !important;
		box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
		box-sizing: border-box;
		height: 100%;
		max-width: none;
		padding: 32px;
	}

	body.daynight-template-contact-us-html .contact-page-info .contact {
		align-items: flex-start;
	}

	body.daynight-template-contact-us-html .contact-page-info .contact .icon {
		background: #f6f8fc;
		border-color: #e3e7ef;
	}

	body.daynight-template-contact-us-html .contact-page-info .contact .icon img {
		filter: none;
	}

	body.daynight-template-contact-us-html .contact-page-info .h3,
	body.daynight-template-contact-us-html .contact-page-form .h3 {
		color: #111827;
		line-height: 1.16;
	}

	body.daynight-template-contact-us-html .contact-page-form input,
	body.daynight-template-contact-us-html .contact-page-form textarea {
		background: #f6f8fc;
		border: 1px solid #e3e7ef;
		border-radius: 8px;
	}

	body.daynight-template-contact-us-html .contact-page-form textarea {
		min-height: 158px;
	}

	body.daynight-template-contact-us-html .contact-page-form .btn,
	body.daynight-template-contact-us-html .contact-page-info-social li a {
		border-radius: 8px;
	}

	body.daynight-template-contact-us-html .contact-page-info-social {
		flex-wrap: wrap;
	}

	body.daynight-template-contact-us-html .daynight-contact-map {
		background: #fff;
		padding: 22px 0 76px;
	}

	body.daynight-template-contact-us-html .daynight-contact-map .max-w-1920 {
		box-sizing: border-box;
		max-width: 1400px;
		padding: 0 15px;
	}

	body.daynight-template-contact-us-html .daynight-contact-map .widget-gg-map {
		border: 1px solid #e3e7ef;
		border-radius: 8px;
	}

	.daynight-about-location-section {
		background: #fff;
		padding: 76px 0 54px;
	}

	.daynight-about-location {
		align-items: center;
		display: grid;
		gap: 48px;
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
	}

	.daynight-about-location__content h2 {
		color: #111827;
		font-size: clamp(34px, 3vw, 52px);
		letter-spacing: 0;
		line-height: 1.08;
		margin: 0 0 18px;
	}

	.daynight-about-location__content .eyebrow {
		color: #111827;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		margin-bottom: 12px;
		text-transform: uppercase;
	}

	.daynight-about-location__list {
		display: grid;
		gap: 12px;
		margin: 26px 0 30px;
	}

	.daynight-about-location__list li {
		align-items: flex-start;
		color: #111827;
		display: flex;
		font-size: 17px;
		font-weight: 500;
		gap: 10px;
		line-height: 1.42;
	}

	.daynight-about-location__list img {
		flex: 0 0 20px;
		margin-top: 3px;
		width: 20px;
	}

	.daynight-about-location__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.daynight-about-location__actions .btn {
		border-radius: 8px;
	}

	.daynight-about-location__visual {
		display: grid;
		gap: 14px;
	}

	.daynight-about-location__images {
		display: grid;
		gap: 14px;
		grid-template-columns: minmax(0, 1.12fr) minmax(150px, 0.88fr);
	}

	.daynight-about-location__images img,
	.daynight-about-location__map,
	.daynight-about-location__map iframe {
		border-radius: 8px;
		overflow: hidden;
	}

	.daynight-about-location__images img {
		aspect-ratio: 4 / 3;
		display: block;
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	.daynight-about-location__map {
		border: 1px solid #e3e7ef;
	}

	.daynight-about-location__map iframe {
		display: block;
	}

	.daynight-support-reviews {
		background: #f6f8fc;
		padding: 58px 0 70px;
	}

	.daynight-review-grid {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.daynight-review-card {
		background: #fff;
		border: 1px solid #e3e7ef;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		min-height: 240px;
		padding: 26px;
	}

	.daynight-review-card__stars {
		display: flex;
		gap: 4px;
		margin-bottom: 18px;
	}

	.daynight-review-card__stars img {
		height: 17px;
		width: 17px;
	}

	.daynight-review-card__text {
		color: #344054;
		flex: 1 1 auto;
		font-size: 17px;
		line-height: 1.58;
		margin: 0 0 22px;
	}

	.daynight-review-card__person {
		display: grid;
		gap: 4px;
	}

	.daynight-review-card__person strong {
		color: #111827;
		font-size: 16px;
		font-weight: 700;
	}

	.daynight-review-card__person span {
		color: #667085;
		font-size: 14px;
	}

	.out-brand,
	.out-brand-2,
	.out-brand-3,
	.out-brand-4 {
		background-color: #fff;
		border: 0 !important;
		box-shadow: none !important;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.service-box,
	.sell-your-car-box,
	.card-box-style-5,
	.card-box-style-7 {
		background-color: #fff;
		border: 0 !important;
		box-shadow: none !important;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.out-brand:hover,
	.out-brand:focus,
	.out-brand.active,
	.out-brand-2:hover,
	.out-brand-2:focus,
	.out-brand-2.active,
	.out-brand-3:hover,
	.out-brand-3:focus,
	.out-brand-3.active,
	.out-brand-4:hover,
	.out-brand-4:focus,
	.out-brand-4.active,
	.card-box-style-5:hover,
	.card-box-style-5:focus-within,
	.card-box-style-5.active,
	.card-box-style-7:hover,
	.card-box-style-7:focus-within,
	.card-box-style-7.active,
	.service-box:hover,
	.service-box:focus-within,
	.sell-your-car-box:hover,
	.sell-your-car-box:focus-within,
	.sell-your-car-box.active,
	.sell-your-car-box.active-step {
		background-color: #eceff2;
		box-shadow: none !important;
		transform: none !important;
	}

	.out-brand:hover,
	.out-brand:focus,
	.out-brand.active,
	.out-brand-2:hover,
	.out-brand-2:focus,
	.out-brand-2.active,
	.out-brand-3:hover,
	.out-brand-3:focus,
	.out-brand-3.active,
	.out-brand-4:hover,
	.out-brand-4:focus,
	.out-brand-4.active {
		box-shadow: none !important;
	}

	.out-brand:hover .h5,
	.out-brand:focus .h5,
	.out-brand.active .h5,
	.out-brand-2:hover .h5,
	.out-brand-2:focus .h5,
	.out-brand-2.active .h5,
	.out-brand-3:hover .h5,
	.out-brand-3:focus .h5,
	.out-brand-3.active .h5,
	.out-brand-4:hover .h5,
	.out-brand-4:focus .h5,
	.out-brand-4.active .h5,
	.service-box:hover .title,
	.service-box:focus-within .title {
		color: #1c1c1c !important;
	}

	.card-box-style-5:hover .image img,
	.card-box-style-5:focus-within .image img,
	.card-box-style-7:hover .image img,
	.card-box-style-7:focus-within .image img {
		transform: none !important;
	}

	.daynight-home-review-card {
		background: #fff;
		border: 0 !important;
		border-radius: 16px;
		box-shadow: none !important;
		transform: none !important;
	}

	.daynight-home-review-card:hover,
	.daynight-home-review-card:focus {
		background: #fff;
		box-shadow: none !important;
		transform: none !important;
	}

	.card-box-style-7 {
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 18px;
	}

	.card-box-style-7 .image {
		gap: 12px;
		height: 148px;
		margin-bottom: 18px;
	}

	.card-box-style-7 .image img {
		border-radius: 12px;
		display: block;
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	.card-box-style-7 .content {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 0;
	}

	.card-box-style-7 .content > .flex {
		flex: 1 1 auto;
	}

	.card-box-style-7 .btn {
		background: #111827 !important;
		border: 0 !important;
		border-radius: 8px;
		color: #fff !important;
		min-height: 42px;
	}

	.card-box-style-7 .btn:hover,
	.card-box-style-7 .btn:focus {
		background: #d71920 !important;
		color: #fff !important;
	}

	.card-box-style-7 .btn svg path,
	.card-box-style-7 .btn:hover svg path,
	.card-box-style-7 .btn:focus svg path {
		stroke: #fff !important;
	}

	/* Bulgarian sentence-case: the template title-cases headings, which on
	   Cyrillic reads machine-translated ("Vehicle Overview", FAQ toggles).
	   Bulgarian does not title-case, so neutralize text-transform site-wide. */
	.capitalize,
	.post-style-6 .title,
	.post-style-7 .title,
	.flat-accordion .flat-toggle .toggle-title,
	.error-page .title {
		text-transform: none !important;
	}

	.daynight-home-action-card {
		box-shadow: none !important;
		position: relative;
		overflow: hidden;
	}

	.daynight-home-action-card::before {
		background: linear-gradient(180deg, rgba(8, 11, 17, 0.26) 0%, rgba(8, 11, 17, 0.62) 100%);
		content: "";
		inset: 0;
		pointer-events: none;
		position: absolute;
		z-index: 1;
	}

	.daynight-home-action-card--inventory::before {
		background: linear-gradient(180deg, rgba(12, 42, 99, 0.32) 0%, rgba(6, 16, 40, 0.66) 100%);
	}

	.daynight-home-action-card--sell::before {
		background: linear-gradient(180deg, rgba(122, 14, 22, 0.34) 0%, rgba(36, 6, 10, 0.68) 100%);
	}

	.daynight-home-action-card__content {
		bottom: 0;
		left: 0;
		position: absolute;
		width: 100%;
		z-index: 2;
	}

	.daynight-home-action-card:hover,
	.daynight-home-action-card:focus-within {
		box-shadow: none !important;
		transform: none !important;
	}

	.title-section .btn.btn-line,
	.title-section .btn.btn-line-style-2 {
		background: #111827 !important;
		border-color: #111827 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	.title-section .btn.btn-line:hover,
	.title-section .btn.btn-line:focus,
	.title-section .btn.btn-line-style-2:hover,
	.title-section .btn.btn-line-style-2:focus {
		background: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
	}

	.title-section .btn.btn-line::before,
	.title-section .btn.btn-line::after,
	.title-section .btn.btn-line-style-2::before,
	.title-section .btn.btn-line-style-2::after {
		opacity: 0 !important;
		transition: none !important;
	}

	.title-section .btn.btn-line svg path,
	.title-section .btn.btn-line:hover svg path,
	.title-section .btn.btn-line:focus svg path,
	.title-section .btn.btn-line-style-2 svg path,
	.title-section .btn.btn-line-style-2:hover svg path,
	.title-section .btn.btn-line-style-2:focus svg path {
		fill: #fff !important;
		stroke: #fff !important;
	}

	.title-section .btn.btn-line svg,
	.title-section .btn.btn-line-style-2 svg {
		display: none !important;
	}

	.title-section .btn.btn-line::after,
	.title-section .btn.btn-line-style-2::after {
		align-items: center;
		background: transparent !important;
		border: 0 !important;
		border-radius: 0 !important;
		color: currentColor !important;
		content: '\\2192' !important;
		display: inline-flex !important;
		flex: 0 0 22px;
		font-size: 22px;
		font-weight: 700;
		height: 22px;
		inset: auto !important;
		justify-content: center;
		line-height: 1;
		margin-left: 2px;
		opacity: 1 !important;
		position: static !important;
		transform: none !important;
		transition: none !important;
		width: 22px;
	}

	.sell-your-car-box .number {
		transition:
			background-color 0.16s ease,
			box-shadow 0.16s ease,
			color 0.16s ease;
	}

	.sell-your-car-box:hover .number,
	.sell-your-car-box:focus-within .number,
	.sell-your-car-box.active .number,
	.sell-your-car-box.active-step .number {
		background-color: #111827 !important;
		box-shadow: none;
		color: #fff !important;
	}

	.sell-your-car-box-wrapper:has(.active-step) .sell-your-car-box.active-step::before,
	.sell-your-car-box-wrapper:has(.active-step) .sell-your-car-box:not(.active-step)::before,
	.sell-your-car-box-wrapper:has(.active-step) .sell-your-car-box:not(.active-step)::after {
		background-color: #111827 !important;
	}

	.sell-your-car-box-wrapper:has(.active-step) .sell-your-car-box:not(.active-step) .number {
		background-color: #111827 !important;
		color: #fff !important;
	}

	.sell-your-car-box-wrapper:has(.active-step)
		.sell-your-car-box.active-step
		~ .sell-your-car-box
		.number {
		background-color: #e7e7e7 !important;
		box-shadow: none;
		color: #1c1c1c !important;
	}

	.sell-your-car-box-wrapper:has(.active-step)
		.sell-your-car-box.active-step
		~ .sell-your-car-box::before,
	.sell-your-car-box-wrapper:has(.active-step)
		.sell-your-car-box.active-step
		~ .sell-your-car-box::after {
		background-color: #e7e7e7 !important;
	}

	body.daynight-template-about-us-html section.pb-100 > .container > .row {
		align-items: stretch;
	}

	body.daynight-template-about-us-html section.pb-100 > .container > .row > .col-lg-6 {
		display: flex;
	}

	body.daynight-template-about-us-html .about-box {
		box-sizing: border-box;
		flex: 1 1 auto;
		min-height: 520px;
		padding-bottom: 0;
		padding-right: 92px;
	}

	body.daynight-template-about-us-html .about-box .main-img {
		height: 100%;
		min-height: 520px;
		object-fit: cover;
		object-position: center;
		width: 100%;
	}

	body.daynight-template-about-us-html .about-box .sub-img {
		bottom: 0;
		height: 300px;
		padding: 18px 0 0 18px;
		right: 0;
		width: 300px;
	}

	body.daynight-template-about-us-html .about-box .sub-img img {
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	body.daynight-template-about-us-html .about-content {
		flex: 1 1 auto;
		padding-bottom: 32px;
		padding-top: 32px;
	}

	body.daynight-template-about-us-html section:not(.daynight-inner-hero) {
		background: #fff;
		color: #1c1c1c;
	}

	body.daynight-template-about-us-html .daynight-raw-template-shell,
	body.daynight-template-about-us-html .tf-spacing-style5 {
		background: #fff;
	}

	body.daynight-template-about-us-html section:not(.daynight-inner-hero) h2,
	body.daynight-template-about-us-html section:not(.daynight-inner-hero) .h5,
	body.daynight-template-about-us-html section:not(.daynight-inner-hero) .sale-agent-title {
		color: #1c1c1c;
	}

	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a {
		background-color: rgba(17, 24, 39, 0.34) !important;
		border-color: rgba(255, 255, 255, 0.42) !important;
		box-shadow: 0 14px 28px rgba(15, 23, 42, 0.2);
		color: #fff !important;
	}

	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a:hover,
	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a:focus,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a:hover,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a:focus {
		background-color: rgba(17, 24, 39, 0.56) !important;
		border-color: rgba(255, 255, 255, 0.78) !important;
		box-shadow: 0 18px 34px rgba(15, 23, 42, 0.34);
		color: #fff !important;
		transform: translateY(-2px);
	}

	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a svg path,
	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a:hover svg path,
	body.daynight-template-about-us-html .sale-agent-box .sale-agent-social li a:focus svg path,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a svg path,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a:hover svg path,
	body.daynight-template-sale-agents-html .sale-agent-box .sale-agent-social li a:focus svg path {
		stroke: #fff !important;
	}

	body.daynight-template-sale-agents-html .sale-agent-box .card-bottom .contact li a:hover,
	body.daynight-template-sale-agents-html .sale-agent-box .card-bottom .contact li a:focus {
		background-color: #111827 !important;
		border-color: #111827 !important;
		color: #fff !important;
	}

	body.daynight-template-sale-agents-html .sale-agent-box .card-bottom .contact li a:hover svg path,
	body.daynight-template-sale-agents-html .sale-agent-box .card-bottom .contact li a:focus svg path {
		fill: none !important;
		stroke: currentColor !important;
	}

	body.daynight-template-about-us-html section.tf-spacing-8.pt-0 {
		background: #fff;
	}

	body.daynight-template-about-us-html .daynight-about-brands {
		background: #fff;
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	body.daynight-template-about-us-html .daynight-about-brand-card {
		border-radius: 8px;
		border: 1px solid #e3e7ef !important;
		min-height: 176px;
		padding: 24px 18px;
	}

	body.daynight-template-about-us-html .daynight-about-brand-card:hover,
	body.daynight-template-about-us-html .daynight-about-brand-card:focus {
		background-color: #eceff2;
		box-shadow: none !important;
		transform: none;
	}

	body.daynight-template-about-us-html .daynight-about-brand-card__logo,
	body.daynight-template-about-us-html .daynight-about-brand-card__mark {
		height: 78px;
		margin-bottom: 16px;
		width: 78px;
	}

	body.daynight-template-about-us-html .daynight-about-brand-card__logo {
		display: block;
		object-fit: contain;
	}

	body.daynight-template-about-us-html .daynight-about-brand-card__mark {
		align-items: center;
		background: #f6f8fc;
		border: 1px solid #d8dee8;
		border-radius: 50%;
		color: #111827;
		display: inline-flex;
		font-size: 20px;
		font-weight: 700;
		justify-content: center;
		letter-spacing: 0;
		line-height: 1;
	}

	body.daynight-template-about-us-html .daynight-about-brand-card:hover .daynight-about-brand-card__mark,
	body.daynight-template-about-us-html .daynight-about-brand-card:focus .daynight-about-brand-card__mark {
		background: #fff;
		border-color: #d8dee8;
		color: #111827;
	}

	@media (max-width: 991px) {
		.daynight-inner-hero {
			min-height: 336px;
		}

		.daynight-inner-hero__content {
			padding-bottom: 56px;
			padding-top: 68px;
		}

		.daynight-inner-hero h1 {
			font-size: clamp(36px, 9vw, 58px);
			max-width: 680px;
		}

		.daynight-inner-hero p {
			font-size: 17px;
			max-width: 560px;
		}

		.daynight-inner-hero + section {
			padding-top: 54px !important;
		}

		body.daynight-template-about-us-html .about-box {
			margin-bottom: 36px;
			min-height: 400px;
			padding-right: 78px;
		}

		body.daynight-template-about-us-html .about-box .main-img {
			height: 400px;
		}

		body.daynight-template-about-us-html .about-content {
			padding: 0;
		}

		body.daynight-template-services-center-html .services-center-info {
			padding: 0;
		}

		.daynight-about-location {
			gap: 34px;
			grid-template-columns: 1fr;
		}

		.daynight-review-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 575px) {
		.daynight-inner-hero {
			min-height: 310px;
		}

		.daynight-inner-hero::after {
			background:
				linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.54) 100%),
				linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.48) 100%);
		}

		.daynight-inner-hero__content {
			padding-bottom: 38px;
			padding-top: 46px;
		}

		.daynight-inner-hero h1 {
			font-size: 34px;
			line-height: 1.08;
			margin-bottom: 12px;
		}

		.daynight-inner-hero p {
			font-size: 15px;
			line-height: 1.45;
		}

		.daynight-inner-hero__actions {
			gap: 10px;
			margin-top: 22px;
		}

		.daynight-inner-hero__button {
			flex: 1 1 100%;
			font-size: 15px;
			min-height: 48px;
		}

		.daynight-inner-hero + section {
			padding-top: 42px !important;
		}

		body.daynight-template-about-us-html .about-box {
			margin-bottom: 28px;
			min-height: 0;
			padding-bottom: 118px;
			padding-right: 0;
		}

		body.daynight-template-about-us-html .about-box .main-img {
			aspect-ratio: 4 / 3;
			height: auto;
			width: 100%;
		}

		body.daynight-template-about-us-html .about-box .sub-img {
			aspect-ratio: 1 / 1;
			bottom: 0;
			height: auto;
			right: 16px;
			width: 58%;
		}

		body.daynight-template-services-center-html .daynight-inner-hero + section {
			padding-top: 44px !important;
		}

		body.daynight-template-services-center-html .service-box,
		body.daynight-template-services-center-html .services-center-form,
		body.daynight-template-contact-us-html .contact-page-info,
		body.daynight-template-contact-us-html .contact-page-form,
		.daynight-review-card {
			padding: 22px;
		}

		body.daynight-template-contact-us-html .daynight-contact-primary {
			padding: 42px 0 30px !important;
		}

		body.daynight-template-contact-us-html .daynight-contact-map {
			padding-bottom: 48px;
		}

		.daynight-about-location-section {
			padding: 44px 0 38px;
		}

		.daynight-about-location__content h2 {
			font-size: 32px;
		}

		.daynight-about-location__images {
			grid-template-columns: 1fr;
		}

		.daynight-support-reviews {
			padding: 42px 0 48px;
		}

		body.daynight-template-about-us-html .daynight-about-brands {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		body.daynight-template-about-us-html .daynight-about-brand-card {
			min-height: 146px;
			padding: 20px 14px;
		}

		body.daynight-template-about-us-html .daynight-about-brand-card__logo,
		body.daynight-template-about-us-html .daynight-about-brand-card__mark {
			height: 60px;
			width: 60px;
		}
	}

	body.daynight-template-listing-grid4-columns-html .btn-filter,
	body.daynight-template-listing-gridstyle-halfmap-html .btn-filter {
		background: #111827 !important;
		border-color: #111827 !important;
		color: #fff !important;
		box-shadow: none;
	}

	body.daynight-template-listing-grid4-columns-html .btn-filter svg path,
	body.daynight-template-listing-gridstyle-halfmap-html .btn-filter svg path {
		fill: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html .btn-filter:hover,
	body.daynight-template-listing-gridstyle-halfmap-html .btn-filter:hover {
		background: #d71920 !important;
		border-color: #d71920 !important;
		color: #fff !important;
		box-shadow: none;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-band {
		background: #111827;
		border-bottom: 0;
		box-shadow: none;
		isolation: isolate;
		overflow: visible;
		position: relative;
		padding: 38px 0 32px;
		margin-bottom: 30px;
		/* Must sit above .daynight-inventory-listings-shell (also z-index:1, but later in
		   the DOM) so an open filter dropdown overflows ABOVE the card grid instead of
		   being trapped behind it. Stays well below the sticky header's z-index. */
		z-index: 40;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-band::before {
		background: transparent;
		content: '';
		inset: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		z-index: -1;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-controls-shell {
		box-sizing: border-box;
		max-width: 1320px !important;
		padding-left: 0;
		padding-right: 0;
		position: relative;
		width: calc(100% - 64px);
		z-index: 2;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-form {
		box-sizing: border-box;
		display: grid;
		gap: 10px;
		background: #ffffff;
		border: 1px solid #d8e1ee;
		border-radius: 14px;
		box-shadow: none;
		min-width: 0;
		overflow: visible;
		padding: 14px;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html section.pb-100,
	body.daynight-template-listing-grid4-columns-html main.pb-100 {
		background: #f4f7fb;
		padding-top: 0;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-listings-shell {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		max-width: 1440px !important;
		padding: 0 0 34px;
		position: relative;
		width: calc(100% - 48px);
		z-index: 1;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listing-controls {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		margin-bottom: 10px;
		min-height: 44px;
		padding: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-results-toolbar {
		align-items: center;
		column-gap: 16px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		margin-left: 0;
		margin-right: 0;
		min-height: 42px;
		row-gap: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-results-toolbar
		> .daynight-inventory-results-count-cell {
		grid-column: 1;
		grid-row: 1;
		justify-self: start;
		max-width: none;
		min-width: 0;
		padding: 0;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-result-summary {
		align-items: center;
		display: flex;
		gap: 10px;
		min-width: 0;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-result-count {
		color: #344054;
		flex: 0 0 auto;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.35;
		margin: 0;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-results-toolbar
		> .daynight-inventory-view-switch {
		grid-column: 2;
		grid-row: 1;
		justify-self: center;
		max-width: none;
		min-width: 0;
		padding: 0;
		width: auto;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-sort-control {
		align-items: center;
		display: flex;
		gap: 10px;
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
		min-height: 44px;
		min-width: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.listing-tabs.menu-tab {
		background: #fff;
		border: 1px solid #dbe5f1;
		border-radius: 8px;
		gap: 6px;
		min-height: 42px;
		padding: 4px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.listing-tabs
		.item-menu {
		align-items: center;
		border-radius: 6px;
		height: 32px;
		justify-content: center;
		transition:
			background 0.16s ease,
			color 0.16s ease;
		width: 36px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.listing-tabs
		.item-menu.active {
		background: #101828;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.listing-tabs
		.item-menu:not(.active):hover {
		background: #eef2f7;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.listing-tabs
		.item-menu.active
		svg
		circle {
		fill: #fff !important;
		stroke: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-listings-shell .content-tab {
		min-width: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-results-toolbar
		> .col-md-12.mb-8 {
		display: none;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-applied-filters {
		align-content: center;
		align-items: center;
		display: none;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0 0 22px;
		min-height: 40px;
		min-width: 0;
		opacity: 0;
		overflow: visible;
		pointer-events: none;
		visibility: hidden;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-applied-filters.is-active {
		display: flex;
		opacity: 1;
		pointer-events: auto;
		visibility: visible;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-applied-filters__tags {
		display: contents;
		scrollbar-width: none;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-applied-filters__tags::-webkit-scrollbar {
		display: none;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterTags
		.select-item {
		align-items: center;
		background: #fee2e2;
		border: 1px solid #d71920;
		border-radius: 999px;
		color: #111827 !important;
		cursor: pointer;
		display: inline-flex;
		flex: 0 1 auto;
		font-size: 14px;
		font-weight: 700;
		gap: 8px;
		height: 42px;
		justify-content: center;
		line-height: 1;
		margin: 0;
		max-width: min(220px, 100%);
		min-height: 42px;
		min-width: 0;
		overflow: hidden;
		padding: 0 11px 0 14px;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterTags
		.select-item__label {
		color: #111827 !important;
		display: block;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterTags
		.select-item:hover {
		background: #fee2e2;
		border-color: #111827;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterTags
		.select-item:focus-visible {
		border-color: #d71920;
		outline: 2px solid #d71920;
		outline-offset: 2px;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterTags
		.select-item
		.filter-icon {
		flex: 0 0 auto;
		filter: none;
		height: 16px;
		opacity: 0.8;
		width: 16px;
	}

	body.daynight-template-listing-grid4-columns-html
		#filterDivider {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		#btnClearAll {
		align-items: center;
		background: #111827;
		border: 1px solid #111827;
		border-radius: 999px;
		color: #fff;
		display: inline-flex;
		font-size: 13px;
		font-weight: 700;
		gap: 8px;
		flex: 0 0 auto;
		height: 42px;
		justify-content: center;
		line-height: 1;
		margin: 0;
		min-height: 42px;
		padding: 0 14px;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html
		#btnClearAll[hidden] {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		#btnClearAll:hover {
		background: #d71920;
		border-color: #d71920;
	}

	body.daynight-template-listing-grid4-columns-html
		#btnClearAll:focus-visible {
		border-color: #d71920;
		outline: 2px solid #d71920;
		outline-offset: 2px;
	}

	body.daynight-template-listing-grid4-columns-html
		#btnClearAll
		img {
		filter: brightness(0) invert(1);
		height: 12px;
		width: 12px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		#filterMatchesCount {
		color: #101828;
		font-weight: 800;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.core-dropdown__button {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		box-shadow: none;
		color: #101828;
		min-height: 42px;
		min-width: 186px;
		padding: 0 14px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.core-dropdown__button:hover,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-listings-shell
		.core-dropdown.active
		.core-dropdown__button {
		border-color: #b8c5d6;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-results-toolbar
		.daynight-inventory-sort-control
		p {
		color: #475467;
		font-size: 15px;
		font-weight: 500;
		margin: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-view-switch {
		align-items: center;
		display: inline-flex;
		min-width: 0;
	}

	body.daynight-template-listing-grid4-columns-html [data-daynight-grid-panel][hidden] {
		display: none !important;
	}

	@media (max-width: 991px) {
		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-results-toolbar {
			grid-template-columns: minmax(0, 1fr) auto;
			row-gap: 12px;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-results-toolbar
			> .daynight-inventory-results-count-cell {
			grid-column: 1;
			grid-row: 1;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-view-switch {
			grid-column: 1 / -1;
			grid-row: 2;
			justify-self: center;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-sort-control {
			grid-column: 2;
			grid-row: 1;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-applied-filters {
			flex-wrap: wrap;
			width: 100%;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-applied-filters__tags {
			max-width: none;
		}
	}

	body.daynight-template-blog-standard-html .daynight-raw-template-shell,
	body.daynight-template-blog-grid-style-1-html .daynight-raw-template-shell,
	body.daynight-template-blog-details-2-html .daynight-raw-template-shell,
	body.daynight-template-blog-standard-html section.pb-100,
	body.daynight-template-blog-grid-style-1-html section.pb-100,
	body.daynight-template-blog-details-2-html section {
		background: #fff;
	}

	body.daynight-template-blog-standard-html section.pb-100 h2,
	body.daynight-template-blog-grid-style-1-html section.pb-100 h2,
	body.daynight-template-blog-details-2-html .bloc-details-container .title-2 {
		color: #1c1c1c;
	}

	body.daynight-template-blog-standard-html .widget-categories a.active,
	body.daynight-template-blog-standard-html .widget-tags a.active {
		color: #d71920;
	}

	body.daynight-template-blog-standard-html .daynight-blog-empty[hidden],
	body.daynight-template-blog-standard-html [data-daynight-blog-pagination][hidden] {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-top-spacer {
		height: 0 !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-controls {
		position: relative;
		z-index: 60;
		margin-top: 0;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-searchbar,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar {
		align-items: center;
		flex-wrap: nowrap;
		background: transparent;
		border: 0;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		overflow: visible;
		padding: 0;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar {
		box-sizing: border-box;
		display: grid;
		gap: 8px;
		grid-template-columns:
			minmax(104px, 0.78fr) minmax(132px, 1.08fr) minmax(132px, 1.08fr)
			minmax(112px, 0.9fr) minmax(112px, 0.9fr) minmax(120px, 0.95fr)
			minmax(124px, 1fr) minmax(112px, 0.9fr) minmax(124px, 1fr);
		justify-content: stretch;
		overflow: visible;
		scrollbar-width: thin;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-sidebar {
		align-items: center;
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 15px;
		font-weight: 650;
		gap: 8px;
		align-self: stretch;
		box-sizing: border-box;
		height: 56px !important;
		justify-content: center;
		min-height: 56px;
		padding: 0 12px !important;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-field {
		flex: 1 1 128px;
		min-width: 124px;
	}

	body.daynight-template-listing-grid4-columns-html #filterSidebarToggle {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-select {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		border: 0;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-search {
		flex: 1 1 auto;
		position: relative;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-search__input {
		background: #f8fafc !important;
		border: 1px solid #e2e8f2;
		border-radius: 8px;
		box-sizing: border-box;
		min-height: 56px;
		padding-right: 112px !important;
		outline: 0;
		font-size: 15px;
		line-height: 20px;
		padding-top: 18px;
		padding-bottom: 0;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-search__input.active,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-search__input:active,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-search__input:focus,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-search:focus-within
		.daynight-inventory-search__input {
		border-color: rgba(219, 227, 238, 0.96) !important;
		outline: 0 !important;
		box-shadow: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-search__input::placeholder {
		color: #9fa1a4;
		font-size: 15px;
		line-height: 20px;
		opacity: 1;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown {
		align-items: center;
		background: #edf3fa !important;
		border: 1px solid #cbd8e8;
		border-radius: 8px;
		box-sizing: border-box;
		box-shadow: none;
		display: flex;
		height: 56px;
		min-height: 56px;
		padding: 0 10px;
		position: relative;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown.active {
		z-index: 90;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__text {
		align-items: center;
		background: transparent;
		border: 0;
		box-sizing: border-box;
		color: inherit;
		cursor: pointer;
		display: flex;
		font: inherit;
		height: 100% !important;
		inset: 0 !important;
		min-width: 0;
		padding: 0 28px 0 12px !important;
		position: absolute !important;
		text-align: left;
		width: 100%;
		z-index: 2;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__text::after {
		border-bottom: 2px solid currentColor;
		border-right: 2px solid currentColor;
		content: '';
		height: 7px;
		position: absolute;
		right: 10px !important;
		top: 50%;
		transform: translateY(-55%) rotate(45deg) !important;
		transition: transform 0.18s ease;
		width: 7px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown:focus-within {
		border-color: #111827 !important;
		outline: 0 !important;
		box-shadow: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown
		.filter-select-dropdown__text:focus-visible {
		outline: 2px solid #111827 !important;
		outline-offset: -4px;
		box-shadow: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.active:not(.is-selected),
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.filter-select-dropdown:not(.is-selected):has(.filter-select-dropdown__toggle:checked) {
		background: #e6eef8 !important;
		border-color: #111827 !important;
		box-shadow: none !important;
		color: #111827 !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.active:not(.is-selected)
		> .filter-select-dropdown__text::after,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.filter-select-dropdown:not(.is-selected):has(.filter-select-dropdown__toggle:checked)
		> .filter-select-dropdown__text::after {
		border-color: #111827 !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected {
		background: #111827 !important;
		background-color: #111827 !important;
		border: 1px solid #111827 !important;
		border-color: #111827 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.active,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.filter-select-dropdown:has(.filter-select-dropdown__toggle:checked) {
		background: #d71920 !important;
		background-color: #d71920 !important;
		border-color: #d71920 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected
		.filter-select-dropdown__text,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected
		[data-daynight-quick-value] {
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.active
		.filter-select-dropdown__text,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.active
		[data-daynight-quick-value],
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.filter-select-dropdown:has(.filter-select-dropdown__toggle:checked)
		.filter-select-dropdown__text,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.filter-select-dropdown:has(.filter-select-dropdown__toggle:checked)
		[data-daynight-quick-value] {
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown.active
		.filter-select-dropdown__text::after,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__toggle:checked
		~ .filter-select-dropdown__text::after {
		transform: translateY(-35%) rotate(225deg) !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected
		> .filter-select-dropdown__text::after {
		border-color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.active
		> .filter-select-dropdown__text::after,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.is-selected.filter-select-dropdown:has(.filter-select-dropdown__toggle:checked)
		> .filter-select-dropdown__text::after {
		border-color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.active,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown:has(.filter-select-dropdown__toggle:checked) {
		position: relative;
		z-index: 1200 !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown.active
		> .filter-select-dropdown__menu,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown:has(.filter-select-dropdown__toggle:checked)
		> .filter-select-dropdown__menu {
		opacity: 1 !important;
		transform: translateY(0) !important;
		visibility: visible !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__menu {
		background: #fff;
		border: 1px solid #ececec;
		border-radius: 14px;
		box-sizing: border-box;
		box-shadow: 0 22px 46px rgba(12, 18, 24, 0.2);
		left: 0;
		max-height: min(360px, calc(100vh - 260px));
		min-width: 100%;
		max-width: calc(100vw - 64px);
		overflow: hidden;
		padding: 13px;
		right: auto;
		top: calc(100% + 8px);
		width: min(360px, calc(100vw - 64px));
		z-index: 1000 !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--brand
		.filter-select-dropdown__menu,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--model
		.filter-select-dropdown__menu {
		width: min(420px, calc(100vw - 64px));
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--mileage
		.filter-select-dropdown__menu,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--body
		.filter-select-dropdown__menu,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--feature
		.filter-select-dropdown__menu {
		left: auto;
		right: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-quick-field--feature
		.filter-select-dropdown__menu {
		width: min(520px, calc(100vw - 64px));
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list {
		box-sizing: border-box;
		display: grid;
		gap: 2px;
		max-height: min(300px, calc(100vh - 300px));
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0;
		scrollbar-width: thin;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox {
		align-items: flex-start;
		box-sizing: border-box;
		color: #101828;
		cursor: pointer;
		min-height: 44px;
		padding: 0;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox:hover,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox:focus-within {
		background: transparent;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox
		input {
		accent-color: #d71920;
		flex: 0 0 auto;
		height: 18px;
		margin-top: 1px;
		width: 18px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox
		span {
		align-items: center;
		background: #fff;
		border: 0;
		border-radius: 8px;
		box-sizing: border-box;
		color: #101828 !important;
		display: flex !important;
		font-size: 14.5px;
		font-weight: 650;
		line-height: 1.45;
		min-height: 44px;
		min-width: 0;
		overflow: visible;
		padding: 10px 12px 10px 42px !important;
		position: relative;
		overflow-wrap: normal;
		white-space: normal;
		width: 100% !important;
		word-break: normal;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox:hover
		span,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox:focus-within
		span {
		background: #f8fafc;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__list
		.filter-checkbox
		input:checked
		+ span {
		background: #fff;
		box-shadow: none;
		color: #101828 !important;
		font-weight: 750;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-checkbox
		span {
		overflow-wrap: normal;
		white-space: normal;
		word-break: normal;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.filter-select-dropdown__text
		span {
		color: #1c1c1c;
		display: block;
		font-size: 15px;
		font-weight: 650;
		line-height: 1.32;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-filterbar
		.daynight-inventory-filter-dropdown__label {
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit {
		position: absolute;
		right: 6px;
		top: 6px;
		bottom: 6px;
		left: auto;
		box-sizing: border-box;
		width: auto !important;
		min-width: 0 !important;
		max-width: none;
		flex: 0 0 auto;
		height: auto;
		min-height: 0;
		padding: 0 20px;
		border-radius: 8px;
		z-index: 2;
		background: #111827 !important;
		border-color: #111827 !important;
		box-shadow: none;
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit::before {
		content: none !important;
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit
		span {
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:hover,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:focus,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:active {
		background: #020617 !important;
		border-color: #020617 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit
		img {
		filter: brightness(0) invert(1);
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:hover
		span,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:focus
		span,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:active
		span {
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:hover
		img,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:focus
		img,
	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-searchbar
		.daynight-inventory-searchbar__submit:active
		img {
		filter: brightness(0) invert(1);
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar {
		align-items: center;
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 15px;
		font-weight: 650;
		gap: 8px;
		height: 56px !important;
		justify-content: center;
		min-height: 56px;
		padding: 0 12px !important;
		width: 100%;
		background: #d71920 !important;
		border: 1px solid #d71920 !important;
		box-shadow: none;
		color: #fff !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar__label {
		color: inherit;
		line-height: 1;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar:hover {
		background: #a50f15 !important;
		border-color: #a50f15 !important;
		box-shadow: none !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar:focus-visible {
		background: #a50f15 !important;
		border-color: #fff !important;
		box-shadow: none !important;
		outline: 2px solid #fff !important;
		outline-offset: 2px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar img {
		height: 18px;
		filter: brightness(0) invert(1) !important;
		width: 18px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar .daynight-inventory-filter-field {
		min-width: 0;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pills {
		align-items: center;
		display: flex;
		flex: 1 1 auto;
		flex-wrap: wrap;
		gap: 8px;
		min-height: 40px;
		min-width: 0;
		overflow: visible;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-quick-form
		.daynight-inventory-type-pills {
		border-top: 0;
		padding-top: 2px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill {
		align-items: center;
		background: #fff;
		border: 1px solid #cbd5e1;
		border-radius: 999px;
		color: #344054;
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 14px;
		font-weight: 650;
		gap: 8px;
		justify-content: center;
		line-height: 1.25;
		min-height: 40px;
		min-width: 0;
		padding: 0 12px;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill[hidden] {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill:hover {
		background: #eef2f7;
		border-color: #94a3b8;
		color: #101828;
		box-shadow: none;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill.is-active {
		background: #111827;
		border-color: #111827;
		color: #fff;
		box-shadow: none;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-quick-form
		.daynight-inventory-type-pill.is-active {
		background: #d71920;
		border-color: #d71920;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill svg {
		color: inherit !important;
		height: 18px;
		flex: 0 0 30px;
		width: 30px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pill span {
		color: inherit !important;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-form--grey-preview {
		background: #f3f6fa;
		border: 1px solid #c7d2e1;
		border-radius: 16px;
		box-shadow: none;
		margin-top: 12px;
		padding: 16px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-searchbar {
		display: grid;
		gap: 12px;
		grid-template-columns: minmax(0, 1fr) 254px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-search {
		background: #fff;
		border: 1px solid #b9c7d8;
		border-radius: 8px;
		box-shadow: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 62px;
		min-width: 0;
		padding: 9px 16px 8px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-label {
		color: #4b5563;
		font-size: 12px;
		line-height: 1.2;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-placeholder {
		color: #9ca3af;
		display: block;
		font-size: 16px;
		line-height: 1.25;
		margin-top: 7px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-search-button,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar {
		align-items: center;
		background: #fff;
		border: 1px solid #111827;
		border-radius: 8px;
		color: #111827;
		display: inline-flex;
		justify-content: center;
		min-height: 62px;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			box-shadow 0.16s ease;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-search-button {
		gap: 10px;
		font-size: 16px;
		font-weight: 600;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-search-button img,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar img {
		filter: brightness(0) saturate(100%) invert(31%) sepia(90%) saturate(2254%) hue-rotate(212deg)
			brightness(86%) contrast(97%);
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-search-button:hover,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar:hover {
		background: #d71920;
		border-color: #d71920;
		box-shadow: none;
		color: #fff;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-preview-search-button:hover
		img,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar:hover img {
		filter: brightness(0) invert(1);
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar {
		background: #111827;
		border-color: #111827;
		color: #fff;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar:hover {
		background: #d71920;
		border-color: #d71920;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar img,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-sidebar:hover img {
		filter: brightness(0) invert(1);
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-filterbar {
		display: grid;
		gap: 12px;
		grid-template-columns: 62px repeat(8, minmax(0, 1fr));
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-select {
		background: #d71920;
		border: 1px solid #d71920;
		border-radius: 8px;
		box-shadow: none;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 62px;
		min-width: 0;
		padding: 0 36px 0 14px;
		position: relative;
		text-align: left;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease,
			color 0.16s ease;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-select::after {
		border-bottom: 2px solid currentColor;
		border-right: 2px solid currentColor;
		content: '';
		height: 8px;
		position: absolute;
		right: 17px;
		top: 50%;
		transform: translateY(-62%) rotate(45deg);
		width: 8px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-select:hover,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-select:focus {
		background: #d71920;
		border-color: #d71920;
		box-shadow: none;
		color: #fff;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-select strong {
		color: inherit;
		display: block;
		font-size: 19px;
		font-weight: 600;
		line-height: 1.05;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pill {
		align-items: center;
		background: #fff;
		border: 1px solid rgba(17, 24, 39, 0.44);
		border-radius: 8px;
		box-shadow: none;
		color: #111827;
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 16px;
		font-weight: 500;
		gap: 8px;
		line-height: 1;
		min-height: 38px;
		padding: 0 15px;
		text-decoration: none;
		white-space: nowrap;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pill:hover,
	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pill.is-active {
		background: #d71920;
		border-color: #d71920;
		box-shadow: none;
		color: #fff;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pill svg {
		color: inherit !important;
		height: 20px;
		width: 42px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-preview-pill span {
		color: inherit !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-preview-pill
		svg
		[stroke='currentColor'] {
		color: inherit !important;
		stroke: currentColor !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-type-pill
		svg
		[stroke='currentColor'] {
		color: inherit !important;
		stroke: currentColor !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.daynight-inventory-type-pill
		svg
		[fill='currentColor'] {
		color: inherit !important;
		fill: currentColor !important;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-heading {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-empty {
		display: none;
		width: 100%;
		margin: -6px 0 24px;
		background: transparent;
		border: 0;
		border-top: 1px solid #dbe5f1;
		border-radius: 0;
		box-shadow: none;
		color: #344054;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.4;
		padding: 16px 0 0;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-empty.is-visible {
		display: block;
	}

	body.daynight-template-listing-grid4-columns-html .daynight-inventory-empty[hidden] {
		display: none !important;
	}

	body.inner-page .daynight-pdp-title {
		color: #1c1c1c;
		font-size: 42px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.12;
		margin: 0 0 18px;
		text-transform: none;
	}

	body.daynight-template-listing-grid4-columns-html [data-daynight-filter-hidden="true"],
	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card][data-daynight-filter-hidden="true"] {
		display: none !important;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card] {
		background: #fff !important;
		border: 0 !important;
		border-radius: 8px;
		box-shadow: none;
		overflow: hidden;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.image {
		aspect-ratio: 1.34 / 1;
		background: #eef2f7;
		border-radius: 8px 8px 0 0;
		height: auto;
		overflow: hidden;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.content {
		background: #fff !important;
		border: 0 !important;
		border-color: transparent !important;
		border-radius: 0 0 8px 8px;
		border-top: 0 !important;
		padding: 18px 16px 16px;
	}

	body.daynight-template-listing-grid4-columns-html
		.card-box.card-box-style-1[data-daynight-vehicle-card]
		.card--img {
		border-radius: 0 !important;
		display: block;
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	body.daynight-template-listing-grid4-columns-html .card-box.card-box-style-1 .card--img,
	body.daynight-template-listing-gridstyle-halfmap-html .card-box.card-box-style-1 .card--img,
	body.inner-page .card-box.card-box-style-1 .card--img {
		transform: none !important;
	}

	@media (max-width: 1480px) {
		body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar {
			grid-template-columns: minmax(118px, 0.72fr) repeat(4, minmax(0, 1fr));
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-filterbar
			.daynight-inventory-quick-sidebar {
			grid-row: 1 / span 2;
			height: auto !important;
			min-height: 100%;
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-filterbar
			.daynight-inventory-filter-field {
			min-width: 0;
		}
	}

	@media (max-width: 1240px) {
		body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar {
			grid-template-columns: 62px repeat(4, minmax(0, 1fr));
		}

		body.daynight-template-listing-grid4-columns-html
			.daynight-inventory-filterbar
			.daynight-inventory-quick-sidebar {
			grid-row: 1 / span 2;
			height: auto !important;
			min-height: 100%;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar {
			padding: 0 !important;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-quick-sidebar__label {
			display: none;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pills {
			flex: 1 1 100%;
		}
	}

	@media (max-width: 575px) {
		body.daynight-template-listing-grid4-columns-html section.pb-100 {
			padding-top: 24px;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-top-spacer {
			height: 0 !important;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar {
			display: flex;
			overflow-x: auto;
			overflow-y: visible;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-type-pills {
			display: flex;
			flex-wrap: nowrap;
			margin-right: -16px;
			overflow-x: auto;
			padding-right: 16px;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-searchbar {
			align-items: stretch;
			flex-direction: column;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-searchbar .daynight-inventory-searchbar__submit {
			width: 100%;
		}

		body.daynight-template-listing-grid4-columns-html .daynight-inventory-filterbar .daynight-inventory-filter-field {
			flex-basis: 145px;
			min-width: 145px;
		}
	}

	@media (max-width: 575px) {

		body.daynight-template-listing-grid4-columns-html .card-box.card-box-style-1 .card--img,
		body.daynight-template-listing-gridstyle-halfmap-html .card-box.card-box-style-1 .card--img,
		body.inner-page .card-box.card-box-style-1 .card--img {
			transform: none !important;
		}
	}

	/* DayNight dashboard density — tighten the oversized vendor template content */
	body.dashboard .dashboard-container .dashboard-content--inner {
		padding: 28px 28px 44px;
	}

	body.dashboard .dashboard-container .dashboard-content--inner .dashboard-content--details {
		max-width: 1180px;
	}

	body.dashboard .dashboard-container .dashboard-content--details > .h3 {
		font-size: 22px !important;
		line-height: 1.25 !important;
		margin-bottom: 18px !important;
	}

	body.dashboard .dashboard-container .grid.grid-cols-4 {
		gap: 16px !important;
	}

	body.dashboard .dashboard-container .dashboard-cart {
		padding: 18px 20px;
		border-radius: 16px;
		gap: 10px;
	}

	body.dashboard .dashboard-container .dashboard-cart .icon {
		max-width: 54px;
		height: 54px;
		border-radius: 12px;
		padding: 12px;
	}

	body.dashboard .dashboard-container .dashboard-cart .h7 {
		font-size: 14px !important;
		line-height: 1.3 !important;
	}

	body.dashboard .dashboard-container .dashboard-cart .h3 {
		font-size: 26px !important;
		line-height: 1.1 !important;
	}

	body.dashboard .dashboard-container .dashboard-box {
		padding: 22px 24px 24px;
		border-radius: 16px;
		margin-bottom: 20px !important;
	}

	body.dashboard .dashboard-container .dashboard-box.style-2 {
		padding-bottom: 26px;
	}

	body.dashboard .dashboard-container .dashboard-box .h4,
	body.dashboard .dashboard-container .car-views-chart__title {
		font-size: 18px !important;
		line-height: 1.3 !important;
	}

	body.dashboard .dashboard-container .car-views-chart__header {
		margin-bottom: 16px;
	}

	body.dashboard .dashboard-container .car-views-chart__container {
		height: 300px;
	}

	/* DayNight dashboard — mobile.bg / cars.bg export panel */
	body.dashboard .daynight-export__head {
		align-items: flex-start;
		display: flex;
		gap: 16px;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	body.dashboard .daynight-export .h4 {
		margin-bottom: 4px;
	}

	body.dashboard .daynight-export__sub {
		color: #64748b;
		display: block;
		font-size: 14px;
		line-height: 1.45;
		max-width: 560px;
	}

	body.dashboard .daynight-export__count {
		background: rgba(40, 125, 250, 0.1);
		border-radius: 999px;
		color: #111827;
		flex: 0 0 auto;
		font-size: 13px;
		font-weight: 600;
		padding: 7px 12px;
		white-space: nowrap;
	}

	body.dashboard .daynight-export__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	body.dashboard .daynight-export__btn {
		appearance: none;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		color: #111827;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
		padding: 11px 18px;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease,
			box-shadow 0.16s ease;
	}

	body.dashboard .daynight-export__btn:hover {
		background: #f3f4f6;
		border-color: #d1d5db;
	}

	body.dashboard .daynight-export__btn--primary {
		background: #d71920;
		border-color: #d71920;
		box-shadow: 0 12px 24px rgba(40, 125, 250, 0.22);
		color: #fff;
	}

	body.dashboard .daynight-export__btn--primary:hover {
		background: #111827;
		border-color: #111827;
		color: #fff;
	}

	body.dashboard .daynight-export__btn--ghost {
		background: transparent;
	}

	body.dashboard .daynight-export__preview {
		background: #0b1220;
		border-radius: 12px;
		color: #d6e2f5;
		font-size: 12px;
		line-height: 1.5;
		margin: 16px 0 0;
		max-height: 240px;
		overflow: auto;
		padding: 16px;
		white-space: pre;
	}

	body.dashboard .daynight-export__hint {
		color: #64748b;
		font-size: 13px;
		line-height: 1.5;
		margin: 14px 0 0;
	}
</style>`;

	return styles;
}
