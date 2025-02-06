import fs from 'fs';
import status from 'http-status';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Folder from '../modules/Folder/folder.model';
import { AppError } from '../utils';

const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    try {
      const { folderId } = req.query;

      if (!folderId) {
        return cb(null, './public');
      }

      const folder = await Folder.findById(folderId);

      if (!folder) {
        return cb(
          new AppError(status.NOT_FOUND, 'Folder not found'),
          './public'
        );
      }

      const folderPath = folder.folderPath;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch {
      cb(
        new AppError(
          status.INTERNAL_SERVER_ERROR,
          'Error accessing folder path'
        ),
        './public'
      );
    }
  },

  filename(_req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${file.originalname
      .replace(fileExt, '')
      .toLocaleLowerCase()
      .split(' ')
      .join('-')}-${uuidv4()}`;

    cb(null, fileName + fileExt);
  },
});

const upload = multer({ storage });

export default upload;
