/* eslint-disable no-unused-vars */
import { Document, ObjectId } from 'mongoose';
import { TPlan, TRole, TStatus } from './user.constant';

export interface IUser extends Document {
  _id: ObjectId;
  name?: string;
  email: string;
  username: string;
  image?: string;
  password: string;
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
