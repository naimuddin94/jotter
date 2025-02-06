import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { FolderService } from './folder.service';

const createFolder = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const payload = req.body;

  const result = await FolderService.saveFolderIntoDB(accessToken, payload);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Folder created successfully'));
});

const deleteFolder = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { folderId } = req.params;

  await FolderService.deleteFolder(accessToken, folderId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Folder deleted successfully'));
});

const renameFolder = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { folderId } = req.params;
  const { newName } = req.body;

  const result = await FolderService.renameFolder(
    accessToken,
    folderId,
    newName
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Folder renamed successfully'));
});

export const FolderController = {
  createFolder,
  deleteFolder,
  renameFolder,
};
