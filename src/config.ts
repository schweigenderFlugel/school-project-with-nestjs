import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    frontendUrl: process.env.FRONTEND_URL,

    jwtSecret: process.env.JWT_SECRET,
    jwtRefresh: process.env.JWT_REFRESH_SECRET,
    jwtRecovery: process.env.JWT_RECOVERY_SECRET,

    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    nodemailerHost: process.env.NODEMAILER_HOST,
    nodemailerPort: +process.env.NODEMAILER_PORT,
    nodemailerUser: process.env.NODEMAILER_USER,
    nodemailerPass: process.env.NODEMAILER_PASS,

    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  }
})