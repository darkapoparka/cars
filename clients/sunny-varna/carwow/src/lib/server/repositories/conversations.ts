import { and, desc, eq, gt, inArray, isNull, sql } from 'drizzle-orm';
import type { ChatStartInput } from '$lib/server/cms/schemas';
import type { Db } from '$lib/server/db/client';
import {
	conversationMembers,
	conversations,
	importRequests,
	leads,
	messages,
	profiles,
	visitorConversationTokens
} from '$lib/server/db/schema';
import type {
	ConversationMemberRow,
	ConversationRow,
	ConversationStatus,
	ImportRequestRow,
	LeadRow,
	MessageRow,
	ProfileRow
} from '$lib/types/database';

export type ConversationStatusFilter = ConversationStatus | 'all';

export type ConversationFilters = {
	status: ConversationStatusFilter;
	query: string;
};

export type ConversationMessage = Pick<
	MessageRow,
	'id' | 'conversation_id' | 'sender_type' | 'sender_name' | 'body' | 'read_at' | 'created_at'
>;

export type VisitorConversation = Pick<
	ConversationRow,
	'id' | 'dealer_id' | 'subject' | 'status' | 'last_message_at' | 'created_at' | 'updated_at'
>;

export type ConversationListItem = ConversationRow & {
	customerName: string;
	customerContact: string;
	lastMessage: ConversationMessage | null;
	unreadCustomerMessages: number;
	lead: Pick<LeadRow, 'id' | 'customer_name' | 'contact' | 'status'> | null;
	importRequest: Pick<ImportRequestRow, 'id' | 'customer_name' | 'status'> | null;
};

export type ConversationThread = {
	conversation: ConversationRow;
	members: Array<
		Pick<
			ConversationMemberRow,
			'id' | 'member_type' | 'display_name' | 'email' | 'phone' | 'last_read_at' | 'created_at'
		>
	>;
	messages: MessageRow[];
};

type VisitorConversationRecord = {
	conversation_id: string;
	dealer_id: string;
	subject: string;
	status: ConversationStatus;
	last_message_at: string | null;
	created_at: string;
	updated_at: string;
};

type StartVisitorConversationRecord = VisitorConversationRecord & {
	message_id: string | null;
	message_sender_type: MessageRow['sender_type'] | null;
	message_sender_name: string | null;
	message_body: string | null;
	message_read_at: string | null;
	message_created_at: string | null;
};

type StaffReplyRecord = {
	message_id: string;
	message_created_at: string;
};

export class AdminConversationNotFoundError extends Error {
	constructor() {
		super('Conversation was not found for this dealer.');
		this.name = 'AdminConversationNotFoundError';
	}
}

export class AdminStaffProfileNotFoundError extends Error {
	constructor() {
		super('Staff profile was not found for this dealer.');
		this.name = 'AdminStaffProfileNotFoundError';
	}
}

function normalizeSearch(value: string) {
	return value.trim().toLowerCase();
}

function firstResult<T>(rows: T[], operation: string): T {
	const result = rows[0];

	if (!result) {
		throw new Error(`${operation} returned no result.`);
	}

	return result;
}

function mapVisitorConversation(record: VisitorConversationRecord): VisitorConversation {
	return {
		id: record.conversation_id,
		dealer_id: record.dealer_id,
		subject: record.subject,
		status: record.status,
		last_message_at: record.last_message_at,
		created_at: record.created_at,
		updated_at: record.updated_at
	};
}

function mapStartVisitorMessage(
	record: StartVisitorConversationRecord
): ConversationMessage | null {
	if (
		!record.message_id ||
		!record.message_sender_type ||
		!record.message_sender_name ||
		!record.message_body ||
		!record.message_created_at
	) {
		return null;
	}

	return {
		id: record.message_id,
		conversation_id: record.conversation_id,
		sender_type: record.message_sender_type,
		sender_name: record.message_sender_name,
		body: record.message_body,
		read_at: record.message_read_at,
		created_at: record.message_created_at
	};
}

