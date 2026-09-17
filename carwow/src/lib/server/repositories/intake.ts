import { sql } from 'drizzle-orm';
import type { ImportRequestInput, LeadRequestInput } from '$lib/server/cms/schemas';
import type { Db } from '$lib/server/db/client';
import type { ConversationRow, ImportRequestRow, LeadRow, MessageRow } from '$lib/types/database';

type LeadIntakeResult = {
	lead: Pick<LeadRow, 'id' | 'status'>;
	conversation: Pick<ConversationRow, 'id'>;
	message: Pick<MessageRow, 'id'> | null;
};

type ImportIntakeResult = {
	lead: Pick<LeadRow, 'id'>;
	importRequest: Pick<ImportRequestRow, 'id' | 'status'>;
	conversation: Pick<ConversationRow, 'id'>;
	message: Pick<MessageRow, 'id'> | null;
};

type LeadIntakeRow = {
	lead_id: string;
	conversation_id: string;
	message_id: string | null;
	status: LeadRow['status'];
};

type ImportIntakeRow = {
	lead_id: string;
	import_request_id: string;
	conversation_id: string;
	message_id: string | null;
	status: ImportRequestRow['status'];
};

function firstResult<T>(rows: T[], operation: string): T {
	const result = rows[0];

	if (!result) {
		throw new Error(`${operation} returned no result.`);
	}

	return result;
}

export async function createLeadWithConversation(
	db: Db,
	input: LeadRequestInput,
	defaultDealerSlug: string
): Promise<LeadIntakeResult> {
	const dealerSlug = input.dealerSlug ?? defaultDealerSlug;
	const message = input.message.trim();
	const result = await db.execute(sql<LeadIntakeRow>`
		with selected_dealer as (
			select id
			from dealers
			where slug = ${dealerSlug}
				and status in ('active', 'demo')
			limit 1
		),
		selected_vehicle as (
			select vehicles.id
			from vehicles
			join selected_dealer on selected_dealer.id = vehicles.dealer_id
			where vehicles.id = ${input.vehicleId ?? null}::uuid
				and vehicles.status = 'published'
			limit 1
		),
		new_lead as (
			insert into leads (
				dealer_id,
				vehicle_id,
				customer_name,
				contact,
				email,
				phone,
				source,
				message,
				value
			)
			select
				selected_dealer.id,
				case
					when ${input.vehicleId ?? null}::uuid is null then null
					else (select id from selected_vehicle)
				end,
				${input.customerName},
				${input.contact},
				${input.email ?? null},
				${input.phone ?? null},
				${input.source},
				${message},
				${input.value ?? null}
			from selected_dealer
			where ${input.vehicleId ?? null}::uuid is null
				or exists (select 1 from selected_vehicle)
			returning id, dealer_id, vehicle_id, status
		),
		new_conversation as (
			insert into conversations (
				dealer_id,
				lead_id,
				vehicle_id,
				kind,
				subject,
				status,
				last_message_at
			)
			select
				dealer_id,
				id,
				vehicle_id,
				'lead',
				${`Lead from ${input.customerName}`},
				'open',
				case when ${message} <> '' then now() else null end
			from new_lead
			returning id, dealer_id
		),
		new_member as (
			insert into conversation_members (
				conversation_id,
				profile_id,
				member_type,
				display_name,
				email,
				phone
			)
			select
				id,
				null,
				'customer',
				${input.customerName},
				${input.email ?? null},
				${input.phone ?? null}
			from new_conversation
			returning id
		),
		new_message as (
			insert into messages (
				dealer_id,
				conversation_id,
				sender_type,
				sender_name,
				body
			)
			select
				dealer_id,
				id,
				'customer',
				${input.customerName},
				${message}
			from new_conversation
			where ${message} <> ''
			returning id
		)
		select
			new_lead.id as lead_id,
			new_lead.status as status,
			new_conversation.id as conversation_id,
			(select id from new_message) as message_id
		from new_lead
		join new_conversation on true
	`);
	const row = firstResult(result.rows as LeadIntakeRow[], 'Lead intake');

	return {
		lead: {
			id: row.lead_id,
			status: row.status
		},
		conversation: { id: row.conversation_id },
		message: row.message_id ? { id: row.message_id } : null
	};
}

