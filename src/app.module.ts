import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import config from './config';

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
