import status from 'http-status';
import { z } from 'zod';
import { generateOtp } from '../../lib';
import { AppError, sendOtpEmail } from '../../utils';
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

export const UserService = { saveUserIntoDB, verifyOtpInDB };
