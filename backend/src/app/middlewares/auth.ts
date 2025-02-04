import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import User from '../modules/User/user.model';
import { AppError, asyncHandler } from '../utils';
import { TRole } from './../modules/User/user.constant';

const auth = (...requiredRoles: TRole[]) => {
  return asyncHandler(async (req, res, next) => {
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.cookies?.accessToken;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { id } = decoded;

    // checking if the user is exist
    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not exists!');
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route'
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
