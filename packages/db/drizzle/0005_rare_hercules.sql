ALTER TABLE "rio_restaking"."dapp_deposit" DROP CONSTRAINT "dapp_deposit_transaction_hash_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dapp_tx_transaction_hash_idx" ON "rio_restaking"."dapp_deposit" ("transaction_hash");--> statement-breakpoint
ALTER TABLE "rio_restaking"."dapp_deposit" ADD CONSTRAINT "dapp_tx_chain_id_transaction_hash_unique" UNIQUE("transaction_hash","chain_id");