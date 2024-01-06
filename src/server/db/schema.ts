// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  json,
  text,
} from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `studio_${name}`);

// Sample schema for posts. From T3 repo
export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    content: varchar("content", { length: 256 }),
    authorId: varchar("userID", { length: 256} ),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
    authorIndex: index("author_idx").on(example.authorId),
  })
);

// Workout Log for tracking completed WODs by users
// Tracks individual workout history for users by WOD
export const workoutsLog = mysqlTable(
  "log",
  {
    logId: varchar('id', { length: 128 }).$defaultFn(() => createId()).primaryKey(),
    athleteId: varchar("userID", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    workoutId: bigint("workoutId", { mode: "number" }),
  },
  (workoutsTable) => ({
    athleteIndex: index("athlete_idx").on(workoutsTable.athleteId),
    workoutIndex: index("workout_idx").on(workoutsTable.workoutId),
  })
);

// Simple storage of WODs by ID as JSON
export const wods = mysqlTable(
  "wod",
  {
    wodId: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    date: timestamp("date").notNull(),
    title: text("title"),
    workout: json("workout").notNull(),
    notes: text("notes"),
  },
  (wodTable) => ({
    wodIndex: index("wod_idx").on(wodTable.wodId),
  })
);

export const levels = mysqlTable(
  "level",
  {
    levelId: varchar('id', { length: 128 }).$defaultFn(() => createId()).primaryKey(),
    title: text("level").notNull(),
    requiredWorkouts: bigint("requiredWorkouts", { mode: "number" }).notNull(),
    nextLevelWorkouts: bigint("nextLevelWorkouts", { mode: "number" }).notNull(),
  }
)

