export type {
	ConversationMemberRow,
	ConversationRow,
	DealerRow,
	ImportRequestRow,
	ImportStatusEventRow,
	LeadRow,
	MessageAttachmentRow,
	MessageRow,
	PostRow,
	ProfileRow,
	VehiclePhotoRow,
	VehicleRow
} from '$lib/server/db/types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DealerStatus = 'demo' | 'active' | 'paused' | 'archived';
export type ProfileRole =
	| 'owner'
	| 'admin'
	| 'manager'
	| 'editor'
	| 'sales'
	| 'viewer'
	| 'agency_admin';
export type VehicleCondition = 'new' | 'used';
export type VehicleStatus = 'draft' | 'published' | 'sold' | 'archived';
export type PostType = 'news' | 'blog';
export type PostStatus = 'draft' | 'published' | 'archived';
export type LeadStatus = 'new' | 'in_progress' | 'won' | 'lost' | 'archived';
export type ImportRequestStatus =
	| 'new'
	| 'sourcing'
	| 'quoted'
	| 'deposit_pending'
	| 'purchased'
	| 'in_transit'
	| 'customs'
	| 'ready_for_delivery'
	| 'delivered'
	| 'cancelled';
export type ConversationKind = 'lead' | 'import' | 'vehicle' | 'support';
export type ConversationStatus = 'open' | 'waiting' | 'closed' | 'archived';
export type MessageSenderType = 'staff' | 'customer' | 'system';
export type MemberType = 'staff' | 'customer' | 'system';
