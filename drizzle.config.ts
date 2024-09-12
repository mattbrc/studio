// import { type Config } from "drizzle-kit";

// import { env } from "~/env.mjs";

// export default {
//   dialect: "mysql",
//   schema: "./src/server/db/schema.ts",
//   driver: "mysql2",
//   dbCredentials: {
//     connectionString: env.DATABASE_URL,
//   },
//   tablesFilter: ["studio_*"],
// } satisfies Config;

import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["studio_*"],
} satisfies Config;