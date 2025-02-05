import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router
  .route('/signup')
  .post(validateRequest(UserValidation.createSchema), UserController.signup);

router
  .route('/signin')
  .post(validateRequest(UserValidation.signinSchema), UserController.signin);

router
  .route('/verify-otp/:email')
  .post(validateRequest(UserValidation.otpSchema), UserController.verifyOtp);

router
  .route('/reset-password-verify')
  .post(
    validateRequest(UserValidation.passwordVerifySchema),
    UserController.resetPasswordVerify
  );

router
  .route('/reset-password')
  .post(
    validateRequest(UserValidation.resetPasswordSchema),
    UserController.resetPassword
  );

export const UserRoutes = router;
