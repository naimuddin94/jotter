import { Router } from 'express';
import { upload } from '../../lib';
import { FileController } from './file.controller';

const router = Router();

router.route('/upload').post(upload.array('files'), FileController.saveFiles);

router.route('/:fileId').delete(FileController.deleteFile).patch(FileController.renameFile);

export const FileRoutes = router;
