import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { CloudinaryResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const destroyFile = cloudinary.uploader.destroy(publicId,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
    })
  }
}
