CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'assigned', 'contacted', 'closed');--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assigned_agent_slug" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message" text NOT NULL,
	"route_path" text NOT NULL,
	"source" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"vehicle_slug" text,
	"vehicle_title" text
);
--> statement-breakpoint
CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");