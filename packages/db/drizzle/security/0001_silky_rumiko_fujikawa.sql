ALTER TABLE "security"."daemon_task_state" ADD COLUMN "chain_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "security"."daemon_task_state" ADD COLUMN "operator_registry_address" char(42) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "daemon_task_state_task_by_operator_registry" ON "security"."daemon_task_state" ("task","operator_registry_address");