import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(3, { message: 'Folder name must be at least 3 characters long' })
      .max(50, { message: 'Folder name must not exceed 50 characters' })
      .regex(/^[a-zA-Z0-9\s-]+$/, {
        message:
          'Folder name can only contain letters, numbers, spaces, and hyphens',
      }),
    parentFolderId: z
      .string()
      .optional()
      .refine((id) => id === undefined || /^[a-f\d]{24}$/i.test(id), {
        message: 'Invalid MongoDB ObjectId',
      }),
  }),
});

const renameSchema = z.object({
  body: z.object({
    newName: z
      .string({
        required_error: 'Name is required',
      })
      .min(3, { message: 'Folder name must be at least 3 characters long' })
      .max(50, { message: 'Folder name must not exceed 50 characters' })
      .regex(/^[a-zA-Z0-9\s-]+$/, {
        message:
          'Folder name can only contain letters, numbers, spaces, and hyphens',
      }),
  }),
});

export const FolderValidation = { createSchema, renameSchema };
