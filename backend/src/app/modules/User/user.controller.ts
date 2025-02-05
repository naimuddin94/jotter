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

const verifyOtp = asyncHandler(async (req, res) => {
  const otp = req.body.otp;
  const email = req.params.email;

  const result = await UserService.verifyOtpInDB(email, otp);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'OTP verified successfully'));
});

export const UserController = {
  signup,
  signin,
  verifyOtp,
};
