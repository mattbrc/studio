// import { Client } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";

// import { env } from "~/env.mjs";
// import * as schema from "./schema";

// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema }
// );

// const client = new Client({
//  host: process.env["DATABASE_HOST"],
//  username: process.env["DATABASE_USERNAME"],
//  password: process.env["DATABASE_PASSWORD"],
// });

// const db = drizzle(client);

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import * as schema from './schema';

const client = new Client({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});
export const db = drizzle(client, { schema });
