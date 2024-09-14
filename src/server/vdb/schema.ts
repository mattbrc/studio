import { index, text, varchar, vector, integer, jsonb, pgTableCreator, timestamp } from "drizzle-orm/pg-core";

import { nanoid } from "@/lib/helpers";
import { sql } from "drizzle-orm";

export const createTable = pgTableCreator((name) => `vector_${name}`);

// export const embeddings = createTable("embeddings",
//   {
//     id: varchar("id", { length: 191 })
//       .primaryKey()
//       .$defaultFn(() => nanoid()),
//     workoutId: varchar("workout_id", { length: 191 }).references(
//       () => workouts.id,
//       { onDelete: "cascade" }
//     ),
//     content: text("content").notNull(),
//     embedding: vector("embedding", { dimensions: 1536 }).notNull(),
//   },
//   (table) => ({
//     embeddingIndex: index("embeddingIndex").using(
//       "hnsw",
//       table.embedding.op("vector_cosine_ops")
//     ),
//   })
// );

export const workouts = createTable(
  'workouts', 
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    orderId: integer('order_id'),
    title: text('title'),
    strength: jsonb('strength'),
    conditioning: jsonb('conditioning'),
    programId: integer('program_id'),
    createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export type SelectWorkout = typeof workouts.$inferSelect;