/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDuplicateError = (err: any) => {
  return {
    statusCode: 400,
    message: 'Duplicate field',
    errors: [
      {
        path: Object.keys(err?.keyValue).join(', '),
        message: `${Object.values(err?.keyValue).join(', ')} is already exists`,
      },
    ],
  };
};

export default handleDuplicateError;
