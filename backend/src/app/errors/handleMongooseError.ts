import mongoose from 'mongoose';

const handleMongooseError = (err: mongoose.Error.ValidationError) => {
  return {
    statusCode: 400,
    message: 'Validation error',
    errors: Object.values(err.errors).map((error) => ({
      path: error?.path,
      message: error?.message,
    })),
  };
};

export default handleMongooseError;
