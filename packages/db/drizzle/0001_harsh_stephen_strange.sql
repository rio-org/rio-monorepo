CREATE TABLE IF NOT EXISTS "rio_restaking"."balance_sheet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"asset" varchar(42) NOT NULL,
	"restaking_token" varchar(42) NOT NULL,
	"asset_balance" numeric(78, 0) DEFAULT '0',
	"restaking_token_supply" numeric(78, 0) DEFAULT '0',
	"timestamp" timestamp with time zone NOT NULL,
	"block_number" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheet_network_idx" ON "rio_restaking"."balance_sheet" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheet_asset_idx" ON "rio_restaking"."balance_sheet" ("asset");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheet_restaking_token_idx" ON "rio_restaking"."balance_sheet" ("restaking_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheet_timestamp_idx" ON "rio_restaking"."balance_sheet" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheet_block_number_idx" ON "rio_restaking"."balance_sheet" ("block_number");