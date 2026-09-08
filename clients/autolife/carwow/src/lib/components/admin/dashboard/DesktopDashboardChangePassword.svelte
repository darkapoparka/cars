<script lang="ts">
	type PasswordField = {
		id: string;
		name: string;
		label: string;
		type: 'text' | 'password';
		value: string;
		placeholder: string;
		className: string;
	};

	const fields: PasswordField[] = [
		{
			id: 'Email',
			name: 'Email',
			label: 'Your Email:*',
			type: 'text',
			value: 'demo@getrich.local|',
			placeholder: 'Your Email*',
			className: 'input-large active'
		},
		{
			id: 'OldPassword',
			name: 'OldPassword',
			label: 'Old Password:*',
			type: 'password',
			value: 'daynightauto@2026',
			placeholder: 'Password',
			className: 'input-large password-input is-hidden'
		},
		{
			id: 'NewPassword',
			name: 'NewPassword',
			label: 'New password:*',
			type: 'password',
			value: 'daynightauto@2026',
			placeholder: 'Password',
			className: 'input-large password-input is-hidden'
		},
		{
			id: 'RetypeNewPassword',
			name: 'RetypeNewPassword',
			label: 'Retype new password:*',
			type: 'password',
			value: 'daynightauto@2026',
			placeholder: 'Password',
			className: 'input-large password-input is-hidden'
		}
	];
</script>

<div class="dashboard-content--inner">
	<div class="dashboard-content--details">
		<button
			class="btn btn-primary btn-large font-weight-600 dashboard-toggle-btn mb-24"
			id="dashboardToggleBtn"
			aria-label="Toggle Моят профил"
			type="button"
		>
			Show Моят профил
		</button>
		<p class="h3 mb-40">Сигурност на профила</p>
		<form action="#">
			<div class="dashboard-box style-5 bg-white">
				<div class="change-password-wrapper flex flex-col gap-23">
					{#each fields as field (field.id)}
						<label for={field.id}>
							<span class="font-weight-600 mb-8 flex">{field.label}</span>
							<input
								class={field.className}
								type={field.type}
								value={field.value}
								id={field.id}
								name={field.name}
								placeholder={field.placeholder}
								required
							/>
						</label>
					{/each}

					<div class="flex">
						<button type="submit" class="btn btn-primary btn-large-3 font-weight-600">
							Сигурност на профила
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
