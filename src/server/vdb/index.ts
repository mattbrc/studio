import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from './schema';

const client = new Client({
  connectionString: process.env.VECTOR_DATABASE_URL,
 });
 
 await client.connect();
 export const vdb = drizzle(client, { schema });