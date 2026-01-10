import { createUser, verifyUser } from '@/core/db/users';

import { getDatabase } from '@/core/db';
import { derivePasswordHash, generateSalt } from '@/core/utils/crypto';
import { uuidv4 } from '@/core/utils/uuid';

jest.mock('@/core/db', () => ({
  getDatabase: jest.fn(),
}));

jest.mock('@/core/utils/crypto', () => ({
  generateSalt: jest.fn(),
  derivePasswordHash: jest.fn(),
}));

jest.mock('@/core/utils/uuid', () => ({
  uuidv4: jest.fn(),
}));

describe('users repository', () => {
  const mockDb = {
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  it('creates user when email is not taken', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    mockDb.getFirstAsync.mockResolvedValue(null);
    (generateSalt as jest.Mock).mockResolvedValue('salt');
    (derivePasswordHash as jest.Mock).mockReturnValue('hash');
    (uuidv4 as jest.Mock).mockResolvedValue('user-id');

    const user = await createUser('test@springfield.com', 'secret123');

    expect(user.email).toBe('test@springfield.com');
    expect(user.passwordHash).toBe('hash');
    expect(user.passwordSalt).toBe('salt');
    expect(mockDb.runAsync).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('rejects duplicate email', async () => {
    mockDb.getFirstAsync.mockResolvedValue({ id: 'existing' });
    await expect(createUser('test@springfield.com', 'secret123')).rejects.toThrow(
      'EMAIL_IN_USE',
    );
  });

  it('verifies credentials', async () => {
    mockDb.getFirstAsync.mockResolvedValue({
      id: 'user-id',
      email: 'homer@springfield.com',
      passwordHash: 'hash',
      passwordSalt: 'salt',
      createdAt: '2025-01-01T00:00:00.000Z',
    });
    (derivePasswordHash as jest.Mock).mockReturnValue('hash');

    const user = await verifyUser('homer@springfield.com', 'donuts');

    expect(user.id).toBe('user-id');
  });
});
