import { diskStorage, memoryStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import * as dotenv from 'dotenv'
import { ENVIRONMENTS } from './environments';

dotenv.config()

const developmentConfig = (localFolder: string, formats: string[]) => {
  return {
    limits: { fileSize: 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const isMatch = formats.some(format => format === file.mimetype)
      if (isMatch) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    storage: diskStorage({
      destination: `uploads/${localFolder}`,
      filename: (req, file, callback) => {
        const uniqueName = v4();
        const ext = extname(file.originalname)
        const filename = `${uniqueName}-${ext}`;
        callback(null, filename);
      },
    })
  }
}

const productionConfig = {
  limits: { fileSize: 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: memoryStorage()
}

export const uploadFileConfig = (localFolder: string, formats: string[]) => {
  if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
    return developmentConfig(localFolder, formats)
  }
  
  if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
    return productionConfig;
  }
}