export const SCHEMA_VERSION = 1;

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    characterId TEXT NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;
