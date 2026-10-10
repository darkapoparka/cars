import { index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const inquiryStatus = pgEnum('inquiry_status', ['new', 'assigned', 'contacted', 'closed']);

export const inquiryRecords = pgTable(
	'inquiries',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		assignedAgentSlug: text('assigned_agent_slug').notNull(),
		contactEmail: text('contact_email').notNull(),
		contactName: text('contact_name').notNull(),
		contactPhone: text('contact_phone').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		message: text('message').notNull(),
		routePath: text('route_path').notNull(),
		source: text('source').notNull(),
		status: inquiryStatus('status').default('new').notNull(),
		vehicleSlug: text('vehicle_slug'),
		vehicleTitle: text('vehicle_title')
	},
	(table) => [index('inquiries_created_at_idx').on(table.createdAt)]
);
