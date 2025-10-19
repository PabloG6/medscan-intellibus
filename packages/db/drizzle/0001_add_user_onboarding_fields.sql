ALTER TABLE `users` ADD COLUMN `organization` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `receive_updates` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `accepted_terms_at` integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);
