import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import config from './config';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    UsersModule, 
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
  ],
})
export class AppModule {}
