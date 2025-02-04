import { ZodError } from 'zod';

const handleZodError = (err: ZodError) => {
  return {
    statusCode: 400,
    message: 'Zod validation error',
    errors: err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    })),
  };
};

export default handleZodError;
