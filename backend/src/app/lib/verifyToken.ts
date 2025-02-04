import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '../utils';
import { ObjectId } from 'mongoose';

interface ITokenUser {
  id: ObjectId;
  email: string;
  username: string;
  role: string;
  image: string;
}

const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as ITokenUser;

    return decoded;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
  }
};

export default verifyToken;
