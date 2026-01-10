import { loginSchema } from '@/features/auth/validation';
import { noteSchema } from '@/features/notes/validation';

describe('validation schemas', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({ email: 'test@springfield.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid note data', () => {
    const result = noteSchema.safeParse({ title: '', text: '', rating: 10 });
    expect(result.success).toBe(false);
  });
});
