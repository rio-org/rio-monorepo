CREATE SCHEMA "rio_restaking";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transaction_type" AS ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" char(42) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid NOT NULL,
	"name" varchar(32) NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"address" char(42) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."deposit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"restaking_token_id" uuid NOT NULL,
	"underlying_asset_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."network" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"name" varchar(32) NOT NULL,
	CONSTRAINT "network_chain_id_unique" UNIQUE("chain_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid NOT NULL,
	"hash" char(66) NOT NULL,
	"account_id" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	CONSTRAINT "transaction_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."transfer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"from_id" uuid NOT NULL,
	"to_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"amount" numeric(78, 0) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rio_restaking"."withdrawal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"restaking_token_id" uuid NOT NULL,
	"underlying_asset_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_address_idx" ON "rio_restaking"."account" ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_network_idx" ON "rio_restaking"."asset" ("network_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_symbol_idx" ON "rio_restaking"."asset" ("symbol");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_address_idx" ON "rio_restaking"."asset" ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_network_idx" ON "rio_restaking"."deposit" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_account_idx" ON "rio_restaking"."deposit" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_restaking_token_idx" ON "rio_restaking"."deposit" ("restaking_token_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_underlying_asset_idx" ON "rio_restaking"."deposit" ("underlying_asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_transaction_idx" ON "rio_restaking"."deposit" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "network_chain_id_idx" ON "rio_restaking"."network" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_network_idx" ON "rio_restaking"."transaction" ("network_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_hash_idx" ON "rio_restaking"."transaction" ("hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_account_idx" ON "rio_restaking"."transaction" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_transaction_idx" ON "rio_restaking"."transfer" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_from_idx" ON "rio_restaking"."transfer" ("from_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_to_idx" ON "rio_restaking"."transfer" ("to_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_asset_idx" ON "rio_restaking"."transfer" ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "withdrawal_network_idx" ON "rio_restaking"."withdrawal" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "withdrawal_account_idx" ON "rio_restaking"."withdrawal" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "withdrawal_restaking_token_idx" ON "rio_restaking"."withdrawal" ("restaking_token_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "withdrawal_underlying_asset_idx" ON "rio_restaking"."withdrawal" ("underlying_asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "withdrarwral_transaction_idx" ON "rio_restaking"."withdrawal" ("transaction_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."asset" ADD CONSTRAINT "asset_network_id_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "rio_restaking"."network"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."deposit" ADD CONSTRAINT "deposit_network_id_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "rio_restaking"."network"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."deposit" ADD CONSTRAINT "deposit_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "rio_restaking"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."deposit" ADD CONSTRAINT "deposit_restaking_token_id_asset_id_fk" FOREIGN KEY ("restaking_token_id") REFERENCES "rio_restaking"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."deposit" ADD CONSTRAINT "deposit_underlying_asset_id_asset_id_fk" FOREIGN KEY ("underlying_asset_id") REFERENCES "rio_restaking"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."deposit" ADD CONSTRAINT "deposit_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "rio_restaking"."transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transaction" ADD CONSTRAINT "transaction_network_id_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "rio_restaking"."network"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transaction" ADD CONSTRAINT "transaction_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "rio_restaking"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transfer" ADD CONSTRAINT "transfer_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "rio_restaking"."transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transfer" ADD CONSTRAINT "transfer_from_id_account_id_fk" FOREIGN KEY ("from_id") REFERENCES "rio_restaking"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transfer" ADD CONSTRAINT "transfer_to_id_account_id_fk" FOREIGN KEY ("to_id") REFERENCES "rio_restaking"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."transfer" ADD CONSTRAINT "transfer_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "rio_restaking"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."withdrawal" ADD CONSTRAINT "withdrawal_network_id_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "rio_restaking"."network"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."withdrawal" ADD CONSTRAINT "withdrawal_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "rio_restaking"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."withdrawal" ADD CONSTRAINT "withdrawal_restaking_token_id_asset_id_fk" FOREIGN KEY ("restaking_token_id") REFERENCES "rio_restaking"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."withdrawal" ADD CONSTRAINT "withdrawal_underlying_asset_id_asset_id_fk" FOREIGN KEY ("underlying_asset_id") REFERENCES "rio_restaking"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rio_restaking"."withdrawal" ADD CONSTRAINT "withdrawal_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "rio_restaking"."transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
