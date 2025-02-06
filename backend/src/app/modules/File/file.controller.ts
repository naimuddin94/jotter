import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { FileService } from './file.service';

const saveFiles = asyncHandler(async (req, res) => {
  const result = await FileService.saveFileIntoDB(req);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'File saved successfully'));
});

const renameFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const newName = req.body.newName;

  const result = await FileService.renameFile(fileId, newName);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'File rename successfully'));
});

const deleteFile = asyncHandler(async (req, res) => {
  await FileService.deleteFile(req);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'File delete successfully'));
});

export const FileController = {
  saveFiles,
  renameFile,
  deleteFile,
};
