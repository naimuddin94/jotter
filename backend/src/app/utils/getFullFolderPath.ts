import status from 'http-status';
import path from 'path';
import Folder from '../modules/Folder/folder.model';
import AppError from './AppError';

const getFullFolderPath = async (
  folderId: string | undefined
): Promise<string> => {
  if (!folderId) {
    return path.join(__dirname, '../public');
  }

  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new AppError(status.NOT_FOUND, 'Folder not exists');
  }

  const parentPath = await getFullFolderPath(folder?.parentFolder?.toString());
  return path.join(parentPath, folder.name);
};

export default getFullFolderPath;
