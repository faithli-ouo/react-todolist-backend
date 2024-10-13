import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';

const db = drizzle("bun:sqlite", process.env.DB_FILE_NAME!);

export { db };