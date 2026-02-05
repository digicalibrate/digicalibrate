import { z } from "zod";

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
