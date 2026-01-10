import { getDatabase } from '@/core/db';
import { derivePasswordHash, generateSalt } from '@/core/utils/crypto';
import { uuidv4 } from '@/core/utils/uuid';

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

export async function createUser(email: string, password: string): Promise<UserRecord> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<UserRecord>('SELECT * FROM users WHERE email = ?;', [
    email,
  ]);
  if (existing) {
    throw new Error('EMAIL_IN_USE');
  }

  const salt = await generateSalt();
  const passwordHash = derivePasswordHash(password, salt);
  const id = await uuidv4();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO users (id, email, passwordHash, passwordSalt, createdAt) VALUES (?, ?, ?, ?, ?);',
    [id, email, passwordHash, salt, createdAt],
  );

  return { id, email, passwordHash, passwordSalt: salt, createdAt };
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const db = await getDatabase();
  const user = await db.getFirstAsync<UserRecord>('SELECT * FROM users WHERE email = ?;', [
    email,
  ]);
  return user ?? null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const db = await getDatabase();
  const user = await db.getFirstAsync<UserRecord>('SELECT * FROM users WHERE id = ?;', [id]);
  return user ?? null;
}

export async function verifyUser(email: string, password: string): Promise<UserRecord> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const hash = derivePasswordHash(password, user.passwordSalt);
  if (hash !== user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS');
  }
  return user;
}
