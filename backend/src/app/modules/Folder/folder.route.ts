import { Router } from 'express';
import { auth } from '../../middlewares';
import { FolderController } from './folder.controller';

const router = Router();

router.route('/').post(auth('ADMIN', 'USER'), FolderController.createFolder);

router
  .route('/:folderId')
  .delete(auth('ADMIN', 'USER'), FolderController.deleteFolder)
  .patch(auth('ADMIN', 'USER'), FolderController.renameFolder);

export const FolderRoutes = router;
