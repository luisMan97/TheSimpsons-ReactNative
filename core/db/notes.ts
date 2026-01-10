import { getDatabase } from '@/core/db';
import { uuidv4 } from '@/core/utils/uuid';

export type NoteRecord = {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  text: string;
  rating: number;
  updatedAt: string;
};

export async function listNotesByCharacter(
  userId: string,
  characterId: string,
): Promise<NoteRecord[]> {
  const db = await getDatabase();
  const notes = await db.getAllAsync<NoteRecord>(
    'SELECT * FROM notes WHERE userId = ? AND characterId = ? ORDER BY updatedAt DESC;',
    [userId, characterId],
  );
  return notes ?? [];
}

export async function getNoteById(id: string, userId: string): Promise<NoteRecord | null> {
  const db = await getDatabase();
  const note = await db.getFirstAsync<NoteRecord>(
    'SELECT * FROM notes WHERE id = ? AND userId = ?;',
    [id, userId],
  );
  return note ?? null;
}

export async function saveNote(
  input: Omit<NoteRecord, 'id' | 'updatedAt'> & { id?: string },
): Promise<NoteRecord> {
  const db = await getDatabase();
  const updatedAt = new Date().toISOString();
  const id = input.id ?? (await uuidv4());

  await db.runAsync(
    `INSERT INTO notes (id, userId, characterId, title, text, rating, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title,
       text=excluded.text,
       rating=excluded.rating,
       updatedAt=excluded.updatedAt;`,
    [id, input.userId, input.characterId, input.title, input.text, input.rating, updatedAt],
  );

  return { ...input, id, updatedAt };
}

export async function deleteNote(id: string, userId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM notes WHERE id = ? AND userId = ?;', [id, userId]);
}