export async function createImportRequestWithConversation(
	db: Db,
	input: ImportRequestInput,
	defaultDealerSlug: string
): Promise<ImportIntakeResult> {
	const dealerSlug = input.dealerSlug ?? defaultDealerSlug;
	const notes = input.notes.trim();
	const result = await db.execute(sql<ImportIntakeRow>`
		with selected_dealer as (
			select id
			from dealers
			where slug = ${dealerSlug}
				and status in ('active', 'demo')
			limit 1
		),
		new_lead as (
			insert into leads (
				dealer_id,
				customer_name,
				contact,
				email,
				phone,
				source,
				message
			)
			select
				id,
				${input.customerName},
				${input.contact},
				${input.email ?? null},
				${input.phone ?? null},
				'import_request',
				${notes}
			from selected_dealer
			returning id, dealer_id
		),
		new_import as (
			insert into import_requests (
				dealer_id,
				lead_id,
				customer_name,
				contact,
				email,
				phone,
				origin_country,
				destination_country,
				desired_make,
				desired_model,
				desired_year_min,
				desired_year_max,
				budget_min,
				budget_max,
				fuel,
				transmission,
				notes
			)
			select
				dealer_id,
				id,
				${input.customerName},
				${input.contact},
				${input.email ?? null},
				${input.phone ?? null},
				${input.originCountry},
				${input.destinationCountry},
				${input.desiredMake ?? null},
				${input.desiredModel ?? null},
				${input.desiredYearMin ?? null},
				${input.desiredYearMax ?? null},
				${input.budgetMin ?? null},
				${input.budgetMax ?? null},
				${input.fuel ?? null},
				${input.transmission ?? null},
				${notes}
			from new_lead
			returning id, dealer_id, lead_id, status
		),
		linked_lead as (
			update leads
			set import_request_id = new_import.id
			from new_import
			where leads.id = new_import.lead_id
			returning leads.id
		),
		status_event as (
			insert into import_status_events (
				dealer_id,
				import_request_id,
				status,
				label,
				notes
			)
			select
				dealer_id,
				id,
				status,
				'Import request received',
				${notes}
			from new_import
			returning id
		),
		new_conversation as (
			insert into conversations (
				dealer_id,
				lead_id,
				import_request_id,
				kind,
				subject,
				status,
				last_message_at
			)
			select
				dealer_id,
				lead_id,
				id,
				'import',
				${`Import request from ${input.customerName}`},
				'open',
				case when ${notes} <> '' then now() else null end
			from new_import
			returning id, dealer_id
		),
		new_member as (
			insert into conversation_members (
				conversation_id,
				profile_id,
				member_type,
				display_name,
				email,
				phone
			)
			select
				id,
				null,
				'customer',
				${input.customerName},
				${input.email ?? null},
				${input.phone ?? null}
			from new_conversation
			returning id
		),
		new_message as (
			insert into messages (
				dealer_id,
				conversation_id,
				sender_type,
				sender_name,
				body
			)
			select
				dealer_id,
				id,
				'customer',
				${input.customerName},
				${notes}
			from new_conversation
			where ${notes} <> ''
			returning id
		)
		select
			new_import.lead_id as lead_id,
			new_import.id as import_request_id,
			new_import.status as status,
			new_conversation.id as conversation_id,
			(select id from new_message) as message_id
		from new_import
		join new_conversation on true
	`);
	const row = firstResult(result.rows as ImportIntakeRow[], 'Import intake');

	return {
		lead: { id: row.lead_id },
		importRequest: {
			id: row.import_request_id,
			status: row.status
		},
		conversation: { id: row.conversation_id },
		message: row.message_id ? { id: row.message_id } : null
	};
}
