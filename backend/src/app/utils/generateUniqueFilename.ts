import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueFilename = (originalname: string) => {
  const fileExt = path.extname(originalname);
  const fileName = `${originalname
    .replace(fileExt, '')
    .toLocaleLowerCase()
    .split(' ')
    .join('-')}-${uuidv4()}`;

  return fileName + fileExt;
};

export default generateUniqueFilename;
