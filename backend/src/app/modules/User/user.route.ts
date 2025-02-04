import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router
  .route('/signup')
  .post(validateRequest(UserValidation.createSchema), UserController.signup);

router
  .route('/verify-otp/:email')
  .post(validateRequest(UserValidation.otpSchema), UserController.verifyOtp);

export const UserRoutes = router;
