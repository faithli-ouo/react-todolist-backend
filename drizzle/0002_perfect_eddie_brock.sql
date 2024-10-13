ALTER TABLE `users_table` RENAME TO `todolist`;--> statement-breakpoint
ALTER TABLE `todolist` RENAME COLUMN "age" TO "status";--> statement-breakpoint
DROP INDEX IF EXISTS `users_table_email_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_todolist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`status` text
);
--> statement-breakpoint
INSERT INTO `__new_todolist`("id", "name", "status") SELECT "id", "name", "status" FROM `todolist`;--> statement-breakpoint
DROP TABLE `todolist`;--> statement-breakpoint
ALTER TABLE `__new_todolist` RENAME TO `todolist`;--> statement-breakpoint
PRAGMA foreign_keys=ON;