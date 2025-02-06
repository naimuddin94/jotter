import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { FileService } from './file.service';

const saveFiles = asyncHandler(async (req, res) => {
  const result = await FileService.saveFileIntoDB(req);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'File saved successfully'));
});

export const FileController = {
  saveFiles,
};
