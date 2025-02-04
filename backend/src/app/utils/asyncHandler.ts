import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler =
  (requestHandler: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };

export default asyncHandler;
