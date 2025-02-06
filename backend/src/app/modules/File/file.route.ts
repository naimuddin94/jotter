import { Router } from 'express';
import { upload } from '../../lib';
import { FileController } from './file.controller';

const router = Router();

router.route('/upload').post(upload.array('files'), FileController.saveFiles);

export const FileRoutes = router;
