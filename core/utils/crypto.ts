import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';

const ITERATIONS = 20000;
const KEY_SIZE = 32 / 4;

export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytes.map((value) => value.toString(16).padStart(2, '0')).join('');
}

export function derivePasswordHash(password: string, salt: string): string {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });
  return key.toString(CryptoJS.enc.Hex);
}
