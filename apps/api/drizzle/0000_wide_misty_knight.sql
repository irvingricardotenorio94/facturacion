CREATE TABLE `emisor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`rfc` text NOT NULL,
	`razon_social` text NOT NULL,
	`regimen_fiscal` text NOT NULL,
	`Lugar_Expedicion` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receptores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rfc` text NOT NULL,
	`razon_social` text NOT NULL,
	`regimen_fiscal` text NOT NULL,
	`Domicilio_Fiscal_Receptor` text NOT NULL,
	`uso_cfdi` text NOT NULL,
	`email` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre_completo` text NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);