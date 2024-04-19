ALTER TABLE "security"."validatorKeys" RENAME TO "validator_keys";--> statement-breakpoint
ALTER TABLE "security"."validator_keys" DROP CONSTRAINT "validatorKeys_add_keys_transaction_id_add_keys_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "security"."validator_keys" DROP CONSTRAINT "validatorKeys_remove_keys_transaction_id_remove_keys_transactions_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "security"."validator_keys" ADD CONSTRAINT "validator_keys_add_keys_transaction_id_add_keys_transactions_id_fk" FOREIGN KEY ("add_keys_transaction_id") REFERENCES "security"."add_keys_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "security"."validator_keys" ADD CONSTRAINT "validator_keys_remove_keys_transaction_id_remove_keys_transactions_id_fk" FOREIGN KEY ("remove_keys_transaction_id") REFERENCES "security"."remove_keys_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "security"."add_keys_transactions" DROP COLUMN IF EXISTS "start_index";