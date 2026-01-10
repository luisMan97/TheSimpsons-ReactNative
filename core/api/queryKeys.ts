export const queryKeys = {
  characters: (query: string) => ['characters', query] as const,
  character: (id: string) => ['character', id] as const,
  episodes: () => ['episodes'] as const,
  episode: (id: string) => ['episode', id] as const,
  notes: (userId: string, characterId: string) => ['notes', userId, characterId] as const,
  note: (userId: string, noteId: string) => ['note', userId, noteId] as const,
};
