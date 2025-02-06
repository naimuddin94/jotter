import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { FolderController } from './folder.controller';
import { FolderValidation } from './folder.validation';

const router = Router();

router
  .route('/')
  .post(
    auth('ADMIN', 'USER'),
    validateRequest(FolderValidation.createSchema),
    FolderController.createFolder
  );

router
  .route('/:folderId')
  .delete(auth('ADMIN', 'USER'), FolderController.deleteFolder)
  .patch(
    auth('ADMIN', 'USER'),
    validateRequest(FolderValidation.renameSchema),
    FolderController.renameFolder
  );

export const FolderRoutes = router;
