import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(2, 'Titulo obligatorio'),
  text: z.string().min(4, 'Nota obligatoria'),
  rating: z.number().min(0).max(5),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
