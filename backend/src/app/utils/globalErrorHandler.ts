/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import {
  handleCastError,
  handleDuplicateError,
  handleMongooseError,
  handleZodError,
} from '../errors';
import { IErrorSource } from '../types';
import AppError from './AppError';

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong!';
  let errors: IErrorSource[] = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const modifier = handleZodError(err);
    statusCode = modifier.statusCode;
    message = modifier.message;
    errors = modifier.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const modifier = handleMongooseError(err);
    statusCode = modifier.statusCode;
    message = modifier.message;
    errors = modifier.errors;
  } else if (err instanceof mongoose.Error.CastError) {
    const modifier = handleCastError(err);
    statusCode = modifier.statusCode;
    message = modifier.message;
    errors = modifier.errors;
  } else if (err?.code === 11000) {
    const modifier = handleDuplicateError(err);
    statusCode = modifier.statusCode;
    message = modifier.message;
    errors = modifier.errors;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errors = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return res.status(err?.status || statusCode).json({
    success: false,
    message,
    errorMessages: errors,
    stack: err?.stack,
  });
};

export default globalErrorHandler;
