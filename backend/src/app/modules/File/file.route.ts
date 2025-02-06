import { Router } from 'express';
import { upload } from '../../lib';
import { auth, validateRequest } from '../../middlewares';
import { FileController } from './file.controller';
import { FileValidation } from './file.validation';

const router = Router();

router.route('/upload').post(upload.array('files'), FileController.saveFiles);

router
  .route('/:fileId')
  .delete(auth('ADMIN', 'USER'), FileController.deleteFile)
  .patch(
    auth('ADMIN', 'USER'),
    validateRequest(FileValidation.renameSchema),
    FileController.renameFile
  );

export const FileRoutes = router;
