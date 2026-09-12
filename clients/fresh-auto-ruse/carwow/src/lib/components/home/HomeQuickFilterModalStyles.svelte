<style>
	/* Home hero quick-filter modal styles. */
	:global(.daynight-hero-filter-sheet) {
		--daynight-hero-filter-offset: clamp(188px, 24vh, 206px);

		align-items: flex-start;
		display: flex;
		inset: 0;
		justify-content: center;
		padding: var(--daynight-hero-filter-offset) 24px 24px;
		position: fixed;
		z-index: 5000;
	}

	:global(.daynight-hero-filter-sheet[hidden]) {
		display: none;
	}

	:global(.daynight-hero-filter-sheet__backdrop) {
		position: absolute;
		inset: 0;
		background: rgba(9, 14, 24, 0.42);
		backdrop-filter: none;
	}

	:global(.daynight-hero-filter-sheet__sheet) {
		background: #fff;
		border: 1px solid rgba(226, 232, 240, 0.92);
		border-radius: 12px;
		box-shadow: none;
		display: flex;
		flex-direction: column;
		max-height: min(640px, calc(100dvh - var(--daynight-hero-filter-offset) - 24px));
		overflow: hidden;
		position: relative;
		width: min(500px, 100%);
		animation: daynight-hero-modal-rise 140ms ease-out;
	}

	@media (max-width: 1199px) {
		:global(.daynight-hero-filter-sheet) {
			--daynight-hero-filter-offset: 80px;

			padding-left: 18px;
			padding-right: 18px;
		}
	}

	@keyframes daynight-hero-modal-rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	:global(.daynight-hero-filter-sheet__head) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 20px 12px;
	}

	:global(.daynight-hero-filter-sheet__title) {
		margin: 0;
		font-size: 20px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.25;
		color: #101828;
	}

	:global(.daynight-hero-filter-sheet__close) {
		flex: 0 0 auto;
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 50%;
		background: #f5f7fb;
		color: #475467;
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
	}

	:global(.daynight-hero-filter-sheet__close:hover) {
		background: #e7ebf2;
	}

	:global(.daynight-hero-filter-sheet__searchwrap) {
		padding: 0 20px 12px;
		position: relative;
	}

	:global(.daynight-hero-filter-sheet__searchwrap[hidden]) {
		display: none;
	}

	:global(.daynight-hero-filter-sheet__searchwrap svg) {
		color: #98a2b3;
		height: 16px;
		left: 34px;
		pointer-events: none;
		position: absolute;
		stroke: currentColor;
		top: 23px;
		transform: translateY(-50%);
		width: 16px;
		z-index: 2;
	}

	:global(.daynight-hero-filter-sheet__search) {
		appearance: none;
		background: #fff !important;
		border: 1px solid #dfe6ef !important;
		border-radius: 10px;
		box-shadow: none !important;
		box-sizing: border-box;
		color: #101828;
		font-size: 16px;
		font-weight: 500;
		height: 46px;
		line-height: 1.35;
		outline: 0 !important;
		/* !important: root-level input padding would otherwise slide the placeholder under the icon. */
		padding: 0 14px 0 44px !important;
		transition: border-color 120ms ease !important;
		width: 100%;
	}

	:global(.daynight-hero-filter-sheet__search::placeholder) {
		color: #98a2b3;
		font-weight: 500;
		opacity: 1;
	}

	:global(.daynight-hero-filter-sheet__search:focus) {
		border-color: #b00000 !important;
		box-shadow: none !important;
		outline: 0 !important;
	}

	:global(.daynight-hero-filter-sheet__search:focus-visible) {
		border-color: #b00000 !important;
		box-shadow: none !important;
		outline: 0 !important;
	}

	:global(.daynight-hero-filter-sheet__list) {
		overflow-y: auto;
		padding: 0 10px 12px;
		overscroll-behavior: contain;
	}

	:global(.daynight-hero-filter-sheet__row) {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 9px;
		box-sizing: border-box;
		color: #101828;
		cursor: pointer;
		display: flex;
		font-size: 16px;
		gap: 12px;
		justify-content: flex-start;
		line-height: 1.4;
		margin: 2px 0;
		min-height: 44px;
		padding: 10px 14px 10px 44px;
		position: relative;
		text-align: left;
		width: 100%;
	}

	:global(.daynight-hero-filter-sheet__row::before) {
		background: #fff;
		border: 1.5px solid #cfd5de;
		border-radius: 5px;
		box-sizing: border-box;
		content: '';
		height: 18px;
		left: 14px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
	}

	:global(.daynight-hero-filter-sheet__row:hover) {
		background: #f6f8fb;
	}

	:global(.daynight-hero-filter-sheet__row:focus-visible) {
		outline: 2px solid #b00000;
		outline-offset: -2px;
	}

	:global(.daynight-hero-filter-sheet__row.is-selected) {
		background: #eef4ff;
		color: #101828;
		font-weight: 600;
	}

	:global(.daynight-hero-filter-sheet__row.is-selected::before) {
		background: #b00000;
		border-color: #b00000;
	}

	:global(.daynight-hero-filter-sheet__row.is-selected::after) {
		border-bottom: 2px solid #fff;
		border-left: 2px solid #fff;
		content: '';
		height: 6px;
		left: 19px;
		position: absolute;
		top: 50%;
		transform: translateY(-62%) rotate(-45deg);
		width: 9px;
	}

	:global(.daynight-hero-filter-sheet__row--reset) {
		border-bottom: 1px solid #f1f3f7;
		border-radius: 8px;
		color: #667085;
		font-weight: 600;
		margin-bottom: 6px;
	}

	:global(.daynight-hero-filter-sheet__row--reset.is-selected) {
		background: #eef4ff;
		color: #101828;
	}

	:global(.daynight-hero-filter-sheet__tick) {
		color: #b00000;
		display: none;
		font-weight: 700;
	}

	:global(.daynight-hero-filter-sheet__empty) {
		margin: 0;
		padding: 18px 16px;
		color: #98a2b3;
		font-size: 16px;
	}

	:global(.daynight-hero-filter-sheet__actions) {
		align-items: center;
		border-top: 1px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
		padding: 12px 20px 16px;
	}

	:global(.daynight-hero-filter-sheet__actions[hidden]) {
		display: none;
	}

	:global(.daynight-hero-filter-sheet__clear),
	:global(.daynight-hero-filter-sheet__done) {
		appearance: none;
		border: 0;
		cursor: pointer;
		font: inherit;
	}

	:global(.daynight-hero-filter-sheet__clear) {
		background: transparent;
		color: #667085;
		font-size: 16px;
		font-weight: 600;
		text-decoration: none;
	}

	:global(.daynight-hero-filter-sheet__done) {
		background: #b00000;
		border-radius: 9px;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		min-height: 42px;
		padding: 0 22px;
		transition:
			background-color 120ms ease-out,
			color 120ms ease-out;
	}

	:global(.daynight-hero-filter-sheet__done:hover),
	:global(.daynight-hero-filter-sheet__done:focus-visible) {
		background: #8a0000;
	}

	:global(.daynight-hero-filter-sheet__done:active) {
		background: #143b82;
	}

	:global(.daynight-hero-filter-sheet__clear:focus-visible),
	:global(.daynight-hero-filter-sheet__done:focus-visible) {
		outline: 2px solid #b00000;
		outline-offset: 2px;
	}
</style>
