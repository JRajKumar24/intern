// packages/integrations/notion/notesync/notesync.mock.ts
import { Note } from "./notesync.schema";

// Mock data for demonstration
export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to NoteSync",
    content: "This is your first note in NoteSync with Notion integration",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    status: "completed",
  },
  {
    id: "2",
    title: "Meeting Notes",
    content: "Discuss project requirements with the team",
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
    status: "pending",
  },
  {
    id: "3",
    title: "Shopping List",
    content: "Milk, Eggs, Bread, Fruits",
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
    status: "pending",
  },
  {
    id: "4",
    title: "Project Ideas",
    content: "Brainstorming for new features",
    createdAt: "2023-01-04T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    status: "completed",
  },
];