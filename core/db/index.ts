import * as SQLite from 'expo-sqlite';

import { CREATE_NOTES_TABLE, CREATE_USERS_TABLE, SCHEMA_VERSION } from '@/core/db/schema';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!database) {
    database = await SQLite.openDatabaseAsync('simpsons.db');
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    await db.execAsync('BEGIN TRANSACTION;');
    try {
      await db.execAsync(CREATE_USERS_TABLE);
      await db.execAsync(CREATE_NOTES_TABLE);
      await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }
}
