<script lang="ts">
	import { daynightSite } from '$lib/data/daynight-site';

	const phoneHref = `tel:${daynightSite.phone}`;
</script>

<ul class="contact-actions" aria-label="Бързи контакти">
	<li class="contact-action contact-action--phone">
		<a
			href={phoneHref}
			class="contact-action__trigger"
			aria-label={`Обади се на ${daynightSite.phoneLabel}`}
		>
			<strong>{daynightSite.phoneLabel}</strong>
			<span>Обаждане / Viber</span>
		</a>
	</li>
</ul>

<!-- Contact details remain in the white header; no floating hero overlay. -->

<style>
	.contact-actions {
		position: relative;
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.contact-action {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.contact-action__trigger {
		display: inline-flex;
		min-height: 44px;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 1px;
		padding: 0 6px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: #202832;
		text-decoration: none;
		user-select: text;
	}

	.contact-action__trigger strong {
		font-size: 15px;
		font-weight: 650;
		line-height: 18px;
		letter-spacing: -0.01em;
		transition: color 100ms ease;
	}

	.contact-action__trigger span {
		color: #697386;
		font-size: 11px;
		font-weight: 450;
		line-height: 14px;
	}

	.contact-action__trigger:hover strong,
	.contact-action__trigger:focus-visible strong {
		color: var(--sa-red, #8b6811);
	}

	.contact-action__trigger:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--sa-red, #8b6811) 34%, transparent);
		outline-offset: 1px;
	}
</style>
