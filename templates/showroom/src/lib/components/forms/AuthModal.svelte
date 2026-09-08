<script lang="ts">
	import { resolve } from '$app/paths';

	type AuthModalVariant = 'forgot-password' | 'login' | 'signup';

	let { closeIcon, variant }: { closeIcon: string; variant: AuthModalVariant } = $props();
</script>

{#if variant === 'login'}
	<div id="LoginModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mb-20 text-center">Вход</h2>

					<form action="#">
						<div class="resutl mb-20">
							<p class="text-secondary mb-4">Влезте с Eliqauto профил.</p>
						</div>

						<label for="email-login" class="mb-20 px-2">
							<span class="mb-8 flex">Имейл*</span>
							<input
								class="input-large active"
								type="email"
								id="email-login"
								name="email-login"
								placeholder="Вашият имейл"
								required
							/>
						</label>

						<label for="Password-login" class="mb-24 px-2">
							<span class="mb-8 flex">Парола*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="Password-login"
								name="Password-login"
								placeholder="Парола"
								required
							/>
						</label>

						<div class="mb-20 flex justify-between gap-12">
							<label class="filter-checkbox style-5">
								<input type="checkbox" name="features" value="remember-me" checked />
								<span class="text-sm">Запомни ме</span>
							</label>

							<span
								class="open-modal text-underline cursor-pointer text-sm font-bold"
								data-modal-id="#ForgotPasswordModal">Забравена парола?</span
							>
						</div>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Вход
						</button>

						<p
							class="open-modal text-secondary flex cursor-pointer justify-center gap-8 text-sm"
							data-modal-id="#SignUpModal"
						>
							Нямате профил?
							<span class="text-underline font-weight-600 text-sm">Регистрация</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
{:else if variant === 'forgot-password'}
	<div id="ForgotPasswordModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mt-20 mb-20 text-center">Забравена парола</h2>

					<form action="#">
						<label for="email-forgot-password" class="mb-20 px-2">
							<span class="mb-8 flex">Имейл адрес *</span>
							<input
								class="input-large active"
								type="email"
								id="email-forgot-password"
								name="email-forgot-password"
								placeholder="Вашият имейл адрес"
								required
							/>
						</label>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Изпрати код
						</button>

						<p
							class="open-modal text-secondary flex cursor-pointer justify-center gap-8 text-sm"
							data-modal-id="#SignUpModal"
						>
							Нямате профил?
							<span class="text-underline font-weight-600 text-sm">Регистрация</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div id="SignUpModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mb-20 text-center">Регистрация</h2>

					<form action="#">
						<label for="SignUp-login" class="mb-20 px-2">
							<span class="mb-8 flex">Имейл*</span>
							<input
								class="input-large active"
								type="email"
								id="SignUp-login"
								name="SignUp-login"
								placeholder="Вашият имейл"
								required
							/>
						</label>

						<label for="Password-SignUp" class="mb-24 px-2">
							<span class="mb-8 flex">Парола*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="Password-SignUp"
								name="Password-SignUp"
								placeholder="Парола"
								required
							/>
						</label>
						<label for="ConfirmPassword-SignUp" class="mb-20 px-2">
							<span class="mb-8 flex">Потвърдете паролата*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="ConfirmPassword-SignUp"
								name="ConfirmPassword-SignUp"
								placeholder="Парола"
								required
							/>
						</label>

						<div class="mb-20 flex justify-between gap-12">
							<label class="filter-checkbox style-5">
								<input type="checkbox" name="features" value="terms" checked />
								<span class="text-sm"
									>Съгласен/на съм с
									<a href={resolve('/terms')} class="text-underline pl-4 text-sm font-bold">
										общите условия
									</a></span
								>
							</label>
						</div>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Създай профил
						</button>

						<p class="text-secondary mb-20 flex justify-center gap-8 text-sm">
							Вече имате профил?
							<span
								class="open-modal text-underline font-weight-600 cursor-pointer text-sm"
								data-modal-id="#LoginModal">Влезте оттук</span
							>
						</p>

						<div class="mb-20 flex items-center justify-center gap-20">
							<p class="divider w-full text-sm"></p>
							<p class="text-secondary min-w-max text-center text-sm">или продължете с</p>
							<p class="divider w-full text-sm"></p>
						</div>

						<div class="social-login flex flex-col gap-12">
							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/facebook.svg" alt="Facebook" />
								Facebook
							</a>

							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/Google.svg" alt="Google" />
								Google
							</a>

							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/Twitter.svg" alt="X" />
								X
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

{#snippet closeButton()}
	<button class="close-modal" type="button" aria-label="Затвори">
		<img src={closeIcon} alt="" aria-hidden="true" />
	</button>
{/snippet}
