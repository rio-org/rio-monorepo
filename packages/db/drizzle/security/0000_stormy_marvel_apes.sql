CREATE SCHEMA "security";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "daemon_status" AS ENUM('running', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "daemon_task" AS ENUM('key_retrieval', 'key_removal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transaction_status" AS ENUM('queued', 'pending', 'reverted', 'succeeded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."add_keys_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"operator_id" integer NOT NULL,
	"operator_registry_address" char(42) NOT NULL,
	"transaction_hash" char(66) NOT NULL,
	"start_index" integer NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"block_number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."daemon_task_state" (
	"task" "daemon_task" PRIMARY KEY NOT NULL,
	"status" "daemon_status" DEFAULT 'running'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."validatorKeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"operator_id" integer NOT NULL,
	"operator_registry_address" char(42) NOT NULL,
	"public_key" char(96) NOT NULL,
	"signature" char(192) NOT NULL,
	"key_index" integer NOT NULL,
	"add_keys_transaction_id" uuid NOT NULL,
	"remove_keys_transaction_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."remove_keys_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"operator_id" integer NOT NULL,
	"operator_registry_address" char(42) NOT NULL,
	"transaction_hash" char(66),
	"status" "transaction_status" DEFAULT 'queued'
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_chain_idx" ON "security"."add_keys_transactions" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_transaction_hash_idx" ON "security"."add_keys_transactions" ("transaction_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_operator_idx" ON "security"."add_keys_transactions" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_operator_registry_idx" ON "security"."add_keys_transactions" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_timestamp_idx" ON "security"."add_keys_transactions" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "add_keys_transactions_block_number_idx" ON "security"."add_keys_transactions" ("block_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_chain_idx" ON "security"."validatorKeys" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_operator_idx" ON "security"."validatorKeys" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_operator_registry_idx" ON "security"."validatorKeys" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_public_key_idx" ON "security"."validatorKeys" ("public_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_key_index_idx" ON "security"."validatorKeys" ("key_index");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_add_keys_transaction_idx" ON "security"."validatorKeys" ("add_keys_transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "validator_keys_remove_keys_transaction_idx" ON "security"."validatorKeys" ("remove_keys_transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remove_keys_transactions_chain_idx" ON "security"."remove_keys_transactions" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remove_keys_transactions_transaction_hash_idx" ON "security"."remove_keys_transactions" ("transaction_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remove_keys_transactions_operator_idx" ON "security"."remove_keys_transactions" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remove_keys_transactions_operator_registry_idx" ON "security"."remove_keys_transactions" ("operator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remove_keys_transactions_status_idx" ON "security"."remove_keys_transactions" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "security"."validatorKeys" ADD CONSTRAINT "validatorKeys_add_keys_transaction_id_add_keys_transactions_id_fk" FOREIGN KEY ("add_keys_transaction_id") REFERENCES "security"."add_keys_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "security"."validatorKeys" ADD CONSTRAINT "validatorKeys_remove_keys_transaction_id_remove_keys_transactions_id_fk" FOREIGN KEY ("remove_keys_transaction_id") REFERENCES "security"."remove_keys_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
