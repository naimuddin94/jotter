import { z } from 'zod';

const signinSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Password must contain at least one special character',
      }),
  }),
});

const createSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
      })
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(15, { message: 'Username cannot exceed 15 characters' })
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
        message:
          'Username must start with a letter and can only contain letters, numbers, and underscores',
      }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Password must contain at least one special character',
      }),
  }),
});

const passwordChangeSchema = z.object({
  cookies: z.object({
    accessToken: z.string({
      required_error: 'Access token is required!',
    }),
  }),
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .min(6, { message: 'Old password must be at least 6 characters long' })
      .max(20, { message: 'Old password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Old password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Old password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Old password must contain at least one special character',
      }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, { message: 'New password must be at least 6 characters long' })
      .max(20, { message: 'New password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'New password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'New password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'New password must contain at least one special character',
      }),
  }),
});

const otpSchema = z.object({
  body: z.object({
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});

const passwordVerifySchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, { message: 'New password must be at least 6 characters long' })
      .max(20, { message: 'New password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'New password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'New password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'New password must contain at least one number',
      })
      .regex(/[@$!%*?&#]/, {
        message: 'New password must contain at least one special character',
      }),
  }),
});

export const UserValidation = {
  signinSchema,
  createSchema,
  passwordChangeSchema,
  otpSchema,
  passwordVerifySchema,
  resetPasswordSchema,
};
