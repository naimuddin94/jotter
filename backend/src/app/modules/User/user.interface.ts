/* eslint-disable no-unused-vars */
import { z } from 'zod';
import { TPlan, TRole, TStatus } from './user.constant';
import { UserValidation } from './user.validation';

export interface IUser
  extends z.infer<typeof UserValidation.createSchema.shape.body> {
  name?: string;
  image?: string;
  role: TRole;
  refreshToken?: string | null;
  verificationCode?: string | null;
  verificationExpiry?: Date | null;
  verified: boolean;
  plan: TPlan;
  status: TStatus;
  storageLimit: number;
  storageUsed: number;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface ILoginPayload {
  identity: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
