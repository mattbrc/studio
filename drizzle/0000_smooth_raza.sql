CREATE TABLE `studio_customers` (
	`userId` varchar(256) NOT NULL,
	`stripeCustomerId` text NOT NULL,
	CONSTRAINT `studio_customers_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `studio_level` (
	`id` varchar(128) NOT NULL,
	`level` text NOT NULL,
	`requiredWorkouts` bigint NOT NULL,
	`nextLevelWorkouts` bigint NOT NULL,
	CONSTRAINT `studio_level_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_meal_plan_generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	`meal_plan` json NOT NULL,
	CONSTRAINT `studio_meal_plan_generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_pathGenerations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	`program` json NOT NULL,
	CONSTRAINT `studio_pathGenerations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_post` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`content` varchar(256),
	`userID` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studio_post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_programWorkouts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`orderId` int NOT NULL,
	`title` text,
	`strength` json,
	`conditioning` json,
	`programId` bigint,
	`notes` text,
	CONSTRAINT `studio_programWorkouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_programs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`title` text NOT NULL,
	`length` text NOT NULL,
	`desc` text NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`options` boolean NOT NULL DEFAULT false,
	CONSTRAINT `studio_programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_subscriptions` (
	`userId` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`stripeSubscriptionId` text NOT NULL,
	`stripeCustomerId` text NOT NULL,
	`stripePriceId` text NOT NULL,
	`stripeCurrentPeriodEnd` bigint NOT NULL,
	CONSTRAINT `studio_subscriptions_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `studio_trackWorkouts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`trackId` bigint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date` timestamp NOT NULL,
	`title` text,
	`strength` json,
	`conditioning` json,
	`week` int NOT NULL DEFAULT 0,
	`block` int NOT NULL DEFAULT 0,
	CONSTRAINT `studio_trackWorkouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_tracks` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	CONSTRAINT `studio_tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_userPathProgram` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`path_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`active` boolean NOT NULL DEFAULT false,
	`currentWorkoutId` int NOT NULL DEFAULT 0,
	CONSTRAINT `studio_userPathProgram_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_userProfiles` (
	`userId` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`instagram` text,
	`city` text,
	`state` text,
	`goal` text,
	`isPublic` boolean NOT NULL DEFAULT false,
	`gender` varchar(10),
	`weight` varchar(10),
	`height` varchar(10),
	`age` varchar(5),
	`activityFactor` varchar(10),
	`bmr` int,
	`tdee` int,
	CONSTRAINT `studio_userProfiles_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `studio_userPrograms` (
	`userId` varchar(256) NOT NULL,
	`isBeingCoached` int NOT NULL DEFAULT 0,
	`coachId` varchar(256),
	`programId` bigint,
	`uniqueProgramId` varchar(128),
	`currentWorkoutId` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studio_userPrograms_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `studio_wod` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date` timestamp NOT NULL,
	`title` text,
	`strength` json,
	`conditioning` json,
	CONSTRAINT `studio_wod_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_log` (
	`id` varchar(128) NOT NULL,
	`userID` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`workoutId` bigint,
	`programId` bigint,
	CONSTRAINT `studio_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `studio_post` (`name`);--> statement-breakpoint
CREATE INDEX `author_idx` ON `studio_post` (`userID`);--> statement-breakpoint
CREATE INDEX `wod_idx` ON `studio_programWorkouts` (`id`);--> statement-breakpoint
CREATE INDEX `program_idx` ON `studio_programs` (`id`);--> statement-breakpoint
CREATE INDEX `wod_idx` ON `studio_trackWorkouts` (`id`);--> statement-breakpoint
CREATE INDEX `user_path_idx` ON `studio_userPathProgram` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `studio_userProfiles` (`userId`);--> statement-breakpoint
CREATE INDEX `user_program_idx` ON `studio_userPrograms` (`userId`);--> statement-breakpoint
CREATE INDEX `wod_idx` ON `studio_wod` (`id`);--> statement-breakpoint
CREATE INDEX `athlete_idx` ON `studio_log` (`userID`);--> statement-breakpoint
CREATE INDEX `workout_idx` ON `studio_log` (`workoutId`);