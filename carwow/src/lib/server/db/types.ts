import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
	conversationMembers,
	conversations,
	dealers,
	importRequests,
	importStatusEvents,
	leads,
	messageAttachments,
	messages,
	posts,
	profiles,
	vehiclePhotos,
	vehicles
} from './schema';

export type DealerRow = InferSelectModel<typeof dealers>;
export type ProfileRow = InferSelectModel<typeof profiles>;
export type VehicleRow = InferSelectModel<typeof vehicles>;
export type VehiclePhotoRow = InferSelectModel<typeof vehiclePhotos>;
export type PostRow = InferSelectModel<typeof posts>;
export type LeadRow = InferSelectModel<typeof leads>;
export type ImportRequestRow = InferSelectModel<typeof importRequests>;
export type ImportStatusEventRow = InferSelectModel<typeof importStatusEvents>;
export type ConversationRow = InferSelectModel<typeof conversations>;
export type ConversationMemberRow = InferSelectModel<typeof conversationMembers> & {
	staffProfileId?: string | null;
};
export type MessageRow = InferSelectModel<typeof messages>;
export type MessageAttachmentRow = InferSelectModel<typeof messageAttachments>;

export type VehicleInsert = InferInsertModel<typeof vehicles>;
export type VehicleUpdate = Partial<VehicleInsert>;
export type PostInsert = InferInsertModel<typeof posts>;
export type PostUpdate = Partial<PostInsert>;
