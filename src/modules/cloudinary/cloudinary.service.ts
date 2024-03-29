import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { CloudinaryDeleteResponse, CloudinaryUploadResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryUploadResponse> {
    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const options: UploadApiOptions = {
          folder: folder,
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        }
      const uploadStream = cloudinary.uploader.upload_stream(options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<CloudinaryDeleteResponse> {
    return new Promise<CloudinaryDeleteResponse>((resolve, reject) => {
      const destroyFile = cloudinary.uploader.destroy(publicId,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
    })
  }
}
