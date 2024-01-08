import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import * as dotenv from 'dotenv'

dotenv.config()

enum ENVIRONMENTS {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  AUTOMATED_TESTS = 'automated_tests'
}

const developmentConfig = {
  limits: { fileSize: 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
      const uniqueName = v4();
      const ext = extname(file.originalname)
      const filename = `${uniqueName}-${ext}`;
      callback(null, filename);
    },
  })
}

export const uploadFileConfig = (() => {
  if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
    return developmentConfig;
  }
}) 