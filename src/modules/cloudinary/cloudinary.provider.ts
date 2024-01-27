import { ConfigType } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import config from '../../config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [config.KEY],
  useFactory: (configService: ConfigType<typeof config>) => {
    return cloudinary.config({
      cloud_name: configService.cloudinaryCloudName,
      api_key: configService.cloudinaryApiKey,
      api_secret: configService.cloudinaryApiSecret,
      secure: true,
    });
  },
};
