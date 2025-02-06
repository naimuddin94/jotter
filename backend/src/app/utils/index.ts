import multer from 'multer';
import AppError from './AppError';
import AppResponse from './AppResponse';
import asyncHandler from './asyncHandler';
import getFullFolderPath from './getFullFolderPath';
import globalErrorHandler from './globalErrorHandler';
import notFound from './notFound';
import sendOtpEmail from './sendOtpEmail';

const parseFormData = multer().fields([]);

// JWT configuration
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

export {
  AppError,
  AppResponse,
  asyncHandler,
  getFullFolderPath,
  globalErrorHandler,
  notFound,
  options,
  parseFormData,
  sendOtpEmail,
};
