import mongoose from 'mongoose';

const handleCastError = (err: mongoose.Error.CastError) => {
  return {
    statusCode: 400,
    message: 'Invalid mongodb object id',
    errors: [
      {
        path: err?.path,
        message: err?.message,
      },
    ],
  };
};

export default handleCastError;
