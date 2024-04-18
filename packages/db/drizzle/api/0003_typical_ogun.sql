CREATE TABLE IF NOT EXISTS "rio_restaking"."dapp_deposit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_id" integer NOT NULL,
	"restaking_token" varchar(42) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" varchar,
	"transaction_hash" char(66) NOT NULL,
	CONSTRAINT "dapp_deposit_transaction_hash_unique" UNIQUE("transaction_hash")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_network_idx" ON "rio_restaking"."dapp_deposit" ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_restaking_token_idx" ON "rio_restaking"."dapp_deposit" ("restaking_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_timestamp_idx" ON "rio_restaking"."dapp_deposit" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_ip_idx" ON "rio_restaking"."dapp_deposit" ("ip");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_transaction_hash_idx" ON "rio_restaking"."dapp_deposit" ("transaction_hash");