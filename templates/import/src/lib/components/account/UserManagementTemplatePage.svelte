<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type {
		AuxeroUserManagementData,
		AuxeroUserManagementNote
	} from '$lib/auxero/user-management';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import UserManagementTable from './UserManagementTable.svelte';

	let {
		afterUsersHtml,
		beforeUsersHtml,
		notes,
		pageDocument,
		searchQuery,
		selectedUserRole,
		users
	}: {
		afterUsersHtml: string;
		beforeUsersHtml: string;
		notes: AuxeroUserManagementNote[];
		pageDocument: AuxeroPageDocument;
		searchQuery: string;
		selectedUserRole: string;
		users: AuxeroUserManagementData;
	} = $props();
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeUsersHtml}
	afterHtml={afterUsersHtml}
	preserveDetailsPrefix={false}
>
	<UserManagementTable {users} {notes} {searchQuery} {selectedUserRole} />
</AuxeroDashboardSlotShell>
