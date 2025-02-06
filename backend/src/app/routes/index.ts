import { Router } from 'express';
import { FileRoutes } from '../modules/File/file.route';
import { FolderRoutes } from '../modules/Folder/folder.route';
import { UserRoutes } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/files',
    route: FileRoutes,
  },
  {
    path: '/folder',
    route: FolderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
