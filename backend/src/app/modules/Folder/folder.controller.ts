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

export const FolderController = {
  createFolder,
};
