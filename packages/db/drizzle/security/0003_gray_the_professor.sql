DO $$ BEGIN
 CREATE TYPE "removal_reason" AS ENUM('duplicate', 'public_key_used', 'invalid_signature');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "security"."daemon_task_state" ADD COLUMN "last_block_number" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "security"."remove_keys_transactions" ADD COLUMN "removal_reason" "removal_reason" NOT NULL;