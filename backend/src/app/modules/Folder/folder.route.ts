import { Router } from 'express';
import { auth } from '../../middlewares';
import { FolderController } from './folder.controller';

const router = Router();

router.route('/').post(auth('ADMIN', 'USER'), FolderController.createFolder);

export const FolderRoutes = router;
