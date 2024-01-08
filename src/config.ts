import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefresh: process.env.JWT_REFRESH_SECRET,
    jwtRecovery: process.env.JWT_RECOVERY_SECRET,

    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
  }
})