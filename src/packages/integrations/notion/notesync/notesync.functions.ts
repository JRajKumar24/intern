// packages/integrations/notion/notesync/notesync.functions.ts
import { ListNotesInputSchema, NoteSchema } from "./notesync.schema";
import { mockNotes } from "./notesync.mock";

/**
 * Mock function to list notes from Notion via NoteSync
 * @param input - Parameters for filtering and pagination
 * @returns Promise with list of notes and pagination info
 */
export async function listNotes(input: unknown) {
  // Validate input using Zod schema
  const validatedInput = ListNotesInputSchema.parse(input);

  // Filter mock data based on input
  let notes = [...mockNotes];
  
  if (validatedInput.query) {
    const query = validatedInput.query.toLowerCase();
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content?.toLowerCase().includes(query)
    );
  }

  if (validatedInput.filter !== "all") {
    notes = notes.filter(note => note.status === validatedInput.filter);
  }

  // Apply maxResults limit
  notes = notes.slice(0, validatedInput.maxResults);

  return {
    notes: NoteSchema.array().parse(notes),
    total: mockNotes.length,
    returned: notes.length,
  };
}