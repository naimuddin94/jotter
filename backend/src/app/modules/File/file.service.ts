import { Request } from 'express';
import fs from 'fs/promises';
import status from 'http-status';
import mongoose from 'mongoose';
import { verifyToken } from '../../lib';
import { AppError } from '../../utils';
import Folder from '../Folder/folder.model';
import User from '../User/user.model';
import File from './file.model';

const saveFileIntoDB = async (req: Request) => {
  const { accessToken } = req.cookies;
  // eslint-disable-next-line no-undef
  const files = req.files as Express.Multer.File[];

  const { folderId } = req.query;

  const folder = await Folder.findById(folderId);

  const { id } = await verifyToken(accessToken);

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User does not exist!');
  }

  if (!files?.length) {
    throw new AppError(status.BAD_REQUEST, 'File is missing');
  }

  const hostname = `${req.protocol}://${req.get('host')}`;

  // Prepare files array to save in bulk
  const filesToSave = files.map((file) => {
    const normalizedFilePath = file.path.replace(/\\/g, '/');
    return {
      filename: file.originalname,
      fileType: file.mimetype,
      size: file.size,
      owner: id,
      filePath: `${hostname}/${normalizedFilePath}`,
    };
  });

  const totalFileSize = files.reduce((acc, file) => acc + file.size, 0);

  const isExceedLimit = totalFileSize + user.storageUsed > user.storageLimit;

  if (isExceedLimit) {
    await Promise.all(files.map((file) => fs.unlink(file.path)));
    throw new AppError(
      status.BAD_REQUEST,
      'Exceed your storage limit, please upgrade your plan'
    );
  }

  const session = await mongoose.startSession();

  try {
    // Start the transaction
    session.startTransaction();

    const savedFiles = await File.create(filesToSave, { session });
    await User.findByIdAndUpdate(
      id,
      {
        $inc: { storageUsed: totalFileSize },
      },
      { session }
    );

    if (folder) {
      await Folder.findByIdAndUpdate(
        folderId,
        {
          $inc: { size: totalFileSize },
        },
        { session }
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return savedFiles;
  } catch {
    await session.abortTransaction();
    session.endSession();

    await Promise.all(files.map((file) => fs.unlink(file.path)));
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Error saving files into database'
    );
  }
};

export const FileService = {
  saveFileIntoDB,
};
