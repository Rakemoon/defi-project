import { pgTable, varchar } from "drizzle-orm/pg-core";

export const indexer = pgTable("indexer", {
  name: varchar("name").primaryKey().notNull(),
  lastBlock: varchar("last_block").notNull(),
  lastBlockTimestamp: varchar("last_block_timestamp").notNull(),
});