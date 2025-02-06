import fs from 'fs';
import status from 'http-status';
import path from 'path';
import { verifyToken } from '../../lib';
import { AppError } from '../../utils';
import User from '../User/user.model';
import Folder from './folder.model';

const saveFolderIntoDB = async (
  accessToken: string,
  payload: { name: string; parentFolderId: string | undefined }
) => {
  const { name, parentFolderId } = payload;
  const { id } = await verifyToken(accessToken);

  const user = await User.findOne({
    _id: id,
    verified: true,
    status: 'ACTIVE',
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  let folderPath = path.join('./public', name);

  if (parentFolderId) {
    const parentFolder = await Folder.findById(parentFolderId);
    if (!parentFolder) {
      throw new AppError(status.NOT_FOUND, 'Parent folder not exists');
    }
    folderPath = path.join(parentFolder.folderPath, name);
  }

  const isExistsFolder = fs.existsSync(folderPath);

  if (isExistsFolder) {
    throw new AppError(status.BAD_REQUEST, 'Folder already exists');
  }

  fs.mkdirSync(folderPath, { recursive: true });

  const folder = await Folder.create({
    name,
    owner: user._id,
    parentFolder: parentFolderId || null,
    folderPath,
  });

  return folder;
};

const deleteFolder = async (accessToken: string, folderId: string) => {
  const { id } = await verifyToken(accessToken);

  const user = await User.findOne({
    _id: id,
    verified: true,
    status: 'ACTIVE',
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new AppError(status.NOT_FOUND, 'Folder not exists');
  }

  if (!folder.owner.equals(user._id)) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to delete this folder'
    );
  }

  fs.rmSync(folder.folderPath, { recursive: true, force: true });

  await Folder.findByIdAndDelete(folderId);
  return null;
};

const renameFolder = async (
  accessToken: string,
  folderId: string,
  newName: string
) => {
  const { id } = await verifyToken(accessToken);

  const user = await User.findOne({
    _id: id,
    verified: true,
    status: 'ACTIVE',
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new AppError(status.NOT_FOUND, 'Folder not exists');
  }

  if (!folder.owner.equals(user._id)) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to rename this folder'
    );
  }

  const newFolderPath = path.join(path.dirname(folder.folderPath), newName);

  if (fs.existsSync(newFolderPath)) {
    throw new AppError(
      status.BAD_REQUEST,
      'A folder with the new name already exists'
    );
  }

  fs.renameSync(folder.folderPath, newFolderPath);

  folder.name = newName;
  folder.folderPath = newFolderPath;
  await folder.save();

  return folder;
};

export const FolderService = {
  saveFolderIntoDB,
  deleteFolder,
  renameFolder,
};
