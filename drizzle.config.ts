import type { Config } from "drizzle-kit";
import path from "path";

export default {
  schema: "./lib/db/schema.sqlite.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: path.resolve(process.cwd(), "dev.db"),
  },
} satisfies Config;
