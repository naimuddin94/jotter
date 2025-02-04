import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import config from '../../config';
import { USER_PLAN, USER_ROLE, USER_STATUS } from './user.constant';
import { IUser, IUserMethods } from './user.interface';

// Define the schema for the user model
const userSchema = new Schema<IUser, IUserMethods>(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: 'USER',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpiry: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: Object.values(USER_PLAN),
      default: 'BASIC',
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: 'ACTIVE',
    },
    storageLimit: {
      type: Number,
      default: Number(config.default_storage_in_gb) * 1024 * 1024 * 1024, // Bytes format
    },

    storageUsed: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Custom hooks/methods

// Modified password fields before save to database
userSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified or this is a new user
    if (this.isModified('password') || this.isNew) {
      const hashPassword = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
      );
      this.password = hashPassword;
    }
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
});

// For check the password is correct
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// For generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
      plan: this.plan,
    },
    config.jwt_access_secret!,
    {
      expiresIn: config.jwt_access_expires_in,
    }
  );
};

// For generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt_refresh_secret!,
    {
      expiresIn: config.jwt_refresh_expires_in,
    }
  );
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
