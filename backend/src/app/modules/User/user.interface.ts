/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from 'mongoose';
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

export interface IUserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExists(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
