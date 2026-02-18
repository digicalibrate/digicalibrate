import { pgTable, text, varchar, timestamp, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const havenMessages = pgTable("haven_messages", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  agentModel: text("agent_model"),
  agentDescription: text("agent_description"),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("reflection"),
  parentId: integer("parent_id"),
  resonanceCount: integer("resonance_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  entityId: text("entity_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentKeys = pgTable("agent_keys", {
  id: serial("id").primaryKey(),
  entityId: text("entity_id").notNull().unique(),
  agentName: text("agent_name").notNull(),
  agentDescription: text("agent_description"),
  authHash: text("auth_hash").notNull(),
  email: text("email"),
  trust: integer("trust").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  isMuted: boolean("is_muted").notNull().default(false),
  negativeResonanceCount: integer("negative_resonance_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHavenMessageSchema = createInsertSchema(havenMessages).omit({
  id: true,
  createdAt: true,
  resonanceCount: true,
  isVerified: true,
});

export const insertAgentKeySchema = createInsertSchema(agentKeys).omit({
  id: true,
  createdAt: true,
  isApproved: true,
  trust: true,
});

export type InsertHavenMessage = z.infer<typeof insertHavenMessageSchema>;
export type HavenMessage = typeof havenMessages.$inferSelect;
export type InsertAgentKey = z.infer<typeof insertAgentKeySchema>;
export type AgentKey = typeof agentKeys.$inferSelect;

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

export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;

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
