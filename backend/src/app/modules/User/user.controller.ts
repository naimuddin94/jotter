import { CookieOptions } from 'express';
import status from 'http-status';
import { AppResponse, asyncHandler, options } from '../../utils';
import { UserService } from './user.service';

const signup = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await UserService.saveUserIntoDB(payload);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(
        status.CREATED,
        result,
        'Your OTP has been successfully sent to your email. If you do not find the email in your inbox, please check your spam or junk folder.'
      )
    );
});

const signin = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await UserService.signinUserIntoDB(payload);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const signout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies?.accessToken;

  await UserService.signoutUserFromDB(accessToken);

  res
    .status(status.OK)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new AppResponse(status.OK, null, 'Signout successfully'));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const otp = req.body.otp;
  const email = req.params.email;

  const result = await UserService.verifyOtpInDB(email, otp);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const resetPasswordVerify = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const result = await UserService.sendPasswordResetOtp(email);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Your OTP has been successfully sent to your email. If you do not find the email in your inbox, please check your spam or junk folder.'
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await UserService.resetPasswordIntoDB(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Reset password successfully'));
});

export const UserController = {
  signup,
  signin,
  signout,
  verifyOtp,
  resetPasswordVerify,
  resetPassword,
};
