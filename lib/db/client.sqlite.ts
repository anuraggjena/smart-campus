import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite);
