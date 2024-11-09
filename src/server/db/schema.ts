// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  int,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  json,
  text,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

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
    programId: bigint("programId", { mode: "number" }),
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
    strength: json("strength"),
    conditioning: json("conditioning"),
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
);

export const programs = mysqlTable(
  "programs",
  {
    programId: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    title: text("title").notNull(),
    length: text("length").notNull(),
    description: text("desc").notNull(),
    active: boolean("active").default(false).notNull(),
  },
  (programTable) => ({
    programIndex: index("program_idx").on(programTable.programId),
  })
)

export const tracks = mysqlTable(
  "tracks",
  {
    trackId: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    title: text("title").notNull(),
    description: text("desc").notNull(),
    active: boolean("active").default(false).notNull(),
  },
)

export const trackWorkouts = mysqlTable(
  "trackWorkouts",
  {
    workoutId: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    trackId: bigint("trackId", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    date: timestamp("date").notNull(),
    title: text("title"),
    strength: json("strength"),
    conditioning: json("conditioning"),
    week: int("week").notNull().default(0),
    block: int("block").notNull().default(0),
  },
  (tracksTable) => ({
    trackIndex: index("wod_idx").on(tracksTable.workoutId),
  })
);

export const userPrograms = mysqlTable(
  "userPrograms",
  {
    userId: varchar("userId", { length: 256 }).primaryKey(),
    isBeingCoached: int("isBeingCoached").notNull().default(0),
    coachId: varchar("coachId", { length: 256 }),
    programId: bigint("programId", { mode: "number" }),
    uniqueProgramId: varchar('uniqueProgramId', { length: 128 }).$defaultFn(() => createId()),
    currentWorkoutId: int("currentWorkoutId").notNull().default(0),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (userProgramTable) => ({
    userProgramIndex: index("user_program_idx").on(userProgramTable.userId),
  })
)

export const programWorkouts = mysqlTable(
  "programWorkouts",
  {
    workoutId: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    orderId: int("orderId").notNull(),
    title: text("title"),
    strength: json("strength"),
    conditioning: json("conditioning"),
    programId: bigint("programId", { mode: "number" }),
    notes: text("notes"),
  },
  (programWorkoutsTable) => ({
    programWorkoutsIndex: index("wod_idx").on(programWorkoutsTable.workoutId),
  })
);

// stripe sub info for each user
export const subscriptions = mysqlTable("subscriptions", {
  userId: varchar("userId", { length: 256 }).notNull().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCurrentPeriodEnd: bigint("stripeCurrentPeriodEnd", { mode: "number" }).notNull(),
});

// userId to stripeCustomerId xRef table - route handler can now access clerk userID
export const customers = mysqlTable("customers", {
  userId: varchar("userId", { length: 256 }).notNull().primaryKey(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
});

export const userProfiles = mysqlTable("userProfiles", {
  userId: varchar("userId", { length: 256 }).notNull().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  instagram: text("instagram"),
  city: text("city"),
  state: text("state"),
  goal: text("goal"),
  isPublic: boolean("isPublic").notNull().default(false),
  gender: varchar("gender", { length: 10 }),
  weight: varchar("weight", { length: 10 }),
  height: varchar("height", { length: 10 }),
  age: varchar("age", { length: 5 }),
  activityFactor: varchar("activityFactor", { length: 10 }),
  bmr: int("bmr"),
  tdee: int("tdee"),
}, (table) => ({
  userIndex: index("user_idx").on(table.userId),
}));

export const userProgramRelations = relations(userPrograms, ({ one, many }) => ({
  program: one(programs, {
    fields: [userPrograms.programId],
    references: [programs.programId],
  }),
  workouts: many(programWorkouts)
}));

export const workoutsRelations = relations(programWorkouts, ({ one }) => ({
  user: one(userPrograms, {
    fields: [programWorkouts.programId],
    references: [userPrograms.programId]
  })
}))

export const workoutProgramRelations = relations(programWorkouts, ({ one }) => ({
  program: one(programs, {
    fields: [programWorkouts.programId],
    references: [programs.programId],
  }),
}));

export const mealPlanGenerations = mysqlTable('meal_plan_generations', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  mealPlan: json('meal_plan').notNull(), // Add this line to store the full meal plan
});

export const pathGenerations = mysqlTable('pathGenerations', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  program: json('program').notNull(), // Add this line to store the full meal plan
});
