// import { Client } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";

// import { env } from "~/env.mjs";
// import * as schema from "./schema";

// // export const vdb = drizzle(
// //   new Client({
// //     url: env.VECTOR_DATABASE_URL,
// //   }).connection(),
// //   { schema }
// // );

// const client = new Client({
//   host: process.env.VECTOR_DATABASE_HOST,
//   username: process.env.VECTOR_DATABASE_USERNAME,
//   password: process.env.VECTOR_DATABASE_PASSWORD,
// });
// export const vdb = drizzle(client, { schema });

import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from './schema';

const client = new Client({
  connectionString: process.env.VECTOR_DATABASE_URL,
 });
 
 await client.connect();
 export const vdb = drizzle(client, { schema });