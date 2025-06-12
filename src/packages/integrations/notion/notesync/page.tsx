// app/notesync/page.tsx
'use client';

import { useState } from 'react';
// Corrected path to listNotes and ListNotesInput based on your provided path in the error
import { listNotes } from '../../../../packages/integrations/notion/notesync/notesync.functions';
import { ListNotesInput } from '../../../../packages/integrations/notion/notesync/notesync.schema';

// Define the Note type based on its usage in the component
interface Note {
  id: string; // Assuming 'id' is a string from Notion API
  title: string;
  status: 'completed' | 'pending'; // Based on your status rendering logic
  content?: string; // Optional, as you check for note.content &&
  createdAt: string; // Assuming date strings are returned from API
  updatedAt: string; // Assuming date strings are returned from API
}

export default function NoteSyncPage() {
  const [params, setParams] = useState<ListNotesInput>({
    maxResults: 5,
    query: '',
    filter: 'all',
  });
  // FIX: Changed 'any[]' to 'Note[]' as previously instructed
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Assuming listNotes returns an object with a 'notes' property which is an array of Note
      // You might need to adjust the return type of listNotes if it's different.
      const result: { notes: Note[] } = await listNotes(params); 
      setNotes(result.notes);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          NoteSync with Notion Integration
        </h1>
        <p className="text-gray-300 mb-8">
          Mock integration for NoteSync with Notion provider. Search and filter notes below.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Max Results
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={params.maxResults}
                  onChange={(e) =>
                    setParams({ ...params, maxResults: Number(e.target.value) })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search Query
                </label>
                <input
                  type="text"
                  value={params.query}
                  onChange={(e) =>
                    setParams({ ...params, query: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Filter by Status
                </label>
                <select
                  value={params.filter}
                  onChange={(e) =>
                    setParams({ ...params, filter: e.target.value as 'all' | 'completed' | 'pending' })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="all">All Notes</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Notes'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-purple-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    {note.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      note.status === 'completed'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-yellow-900/30 text-yellow-300'
                    }`}
                  >
                    {note.status}
                  </span>
                </div>
                {note.content && (
                  <p className="text-gray-300 mb-3">{note.content}</p>
                )}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-10 text-gray-400">
                No notes found. Try adjusting your search criteria.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}