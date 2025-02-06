import { Request } from 'express';
import fs from 'fs/promises';
import status from 'http-status';
import mongoose from 'mongoose';
import path from 'path';
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
          $addToSet: { files: { $each: savedFiles.map((file) => file._id) } },
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

const renameFile = async (fileId: string, newFilename: string) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new AppError(status.NOT_FOUND, 'File not found');
  }

  const originalExtension = path.extname(file.filename);
  const newNameExtension = path.extname(newFilename);

  const updatedName = newNameExtension
    ? newFilename
    : `${newFilename}${originalExtension}`;

  file.filename = updatedName;
  await file.save();

  return file;
};

const deleteFile = async (req: Request) => {
  const { accessToken } = req.cookies;
  const fileId = req.params.fileId;
  const hostname = `${req.protocol}://${req.get('host')}`;

  const { id } = await verifyToken(accessToken);

  const file = await File.findById(fileId);

  if (!file) {
    throw new AppError(status.NOT_FOUND, 'File not found');
  }

  if (file.owner.toString() !== id.toString()) {
    throw new AppError(
      status.NOT_FOUND,
      'You have no permission to delete this'
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Delete the file from the database
    await File.findByIdAndDelete(fileId, { session });

    await User.findByIdAndUpdate(
      id,
      { $inc: { storageUsed: -file.size } },
      { session }
    );

    await Folder.updateMany(
      { files: fileId },
      { $pull: { files: fileId } },
      { session }
    );

    const relativePath = file.filePath.replace(hostname, '');
    const projectRoot = path.resolve(__dirname, '../../../../');
    const absolutePath = path.join(projectRoot, relativePath);

    // Delete the file from the filesystem
    await fs.unlink(absolutePath);

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Error deleting file');
  }
};

export const FileService = {
  saveFileIntoDB,
  renameFile,
  deleteFile,
};
