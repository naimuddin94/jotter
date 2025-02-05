import status from 'http-status';
import { z } from 'zod';
import { generateOtp } from '../../lib';
import { AppError, sendOtpEmail } from '../../utils';
import { ILoginPayload } from './user.interface';
import User from './user.model';
import { UserValidation } from './user.validation';

const saveUserIntoDB = async (
  payload: z.infer<typeof UserValidation.createSchema.shape.body>
) => {
  const isEmailExists = await User.findOne({ email: payload.email });

  if (isEmailExists) {
    // If the email already exists, we allow the OTP to be re-requested if expired.

    if (
      isEmailExists.verificationCode &&
      isEmailExists.verificationExpiry &&
      Date.now() > isEmailExists.verificationExpiry.getTime()
    ) {
      // OTP expired, generate new OTP
      const otp = generateOtp();
      isEmailExists.verificationCode = otp;
      isEmailExists.verificationExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await isEmailExists.save();
      sendOtpEmail(payload.email, otp, payload.username);

      return {
        email: isEmailExists.email,
      };
    }

    throw new AppError(status.BAD_REQUEST, 'Email already exists');
  }

  const isUsernameExists = await User.findOne({ username: payload.username });

  if (isUsernameExists) {
    throw new AppError(status.BAD_REQUEST, 'Username already taken');
  }

  const otp = generateOtp();

  const result = await User.create({
    ...payload,
    verificationCode: otp,
    verificationExpiry: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
  });

  if (result) {
    sendOtpEmail(payload.email, otp, payload.username);
  }

  return {
    email: result.email,
  };
};

const verifyOtpInDB = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (user.verificationCode !== otp || !user.verificationExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  // Check if OTP has expired
  if (Date.now() > user.verificationExpiry.getTime()) {
    throw new AppError(status.BAD_REQUEST, 'OTP has expired');
  }

  // Mark user as verified after successful OTP validation
  user.verified = true;
  user.verificationCode = null;
  user.verificationExpiry = null;
  await user.save();

  return null;
};

const signinUserIntoDB = async (credentials: ILoginPayload) => {
  const user = await User.isUserExists(credentials.email);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const isCredentialsCorrect = await user.isPasswordCorrect(
    credentials.password
  );

  if (!isCredentialsCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const userData = await User.findByIdAndUpdate(user._id, {
    refreshToken,
  }).select('name email username image plan storageLimit storageUsed');

  if (!userData) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Internal Server Error to set refresh token'
    );
  }
  // Convert `storageLimit` and `storageUsed` from bytes to GB
  const storageLimitInGB =
    (userData.storageLimit / 1024 ** 3).toFixed(2) + ' GB';
  const storageUsedInGB = (userData.storageUsed / 1024 ** 3).toFixed(2) + ' GB';

  return {
    ...userData.toObject(),
    storageLimit: storageLimitInGB,
    storageUsed: storageUsedInGB,
    accessToken,
    refreshToken,
  };
};

export const UserService = { saveUserIntoDB, verifyOtpInDB, signinUserIntoDB };
