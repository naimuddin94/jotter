import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
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
  verifyOtp,
};
