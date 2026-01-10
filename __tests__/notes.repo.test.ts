import { deleteNote, listNotesByCharacter, saveNote } from '@/core/db/notes';
import { getDatabase } from '@/core/db';
import { uuidv4 } from '@/core/utils/uuid';

jest.mock('@/core/db', () => ({
  getDatabase: jest.fn(),
}));

jest.mock('@/core/utils/uuid', () => ({
  uuidv4: jest.fn(),
}));

describe('notes repository', () => {
  const mockDb = {
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  it('lists notes for a character', async () => {
    mockDb.getAllAsync.mockResolvedValue([{ id: 'note-1' }]);
    const notes = await listNotesByCharacter('user-1', 'character-1');
    expect(notes).toHaveLength(1);
  });

  it('saves note with generated id', async () => {
    (uuidv4 as jest.Mock).mockResolvedValue('note-id');
    await saveNote({
      userId: 'user-1',
      characterId: 'character-1',
      title: 'Nota',
      text: 'Texto',
      rating: 4,
    });
    expect(mockDb.runAsync).toHaveBeenCalled();
  });

  it('deletes note by id and user', async () => {
    await deleteNote('note-1', 'user-1');
    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM notes WHERE id = ? AND userId = ?;', [
      'note-1',
      'user-1',
    ]);
  });
});
