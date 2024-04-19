CREATE SCHEMA "rio_restaking";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."transfer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"transaction_hash" char(66) NOT NULL,
	"from" char(42) DEFAULT '0x0000000000000000000000000000000000000000' NOT NULL,
	"to" char(42) DEFAULT '0x0000000000000000000000000000000000000000' NOT NULL,
	"asset" varchar(42) NOT NULL,
	"value" numeric(78, 0) DEFAULT '0',
	"timestamp" timestamp with time zone NOT NULL,
	"block_number" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_network_idx" ON "rio_restaking"."transfer" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_transaction_hash_idx" ON "rio_restaking"."transfer" ("transaction_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_from_idx" ON "rio_restaking"."transfer" ("from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_to_idx" ON "rio_restaking"."transfer" ("to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_asset_idx" ON "rio_restaking"."transfer" ("asset");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_timestamp_idx" ON "rio_restaking"."transfer" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_block_number_idx" ON "rio_restaking"."transfer" ("block_number");