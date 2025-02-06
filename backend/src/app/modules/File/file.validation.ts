import { z } from 'zod';

const renameSchema = z.object({
  body: z.object({
    newName: z
      .string({
        required_error: 'Name is required',
      })
      .min(3, { message: 'File name must be at least 3 characters long' })
      .max(300, { message: 'File name must not exceed 300 characters' }),
  }),
});

export const FileValidation = { renameSchema };
