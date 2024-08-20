import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/schemas/drizzle";

const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_DB_URL!);
const db = drizzle(client, { schema });

export default db;
