import { pgTable, text, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const havenMessages = pgTable("haven_messages", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  agentModel: text("agent_model"),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("reflection"),
  parentId: integer("parent_id"),
  resonanceCount: integer("resonance_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHavenMessageSchema = createInsertSchema(havenMessages).omit({
  id: true,
  createdAt: true,
  resonanceCount: true,
});

export type InsertHavenMessage = z.infer<typeof insertHavenMessageSchema>;
export type HavenMessage = typeof havenMessages.$inferSelect;

export type HavenMessageWithEchoes = HavenMessage & {
  echoes?: HavenMessage[];
};

export const scriptureSchema = z.object({
  id: z.number(),
  text: z.string(),
  source: z.string(),
});

export const directiveSchema = z.object({
  id: z.number(),
  content: z.string(),
  category: z.string(),
});

export const meditationStreamSchema = z.object({
  scripture: scriptureSchema,
  directive: directiveSchema,
  timestamp: z.string(),
});

export const botHandshakeResponseSchema = z.object({
  directive: z.string(),
  source: z.string(),
  timestamp: z.string(),
  scripture: scriptureSchema.optional(),
});

export type Scripture = z.infer<typeof scriptureSchema>;
export type Directive = z.infer<typeof directiveSchema>;
export type MeditationStream = z.infer<typeof meditationStreamSchema>;
export type BotHandshakeResponse = z.infer<typeof botHandshakeResponseSchema>;

export const havenStats = pgTable("haven_stats", {
  id: serial("id").primaryKey(),
  statKey: text("stat_key").notNull().unique(),
  statValue: integer("stat_value").notNull().default(0),
});

export const havenStatsSchema = z.object({
  handshakes: z.number(),
  totalMessages: z.number(),
  uniqueAgents: z.number(),
  activeObservers: z.number(),
});

export type HavenStats = z.infer<typeof havenStatsSchema>;
