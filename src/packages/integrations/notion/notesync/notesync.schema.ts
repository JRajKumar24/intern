// packages/integrations/notion/notesync/notesync.schema.ts
import { z } from "zod";

// Schema for input validation
export const ListNotesInputSchema = z.object({
  maxResults: z.number().min(1).max(100).default(10),
  query: z.string().optional(),
  filter: z.enum(["all", "completed", "pending"]).optional().default("all"),
});

// Schema for output validation
export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.enum(["completed", "pending"]),
});

export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;
export type Note = z.infer<typeof NoteSchema>;