function matchesConversationSearch(conversation: ConversationListItem, query: string) {
	if (!query) return true;

	const haystack = [
		conversation.subject,
		conversation.status,
		conversation.kind,
		conversation.customerName,
		conversation.customerContact,
		conversation.lastMessage?.body,
		conversation.lead?.customer_name,
		conversation.lead?.contact,
		conversation.importRequest?.customer_name
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

async function fetchConversationMessages(db: Db, conversationIds: string[]) {
	if (!conversationIds.length) return [];

	return db
		.select()
		.from(messages)
		.where(inArray(messages.conversation_id, conversationIds))
		.orderBy(desc(messages.created_at))
		.limit(Math.max(200, conversationIds.length * 8));
}

async function fetchCustomerMembers(db: Db, conversationIds: string[]) {
	if (!conversationIds.length) return [];

	return db
		.select({
			id: conversationMembers.id,
			conversation_id: conversationMembers.conversation_id,
			member_type: conversationMembers.member_type,
			display_name: conversationMembers.display_name,
			email: conversationMembers.email,
			phone: conversationMembers.phone,
			last_read_at: conversationMembers.last_read_at,
			created_at: conversationMembers.created_at
		})
		.from(conversationMembers)
		.where(
			and(
				inArray(conversationMembers.conversation_id, conversationIds),
				eq(conversationMembers.member_type, 'customer')
			)
		);
}

async function fetchLinkedLeads(db: Db, leadIds: string[]) {
	if (!leadIds.length) return new Map<string, ConversationListItem['lead']>();

	const rows = await db
		.select({
			id: leads.id,
			customer_name: leads.customer_name,
			contact: leads.contact,
			status: leads.status
		})
		.from(leads)
		.where(inArray(leads.id, leadIds));

	return new Map(rows.map((lead) => [lead.id, lead]));
}

async function fetchLinkedImports(db: Db, importIds: string[]) {
	if (!importIds.length) return new Map<string, ConversationListItem['importRequest']>();

	const rows = await db
		.select({
			id: importRequests.id,
			customer_name: importRequests.customer_name,
			status: importRequests.status
		})
		.from(importRequests)
		.where(inArray(importRequests.id, importIds));

	return new Map(rows.map((request) => [request.id, request]));
}

async function getDealerStaffProfile(db: Db, dealerId: string, profileId: string) {
	const [profile] = await db
		.select({
			id: profiles.id,
			full_name: profiles.full_name,
			email: profiles.email
		})
		.from(profiles)
		.where(and(eq(profiles.id, profileId), eq(profiles.dealer_id, dealerId)))
		.limit(1);

	if (!profile) throw new AdminStaffProfileNotFoundError();

	return profile as Pick<ProfileRow, 'id' | 'full_name' | 'email'>;
}

export async function listAdminConversations(
	db: Db,
	dealerId: string,
	filters: ConversationFilters
): Promise<ConversationListItem[]> {
	const where =
		filters.status === 'all'
			? eq(conversations.dealer_id, dealerId)
			: and(eq(conversations.dealer_id, dealerId), eq(conversations.status, filters.status));

	const rows = await db
		.select()
		.from(conversations)
		.where(where)
		.orderBy(desc(conversations.last_message_at), desc(conversations.created_at))
		.limit(150);
	const conversationIds = rows.map((conversation) => conversation.id);
	const leadIds = rows
		.map((conversation) => conversation.lead_id)
		.filter((id): id is string => Boolean(id));
	const importIds = rows
		.map((conversation) => conversation.import_request_id)
		.filter((id): id is string => Boolean(id));

	const [conversationMessages, members, leadsById, importsById] = await Promise.all([
		fetchConversationMessages(db, conversationIds),
		fetchCustomerMembers(db, conversationIds),
		fetchLinkedLeads(db, leadIds),
		fetchLinkedImports(db, importIds)
	]);

	const latestMessageByConversation = new Map<string, ConversationMessage>();
	const unreadCounts = new Map<string, number>();

	for (const message of conversationMessages) {
		if (!latestMessageByConversation.has(message.conversation_id)) {
			latestMessageByConversation.set(message.conversation_id, message);
		}

		if (message.sender_type === 'customer' && !message.read_at) {
			unreadCounts.set(
				message.conversation_id,
				(unreadCounts.get(message.conversation_id) ?? 0) + 1
			);
		}
	}

	const customerByConversation = new Map(members.map((member) => [member.conversation_id, member]));
	const normalizedQuery = normalizeSearch(filters.query);

	return rows
		.map((conversation) => {
			const customer = customerByConversation.get(conversation.id);
			const lead = conversation.lead_id ? (leadsById.get(conversation.lead_id) ?? null) : null;
			const importRequest = conversation.import_request_id
				? (importsById.get(conversation.import_request_id) ?? null)
				: null;
			const customerName =
				customer?.display_name ||
				lead?.customer_name ||
				importRequest?.customer_name ||
				'Website visitor';
			const customerContact = [customer?.email, customer?.phone].filter(Boolean).join(' / ');

			return {
				...conversation,
				customerName,
				customerContact,
				lastMessage: latestMessageByConversation.get(conversation.id) ?? null,
				unreadCustomerMessages: unreadCounts.get(conversation.id) ?? 0,
				lead,
				importRequest
			};
		})
		.filter((conversation) => matchesConversationSearch(conversation, normalizedQuery));
}

export async function getAdminConversationThread(
	db: Db,
	dealerId: string,
	conversationId: string
): Promise<ConversationThread | null> {
	const [conversation] = await db
		.select()
		.from(conversations)
		.where(and(eq(conversations.dealer_id, dealerId), eq(conversations.id, conversationId)))
		.limit(1);

	if (!conversation) return null;

	const [members, threadMessages] = await Promise.all([
		db
			.select({
				id: conversationMembers.id,
				member_type: conversationMembers.member_type,
				display_name: conversationMembers.display_name,
				email: conversationMembers.email,
				phone: conversationMembers.phone,
				last_read_at: conversationMembers.last_read_at,
				created_at: conversationMembers.created_at
			})
			.from(conversationMembers)
			.where(eq(conversationMembers.conversation_id, conversation.id))
			.orderBy(conversationMembers.created_at),
		db
			.select()
			.from(messages)
			.where(and(eq(messages.dealer_id, dealerId), eq(messages.conversation_id, conversation.id)))
			.orderBy(messages.created_at)
			.limit(250)
	]);

	return {
		conversation,
		members,
		messages: threadMessages
	};
}

export async function createStaffConversationReply(
	db: Db,
	dealerId: string,
	conversationId: string,
	senderProfileId: string,
	body: string
) {
	const cleanBody = body.trim();

	if (!cleanBody) {
		throw new Error('Reply body is required.');
	}

	if (cleanBody.length > 4000) {
		throw new Error('Reply body is too long.');
	}

	const result = await db.execute(sql<StaffReplyRecord>`
		with selected_conversation as (
			select id, dealer_id
			from conversations
			where dealer_id = ${dealerId}::uuid
				and id = ${conversationId}::uuid
			limit 1
		),
		selected_profile as (
			select id, coalesce(nullif(full_name, ''), email, 'Staff') as display_name, email
			from profiles
			where dealer_id = ${dealerId}::uuid
				and id = ${senderProfileId}::uuid
			limit 1
		),
		new_message as (
			insert into messages (
				dealer_id,
				conversation_id,
				sender_profile_id,
				sender_type,
				sender_name,
				body
			)
			select
				selected_conversation.dealer_id,
				selected_conversation.id,
				selected_profile.id,
				'staff',
				selected_profile.display_name,
				${cleanBody}
			from selected_conversation
			cross join selected_profile
			returning id, conversation_id, created_at
		),
		updated_conversation as (
			update conversations
			set last_message_at = (select created_at from new_message),
				status = 'open',
				updated_at = now()
			where id = (select conversation_id from new_message)
			returning id
		),
		read_messages as (
			update messages
			set read_at = now()
			where dealer_id = ${dealerId}::uuid
				and conversation_id = ${conversationId}::uuid
				and sender_type = 'customer'
				and read_at is null
			returning id
		),
		upserted_member as (
			insert into conversation_members (
				conversation_id,
				profile_id,
				member_type,
				display_name,
				email,
				last_read_at
			)
			select
				selected_conversation.id,
				selected_profile.id,
				'staff',
				selected_profile.display_name,
				selected_profile.email,
				now()
			from selected_conversation
			cross join selected_profile
			on conflict (conversation_id, profile_id) do update set
				display_name = excluded.display_name,
				email = excluded.email,
				last_read_at = excluded.last_read_at
			returning id
		)
		select id as message_id, created_at as message_created_at
		from new_message
	`);
	const message = (result.rows as StaffReplyRecord[])[0];

	if (!message) {
		const [conversation] = await db
			.select({ id: conversations.id })
			.from(conversations)
			.where(and(eq(conversations.dealer_id, dealerId), eq(conversations.id, conversationId)))
			.limit(1);

		if (!conversation) throw new AdminConversationNotFoundError();
		throw new AdminStaffProfileNotFoundError();
	}

	return {
		id: message.message_id,
		created_at: message.message_created_at
	};
}

export async function updateAdminConversationStatus(
	db: Db,
	dealerId: string,
	conversationId: string,
	status: Extract<ConversationStatus, 'open' | 'closed'>
) {
	const [updated] = await db
		.update(conversations)
		.set({ status })
		.where(and(eq(conversations.dealer_id, dealerId), eq(conversations.id, conversationId)))
		.returning({ id: conversations.id });

	if (!updated) throw new AdminConversationNotFoundError();
}

export async function markAdminConversationRead(
	db: Db,
	dealerId: string,
	conversationId: string,
	staffProfileId: string
) {
	const [conversation] = await db
		.select({ id: conversations.id })
		.from(conversations)
		.where(and(eq(conversations.dealer_id, dealerId), eq(conversations.id, conversationId)))
		.limit(1);

	if (!conversation) {
		throw new AdminConversationNotFoundError();
	}

	const profile = await getDealerStaffProfile(db, dealerId, staffProfileId);
	const displayName = profile.full_name || profile.email || 'Staff';
	const readAt = new Date().toISOString();

	await db
		.update(messages)
		.set({ read_at: readAt })
		.where(
			and(
				eq(messages.dealer_id, dealerId),
				eq(messages.conversation_id, conversationId),
				eq(messages.sender_type, 'customer'),
				isNull(messages.read_at)
			)
		);

	await db
		.insert(conversationMembers)
		.values({
			conversation_id: conversationId,
			profile_id: staffProfileId,
			member_type: 'staff',
			display_name: displayName,
			email: profile.email,
			last_read_at: readAt
		})
		.onConflictDoUpdate({
			target: [conversationMembers.conversation_id, conversationMembers.profile_id],
			set: {
				display_name: displayName,
				email: profile.email,
				last_read_at: readAt
			}
		});
}

export async function createVisitorConversation(
	db: Db,
	input: ChatStartInput,
	visitorTokenHash: string,
	defaultDealerSlug: string
) {
	const result = await startVisitorConversation(
		db,
		{ ...input, message: '' },
		visitorTokenHash,
		defaultDealerSlug
	);

	return result.conversation;
}

export async function startVisitorConversation(
	db: Db,
	input: ChatStartInput,
	visitorTokenHash: string,
	defaultDealerSlug: string
) {
	const dealerSlug = input.dealerSlug ?? defaultDealerSlug;
	const displayName = input.name?.trim() || 'Website visitor';
	const messageBody = input.message?.trim() ?? '';
	const result = await db.execute(sql<StartVisitorConversationRecord>`
		with existing_token as (
			select
				visitor_conversation_tokens.dealer_id,
				visitor_conversation_tokens.conversation_id
			from visitor_conversation_tokens
			join conversations
				on conversations.id = visitor_conversation_tokens.conversation_id
			where visitor_conversation_tokens.token_hash = ${visitorTokenHash}
				and visitor_conversation_tokens.expires_at > now()
			limit 1
		),
		selected_dealer as (
			select id
			from dealers
			where slug = ${dealerSlug}
				and status in ('active', 'demo')
			limit 1
		),
		new_conversation as (
			insert into conversations (
				dealer_id,
				kind,
				subject,
				status,
				last_message_at
			)
			select
				selected_dealer.id,
				'support',
				${`Website chat from ${displayName}`},
				'open',
				case when ${messageBody} <> '' then now() else null end
			from selected_dealer
			where not exists (select 1 from existing_token)
			returning id, dealer_id, subject, status, last_message_at, created_at, updated_at
		),
		conversation_row as (
			select
				conversations.id,
				conversations.dealer_id,
				conversations.subject,
				conversations.status,
				conversations.last_message_at,
				conversations.created_at,
				conversations.updated_at
			from conversations
			join existing_token on existing_token.conversation_id = conversations.id
			union all
			select
				id,
				dealer_id,
				subject,
				status,
				last_message_at,
				created_at,
				updated_at
			from new_conversation
		),
		upserted_token as (
			insert into visitor_conversation_tokens (
				dealer_id,
				conversation_id,
				token_hash,
				display_name,
				email,
				phone
			)
			select
				dealer_id,
				id,
				${visitorTokenHash},
				${displayName},
				${input.email ?? null},
				${input.phone ?? null}
			from conversation_row
			on conflict (token_hash) do update set
				display_name = coalesce(excluded.display_name, visitor_conversation_tokens.display_name),
				email = coalesce(excluded.email, visitor_conversation_tokens.email),
				phone = coalesce(excluded.phone, visitor_conversation_tokens.phone),
				updated_at = now()
			returning conversation_id
		),
		inserted_customer_member as (
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
				${displayName},
				${input.email ?? null},
				${input.phone ?? null}
			from conversation_row
			where not exists (
				select 1
				from conversation_members
				where conversation_members.conversation_id = conversation_row.id
					and conversation_members.member_type = 'customer'
			)
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
				${displayName},
				${messageBody}
			from conversation_row
			where ${messageBody} <> ''
			returning id, conversation_id, sender_type, sender_name, body, read_at, created_at
		),
		updated_conversation as (
			update conversations
			set last_message_at = (select created_at from new_message),
				status = 'open',
				updated_at = now()
			where id = (select conversation_id from new_message)
			returning id
		)
		select
			conversation_row.id as conversation_id,
			conversation_row.dealer_id,
			conversation_row.subject,
			conversation_row.status,
			coalesce((select created_at from new_message), conversation_row.last_message_at) as last_message_at,
			conversation_row.created_at,
			case
				when exists (select 1 from updated_conversation) then now()
				else conversation_row.updated_at
			end as updated_at,
			(select id from new_message) as message_id,
			(select sender_type from new_message) as message_sender_type,
			(select sender_name from new_message) as message_sender_name,
			(select body from new_message) as message_body,
			(select read_at from new_message) as message_read_at,
			(select created_at from new_message) as message_created_at
		from conversation_row
	`);
	const rows = result.rows as StartVisitorConversationRecord[];
	const firstRow = firstResult(rows, 'Visitor chat start');

	return {
		conversation: mapVisitorConversation(firstRow),
		messages: rows
			.map((record) => mapStartVisitorMessage(record))
			.filter((message): message is ConversationMessage => Boolean(message))
	};
}

export async function getVisitorConversation(db: Db, visitorTokenHash: string) {
	const result = await db.execute(sql<VisitorConversationRecord>`
		select
			conversations.id as conversation_id,
			conversations.dealer_id,
			conversations.subject,
			conversations.status,
			conversations.last_message_at,
			conversations.created_at,
			conversations.updated_at
		from visitor_conversation_tokens
		join conversations
			on conversations.id = visitor_conversation_tokens.conversation_id
		where visitor_conversation_tokens.token_hash = ${visitorTokenHash}
			and visitor_conversation_tokens.expires_at > now()
		limit 1
	`);
	const row = (result.rows as VisitorConversationRecord[])[0];

	return row ? mapVisitorConversation(row) : null;
}

export async function listVisitorMessages(
	db: Db,
	visitorTokenHash: string,
	afterCreatedAt: string | null = null
) {
	const where = afterCreatedAt
		? and(
				eq(visitorConversationTokens.token_hash, visitorTokenHash),
				gt(visitorConversationTokens.expires_at, sql<string>`now()`),
				gt(messages.created_at, afterCreatedAt)
			)
		: and(
				eq(visitorConversationTokens.token_hash, visitorTokenHash),
				gt(visitorConversationTokens.expires_at, sql<string>`now()`)
			);

	return db
		.select({
			id: messages.id,
			conversation_id: messages.conversation_id,
			sender_type: messages.sender_type,
			sender_name: messages.sender_name,
			body: messages.body,
			read_at: messages.read_at,
			created_at: messages.created_at
		})
		.from(messages)
		.innerJoin(
			visitorConversationTokens,
			eq(visitorConversationTokens.conversation_id, messages.conversation_id)
		)
		.where(where)
		.orderBy(messages.created_at)
		.limit(100);
}

export async function createVisitorMessage(db: Db, visitorTokenHash: string, message: string) {
	const cleanMessage = message.trim();
	const result = await db.execute(sql<ConversationMessage>`
		with visitor_context as (
			select
				visitor_conversation_tokens.dealer_id,
				visitor_conversation_tokens.conversation_id,
				coalesce(
					nullif(visitor_conversation_tokens.display_name, ''),
					visitor_conversation_tokens.email,
					'Website visitor'
				) as display_name
			from visitor_conversation_tokens
			join conversations
				on conversations.id = visitor_conversation_tokens.conversation_id
			where visitor_conversation_tokens.token_hash = ${visitorTokenHash}
				and visitor_conversation_tokens.expires_at > now()
				and conversations.status <> 'archived'
			limit 1
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
				conversation_id,
				'customer',
				display_name,
				${cleanMessage}
			from visitor_context
			returning id, conversation_id, sender_type, sender_name, body, read_at, created_at
		),
		updated_conversation as (
			update conversations
			set last_message_at = (select created_at from new_message),
				status = 'open',
				updated_at = now()
			where id = (select conversation_id from new_message)
			returning id
		)
		select
			id,
			conversation_id,
			sender_type,
			sender_name,
			body,
			read_at,
			created_at
		from new_message
	`);

	return firstResult(result.rows as ConversationMessage[], 'Visitor chat message');
}
