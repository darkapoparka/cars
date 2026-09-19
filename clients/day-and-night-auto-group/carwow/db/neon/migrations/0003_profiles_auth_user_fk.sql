do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conname = 'profiles_auth_user_id_user_id_fkey'
			and conrelid = 'public.profiles'::regclass
	) then
		alter table public.profiles
			add constraint profiles_auth_user_id_user_id_fkey
			foreign key (auth_user_id)
			references public."user"(id)
			on delete cascade
			not valid;
	end if;
end $$;

alter table public.profiles
	validate constraint profiles_auth_user_id_user_id_fkey;
